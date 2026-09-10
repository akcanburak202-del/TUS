# TUS offline learning core

`core.js` is a dependency-free, fixed-rule learning core for an offline Android
prototype. It is a browser-compatible IIFE exposed as `globalThis.TusCore` and a
CommonJS module for Node. It does not implement or claim to implement FSRS.

## API

- `createState()` creates `{schemaVersion: 1, events: [], settings: {minutes: 15}}`.
- `validateState(value)` returns `true` or throws `TypeError`. It requires the exact
  backup shape, bounds event count and strings, validates UTC timestamps from 2000
  through 2099, checks enums and cross-field consistency, and rejects duplicate IDs.
- `validateTasks(tasks)` validates the host-owned catalog and rejects duplicate IDs.
- `addEvent(state, event)` validates both values and returns a new state. An exact
  repeat of an existing event is idempotent and returns the same state object. Reuse
  of an ID with different content throws. Existing events are never rewritten.
- `plan(state, tasks, minutes, now)` returns `{task, reason}` entries. The sum of
  `task.estimatedMinutes` never exceeds `minutes`. `now` is a UTC ISO timestamp.
- `summary(state, tasks, now)` reports attempts, self-reports, observer reports,
  exposures, and delayed independent successes in separate buckets.

All objects have exact keys; extra fields are rejected. IDs use letters, digits,
`.`, `_`, `:`, or `-`, begin with a letter or digit, and are at most 128 characters.
Answers are at most 2,000 characters. A state holds at most 100,000 events, a task
catalog at most 10,000 tasks, and minute values range from 0 through 1,440.

## Event shapes

An attempt has exactly these fields:

```js
{
  id, type: "attempt", at, objectiveId, taskId, familyId, taskVersion,
  kind: "recall" | "explain" | "discriminate",
  bank: "training" | "control", sessionId,
  result: "correct" | "incorrect" | "unknown",
  answer, hintUsed: boolean, answerShown: boolean,
  confidence: 0 | 1 | 2 | 3 | null
}
```

An exposure has exactly these fields:

```js
{
  id, type: "exposure", at, objectiveId,
  taskId: string | null, familyId: string | null,
  taskVersion: positiveInteger | null, sessionId,
  mode: "answer" | "hint" | "study" | "practice"
}
```

The three task reference fields are either all populated or all `null`. `answer`
and `hint` modes require a populated task reference.

An external report has exactly these fields:

```js
{
  id, type: "external", at, objectiveId,
  source: "self_report" | "observer",
  result: "correct" | "incorrect" | "unknown"
}
```

`at` and `now` are UTC ISO-8601 strings ending in `Z`. External reports never count
as independent evidence.

## Task catalog shape

The host stores the catalog separately from core state. Every task has exactly:

```js
{
  id, objectiveId, familyId,
  kind: "recall" | "explain" | "discriminate",
  bank: "training" | "control",
  status: "synthetic" | "approved" | "draft" | "suspended",
  estimatedMinutes: integerFrom1Through1440,
  version: positiveInteger
}
```

The planner uses only `training` tasks whose status is `approved` or `synthetic`.
It never puts a `control` task in a normal plan. Within each objective it chooses
the eligible task with the fewest prior training attempts. Ties prefer `recall`,
then `explain`, then `discriminate`, approved status, and task ID. This rotates
families instead of repeatedly selecting the lexically first task. It chooses at
most one task per objective and sorts those choices by a prior incorrect attempt,
a prior unknown attempt, no prior attempt, then maintenance after a correct
attempt. Ties use the oldest attempt, approved status, then task ID. Greedy
selection skips a task that would exceed the remaining capacity.

## Independent evidence rule

A successful attempt is delayed independent evidence only when all conditions hold:

1. It is a correct control-bank attempt with neither a hint nor a shown answer.
2. The objective has a prior exposure, and at least seven full days have elapsed
   since the latest prior exposure of that objective.
3. No prior event has used that control family.
4. No prior exposure of the objective has the same session ID.

Attempts marked incorrect and unknown remain separate. Self-reports, observer
reports, and exposures remain visible in their own totals but never become
independent success. `summary` and `plan` ignore events after `now` without deleting
or changing them.

Run the invariant tests with:

```sh
node --test tests/prototype/core.test.cjs
```

Host prototype/app.js projects rich UI task records to this strict core catalog before calling plan/summary.
