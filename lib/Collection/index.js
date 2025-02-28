"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _rx = require("../utils/rx");
var _invariant = _interopRequireDefault(require("../utils/common/invariant"));
var _fp = require("../utils/fp");
var _Result = require("../utils/fp/Result");
var _Query = _interopRequireDefault(require("../Query"));
var _RecordCache = _interopRequireDefault(require("./RecordCache"));
var Collection = exports["default"] = /*#__PURE__*/function () {
  function Collection(database, ModelClass) {
    var _this = this;
    /**
     * `Model` subclass associated with this Collection
     */
    /**
     * An `Rx.Subject` that emits a signal on every change (record creation/update/deletion) in
     * this Collection.
     *
     * The emissions contain information about which record was changed and what the change was.
     *
     * Warning: You can easily introduce performance bugs in your application by using this method
     * inappropriately. You generally should just use the `Query` API.
     */
    this.changes = new _rx.Subject();
    this._subscribers = [];
    this.database = database;
    this.modelClass = ModelClass;
    this._cache = new _RecordCache["default"](ModelClass.table, function (raw) {
      return new ModelClass(_this, raw);
    }, this);
  }

  /**
   * `Database` associated with this Collection.
   */
  var _proto = Collection.prototype;
  /**
   * Fetches the record with the given ID.
   *
   * If the record is not found, the Promise will reject.
   */
  _proto.find =
  /*#__PURE__*/
  function () {
    var _find = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(id) {
      var _this2 = this;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", (0, _Result.toPromise)(function (callback) {
              return _this2._fetchRecord(id, callback);
            }));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function find(_x) {
      return _find.apply(this, arguments);
    }
    return find;
  }()
  /**
   * Fetches the given record and then starts observing it.
   *
   * This is a convenience method that's equivalent to
   * `collection.find(id)`, followed by `record.observe()`.
   */
  ;
  _proto.findAndObserve = function findAndObserve(id) {
    var _this3 = this;
    return _rx.Observable.create(function (observer) {
      var unsubscribe = null;
      var unsubscribed = false;
      _this3._fetchRecord(id, function (result) {
        if (result.value) {
          var record = result.value;
          observer.next(record);
          unsubscribe = record.experimentalSubscribe(function (isDeleted) {
            if (!unsubscribed) {
              isDeleted ? observer.complete() : observer.next(record);
            }
          });
        } else {
          // $FlowFixMe
          observer.error(result.error);
        }
      });
      return function () {
        unsubscribed = true;
        unsubscribe && unsubscribe();
      };
    });
  }

  /*:: query: ArrayOrSpreadFn<Clause, Query<Record>>  */
  /**
   * Returns a `Query` with conditions given.
   *
   * You can pass conditions as multiple arguments or a single array.
   *
   * See docs for details about the Query API.
   */
  // $FlowFixMe
  ;
  _proto.query = function query() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var clauses = (0, _fp.fromArrayOrSpread)(args, 'Collection.query', 'Clause');
    return new _Query["default"](this, clauses);
  }

  /**
   * Creates a new record.
   * Pass a function to set attributes of the new record.
   *
   * Note: This method must be called within a Writer {@link Database#write}.
   *
   * @example
   * ```js
   * db.get(Tables.tasks).create(task => {
   *   task.name = 'Task name'
   * })
   * ```
   */;
  _proto.create =
  /*#__PURE__*/
  function () {
    var _create = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var recordBuilder,
        record,
        _args2 = arguments;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            recordBuilder = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : _fp.noop;
            this.database._ensureInWriter("Collection.create()");
            record = this.prepareCreate(recordBuilder);
            _context2.next = 5;
            return this.database.batch(record);
          case 5:
            return _context2.abrupt("return", record);
          case 6:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));
    function create() {
      return _create.apply(this, arguments);
    }
    return create;
  }()
  /**
   * Prepares a new record to be created
   *
   * Use this to batch-execute multiple changes at once.
   * @see {Collection#create}
   * @see {Database#batch}
   */
  ;
  _proto.prepareCreate = function prepareCreate() {
    var recordBuilder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _fp.noop;
    // $FlowFixMe
    return this.modelClass._prepareCreate(this, recordBuilder);
  }

  /**
   * Prepares a new record to be created, based on a raw object.
   *
   * Don't use this unless you know how RawRecords work in WatermelonDB. See docs for more details.
   *
   * This is useful as a performance optimization, when adding online-only features to an otherwise
   * offline-first app, or if you're implementing your own sync mechanism.
   */;
  _proto.prepareCreateFromDirtyRaw = function prepareCreateFromDirtyRaw(dirtyRaw) {
    // $FlowFixMe
    return this.modelClass._prepareCreateFromDirtyRaw(this, dirtyRaw);
  }

  /**
   * Returns a disposable record, based on a raw object.
   *
   * A disposable record is a read-only record that **does not** exist in the actual database. It's
   * not cached and cannot be saved in the database, updated, deleted, queried, or found by ID. It
   * only exists for as long as you keep a reference to it.
   *
   * Don't use this unless you know how RawRecords work in WatermelonDB. See docs for more details.
   *
   * This is useful for adding online-only features to an otherwise offline-first app, or for
   * temporary objects that are not meant to be persisted (as you can reuse existing Model helpers
   * and compatible UI components to display a disposable record).
   */;
  _proto.disposableFromDirtyRaw = function disposableFromDirtyRaw(dirtyRaw) {
    // $FlowFixMe
    return this.modelClass._disposableFromDirtyRaw(this, dirtyRaw);
  }

  // *** Implementation details ***

  // See: Query.fetch
  ;
  _proto._fetchQuery = function _fetchQuery(query, callback) {
    var _this4 = this;
    this.database.adapter.underlyingAdapter.query(query.serialize(), function (result) {
      return callback((0, _Result.mapValue)(function (rawRecords) {
        return _this4._cache.recordsFromQueryResult(rawRecords);
      }, result));
    });
  };
  _proto._fetchIds = function _fetchIds(query, callback) {
    this.database.adapter.underlyingAdapter.queryIds(query.serialize(), callback);
  };
  _proto._fetchCount = function _fetchCount(query, callback) {
    this.database.adapter.underlyingAdapter.count(query.serialize(), callback);
  };
  _proto._unsafeFetchRaw = function _unsafeFetchRaw(query, callback) {
    this.database.adapter.underlyingAdapter.unsafeQueryRaw(query.serialize(), callback);
  }

  // Fetches exactly one record (See: Collection.find)
  ;
  _proto._fetchRecord = function _fetchRecord(id, callback) {
    var _this5 = this;
    if (typeof id !== 'string') {
      callback({
        error: new Error("Invalid record ID ".concat(this.table, "#").concat(id))
      });
      return;
    }
    var cachedRecord = this._cache.get(id);
    if (cachedRecord) {
      callback({
        value: cachedRecord
      });
      return;
    }
    this.database.adapter.underlyingAdapter.find(this.table, id, function (result) {
      return callback((0, _Result.mapValue)(function (rawRecord) {
        (0, _invariant["default"])(rawRecord, "Record ".concat(_this5.table, "#").concat(id, " not found"));
        return _this5._cache.recordFromQueryResult(rawRecord);
      }, result));
    });
  };
  _proto._applyChangesToCache = function _applyChangesToCache(operations) {
    var _this6 = this;
    operations.forEach(function (_ref) {
      var record = _ref.record,
        type = _ref.type;
      if (type === 'created') {
        record._preparedState = null;
        _this6._cache.add(record);
      } else if (type === 'destroyed') {
        _this6._cache["delete"](record);
      }
    });
  };
  _proto._notify = function _notify(operations) {
    var collectionChangeNotifySubscribers = function collectionChangeNotifySubscribers(_ref2) {
      var _ref3 = (0, _slicedToArray2["default"])(_ref2, 1),
        subscriber = _ref3[0];
      subscriber(operations);
    };
    this._subscribers.forEach(collectionChangeNotifySubscribers);
    this.changes.next(operations);
    var collectionChangeNotifyModels = function collectionChangeNotifyModels(_ref4) {
      var record = _ref4.record,
        type = _ref4.type;
      if (type === 'updated') {
        record._notifyChanged();
      } else if (type === 'destroyed') {
        record._notifyDestroyed();
      }
    };
    operations.forEach(collectionChangeNotifyModels);
  };
  /**
   * Notifies `subscriber` on every change (record creation/update/deletion) in this Collection.
   *
   * Notifications contain information about which record was changed and what the change was.
   * (Currently, subscribers are called before `changes` emissions, but this behavior might change)
   *
   * Warning: You can easily introduce performance bugs in your application by using this method
   * inappropriately. You generally should just use the `Query` API.
   */
  _proto.experimentalSubscribe = function experimentalSubscribe(subscriber, debugInfo) {
    var _this7 = this;
    var entry = [subscriber, debugInfo];
    this._subscribers.push(entry);
    return function () {
      var idx = _this7._subscribers.indexOf(entry);
      idx !== -1 && _this7._subscribers.splice(idx, 1);
    };
  };
  return (0, _createClass2["default"])(Collection, [{
    key: "db",
    get: function get() {
      return this.database;
    }

    /**
     * Table name associated with this Collection
     */
  }, {
    key: "table",
    get: function get() {
      // $FlowFixMe
      return this.modelClass.table;
    }

    /**
     * Table schema associated with this Collection
     */
  }, {
    key: "schema",
    get: function get() {
      return this.database.schema.tables[this.table];
    }
  }]);
}();