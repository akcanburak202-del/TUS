(function (root, factory) {
  "use strict";
  var api;
  if (typeof module === "object" && module.exports) {
    api = factory(require("./session-core.js"));
    module.exports = api;
  } else {
    api = factory(root.TusSessionCore);
  }
  root.TusSessionStore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (Core) {
  "use strict";

  var DEFAULT_DB_NAME = "tus-learning-demo-v2";
  var DATABASE_VERSION = 1;
  var STORE_NAME = "workspaceStates";

  function fail(message) { throw new TypeError(message); }

  function snapshot(value, seen) {
    if (value === null || typeof value === "string" || typeof value === "boolean") return value;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value !== "object") fail("input contains a value that cannot be snapshotted");
    seen = seen || [];
    if (seen.indexOf(value) !== -1) fail("input contains a cycle");
    seen.push(value);
    var out;
    if (Array.isArray(value)) {
      out = value.map(function (item) { return snapshot(item, seen); });
    } else {
      var proto = Object.getPrototypeOf(value);
      if (proto !== Object.prototype && proto !== null) fail("input must contain only plain objects and arrays");
      out = {};
      Object.keys(value).forEach(function (key) { out[key] = snapshot(value[key], seen); });
    }
    seen.pop();
    return out;
  }

  function error(message, cause) {
    var out = new Error(message);
    if (cause !== undefined) out.cause = cause;
    return out;
  }

  function workspaceId(value) {
    if (typeof value !== "string" || value.length === 0 || value.length > 128 || /\u0000/.test(value)) {
      fail("workspaceId must be 1..128 characters without NUL");
    }
    return value;
  }

  function Store(db, catalog) {
    this._db = db;
    this._catalog = catalog;
    this._closedError = null;
    this._active = [];
  }

  Store.prototype._begin = function (mode) {
    if (this._closedError) throw this._closedError;
    var transaction = this._db.transaction(STORE_NAME, mode);
    this._active.push(transaction);
    return transaction;
  };

  Store.prototype._forget = function (transaction) {
    var index = this._active.indexOf(transaction);
    if (index !== -1) this._active.splice(index, 1);
  };

  Store.prototype._invalidate = function (reason) {
    if (this._closedError) return;
    this._closedError = reason;
    this._active.slice().forEach(function (transaction) {
      try { transaction.abort(); } catch (_) { /* already finished */ }
    });
    this._db.close();
  };

  Store.prototype.load = function (workspace) {
    var self = this;
    var key;
    try { key = workspaceId(workspace); } catch (cause) { return Promise.reject(cause); }
    return new Promise(function (resolve, reject) {
      var transaction;
      var request;
      var result;
      var operationError = null;
      try {
        transaction = self._begin("readonly");
        request = transaction.objectStore(STORE_NAME).get(key);
      } catch (cause) {
        reject(cause);
        return;
      }
      request.onsuccess = function () {
        try {
          result = request.result === undefined ? Core.createState() : request.result.state;
          Core.validateState(result, self._catalog);
        } catch (cause) {
          operationError = cause;
          try { transaction.abort(); } catch (_) { /* transaction is already ending */ }
        }
      };
      request.onerror = function () { operationError = request.error || error("IndexedDB read failed"); };
      transaction.oncomplete = function () {
        self._forget(transaction);
        if (self._closedError) reject(self._closedError);
        else resolve(result);
      };
      transaction.onabort = transaction.onerror = function () {
        self._forget(transaction);
        reject(self._closedError || operationError || transaction.error || error("IndexedDB read transaction failed"));
      };
    });
  };

  Store.prototype.dispatch = function (workspace, commands) {
    var self = this;
    var key;
    var commandSnapshot;
    try {
      key = workspaceId(workspace);
      commandSnapshot = snapshot(commands);
    } catch (cause) {
      return Promise.reject(cause);
    }
    return new Promise(function (resolve, reject) {
      var transaction;
      var request;
      var next;
      var operationError = null;
      try {
        transaction = self._begin("readwrite");
        request = transaction.objectStore(STORE_NAME).get(key);
      } catch (cause) {
        reject(cause);
        return;
      }
      request.onsuccess = function () {
        try {
          var current = request.result === undefined ? Core.createState() : request.result.state;
          Core.validateState(current, self._catalog);
          next = Core.dispatchBatch(current, self._catalog, commandSnapshot);
          transaction.objectStore(STORE_NAME).put({ workspaceId: key, state: next });
        } catch (cause) {
          operationError = cause;
          try { transaction.abort(); } catch (_) { /* transaction is already ending */ }
        }
      };
      request.onerror = function () { operationError = request.error || error("IndexedDB read failed"); };
      transaction.oncomplete = function () {
        self._forget(transaction);
        if (self._closedError) reject(self._closedError);
        else resolve(next);
      };
      transaction.onabort = transaction.onerror = function () {
        self._forget(transaction);
        reject(self._closedError || operationError || transaction.error || error("IndexedDB write transaction failed"));
      };
    });
  };

  Store.prototype.close = function () {
    if (this._closedError) return;
    this._closedError = error("session store is closed");
    this._db.close();
  };

  function open(options) {
    var catalog;
    var indexedDB;
    var dbName;
    try {
      if (options === null || typeof options !== "object" || Array.isArray(options)) fail("open options must be an object");
      catalog = snapshot(options.catalog);
      Core.validateCatalog(catalog);
      indexedDB = options.indexedDB || (typeof globalThis !== "undefined" && globalThis.indexedDB);
      if (!indexedDB || typeof indexedDB.open !== "function") fail("IndexedDB is unavailable");
      dbName = options.dbName === undefined ? DEFAULT_DB_NAME : options.dbName;
      if (typeof dbName !== "string" || dbName.length === 0 || dbName.length > 255 || /\u0000/.test(dbName)) fail("dbName must be 1..255 characters without NUL");
    } catch (cause) {
      return Promise.reject(cause);
    }
    return new Promise(function (resolve, reject) {
      var request;
      var settled = false;
      try { request = indexedDB.open(dbName, DATABASE_VERSION); }
      catch (cause) { reject(cause); return; }
      request.onupgradeneeded = function () {
        var db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: "workspaceId" });
      };
      request.onerror = function () {
        if (!settled) { settled = true; reject(request.error || error("IndexedDB open failed")); }
      };
      request.onblocked = function () {
        if (!settled) { settled = true; reject(error("IndexedDB open was blocked")); }
      };
      request.onsuccess = function () {
        var db = request.result;
        if (settled) { db.close(); return; }
        settled = true;
        var store = new Store(db, catalog);
        db.onversionchange = function () { store._invalidate(error("IndexedDB version changed")); };
        resolve(store);
      };
    });
  }

  return { open: open };
});
