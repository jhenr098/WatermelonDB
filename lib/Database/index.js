"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
exports.setExperimentalAllowsFatalError = setExperimentalAllowsFatalError;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _rx = require("../utils/rx");
var _common = require("../utils/common");
var _fp = require("../utils/fp");
var _compat = _interopRequireDefault(require("../adapters/compat"));
var _CollectionMap = _interopRequireDefault(require("./CollectionMap"));
var _WorkQueue = _interopRequireDefault(require("./WorkQueue"));
var experimentalAllowsFatalError = false;
function setExperimentalAllowsFatalError() {
  experimentalAllowsFatalError = true;
}
var Database = exports["default"] = /*#__PURE__*/function () {
  function Database(options) {
    /**
     * Database's adapter - the low-level connection with the underlying database (e.g. SQLite)
     *
     * Unless you understand WatermelonDB's internals, you SHOULD NOT use adapter directly.
     * Running queries, or updating/deleting records on the adapter will corrupt the in-memory cache
     * if special care is not taken
     */
    this._workQueue = new _WorkQueue["default"](this);
    // (experimental) if true, Database is in a broken state and should not be used anymore
    this._isBroken = false;
    this._pendingNotificationBatches = 0;
    this._pendingNotificationChanges = [];
    this._subscribers = [];
    this._resetCount = 0;
    this._isBeingReset = false;
    // (experimental) if true, Models will print to console diagnostic information on every
    // prepareCreate/Update/Delete call, as well as on commit (Database.batch() call). Note that this
    // has a significant performance impact so should only be enabled when debugging.
    this.experimentalIsVerbose = false;
    var adapter = options.adapter,
      modelClasses = options.modelClasses;
    if (process.env.NODE_ENV !== 'production') {
      (0, _common.invariant)(adapter, "Missing adapter parameter for new Database()");
      (0, _common.invariant)(modelClasses && Array.isArray(modelClasses), "Missing modelClasses parameter for new Database()");
    }
    this.adapter = new _compat["default"](adapter);
    this.schema = adapter.schema;
    this.collections = new _CollectionMap["default"](this, modelClasses);
  }

  /**
   * Returns a `Collection` for a given table name
   */
  var _proto = Database.prototype;
  _proto.get = function get(tableName) {
    return this.collections.get(tableName);
  }

  /**
   * Returns a `LocalStorage` (WatermelonDB-based localStorage/AsyncStorage alternative)
   */;
  /*:: batch: ArrayOrSpreadFn<?Model | false, Promise<void>>  */
  /**
   * Executes multiple prepared operations
   *
   * Pass a list (or array) of operations like so:
   * - `collection.prepareCreate(...)`
   * - `record.prepareUpdate(...)`
   * - `record.prepareMarkAsDeleted()` (or `record.prepareDestroyPermanently()`)
   *
   * Note that falsy values (null, undefined, false) passed to batch are simply ignored
   * so you can use patterns like `.batch(condition && record.prepareUpdate(...))` for convenience.
   *
   * Note: This method must be called within a Writer {@link Database#write}.
   */
  // $FlowFixMe
  _proto.batch =
  /*#__PURE__*/
  function () {
    var _batch = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var _this = this;
      var _len,
        records,
        _key,
        actualRecords,
        batchOperations,
        changeNotifications,
        debugInfo,
        changes,
        _args = arguments;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            for (_len = _args.length, records = new Array(_len), _key = 0; _key < _len; _key++) {
              records[_key] = _args[_key];
            }
            actualRecords = (0, _fp.fromArrayOrSpread)(records, 'Database.batch', 'Model');
            this._ensureInWriter("Database.batch()");

            // performance critical - using mutations
            batchOperations = [];
            changeNotifications = {};
            actualRecords.forEach(function (record) {
              if (!record) {
                return;
              }
              var preparedState = record._preparedState;
              if (!preparedState) {
                (0, _common.invariant)(record._raw._status !== 'disposable', "Cannot batch a disposable record");
                throw new Error("Cannot batch a record that doesn't have a prepared create/update/delete");
              }
              var raw = record._raw;
              var id = raw.id; // faster than Model.id
              var table = record.constructor.table; // faster than Model.table

              var changeType;
              if (preparedState === 'update') {
                batchOperations.push(['update', table, raw]);
                changeType = 'updated';
              } else if (preparedState === 'create') {
                batchOperations.push(['create', table, raw]);
                changeType = 'created';
              } else if (preparedState === 'markAsDeleted') {
                batchOperations.push(['markAsDeleted', table, id]);
                changeType = 'destroyed';
              } else if (preparedState === 'destroyPermanently') {
                batchOperations.push(['destroyPermanently', table, id]);
                changeType = 'destroyed';
              } else {
                (0, _common.invariant)(false, 'bad preparedState');
              }
              if (preparedState !== 'create') {
                // We're (unsafely) assuming that batch will succeed and removing the "pending" state so that
                // subsequent changes to the record don't trip up the invariant
                // TODO: What if this fails?
                record._preparedState = null;
              }
              if (!changeNotifications[table]) {
                changeNotifications[table] = [];
              }
              changeNotifications[table].push({
                record: record,
                type: changeType
              });
            });
            _context.next = 8;
            return this.adapter.batch(batchOperations);
          case 8:
            // Debug info
            if (this.experimentalIsVerbose) {
              debugInfo = batchOperations.map(function (_ref) {
                var _ref2 = (0, _slicedToArray2["default"])(_ref, 3),
                  type = _ref2[0],
                  table = _ref2[1],
                  rawOrId = _ref2[2];
                switch (type) {
                  case 'create':
                  case 'update':
                    return "".concat(type, " ").concat(table, "#").concat(rawOrId.id);
                  case 'markAsDeleted':
                  case 'destroyPermanently':
                    return "".concat(type, " ").concat(table, "#").concat(rawOrId);
                  default:
                    return "".concat(type, "???");
                }
              }).join(', ');
              _common.logger.debug("batch: ".concat(debugInfo));
            }

            // NOTE: We must make two passes to ensure all changes to caches are applied before subscribers are called
            changes = Object.entries(changeNotifications);
            changes.forEach(function (_ref3) {
              var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
                table = _ref4[0],
                changeSet = _ref4[1];
              _this.collections.get(table)._applyChangesToCache(changeSet);
            });
            this._notify(changes);
            return _context.abrupt("return", undefined);
          case 13:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function batch() {
      return _batch.apply(this, arguments);
    }
    return batch;
  }();
  _proto._notify = function _notify(changes) {
    var _this2 = this;
    if (this._pendingNotificationBatches > 0) {
      this._pendingNotificationChanges.push(changes);
      return;
    }
    var affectedTables = new Set(changes.map(function (_ref5) {
      var _ref6 = (0, _slicedToArray2["default"])(_ref5, 1),
        table = _ref6[0];
      return table;
    }));
    var databaseChangeNotifySubscribers = function databaseChangeNotifySubscribers(_ref7) {
      var _ref8 = (0, _slicedToArray2["default"])(_ref7, 2),
        tables = _ref8[0],
        subscriber = _ref8[1];
      if (tables.some(function (table) {
        return affectedTables.has(table);
      })) {
        subscriber();
      }
    };
    this._subscribers.forEach(databaseChangeNotifySubscribers);
    changes.forEach(function (_ref9) {
      var _ref10 = (0, _slicedToArray2["default"])(_ref9, 2),
        table = _ref10[0],
        changeSet = _ref10[1];
      _this2.collections.get(table)._notify(changeSet);
    });
  };
  _proto.experimentalBatchNotifications = /*#__PURE__*/function () {
    var _experimentalBatchNotifications = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(work) {
      var _this3 = this;
      var result, changes;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            this._pendingNotificationBatches += 1;
            _context2.next = 4;
            return work();
          case 4:
            result = _context2.sent;
            return _context2.abrupt("return", result);
          case 6:
            _context2.prev = 6;
            this._pendingNotificationBatches -= 1;
            if (this._pendingNotificationBatches === 0) {
              changes = this._pendingNotificationChanges;
              this._pendingNotificationChanges = [];
              changes.forEach(function (_changes) {
                return _this3._notify(_changes);
              });
            }
            return _context2.finish(6);
          case 10:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this, [[0,, 6, 10]]);
    }));
    function experimentalBatchNotifications(_x) {
      return _experimentalBatchNotifications.apply(this, arguments);
    }
    return experimentalBatchNotifications;
  }()
  /**
   * Schedules a Writer
   *
   * Writer is a block of code, inside of which you can modify the database
   * (call `Collection.create`, `Model.update`, `Database.batch` and so on).
   *
   * In a Writer, you're guaranteed that no other Writer is simultaneously executing. Therefore, you
   * can rely on the results of queries and other asynchronous operations - they won't change for
   * the duration of this Writer (except if changed by it).
   *
   * To call another Writer (or Reader) from this one without deadlocking, use `callWriter`
   * (or `callReader`).
   *
   * See docs for more details and a practical guide.
   *
   * @param work - Block of code to execute
   * @param [description] - Debug description of this Writer
   */
  ;
  _proto.write = function write(work, description) {
    return this._workQueue.enqueue(work, description, true);
  }

  /**
   * Schedules a Reader
   *
   * In a Reader, you're guaranteed that no Writer is running at the same time. Therefore, you can
   * run many queries or other asynchronous operations, and you can rely on their results - they
   * won't change for the duration of this Reader. However, other Readers might run concurrently.
   *
   * To call another Reader from this one, use `callReader`
   *
   * See docs for more details and a practical guide.
   *
   * @param work - Block of code to execute
   * @param [description] - Debug description of this Reader
   */;
  _proto.read = function read(work, description) {
    return this._workQueue.enqueue(work, description, false);
  }

  /**
   * Returns an `Observable` that emits a signal (`null`) immediately, and on every change in
   * any of the passed tables.
   *
   * A set of changes made is passed with the signal, with an array of changes per-table
   * (Currently, if changes are made to multiple different tables, multiple signals will be emitted,
   * even if they're made with a batch. However, this behavior might change. Use Rx to debounce,
   * throttle, merge as appropriate for your use case.)
   *
   * Warning: You can easily introduce performance bugs in your application by using this method
   * inappropriately.
   */;
  _proto.withChangesForTables = function withChangesForTables(tables) {
    var _this4 = this;
    var changesSignals = tables.map(function (table) {
      return _this4.collections.get(table).changes;
    });
    return _rx.merge.apply(void 0, (0, _toConsumableArray2["default"])(changesSignals)).pipe((0, _rx.startWith)(null));
  };
  /**
   * Notifies `subscriber` on change in any of the passed tables.
   *
   * A single notification will be sent per `database.batch()` call.
   * (Currently, no details about the changes made are provided, only a signal, but this behavior
   * might change. Currently, subscribers are called before `withChangesForTables`).
   *
   * Warning: You can easily introduce performance bugs in your application by using this method
   * inappropriately.
   */
  _proto.experimentalSubscribe = function experimentalSubscribe(tables, subscriber, debugInfo) {
    var _this5 = this;
    if (!tables.length) {
      return _fp.noop;
    }
    var entry = [tables, subscriber, debugInfo];
    this._subscribers.push(entry);
    return function () {
      var idx = _this5._subscribers.indexOf(entry);
      idx !== -1 && _this5._subscribers.splice(idx, 1);
    };
  };
  /**
   * Resets the database
   *
   * This permanently deletes the database (all records, metadata, and `LocalStorage`) and sets
   * up an empty database.
   *
   * Special care must be taken to safely reset the database. Ideally, you should reset your app
   * to an empty / "logging out" state while doing this. Specifically:
   *
   * - You MUST NOT hold onto Watermelon records other than this `Database`. Do not keep references
   *   to records, collections, or any other objects from before database reset
   * - You MUST NOT observe any Watermelon state. All Database, Collection, Query, and Model
   *   observers/subscribers should be disposed of before resetting
   * - You SHOULD NOT have any pending (queued) Readers or Writers. Pending work will be aborted
   *   (rejected with an error)
   */
  _proto.unsafeResetDatabase =
  /*#__PURE__*/
  function () {
    var _unsafeResetDatabase = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var adapter, ErrorAdapter;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            this._ensureInWriter("Database.unsafeResetDatabase()");
            _context3.prev = 1;
            this._isBeingReset = true;
            // First kill actions, to ensure no more traffic to adapter happens
            this._workQueue._abortPendingWork();

            // Kill ability to call adapter methods during reset (to catch bugs if someone does this)
            adapter = this.adapter;
            ErrorAdapter = require('../adapters/error')["default"];
            this.adapter = new ErrorAdapter();

            // Check for illegal subscribers
            if (this._subscribers.length) {
              // TODO: This should be an error, not a console.log, but actually useful diagnostics are necessary for this to work, otherwise people will be confused
              // eslint-disable-next-line no-console
              console.log("Application error! Unexpected ".concat(this._subscribers.length, " Database subscribers were detected during database.unsafeResetDatabase() call. App should not hold onto subscriptions or Watermelon objects while resetting database."));
              // eslint-disable-next-line no-console
              console.log(this._subscribers);
              this._subscribers = [];
            }

            // Clear the database
            _context3.next = 10;
            return adapter.unsafeResetDatabase();
          case 10:
            // Only now clear caches, since there may have been queued fetches from DB still bringing in items to cache
            Object.values(this.collections.map).forEach(function (collection) {
              // $FlowFixMe
              collection._cache.unsafeClear();
            });

            // Restore working Database
            this._resetCount += 1;
            this.adapter = adapter;
          case 13:
            _context3.prev = 13;
            this._isBeingReset = false;
            return _context3.finish(13);
          case 16:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this, [[1,, 13, 16]]);
    }));
    function unsafeResetDatabase() {
      return _unsafeResetDatabase.apply(this, arguments);
    }
    return unsafeResetDatabase;
  }();
  _proto._ensureInWriter = function _ensureInWriter(debugName) {
    (0, _common.invariant)(this._workQueue.isWriterRunning, "".concat(debugName, " can only be called from inside of a Writer. See docs for more details."));
  }

  // (experimental) puts Database in a broken state
  // TODO: Not used anywhere yet
  ;
  _proto._fatalError = function _fatalError(error) {
    if (!experimentalAllowsFatalError) {
      _common.logger.warn('Database is now broken, but experimentalAllowsFatalError has not been enabled to do anything about it...');
      return;
    }
    this._isBroken = true;
    _common.logger.error('Database is broken. App must be reloaded before continuing.');

    // TODO: Passing this to an adapter feels wrong, but it's tricky.
    // $FlowFixMe
    if (this.adapter.underlyingAdapter._fatalError) {
      // $FlowFixMe
      this.adapter.underlyingAdapter._fatalError(error);
    }
  };
  return (0, _createClass2["default"])(Database, [{
    key: "localStorage",
    get: function get() {
      if (!this._localStorage) {
        var LocalStorageClass = require('./LocalStorage')["default"];
        this._localStorage = new LocalStorageClass(this);
      }
      return this._localStorage;
    }
  }]);
}();