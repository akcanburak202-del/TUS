"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const Core = require("../../prototype/session-core.js");

function task(overrides = {}) {
  return {
    id: "synthetic-task", version: "1.0.0",
    objective: { id: "objective-1", version: "1.0.0" },
    family: { id: "family-1", version: "1.0.0" },
    source: { id: "source-1", version: "1.0.0" },
    key: { id: "key-1", version: "1.0.0" },
    policy: { id: "policy-1", version: "1.0.0" },
    bank: "training", status: "synthetic", vettedContent: false,
    optionKeys: ["option-a", "option-b"], correctOptionKey: "option-a",
    ...overrides
  };
}

function catalog(tasks = [task()]) { return { schemaVersion: 1, tasks }; }

function command(type, revision, overrides = {}) {
  return {
    id: `event-${revision}`, type, at: `2026-09-10T10:00:${String(revision).padStart(2, "0")}.000Z`,
    expectedRevision: revision, sessionId: "session-1", attemptId: "attempt-1", ...overrides
  };
}

function start(revision = 0, overrides = {}) {
  return command("start_session", revision, {
    taskRef: { id: "synthetic-task", version: "1.0.0" }, step: "root", ...overrides
  });
}

function submit(revision, response = { kind: "option", selectedOptionKey: "option-a" }, overrides = {}) {
  return command("submit_answer", revision, { response, ...overrides });
}

function apply(commands, tasks) {
  return Core.dispatchBatch(Core.createState(), catalog(tasks), commands);
}

test("fresh state validates and browser IIFE exposes TusSessionCore", () => {
  assert.deepEqual(Core.createState(), { schemaVersion: 1, revision: 0, events: [] });
  assert.equal(Core.validateState(Core.createState()), true);
  const source = fs.readFileSync(require.resolve("../../prototype/session-core.js"), "utf8");
  const context = vm.createContext({});
  vm.runInContext(source, context);
  assert.equal(typeof context.TusSessionCore.dispatchBatch, "function");
});

test("start snapshots every origin version and catalog validation is strict", () => {
  const cat = catalog();
  const state = Core.dispatch(Core.createState(), cat, start());
  const origin = state.events[0].origin;
  assert.deepEqual(Object.fromEntries(["task", "objective", "family", "source", "key", "policy"].map(k => [k, origin[k].version])), {
    task: "1.0.0", objective: "1.0.0", family: "1.0.0", source: "1.0.0", key: "1.0.0", policy: "1.0.0"
  });
  assert.equal(Core.validateState(state, cat), true);
  assert.throws(() => Core.validateCatalog({ ...cat, schemaVersion: 2 }), /schemaVersion/);
  assert.throws(() => Core.dispatch(Core.createState(), cat, start(0, { taskRef: { id: "synthetic-task", version: "9.0.0" } })), /reference\/version/);
  assert.throws(() => Core.validateCatalog(catalog([task({ correctOptionKey: "missing" })])), /not an option/);
});

test("exact duplicate is a no-op; conflicting duplicate and stale revision reject", () => {
  const cat = catalog();
  const first = start();
  const state = Core.dispatch(Core.createState(), cat, first);
  assert.equal(Core.dispatch(state, cat, structuredClone(first)), state);
  assert.throws(() => Core.dispatch(state, cat, { ...first, step: "changed" }), /different content/);
  assert.throws(() => Core.dispatch(state, cat, command("pause_session", 0, { id: "stale-event" })), /stale expectedRevision/);
});

test("first answer locks and evaluation derives correctness without accepting result", () => {
  const cat = catalog();
  let state = Core.dispatch(Core.createState(), cat, start());
  state = Core.dispatch(state, cat, submit(1));
  assert.throws(() => Core.dispatch(state, cat, submit(2, { kind: "option", selectedOptionKey: "option-b" })), /first answer is locked|status transitions/);
  assert.throws(() => Core.dispatch(state, cat, { ...command("evaluate_answer", 2, { answerEventId: "event-1" }), result: "incorrect" }), /unexpected or missing/);
  state = Core.dispatch(state, cat, command("evaluate_answer", 2, { answerEventId: "event-1" }));
  const attempt = Core.project(state).attempts["attempt-1"];
  assert.equal(attempt.answer.response.selectedOptionKey, "option-a");
  assert.equal(attempt.evaluation.result, "correct");
});

test("correct guess remains correct while confidence remains a separate declaration", () => {
  const cat = catalog();
  let state = Core.dispatchBatch(Core.createState(), cat, [start(), submit(1)]);
  const declaration = command("declare_confidence", 2, { answerEventId: "event-1", confidence: "guess" });
  state = Core.dispatch(state, cat, declaration);
  assert.equal(Core.dispatch(state, cat, structuredClone(declaration)), state);
  assert.throws(() => Core.dispatch(state, cat, command("declare_confidence", 3, {
    answerEventId: "event-1", confidence: "sure", id: "second-confidence"
  })), /declared once|confidence declaration/);
  state = Core.dispatch(state, cat, command("evaluate_answer", 3, { answerEventId: "event-1" }));
  assert.throws(() => Core.dispatch(state, cat, command("declare_confidence", 4, {
    answerEventId: "event-1", confidence: "unsure", id: "late-confidence"
  })), /declared once|confidence declaration/);
  const attempt = Core.project(state).attempts["attempt-1"];
  assert.deepEqual(attempt.answer.confidence, { eventId: "event-2", at: "2026-09-10T10:00:02.000Z", value: "guess" });
  assert.equal(attempt.evaluation.result, "correct");

  const unanswered = Core.dispatchBatch(Core.createState(), cat, [start(), submit(1)]);
  assert.throws(() => Core.dispatch(unanswered, cat, command("declare_confidence", 2, {
    answerEventId: "wrong-answer", confidence: "guess"
  })), /first unevaluated answer|answer reference/);
});

test("unknown is distinct from an incorrect option and cannot carry confidence implicitly", () => {
  const unknown = { kind: "unknown", selectedOptionKey: null };
  const state = apply([start(), submit(1, unknown), command("evaluate_answer", 2, { answerEventId: "event-1" })]);
  const attempt = Core.project(state).attempts["attempt-1"];
  assert.equal(attempt.answer.response.kind, "unknown");
  assert.equal(attempt.answer.confidence, null);
  assert.equal(attempt.evaluation.result, "unknown");
  assert.throws(() => apply([start(), submit(1, { kind: "unknown", selectedOptionKey: "option-a" })]), /null selectedOptionKey/);
});

test("timed source before answer marks assistance; root does not and later feedback cannot rewrite it", () => {
  const assisted = apply([
    start(), command("open_material", 1, { material: "source" }), submit(2),
    command("evaluate_answer", 3, { answerEventId: "event-2" }), command("open_material", 4, { material: "feedback" })
  ]);
  const attempt = Core.project(assisted).attempts["attempt-1"];
  assert.equal(attempt.answer.assistance, "assisted");
  assert.deepEqual(attempt.exposures.map(x => x.material), ["source", "feedback"]);

  const rootOnly = apply([start(), command("open_material", 1, { material: "root" }), submit(2)]);
  assert.equal(Core.project(rootOnly).attempts["attempt-1"].answer.assistance, "unassisted");
  assert.throws(() => apply([start(), command("open_material", 1, { material: "feedback" })]), /status transitions/);
});

test("pause, JSON reload, and resume preserve the open attempt and step", () => {
  const cat = catalog();
  let state = Core.dispatchBatch(Core.createState(), cat, [
    start(), command("advance_step", 1, { step: "practice" }), command("pause_session", 2)
  ]);
  state = JSON.parse(JSON.stringify(state));
  assert.equal(Core.validateState(state, cat), true);
  assert.deepEqual(Core.project(state).sessions["session-1"], {
    id: "session-1", status: "paused", currentAttemptId: "attempt-1", currentStep: "practice"
  });
  state = Core.dispatch(state, cat, command("resume_session", 3));
  assert.equal(Core.project(state).sessions["session-1"].status, "active");
});

test("objective dispute preserves first answers and neutralizes every same-objective evaluation", () => {
  const cat = catalog();
  let state = Core.dispatchBatch(Core.createState(), cat, [
    start(), submit(1), command("evaluate_answer", 2, { answerEventId: "event-1" }),
    start(3, { id: "event-3", sessionId: "session-2", attemptId: "attempt-2" }),
    submit(4, { kind: "option", selectedOptionKey: "option-b" }, { id: "event-4", sessionId: "session-2", attemptId: "attempt-2" }),
    command("evaluate_answer", 5, { id: "event-5", sessionId: "session-2", attemptId: "attempt-2", answerEventId: "event-4" }),
    command("dispute_answer", 6, { id: "event-6", answerEventId: "event-1", scope: "objective", category: "key", note: "synthetic dispute" })
  ]);
  const out = Core.project(state);
  assert.equal(out.attempts["attempt-1"].answer.response.selectedOptionKey, "option-a");
  assert.equal(out.attempts["attempt-2"].answer.response.selectedOptionKey, "option-b");
  assert.equal(out.attempts["attempt-1"].evaluation.effectiveResult, null);
  assert.equal(out.attempts["attempt-2"].evaluation.effectiveResult, null);
  assert.equal(out.attempts["attempt-1"].evaluation.status, "pending_review");
  assert.equal(out.sessions["session-2"].status, "review_pending");
  assert.equal(out.blockedObjectives["objective-1"], true);
  assert.throws(() => Core.dispatch(state, cat, start(7, { id: "event-7", sessionId: "session-3", attemptId: "attempt-3" })), /status transitions/);
});

test("nested catalog, command, state history, and projections do not share mutable aliases", () => {
  const cat = catalog();
  const first = start();
  let state = Core.dispatch(Core.createState(), cat, first);
  cat.tasks[0].objective.id = "mutated";
  first.taskRef.id = "mutated";
  assert.equal(state.events[0].origin.objective.id, "objective-1");
  assert.equal(state.events[0].command.taskRef.id, "synthetic-task");
  const oldEvent = state.events[0];
  const next = Core.dispatch(state, catalog(), command("open_material", 1, { material: "root" }));
  next.events[0].origin.objective.id = "changed-in-next";
  assert.equal(oldEvent.origin.objective.id, "objective-1");
  const view = Core.project(state);
  view.attempts["attempt-1"].origin.optionKeys[0] = "changed-in-view";
  assert.equal(state.events[0].origin.optionKeys[0], "option-a");
});

test("failed multi-command input has no partial mutation", () => {
  const original = Core.createState();
  assert.throws(() => Core.dispatchBatch(original, catalog(), [
    start(), command("evaluate_answer", 1, { answerEventId: "missing" })
  ]), /unevaluated answer|status transitions/);
  assert.deepEqual(original, Core.createState());
});

test("invalid timestamp, schema, event order, origin, and answer references reject", () => {
  const cat = catalog();
  assert.throws(() => Core.dispatch(Core.createState(), cat, start(0, { at: "2026-02-30T00:00:00.000Z" })), /real UTC/);
  assert.throws(() => Core.validateState({ schemaVersion: 2, revision: 0, events: [] }), /schemaVersion/);
  let state = apply([start(), command("open_material", 1, { material: "root" })]);
  const unordered = structuredClone(state);
  unordered.events[1].at = unordered.events[1].command.at = "2026-09-10T09:00:00.000Z";
  assert.throws(() => Core.validateState(unordered), /out of order/);
  const changedOrigin = structuredClone(state);
  changedOrigin.events[1].origin.family.id = "forged-family";
  assert.throws(() => Core.validateState(changedOrigin), /status transitions/);
  const badRef = apply([start(), submit(1)]);
  const forgedEvaluation = structuredClone(badRef);
  forgedEvaluation.events.push({
    id: "event-2", type: "evaluate_answer", at: "2026-09-10T10:00:02.000Z",
    command: command("evaluate_answer", 2, { answerEventId: "missing" }), origin: structuredClone(badRef.events[0].origin)
  });
  forgedEvaluation.revision = 3;
  assert.throws(() => Core.validateState(forgedEvaluation), /status transitions/);

  const forgedKey = structuredClone(badRef);
  forgedKey.events.forEach(event => { event.origin.key.correctOptionKey = "option-b"; });
  assert.equal(Core.project(forgedKey).attempts["attempt-1"].origin.key.correctOptionKey, "option-b");
  assert.throws(() => Core.dispatch(forgedKey, cat, command("evaluate_answer", 2, { answerEventId: "event-1" })), /does not match the supplied catalog/);
});

test("control, draft, suspended, and unvetted production tasks cannot start", () => {
  for (const blocked of [
    task({ bank: "control" }), task({ status: "draft" }), task({ status: "suspended" }),
    task({ status: "production", vettedContent: false })
  ]) {
    assert.throws(() => Core.dispatch(Core.createState(), catalog([blocked]), start()), /NOT_IMPLEMENTED|not synthetic|status transitions/);
  }
  const vetted = task({ status: "production", vettedContent: true });
  assert.equal(Core.dispatch(Core.createState(), catalog([vetted]), start()).revision, 1);
});
