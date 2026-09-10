"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

function playwright() {
  try { return require("playwright"); }
  catch (first) {
    const runtimeModules = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
    if (!runtimeModules) throw first;
    return require(path.join(runtimeModules, "playwright"));
  }
}

const root = path.resolve(__dirname, "../..");
let server;
let origin;
let browser;
let page;

test.before(async () => {
  server = http.createServer((request, response) => {
    const files = {
      "/": ["text/html", "<!doctype html><script src='/session-core.js'></script><script src='/session-store.js'></script>"],
      "/session-core.js": ["text/javascript", fs.readFileSync(path.join(root, "prototype/session-core.js"))],
      "/session-store.js": ["text/javascript", fs.readFileSync(path.join(root, "prototype/session-store.js"))]
    };
    const item = files[new URL(request.url, "http://localhost").pathname];
    if (!item) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { "content-type": item[0], "cache-control": "no-store" });
    response.end(item[1]);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await playwright().chromium.launch({ headless: true });
  page = await browser.newPage();
  await page.goto(origin);
  assert.equal(await page.evaluate(() => typeof TusSessionStore.open), "function");
});

test.after(async () => {
  if (browser) await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
});

function run(body, argument) {
  return page.evaluate(body, argument);
}

test("reload persists the authoritative events and current step with every historic catalog version", async () => {
  const result = await run(async dbName => {
    const makeTask = version => ({
      id: "synthetic-task", version,
      objective: { id: `objective-${version}`, version: "1.0.0" },
      family: { id: "family-1", version: "1.0.0" }, source: { id: "source-1", version: "1.0.0" },
      key: { id: `key-${version}`, version: "1.0.0" }, policy: { id: "policy-1", version: "1.0.0" },
      bank: "training", status: "synthetic", vettedContent: false,
      optionKeys: ["option-a", "option-b"], correctOptionKey: "option-a"
    });
    const catalog = { schemaVersion: 1, tasks: [makeTask("1.0.0"), makeTask("2.0.0")] };
    const at = n => `2026-09-10T10:00:0${n}.000Z`;
    let store = await TusSessionStore.open({ catalog, dbName });
    await store.dispatch("workspace", [
      { id: "event-0", type: "start_session", at: at(0), expectedRevision: 0, sessionId: "session-1", attemptId: "attempt-1", taskRef: { id: "synthetic-task", version: "1.0.0" }, step: "root" },
      { id: "event-1", type: "advance_step", at: at(1), expectedRevision: 1, sessionId: "session-1", attemptId: "attempt-1", step: "practice" },
      { id: "event-2", type: "pause_session", at: at(2), expectedRevision: 2, sessionId: "session-1", attemptId: "attempt-1" },
      { id: "event-3", type: "start_session", at: at(3), expectedRevision: 3, sessionId: "session-2", attemptId: "attempt-2", taskRef: { id: "synthetic-task", version: "2.0.0" }, step: "root" }
    ]);
    store.close();
    store = await TusSessionStore.open({ catalog, dbName });
    const state = await store.load("workspace");
    const view = TusSessionCore.project(state);
    store.close();
    let missingHistoricRejected = false;
    const incomplete = await TusSessionStore.open({ catalog: { schemaVersion: 1, tasks: [makeTask("2.0.0")] }, dbName });
    try { await incomplete.load("workspace"); } catch (_) { missingHistoricRejected = true; }
    incomplete.close();
    return { revision: state.revision, eventTypes: state.events.map(x => x.type), step: view.sessions["session-1"].currentStep, status: view.sessions["session-1"].status, missingHistoricRejected };
  }, `reload-${Date.now()}`);
  assert.deepEqual(result, {
    revision: 4, eventTypes: ["start_session", "advance_step", "pause_session", "start_session"],
    step: "practice", status: "paused", missingHistoricRejected: true
  });
});

test("two handles serialize writes and reject the stale expected revision", async () => {
  const result = await run(async dbName => {
    const task = { id: "synthetic-task", version: "1.0.0", objective: { id: "objective-1", version: "1.0.0" }, family: { id: "family-1", version: "1.0.0" }, source: { id: "source-1", version: "1.0.0" }, key: { id: "key-1", version: "1.0.0" }, policy: { id: "policy-1", version: "1.0.0" }, bank: "training", status: "synthetic", vettedContent: false, optionKeys: ["option-a", "option-b"], correctOptionKey: "option-a" };
    const catalog = { schemaVersion: 1, tasks: [task] };
    const a = await TusSessionStore.open({ catalog, dbName });
    const b = await TusSessionStore.open({ catalog, dbName });
    await a.dispatch("workspace", [{ id: "start", type: "start_session", at: "2026-09-10T10:00:00.000Z", expectedRevision: 0, sessionId: "session-1", attemptId: "attempt-1", taskRef: { id: "synthetic-task", version: "1.0.0" }, step: "root" }]);
    const base = { at: "2026-09-10T10:00:01.000Z", expectedRevision: 1, sessionId: "session-1", attemptId: "attempt-1" };
    const outcomes = await Promise.allSettled([
      a.dispatch("workspace", [{ ...base, id: "writer-a", type: "open_material", material: "root" }]),
      b.dispatch("workspace", [{ ...base, id: "writer-b", type: "advance_step", step: "practice" }])
    ]);
    const state = await a.load("workspace");
    a.close(); b.close();
    return { statuses: outcomes.map(x => x.status).sort(), revision: state.revision, tail: state.events[1].id };
  }, `writers-${Date.now()}`);
  assert.deepEqual(result.statuses, ["fulfilled", "rejected"]);
  assert.equal(result.revision, 2);
  assert.match(result.tail, /^writer-[ab]$/);
});

test("an exact duplicate is persisted as a no-op", async () => {
  const result = await run(async dbName => {
    const task = { id: "synthetic-task", version: "1.0.0", objective: { id: "objective-1", version: "1.0.0" }, family: { id: "family-1", version: "1.0.0" }, source: { id: "source-1", version: "1.0.0" }, key: { id: "key-1", version: "1.0.0" }, policy: { id: "policy-1", version: "1.0.0" }, bank: "training", status: "synthetic", vettedContent: false, optionKeys: ["option-a", "option-b"], correctOptionKey: "option-a" };
    const catalog = { schemaVersion: 1, tasks: [task] };
    const command = { id: "same", type: "start_session", at: "2026-09-10T10:00:00.000Z", expectedRevision: 0, sessionId: "session-1", attemptId: "attempt-1", taskRef: { id: "synthetic-task", version: "1.0.0" }, step: "root" };
    const store = await TusSessionStore.open({ catalog, dbName });
    const firstWrite = store.dispatch("workspace", [command]);
    command.step = "mutated-after-first-call";
    await firstWrite;
    const exactOriginal = { ...command, step: "root" };
    const replayed = await store.dispatch("workspace", [exactOriginal]);
    const loaded = await store.load("workspace");
    store.close();
    return { replayRevision: replayed.revision, loadedRevision: loaded.revision, step: loaded.events[0].command.step };
  }, `duplicate-${Date.now()}`);
  assert.deepEqual(result, { replayRevision: 1, loadedRevision: 1, step: "root" });
});

test("malformed stored history rejects and is never replaced with an empty state", async () => {
  const result = await run(async dbName => {
    const task = { id: "synthetic-task", version: "1.0.0", objective: { id: "objective-1", version: "1.0.0" }, family: { id: "family-1", version: "1.0.0" }, source: { id: "source-1", version: "1.0.0" }, key: { id: "key-1", version: "1.0.0" }, policy: { id: "policy-1", version: "1.0.0" }, bank: "training", status: "synthetic", vettedContent: false, optionKeys: ["option-a", "option-b"], correctOptionKey: "option-a" };
    const catalog = { schemaVersion: 1, tasks: [task] };
    const store = await TusSessionStore.open({ catalog, dbName });
    const db = await new Promise((resolve, reject) => { const request = indexedDB.open(dbName, 1); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    await new Promise((resolve, reject) => { const tx = db.transaction("workspaceStates", "readwrite"); tx.objectStore("workspaceStates").put({ workspaceId: "workspace", state: { schemaVersion: 1, revision: 7, events: [] } }); tx.oncomplete = resolve; tx.onerror = tx.onabort = () => reject(tx.error); });
    let rejected = false;
    try { await store.load("workspace"); } catch (_) { rejected = true; }
    const raw = await new Promise((resolve, reject) => { const tx = db.transaction("workspaceStates", "readonly"); const request = tx.objectStore("workspaceStates").get("workspace"); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    store.close(); db.close();
    return { rejected, revision: raw.state.revision, events: raw.state.events.length };
  }, `malformed-${Date.now()}`);
  assert.deepEqual(result, { rejected: true, revision: 7, events: 0 });
});

test("a simulated quota-like put abort rolls back the whole real transaction", async () => {
  const result = await run(async dbName => {
    const task = { id: "synthetic-task", version: "1.0.0", objective: { id: "objective-1", version: "1.0.0" }, family: { id: "family-1", version: "1.0.0" }, source: { id: "source-1", version: "1.0.0" }, key: { id: "key-1", version: "1.0.0" }, policy: { id: "policy-1", version: "1.0.0" }, bank: "training", status: "synthetic", vettedContent: false, optionKeys: ["option-a", "option-b"], correctOptionKey: "option-a" };
    const catalog = { schemaVersion: 1, tasks: [task] };
    const store = await TusSessionStore.open({ catalog, dbName });
    const start = { id: "start", type: "start_session", at: "2026-09-10T10:00:00.000Z", expectedRevision: 0, sessionId: "session-1", attemptId: "attempt-1", taskRef: { id: "synthetic-task", version: "1.0.0" }, step: "root" };
    await store.dispatch("workspace", [start]);
    const originalPut = IDBObjectStore.prototype.put;
    let rejected = false;
    try {
      IDBObjectStore.prototype.put = function (...args) {
        const request = originalPut.apply(this, args);
        this.transaction.abort();
        return request;
      };
      await store.dispatch("workspace", [
        { id: "step", type: "advance_step", at: "2026-09-10T10:00:01.000Z", expectedRevision: 1, sessionId: "session-1", attemptId: "attempt-1", step: "practice" },
        { id: "pause", type: "pause_session", at: "2026-09-10T10:00:02.000Z", expectedRevision: 2, sessionId: "session-1", attemptId: "attempt-1" }
      ]);
    } catch (_) { rejected = true; }
    finally { IDBObjectStore.prototype.put = originalPut; }
    const state = await store.load("workspace");
    store.close();
    return { rejected, revision: state.revision, ids: state.events.map(x => x.id) };
  }, `abort-${Date.now()}`);
  assert.deepEqual(result, { rejected: true, revision: 1, ids: ["start"] });
});
