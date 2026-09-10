(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.TusSessionCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var SCHEMA_VERSION = 1;
  var CATALOG_VERSION = 1;
  var MAX_EVENTS = 10000;
  var MATERIALS = ["root", "source", "hint", "study", "answer", "feedback"];
  var CONFIDENCE = ["sure", "unsure", "guess"];
  var TASK_STATUS = ["synthetic", "production", "draft", "suspended"];
  var COMMAND_TYPES = [
    "start_session", "open_material", "submit_answer", "declare_confidence", "evaluate_answer",
    "advance_step", "pause_session", "resume_session", "end_session", "dispute_answer"
  ];

  function fail(message) { throw new TypeError(message); }

  function isRecord(value) {
    if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
    var proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  }

  function exactKeys(value, keys, label) {
    if (!isRecord(value)) fail(label + " must be a plain object");
    var actual = Object.keys(value).sort();
    var expected = keys.slice().sort();
    if (actual.length !== expected.length) fail(label + " has unexpected or missing fields");
    for (var i = 0; i < expected.length; i += 1) {
      if (actual[i] !== expected[i]) fail(label + " has unexpected or missing fields");
    }
  }

  function string(value, label, max, allowEmpty) {
    if (typeof value !== "string" || (!allowEmpty && value.length === 0) || value.length > max || /\u0000/.test(value)) {
      fail(label + " must be " + (allowEmpty ? "0" : "1") + ".." + max + " characters without NUL");
    }
  }

  function id(value, label) {
    string(value, label, 128, false);
    if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(value)) fail(label + " contains unsupported characters");
  }

  function version(value, label) {
    string(value, label, 64, false);
    if (!/^[0-9]+(?:\.[0-9]+){0,2}(?:[-+][A-Za-z0-9.-]+)?$/.test(value)) fail(label + " is not a supported version");
  }

  function oneOf(value, choices, label) {
    if (choices.indexOf(value) === -1) fail(label + " is invalid");
  }

  function timestamp(value, label) {
    string(value, label, 24, false);
    var match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/.exec(value);
    if (!match) fail(label + " must be a millisecond-precision UTC ISO-8601 timestamp");
    var ms = Date.parse(value);
    if (!Number.isFinite(ms) || new Date(ms).toISOString() !== value) fail(label + " is not a real UTC timestamp");
    if (ms < Date.UTC(2000, 0, 1) || ms >= Date.UTC(2100, 0, 1)) fail(label + " is outside the supported range");
    return ms;
  }

  function clone(value) {
    if (Array.isArray(value)) return value.map(clone);
    if (isRecord(value)) {
      var out = {};
      Object.keys(value).forEach(function (key) { out[key] = clone(value[key]); });
      return out;
    }
    return value;
  }

  function canonical(value) {
    if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
    if (isRecord(value)) {
      return "{" + Object.keys(value).sort().map(function (key) {
        return JSON.stringify(key) + ":" + canonical(value[key]);
      }).join(",") + "}";
    }
    return JSON.stringify(value);
  }

  function validateRef(ref, label) {
    exactKeys(ref, ["id", "version"], label);
    id(ref.id, label + ".id");
    version(ref.version, label + ".version");
  }

  function validateTask(task, label) {
    exactKeys(task, [
      "id", "version", "objective", "family", "source", "key", "policy",
      "bank", "status", "vettedContent", "optionKeys", "correctOptionKey"
    ], label);
    id(task.id, label + ".id");
    version(task.version, label + ".version");
    ["objective", "family", "source", "policy"].forEach(function (name) {
      validateRef(task[name], label + "." + name);
    });
    exactKeys(task.key, ["id", "version"], label + ".key");
    id(task.key.id, label + ".key.id");
    version(task.key.version, label + ".key.version");
    oneOf(task.bank, ["training", "control"], label + ".bank");
    oneOf(task.status, TASK_STATUS, label + ".status");
    if (typeof task.vettedContent !== "boolean") fail(label + ".vettedContent must be boolean");
    if (!Array.isArray(task.optionKeys) || task.optionKeys.length < 2 || task.optionKeys.length > 20) {
      fail(label + ".optionKeys must contain 2..20 keys");
    }
    var seen = Object.create(null);
    task.optionKeys.forEach(function (key, index) {
      id(key, label + ".optionKeys[" + index + "]");
      if (seen[key]) fail(label + ".optionKeys contains a duplicate");
      seen[key] = true;
    });
    id(task.correctOptionKey, label + ".correctOptionKey");
    if (!seen[task.correctOptionKey]) fail(label + ".correctOptionKey is not an option");
  }

  function validateCatalog(catalog) {
    exactKeys(catalog, ["schemaVersion", "tasks"], "catalog");
    if (catalog.schemaVersion !== CATALOG_VERSION) fail("catalog.schemaVersion is unsupported");
    if (!Array.isArray(catalog.tasks) || catalog.tasks.length > 1000) fail("catalog.tasks must be an array of at most 1000 tasks");
    var seen = Object.create(null);
    catalog.tasks.forEach(function (task, index) {
      validateTask(task, "catalog.tasks[" + index + "]");
      var key = task.id + "@" + task.version;
      if (seen[key]) fail("catalog contains duplicate task version " + key);
      seen[key] = true;
    });
    return true;
  }

  function originFor(task) {
    return {
      task: { id: task.id, version: task.version, bank: task.bank, status: task.status, vettedContent: task.vettedContent },
      objective: clone(task.objective), family: clone(task.family), source: clone(task.source),
      key: { id: task.key.id, version: task.key.version, correctOptionKey: task.correctOptionKey },
      policy: clone(task.policy), optionKeys: clone(task.optionKeys)
    };
  }

  function validateOrigin(origin, label) {
    exactKeys(origin, ["task", "objective", "family", "source", "key", "policy", "optionKeys"], label);
    exactKeys(origin.task, ["id", "version", "bank", "status", "vettedContent"], label + ".task");
    id(origin.task.id, label + ".task.id"); version(origin.task.version, label + ".task.version");
    oneOf(origin.task.bank, ["training", "control"], label + ".task.bank");
    oneOf(origin.task.status, TASK_STATUS, label + ".task.status");
    if (typeof origin.task.vettedContent !== "boolean") fail(label + ".task.vettedContent must be boolean");
    ["objective", "family", "source", "policy"].forEach(function (name) { validateRef(origin[name], label + "." + name); });
    exactKeys(origin.key, ["id", "version", "correctOptionKey"], label + ".key");
    id(origin.key.id, label + ".key.id"); version(origin.key.version, label + ".key.version");
    if (!Array.isArray(origin.optionKeys) || origin.optionKeys.length < 2) fail(label + ".optionKeys is invalid");
    var seen = Object.create(null);
    origin.optionKeys.forEach(function (key) { id(key, label + ".optionKeys[]"); if (seen[key]) fail(label + ".optionKeys has duplicates"); seen[key] = true; });
    id(origin.key.correctOptionKey, label + ".key.correctOptionKey");
    if (!seen[origin.key.correctOptionKey]) fail(label + ".key.correctOptionKey is not an option");
  }

  function common(command, keys) {
    exactKeys(command, ["id", "type", "at", "expectedRevision", "sessionId", "attemptId"].concat(keys), "command");
    id(command.id, "command.id"); oneOf(command.type, COMMAND_TYPES, "command.type"); timestamp(command.at, "command.at");
    if (!Number.isInteger(command.expectedRevision) || command.expectedRevision < 0) fail("command.expectedRevision must be a non-negative integer");
    id(command.sessionId, "command.sessionId"); id(command.attemptId, "command.attemptId");
  }

  function validateCommand(command) {
    if (!isRecord(command)) fail("command must be a plain object");
    if (command.type === "start_session") {
      common(command, ["taskRef", "step"]); validateRef(command.taskRef, "command.taskRef"); id(command.step, "command.step");
    } else if (command.type === "open_material") {
      common(command, ["material"]); oneOf(command.material, MATERIALS, "command.material");
    } else if (command.type === "submit_answer") {
      common(command, ["response"]);
      exactKeys(command.response, ["kind", "selectedOptionKey"], "command.response");
      oneOf(command.response.kind, ["option", "unknown"], "command.response.kind");
      if (command.response.kind === "option") id(command.response.selectedOptionKey, "command.response.selectedOptionKey");
      else if (command.response.selectedOptionKey !== null) fail("unknown response must have a null selectedOptionKey");
    } else if (command.type === "declare_confidence") {
      common(command, ["answerEventId", "confidence"]);
      id(command.answerEventId, "command.answerEventId");
      oneOf(command.confidence, CONFIDENCE, "command.confidence");
    } else if (command.type === "evaluate_answer") {
      common(command, ["answerEventId"]); id(command.answerEventId, "command.answerEventId");
    } else if (command.type === "advance_step") {
      common(command, ["step"]); id(command.step, "command.step");
    } else if (command.type === "pause_session" || command.type === "resume_session" || command.type === "end_session") {
      common(command, []);
    } else if (command.type === "dispute_answer") {
      common(command, ["answerEventId", "scope", "category", "note"]);
      id(command.answerEventId, "command.answerEventId");
      if (command.scope !== "objective") fail("command.scope must be objective in schema 1");
      oneOf(command.category, ["key", "root", "source", "other"], "command.category");
      string(command.note, "command.note", 1000, true);
    } else fail("command.type is unsupported");
    return true;
  }

  function createState() { return { schemaVersion: SCHEMA_VERSION, revision: 0, events: [] }; }

  function replay(state) {
    var sessions = Object.create(null);
    var attempts = Object.create(null);
    var blockedObjectives = Object.create(null);
    state.events.forEach(function (event) {
      var c = event.command;
      var session = sessions[c.sessionId];
      var attempt = attempts[c.attemptId];
      if (c.type === "start_session") {
        if (session || attempt) fail("start_session reuses a sessionId or attemptId");
        if (event.origin.task.id !== c.taskRef.id || event.origin.task.version !== c.taskRef.version) fail("start_session taskRef differs from its origin");
        if (event.origin.task.bank === "control") fail("control tasks are NOT_IMPLEMENTED in session core schema 1");
        if (event.origin.task.status !== "synthetic" && !(event.origin.task.status === "production" && event.origin.task.vettedContent === true)) {
          fail("start_session origin is not synthetic or explicitly vetted production content");
        }
        if (blockedObjectives[event.origin.objective.id]) fail("objective is pending review");
        session = { id: c.sessionId, status: "active", currentAttemptId: c.attemptId, currentStep: c.step };
        attempt = { id: c.attemptId, sessionId: c.sessionId, origin: clone(event.origin), answer: null, evaluation: null, dispute: null, exposures: [] };
        sessions[c.sessionId] = session; attempts[c.attemptId] = attempt;
        return;
      }
      if (!session || !attempt || attempt.sessionId !== session.id || session.currentAttemptId !== attempt.id) {
        fail("event references no open session attempt");
      }
      if (canonical(event.origin) !== canonical(attempt.origin)) fail("event origin differs from the attempt snapshot");
      if (blockedObjectives[attempt.origin.objective.id] && c.type !== "dispute_answer") fail("objective is pending review");
      if (c.type === "resume_session") {
        if (session.status !== "paused") fail("invalid resume transition");
        session.status = "active";
        return;
      }
      if (c.type === "dispute_answer") {
        if ((session.status !== "active" && session.status !== "completed") || !attempt.answer || !attempt.evaluation || attempt.dispute || c.answerEventId !== attempt.answer.eventId) {
          fail("invalid dispute transition or answer reference");
        }
        attempt.dispute = { eventId: event.id, at: c.at, answerEventId: c.answerEventId, scope: c.scope, objective: clone(attempt.origin.objective), category: c.category, note: c.note };
        blockedObjectives[attempt.origin.objective.id] = true;
        Object.keys(attempts).forEach(function (attemptId) {
          var affected = attempts[attemptId];
          if (affected.origin.objective.id !== attempt.origin.objective.id) return;
          if (affected.evaluation) { affected.evaluation.effectiveResult = null; affected.evaluation.status = "pending_review"; }
          sessions[affected.sessionId].status = "review_pending";
        });
        return;
      }
      if (session.status !== "active") fail("event requires an active session");
      if (c.type === "open_material") {
        if (c.material === "feedback" && !attempt.evaluation) fail("feedback cannot open before evaluation");
        attempt.exposures.push({ eventId: event.id, material: c.material, at: c.at });
      } else if (c.type === "submit_answer") {
        if (attempt.answer) fail("first answer is locked");
        if (c.response.kind === "option" && attempt.origin.optionKeys.indexOf(c.response.selectedOptionKey) === -1) fail("answer option is absent from the snapshot");
        var assisted = attempt.exposures.some(function (x) { return ["source", "hint", "study", "answer"].indexOf(x.material) !== -1; });
        attempt.answer = { eventId: event.id, at: c.at, response: clone(c.response), confidence: null, assistance: assisted ? "assisted" : "unassisted" };
      } else if (c.type === "declare_confidence") {
        if (!attempt.answer || attempt.answer.confidence || attempt.evaluation || c.answerEventId !== attempt.answer.eventId) fail("invalid confidence declaration or answer reference");
        attempt.answer.confidence = { eventId: event.id, at: c.at, value: c.confidence };
      } else if (c.type === "evaluate_answer") {
        if (!attempt.answer || attempt.evaluation || c.answerEventId !== attempt.answer.eventId) fail("invalid evaluation transition or answer reference");
        var result = attempt.answer.response.kind === "unknown" ? "unknown" :
          attempt.answer.response.selectedOptionKey === attempt.origin.key.correctOptionKey ? "correct" : "incorrect";
        attempt.evaluation = { eventId: event.id, answerEventId: c.answerEventId, at: c.at, result: result, effectiveResult: result, status: "effective" };
      } else if (c.type === "advance_step") session.currentStep = c.step;
      else if (c.type === "pause_session") session.status = "paused";
      else if (c.type === "end_session") {
        if (!attempt.answer || !attempt.evaluation) fail("session can end only after evaluating its current answer");
        session.status = "completed";
      }
    });
    return { sessions: sessions, attempts: attempts, blockedObjectives: blockedObjectives };
  }

  function validateState(state, catalog) {
    exactKeys(state, ["schemaVersion", "revision", "events"], "state");
    if (state.schemaVersion !== SCHEMA_VERSION) fail("state.schemaVersion is unsupported");
    if (!Array.isArray(state.events) || state.events.length > MAX_EVENTS) fail("state.events must be an array of at most " + MAX_EVENTS + " events");
    if (state.revision !== state.events.length) fail("state.revision does not match the authoritative event log");
    var ids = Object.create(null); var lastAt = -Infinity;
    state.events.forEach(function (event, index) {
      exactKeys(event, ["id", "type", "at", "command", "origin"], "state.events[" + index + "]");
      validateCommand(event.command); validateOrigin(event.origin, "state.events[" + index + "].origin");
      if (event.id !== event.command.id || event.type !== event.command.type || event.at !== event.command.at) fail("event envelope does not match its command");
      if (ids[event.id]) fail("state.events contains duplicate id " + event.id); ids[event.id] = true;
      var at = timestamp(event.at, "state.events[" + index + "].at");
      if (at < lastAt) fail("state.events timestamps are out of order"); lastAt = at;
      if (event.command.expectedRevision !== index) fail("event expectedRevision does not match its log position");
    });
    try { replay(state); } catch (error) { fail("state event references or status transitions are invalid"); }
    if (catalog !== undefined) {
      validateCatalog(catalog);
      state.events.forEach(function (event) {
        if (event.type !== "start_session") return;
        var task = taskByRef(catalog, event.command.taskRef);
        if (canonical(event.origin) !== canonical(originFor(task))) fail("start_session origin does not match the supplied catalog");
      });
    }
    return true;
  }

  function taskByRef(catalog, ref) {
    for (var i = 0; i < catalog.tasks.length; i += 1) {
      if (catalog.tasks[i].id === ref.id && catalog.tasks[i].version === ref.version) return catalog.tasks[i];
    }
    fail("task reference/version is not in the catalog");
  }

  function dispatch(state, catalog, command) {
    validateState(state, catalog); validateCommand(command);
    for (var i = 0; i < state.events.length; i += 1) {
      if (state.events[i].id === command.id) {
        if (canonical(state.events[i].command) === canonical(command)) return state;
        fail("command id already exists with different content: " + command.id);
      }
    }
    if (command.expectedRevision !== state.revision) fail("stale expectedRevision");
    if (state.events.length >= MAX_EVENTS) fail("state event limit reached");
    if (state.events.length && timestamp(command.at, "command.at") < timestamp(state.events[state.events.length - 1].at, "last event at")) {
      fail("command timestamp is earlier than the event log");
    }
    var model = replay(state); var session = model.sessions[command.sessionId]; var attempt = model.attempts[command.attemptId]; var origin;
    if (command.type === "start_session") {
      if (session || attempt) fail("sessionId and attemptId must be new");
      var task = taskByRef(catalog, command.taskRef);
      if (task.bank === "control") fail("control tasks are NOT_IMPLEMENTED in session core schema 1");
      if (task.status !== "synthetic" && !(task.status === "production" && task.vettedContent === true)) {
        fail("task is not synthetic or explicitly vetted production content");
      }
      origin = originFor(task);
    } else {
      if (!session || !attempt || attempt.sessionId !== session.id || session.currentAttemptId !== attempt.id) fail("command references no open session attempt");
      origin = clone(attempt.origin);
      if (command.type === "resume_session") {
        if (session.status !== "paused") fail("only a paused session can resume");
      } else if (command.type === "dispute_answer") {
        if ((session.status !== "active" && session.status !== "completed") || !attempt.answer || !attempt.evaluation || attempt.dispute) fail("answer must have one effective evaluation before dispute");
        if (command.answerEventId !== attempt.answer.eventId) fail("dispute references the wrong first answer");
      } else {
        if (session.status !== "active") fail("session is not active");
        if (command.type === "pause_session") { /* active is sufficient */ }
        else if (command.type === "submit_answer") {
          if (attempt.answer) fail("first answer is locked");
          if (command.response.kind === "option" && attempt.origin.optionKeys.indexOf(command.response.selectedOptionKey) === -1) fail("selected option is not in the task snapshot");
        } else if (command.type === "declare_confidence") {
          if (!attempt.answer || attempt.answer.confidence || attempt.evaluation || command.answerEventId !== attempt.answer.eventId) fail("confidence requires the first unevaluated answer and can be declared once");
        } else if (command.type === "evaluate_answer") {
          if (!attempt.answer || attempt.evaluation) fail("exactly one unevaluated answer is required");
          if (command.answerEventId !== attempt.answer.eventId) fail("evaluation references the wrong first answer");
        } else if (command.type === "end_session") {
          if (!attempt.answer || !attempt.evaluation) fail("session can end only after evaluating its current answer");
        }
      }
    }
    var event = { id: command.id, type: command.type, at: command.at, command: clone(command), origin: clone(origin) };
    var next = { schemaVersion: SCHEMA_VERSION, revision: state.revision + 1, events: state.events.map(clone).concat([event]) };
    validateState(next, catalog);
    return next;
  }

  function dispatchBatch(state, catalog, commands) {
    if (!Array.isArray(commands) || commands.length === 0) fail("commands must be a non-empty array");
    var next = state;
    for (var i = 0; i < commands.length; i += 1) next = dispatch(next, catalog, commands[i]);
    return next;
  }

  function project(state) {
    validateState(state);
    var model = replay(state);
    return clone({ revision: state.revision, sessions: model.sessions, attempts: model.attempts, blockedObjectives: model.blockedObjectives });
  }

  return {
    createState: createState,
    validateCatalog: validateCatalog,
    validateState: validateState,
    dispatch: dispatch,
    dispatchBatch: dispatchBatch,
    project: project
  };
});
