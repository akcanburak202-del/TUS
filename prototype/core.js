(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.TusCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var MAX_EVENTS = 100000;
  var MAX_TASKS = 10000;
  var MAX_MINUTES = 1440;
  var SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  var RESULTS = ["correct", "incorrect", "unknown"];
  var KINDS = ["recall", "explain", "discriminate"];
  var BANKS = ["training", "control"];
  var STATUSES = ["synthetic", "approved", "draft", "suspended"];
  var EXPOSURE_MODES = ["answer", "hint", "study", "practice"];
  var EXTERNAL_SOURCES = ["self_report", "observer"];

  function fail(message) {
    throw new TypeError(message);
  }

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

  function boundedString(value, label, max, allowEmpty) {
    if (typeof value !== "string") fail(label + " must be a string");
    if ((!allowEmpty && value.length === 0) || value.length > max) {
      fail(label + " must be " + (allowEmpty ? "0" : "1") + ".." + max + " characters");
    }
    if (/\u0000/.test(value)) fail(label + " cannot contain NUL");
  }

  function id(value, label) {
    boundedString(value, label, 128, false);
    if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(value)) {
      fail(label + " contains unsupported characters");
    }
  }

  function oneOf(value, choices, label) {
    if (choices.indexOf(value) === -1) fail(label + " is invalid");
  }

  function positiveInteger(value, label) {
    if (!Number.isInteger(value) || value < 1 || value > 2147483647) {
      fail(label + " must be a positive integer");
    }
  }

  function timestamp(value, label) {
    boundedString(value, label, 32, false);
    var match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z$/.exec(value);
    if (!match) {
      fail(label + " must be a UTC ISO-8601 timestamp");
    }
    var ms = Date.parse(value);
    var lower = Date.UTC(2000, 0, 1);
    var upper = Date.UTC(2100, 0, 1);
    if (!Number.isFinite(ms) || ms < lower || ms >= upper) {
      fail(label + " is outside 2000-01-01 through 2099-12-31");
    }
    var date = new Date(ms);
    var fraction = match[7] ? Number((match[7] + "00").slice(0, 3)) : 0;
    if (date.getUTCFullYear() !== Number(match[1]) ||
        date.getUTCMonth() + 1 !== Number(match[2]) ||
        date.getUTCDate() !== Number(match[3]) ||
        date.getUTCHours() !== Number(match[4]) ||
        date.getUTCMinutes() !== Number(match[5]) ||
        date.getUTCSeconds() !== Number(match[6]) ||
        date.getUTCMilliseconds() !== fraction) {
      fail(label + " is not a real calendar timestamp");
    }
    return ms;
  }

  function nullableId(value, label) {
    if (value !== null) id(value, label);
  }

  function validateAttempt(event, label) {
    exactKeys(event, [
      "id", "type", "at", "objectiveId", "taskId", "familyId", "taskVersion",
      "kind", "bank", "sessionId", "result", "answer", "hintUsed",
      "answerShown", "confidence"
    ], label);
    id(event.id, label + ".id");
    timestamp(event.at, label + ".at");
    id(event.objectiveId, label + ".objectiveId");
    id(event.taskId, label + ".taskId");
    id(event.familyId, label + ".familyId");
    positiveInteger(event.taskVersion, label + ".taskVersion");
    oneOf(event.kind, KINDS, label + ".kind");
    oneOf(event.bank, BANKS, label + ".bank");
    id(event.sessionId, label + ".sessionId");
    oneOf(event.result, RESULTS, label + ".result");
    boundedString(event.answer, label + ".answer", 2000, true);
    if (typeof event.hintUsed !== "boolean") fail(label + ".hintUsed must be boolean");
    if (typeof event.answerShown !== "boolean") fail(label + ".answerShown must be boolean");
    if (event.confidence !== null &&
        (!Number.isInteger(event.confidence) || event.confidence < 0 || event.confidence > 3)) {
      fail(label + ".confidence must be null or an integer from 0 through 3");
    }
  }

  function validateExposure(event, label) {
    exactKeys(event, [
      "id", "type", "at", "objectiveId", "taskId", "familyId", "taskVersion",
      "sessionId", "mode"
    ], label);
    id(event.id, label + ".id");
    timestamp(event.at, label + ".at");
    id(event.objectiveId, label + ".objectiveId");
    nullableId(event.taskId, label + ".taskId");
    nullableId(event.familyId, label + ".familyId");
    if (event.taskVersion !== null) positiveInteger(event.taskVersion, label + ".taskVersion");
    id(event.sessionId, label + ".sessionId");
    oneOf(event.mode, EXPOSURE_MODES, label + ".mode");
    var allNull = event.taskId === null && event.familyId === null && event.taskVersion === null;
    var allSet = event.taskId !== null && event.familyId !== null && event.taskVersion !== null;
    if (!allNull && !allSet) fail(label + " task reference fields must all be null or all populated");
    if ((event.mode === "answer" || event.mode === "hint") && !allSet) {
      fail(label + " answer and hint exposures require a task reference");
    }
  }

  function validateExternal(event, label) {
    exactKeys(event, ["id", "type", "at", "objectiveId", "source", "result"], label);
    id(event.id, label + ".id");
    timestamp(event.at, label + ".at");
    id(event.objectiveId, label + ".objectiveId");
    oneOf(event.source, EXTERNAL_SOURCES, label + ".source");
    oneOf(event.result, RESULTS, label + ".result");
  }

  function validateEvent(event, label) {
    if (!isRecord(event)) fail(label + " must be a plain object");
    if (event.type === "attempt") validateAttempt(event, label);
    else if (event.type === "exposure") validateExposure(event, label);
    else if (event.type === "external") validateExternal(event, label);
    else fail(label + ".type is invalid");
    return true;
  }

  function createState() {
    return { schemaVersion: 1, events: [], settings: { minutes: 15 } };
  }

  function validateState(input) {
    exactKeys(input, ["schemaVersion", "events", "settings"], "state");
    if (input.schemaVersion !== 1) fail("state.schemaVersion must be 1");
    if (!Array.isArray(input.events)) fail("state.events must be an array");
    if (input.events.length > MAX_EVENTS) fail("state.events exceeds " + MAX_EVENTS);
    exactKeys(input.settings, ["minutes"], "state.settings");
    if (!Number.isInteger(input.settings.minutes) || input.settings.minutes < 0 ||
        input.settings.minutes > MAX_MINUTES) {
      fail("state.settings.minutes must be an integer from 0 through " + MAX_MINUTES);
    }
    var seen = Object.create(null);
    for (var i = 0; i < input.events.length; i += 1) {
      validateEvent(input.events[i], "state.events[" + i + "]");
      var eventId = input.events[i].id;
      if (seen[eventId]) fail("state.events contains duplicate id " + eventId);
      seen[eventId] = true;
    }
    return true;
  }

  function stableEventJson(event) {
    var keys = Object.keys(event).sort();
    var ordered = {};
    for (var i = 0; i < keys.length; i += 1) ordered[keys[i]] = event[keys[i]];
    return JSON.stringify(ordered);
  }

  function addEvent(state, event) {
    validateState(state);
    validateEvent(event, "event");
    for (var i = 0; i < state.events.length; i += 1) {
      if (state.events[i].id === event.id) {
        if (stableEventJson(state.events[i]) === stableEventJson(event)) return state;
        fail("event id already exists with different content: " + event.id);
      }
    }
    if (state.events.length >= MAX_EVENTS) fail("state.events exceeds " + MAX_EVENTS);
    var copy = Object.assign({}, event);
    return {
      schemaVersion: state.schemaVersion,
      events: state.events.concat([copy]),
      settings: { minutes: state.settings.minutes }
    };
  }

  function validateTask(task, label) {
    exactKeys(task, [
      "id", "objectiveId", "familyId", "kind", "bank", "status",
      "estimatedMinutes", "version"
    ], label);
    id(task.id, label + ".id");
    id(task.objectiveId, label + ".objectiveId");
    id(task.familyId, label + ".familyId");
    oneOf(task.kind, KINDS, label + ".kind");
    oneOf(task.bank, BANKS, label + ".bank");
    oneOf(task.status, STATUSES, label + ".status");
    if (!Number.isInteger(task.estimatedMinutes) || task.estimatedMinutes < 1 ||
        task.estimatedMinutes > MAX_MINUTES) {
      fail(label + ".estimatedMinutes must be an integer from 1 through " + MAX_MINUTES);
    }
    positiveInteger(task.version, label + ".version");
  }

  function validateTasks(tasks) {
    if (!Array.isArray(tasks)) fail("tasks must be an array");
    if (tasks.length > MAX_TASKS) fail("tasks exceeds " + MAX_TASKS);
    var seen = Object.create(null);
    for (var i = 0; i < tasks.length; i += 1) {
      validateTask(tasks[i], "tasks[" + i + "]");
      if (seen[tasks[i].id]) fail("tasks contains duplicate id " + tasks[i].id);
      seen[tasks[i].id] = true;
    }
    return true;
  }

  function nowMs(now) {
    return timestamp(now, "now");
  }

  function visibleEvents(state, cutoff) {
    return state.events.filter(function (event) { return Date.parse(event.at) <= cutoff; });
  }

  function plan(state, tasks, minutes, now) {
    validateState(state);
    validateTasks(tasks);
    if (!Number.isInteger(minutes) || minutes < 0 || minutes > MAX_MINUTES) {
      fail("minutes must be an integer from 0 through " + MAX_MINUTES);
    }
    var cutoff = nowMs(now);
    if (minutes === 0) return [];
    var events = visibleEvents(state, cutoff);
    var latestAttempt = Object.create(null);
    var attemptsByTask = Object.create(null);
    for (var i = 0; i < events.length; i += 1) {
      var e = events[i];
      if (e.type !== "attempt") continue;
      if (e.bank === "training") {
        attemptsByTask[e.taskId] = (attemptsByTask[e.taskId] || 0) + 1;
      }
      var previous = latestAttempt[e.objectiveId];
      if (!previous || Date.parse(previous.at) < Date.parse(e.at) ||
          (previous.at === e.at && previous.id < e.id)) {
        latestAttempt[e.objectiveId] = e;
      }
    }

    var priority = { retry_after_incorrect: 0, resolve_unknown: 1, new_objective: 2, maintain_recall: 3 };
    var kindPriority = { recall: 0, explain: 1, discriminate: 2 };
    var candidatesByObjective = Object.create(null);
    for (var j = 0; j < tasks.length; j += 1) {
      var task = tasks[j];
      if (task.bank !== "training") continue;
      if (task.status !== "approved" && task.status !== "synthetic") continue;
      if (!candidatesByObjective[task.objectiveId]) candidatesByObjective[task.objectiveId] = [];
      candidatesByObjective[task.objectiveId].push({
        task: task,
        attemptCount: attemptsByTask[task.id] || 0
      });
    }

    var candidates = [];
    var objectiveIds = Object.keys(candidatesByObjective);
    for (var objectiveIndex = 0; objectiveIndex < objectiveIds.length; objectiveIndex += 1) {
      var objectiveId = objectiveIds[objectiveIndex];
      var objectiveTasks = candidatesByObjective[objectiveId];
      objectiveTasks.sort(function (a, b) {
        return a.attemptCount - b.attemptCount ||
          kindPriority[a.task.kind] - kindPriority[b.task.kind] ||
          (a.task.status === b.task.status ? 0 : a.task.status === "approved" ? -1 : 1) ||
          (a.task.id < b.task.id ? -1 : a.task.id > b.task.id ? 1 : 0);
      });
      var chosen = objectiveTasks[0].task;
      var last = latestAttempt[objectiveId];
      var reason = !last ? "new_objective" :
        last.result === "incorrect" ? "retry_after_incorrect" :
        last.result === "unknown" ? "resolve_unknown" : "maintain_recall";
      candidates.push({ task: chosen, reason: reason, lastAt: last ? Date.parse(last.at) : -Infinity });
    }
    candidates.sort(function (a, b) {
      return priority[a.reason] - priority[b.reason] ||
        a.lastAt - b.lastAt ||
        (a.task.status === b.task.status ? 0 : a.task.status === "approved" ? -1 : 1) ||
        (a.task.id < b.task.id ? -1 : a.task.id > b.task.id ? 1 : 0);
    });

    var selected = [];
    var usedMinutes = 0;
    for (var k = 0; k < candidates.length; k += 1) {
      var candidate = candidates[k];
      if (usedMinutes + candidate.task.estimatedMinutes > minutes) continue;
      selected.push({ task: candidate.task, reason: candidate.reason });
      usedMinutes += candidate.task.estimatedMinutes;
    }
    return selected;
  }

  function emptyResultCounts() {
    return { total: 0, correct: 0, incorrect: 0, unknown: 0 };
  }

  function countResult(bucket, result) {
    bucket.total += 1;
    bucket[result] += 1;
  }

  function independentSuccess(attempt, seenFamilies, latestExposure, exposureSessions) {
    if (attempt.bank !== "control" || attempt.result !== "correct" ||
        attempt.hintUsed || attempt.answerShown) return false;
    var attemptAt = Date.parse(attempt.at);
    if (seenFamilies[attempt.familyId]) return false;
    var latestExposureAt = latestExposure[attempt.objectiveId];
    if (latestExposureAt === undefined) return false;
    var sessions = exposureSessions[attempt.objectiveId];
    if (sessions && sessions[attempt.sessionId]) return false;
    return attemptAt - latestExposureAt >= SEVEN_DAYS_MS;
  }

  function summary(state, tasks, now) {
    validateState(state);
    validateTasks(tasks);
    var cutoff = nowMs(now);
    var events = state.events.map(function (event, index) {
      return { event: event, index: index };
    }).filter(function (item) {
      return Date.parse(item.event.at) <= cutoff;
    }).sort(function (a, b) {
      return Date.parse(a.event.at) - Date.parse(b.event.at) || a.index - b.index;
    }).map(function (item) { return item.event; });
    var attempts = emptyResultCounts();
    var selfReports = emptyResultCounts();
    var observations = emptyResultCounts();
    var exposures = { total: 0, answer: 0, hint: 0, study: 0, practice: 0 };
    var successes = [];
    var latest = Object.create(null);
    var seenFamilies = Object.create(null);
    var latestExposure = Object.create(null);
    var exposureSessions = Object.create(null);

    for (var i = 0; i < events.length; i += 1) {
      var event = events[i];
      if (event.type === "attempt") {
        countResult(attempts, event.result);
        if (independentSuccess(event, seenFamilies, latestExposure, exposureSessions)) {
          var item = {
            eventId: event.id,
            objectiveId: event.objectiveId,
            taskId: event.taskId,
            familyId: event.familyId,
            at: event.at
          };
          successes.push(item);
          latest[event.objectiveId] = event.id;
        }
        seenFamilies[event.familyId] = true;
      } else if (event.type === "exposure") {
        exposures.total += 1;
        exposures[event.mode] += 1;
        latestExposure[event.objectiveId] = Date.parse(event.at);
        if (!exposureSessions[event.objectiveId]) {
          exposureSessions[event.objectiveId] = Object.create(null);
        }
        exposureSessions[event.objectiveId][event.sessionId] = true;
        if (event.familyId !== null) seenFamilies[event.familyId] = true;
      } else if (event.source === "self_report") {
        countResult(selfReports, event.result);
      } else {
        countResult(observations, event.result);
      }
    }
    return {
      attempts: attempts,
      selfReports: selfReports,
      externalObservations: observations,
      exposures: exposures,
      independent: {
        eligibleAttempts: successes.length,
        successes: successes,
        latestSuccessByObjective: latest
      }
    };
  }

  return {
    createState: createState,
    validateState: validateState,
    validateTasks: validateTasks,
    addEvent: addEvent,
    plan: plan,
    summary: summary
  };
});
