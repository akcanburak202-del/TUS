"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const Core = require("../../prototype/core.js");

function attempt(overrides = {}) {
  return {
    id: "a1", type: "attempt", at: "2026-01-10T12:00:00.000Z",
    objectiveId: "obj-1", taskId: "task-1", familyId: "family-control-1",
    taskVersion: 1, kind: "recall", bank: "control", sessionId: "session-2",
    result: "correct", answer: "example", hintUsed: false, answerShown: false,
    confidence: 2, ...overrides
  };
}

function exposure(overrides = {}) {
  return {
    id: "e1", type: "exposure", at: "2026-01-01T12:00:00.000Z",
    objectiveId: "obj-1", taskId: "train-1", familyId: "family-train-1",
    taskVersion: 1, sessionId: "session-1", mode: "practice", ...overrides
  };
}

function external(overrides = {}) {
  return {
    id: "x1", type: "external", at: "2026-01-02T12:00:00.000Z",
    objectiveId: "obj-1", source: "self_report", result: "correct", ...overrides
  };
}

function task(overrides = {}) {
  return {
    id: "task-1", objectiveId: "obj-1", familyId: "family-train-1",
    kind: "recall", bank: "training", status: "approved", estimatedMinutes: 5,
    version: 1, ...overrides
  };
}

test("createState produces a valid fresh state", () => {
  const state = Core.createState();
  assert.deepEqual(state, { schemaVersion: 1, events: [], settings: { minutes: 15 } });
  assert.equal(Core.validateState(state), true);
});

test("browser IIFE exposes globalThis.TusCore without CommonJS", () => {
  const source = fs.readFileSync(require.resolve("../../prototype/core.js"), "utf8");
  const context = vm.createContext({});
  vm.runInContext(source, context);
  assert.equal(typeof context.TusCore.createState, "function");
  assert.equal(context.TusCore.createState().schemaVersion, 1);
});

test("addEvent is immutable and an exact duplicate is idempotent", () => {
  const original = Core.createState();
  const event = exposure();
  const next = Core.addEvent(original, event);
  assert.equal(original.events.length, 0);
  assert.notEqual(next, original);
  assert.notEqual(next.events[0], event);
  assert.equal(Core.addEvent(next, { ...event }), next);
  assert.throws(() => Core.addEvent(next, { ...event, mode: "study" }), /different content/);
});

test("validateState rejects duplicate IDs and malformed backup shapes", () => {
  const e = exposure();
  assert.throws(() => Core.validateState({
    schemaVersion: 1, events: [e, { ...e }], settings: { minutes: 15 }
  }), /duplicate id/);
  assert.throws(() => Core.validateState({
    schemaVersion: 1, events: [{ ...e, surprise: true }], settings: { minutes: 15 }
  }), /unexpected or missing/);
  assert.throws(() => Core.validateState({
    schemaVersion: 1, events: [{ ...e, at: "yesterday" }], settings: { minutes: 15 }
  }), /UTC ISO-8601/);
  assert.throws(() => Core.validateState({
    schemaVersion: 1, events: [{ ...e, at: "2026-02-30T12:00:00Z" }], settings: { minutes: 15 }
  }), /real calendar/);
  assert.throws(() => Core.validateState({
    schemaVersion: 1, events: [{ ...e, taskVersion: null }], settings: { minutes: 15 }
  }), /all be null or all populated/);
  assert.throws(() => Core.validateState({
    schemaVersion: 2, events: [], settings: { minutes: 15 }
  }), /schemaVersion/);
});

test("task catalogs are bounded and strictly shaped", () => {
  assert.equal(Core.validateTasks([task()]), true);
  assert.throws(() => Core.validateTasks([task(), task()]), /duplicate id/);
  assert.throws(() => Core.validateTasks([task({ status: "published" })]), /status/);
  assert.throws(() => Core.validateTasks([task({ extra: true })]), /unexpected or missing/);
});

test("plan obeys capacity zero and filters control, draft, and suspended tasks", () => {
  const tasks = [
    task({ id: "ok", estimatedMinutes: 5 }),
    task({ id: "control", bank: "control" }),
    task({ id: "draft", status: "draft" }),
    task({ id: "suspended", status: "suspended" })
  ];
  assert.deepEqual(Core.plan(Core.createState(), tasks, 0, "2026-01-03T00:00:00Z"), []);
  const result = Core.plan(Core.createState(), tasks, 5, "2026-01-03T00:00:00Z");
  assert.deepEqual(result.map(x => x.task.id), ["ok"]);
  assert.equal(result[0].reason, "new_objective");
  assert.ok(result.reduce((sum, x) => sum + x.task.estimatedMinutes, 0) <= 5);
});

test("plan is deterministic, bounded, and distinguishes unknown from wrong", () => {
  let state = Core.createState();
  state = Core.addEvent(state, attempt({
    id: "wrong", bank: "training", objectiveId: "obj-wrong", taskId: "old-wrong",
    familyId: "fw", result: "incorrect"
  }));
  state = Core.addEvent(state, attempt({
    id: "unknown", bank: "training", objectiveId: "obj-unknown", taskId: "old-unknown",
    familyId: "fu", result: "unknown"
  }));
  const tasks = [
    task({ id: "new", objectiveId: "obj-new", estimatedMinutes: 4 }),
    task({ id: "unknown-task", objectiveId: "obj-unknown", familyId: "fu2", estimatedMinutes: 4 }),
    task({ id: "wrong-task", objectiveId: "obj-wrong", familyId: "fw2", estimatedMinutes: 4 })
  ];
  const result = Core.plan(state, tasks, 8, "2026-01-11T00:00:00Z");
  assert.deepEqual(result.map(x => [x.task.id, x.reason]), [
    ["wrong-task", "retry_after_incorrect"],
    ["unknown-task", "resolve_unknown"]
  ]);
});

test("successive plans rotate an objective through recall, explain, and discriminate", () => {
  const tasks = [
    task({ id: "demo-d", familyId: "family-d", kind: "discriminate" }),
    task({ id: "demo-e", familyId: "family-e", kind: "explain" }),
    task({ id: "demo-r", familyId: "family-r", kind: "recall" })
  ];
  let state = Core.createState();
  const chosen = [];
  const expected = ["demo-r", "demo-e", "demo-d"];

  for (let i = 0; i < expected.length; i += 1) {
    const next = Core.plan(state, tasks, 5, "2026-01-20T00:00:00Z");
    assert.equal(next.length, 1);
    chosen.push(next[0].task.id);
    state = Core.addEvent(state, attempt({
      id: `rotation-${i}`,
      at: `2026-01-${10 + i}T12:00:00.000Z`,
      taskId: next[0].task.id,
      familyId: next[0].task.familyId,
      kind: next[0].task.kind,
      bank: "training"
    }));
  }
  assert.deepEqual(chosen, expected);

  const fourth = Core.plan(state, tasks, 5, "2026-01-20T00:00:00Z");
  assert.equal(fourth[0].task.id, "demo-r");
});

test("summary separates wrong, unknown, self reports, observations, and exposures", () => {
  let state = Core.createState();
  state = Core.addEvent(state, exposure());
  state = Core.addEvent(state, attempt({ id: "a-wrong", result: "incorrect", bank: "training" }));
  state = Core.addEvent(state, attempt({ id: "a-unknown", result: "unknown", bank: "training" }));
  state = Core.addEvent(state, external());
  state = Core.addEvent(state, external({ id: "x2", source: "observer", result: "incorrect" }));
  const out = Core.summary(state, [], "2026-01-11T00:00:00Z");
  assert.deepEqual(out.attempts, { total: 2, correct: 0, incorrect: 1, unknown: 1 });
  assert.deepEqual(out.selfReports, { total: 1, correct: 1, incorrect: 0, unknown: 0 });
  assert.deepEqual(out.externalObservations, { total: 1, correct: 0, incorrect: 1, unknown: 0 });
  assert.deepEqual(out.exposures, { total: 1, answer: 0, hint: 0, study: 0, practice: 1 });
  assert.equal(out.independent.eligibleAttempts, 0);
});

test("a first-seen control family can be delayed independent success", () => {
  let state = Core.addEvent(Core.createState(), exposure());
  state = Core.addEvent(state, attempt());
  const out = Core.summary(state, [], "2026-01-11T00:00:00Z");
  assert.equal(out.independent.eligibleAttempts, 1);
  assert.equal(out.independent.successes[0].eventId, "a1");
  assert.equal(out.independent.latestSuccessByObjective["obj-1"], "a1");
});

test("hints, shown answers, reused control family, and short delay never count", () => {
  const variants = [
    attempt({ hintUsed: true }),
    attempt({ answerShown: true }),
    attempt({ at: "2026-01-05T12:00:00.000Z" })
  ];
  for (const candidate of variants) {
    let state = Core.addEvent(Core.createState(), exposure());
    state = Core.addEvent(state, candidate);
    assert.equal(Core.summary(state, [], "2026-01-11T00:00:00Z").independent.eligibleAttempts, 0);
  }

  let reused = Core.addEvent(Core.createState(), exposure());
  reused = Core.addEvent(reused, attempt({
    id: "prior-family", at: "2026-01-02T12:00:00.000Z", result: "unknown"
  }));
  reused = Core.addEvent(reused, attempt({ id: "later", at: "2026-01-10T12:00:00.000Z" }));
  assert.equal(Core.summary(reused, [], "2026-01-11T00:00:00Z").independent.eligibleAttempts, 0);
});

test("same-session exposure cannot become independent evidence even after seven days", () => {
  let state = Core.addEvent(Core.createState(), exposure({ sessionId: "reused-session" }));
  state = Core.addEvent(state, attempt({ sessionId: "reused-session" }));
  assert.equal(Core.summary(state, [], "2026-01-11T00:00:00Z").independent.eligibleAttempts, 0);
});

test("equal timestamps use append order when evaluating contamination", () => {
  let state = Core.addEvent(Core.createState(), exposure({
    id: "z-exposure", at: "2026-01-10T12:00:00.000Z"
  }));
  state = Core.addEvent(state, attempt({
    id: "a-attempt", at: "2026-01-10T12:00:00.000Z"
  }));
  assert.equal(Core.summary(state, [], "2026-01-11T00:00:00Z").independent.eligibleAttempts, 0);
});

test("future events are retained but excluded from an as-of summary and plan", () => {
  let state = Core.addEvent(Core.createState(), attempt({
    id: "future", at: "2026-12-01T00:00:00.000Z", bank: "training", result: "incorrect"
  }));
  assert.equal(state.events.length, 1);
  assert.equal(Core.summary(state, [], "2026-02-01T00:00:00Z").attempts.total, 0);
  const result = Core.plan(state, [task()], 5, "2026-02-01T00:00:00Z");
  assert.equal(result[0].reason, "new_objective");
});
