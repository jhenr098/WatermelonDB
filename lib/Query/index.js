"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
exports.__esModule = true;
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));
var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));
var _allPromises = _interopRequireDefault(require("../utils/fp/allPromises"));
var _invariant = _interopRequireDefault(require("../utils/common/invariant"));
var _rx = require("../utils/rx");
var _Result = require("../utils/fp/Result");
var _fp = require("../utils/fp");
var _subscriptions = require("../utils/subscriptions");
var _lazy = _interopRequireDefault(require("../decorators/lazy"));
var _subscribeToCount = _interopRequireDefault(require("../observation/subscribeToCount"));
var _subscribeToQuery = _interopRequireDefault(require("../observation/subscribeToQuery"));
var _subscribeToQueryWithColumns = _interopRequireDefault(require("../observation/subscribeToQueryWithColumns"));
var Q = _interopRequireWildcard(require("../QueryDescription"));
var _helpers = require("./helpers");
var _class, _descriptor, _descriptor2, _descriptor3, _Query;
/* eslint-disable no-use-before-define */
// import from decorarators break the app on web production WTF ¯\_(ツ)_/¯
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var Query = exports["default"] = (_class = (_Query = /*#__PURE__*/function () {
  // Note: Don't use this directly, use Collection.query(...)
  function Query(collection, clauses) {
    (0, _initializerDefineProperty2["default"])(this, "_cachedSubscribable", _descriptor, this);
    (0, _initializerDefineProperty2["default"])(this, "_cachedCountSubscribable", _descriptor2, this);
    (0, _initializerDefineProperty2["default"])(this, "_cachedCountThrottledSubscribable", _descriptor3, this);
    this.collection = collection;
    this._rawDescription = Q.buildQueryDescription(clauses);
    this.description = Q.queryWithoutDeleted(this._rawDescription);
  }

  /*:: extend: ArrayOrSpreadFn<Clause, Query<Record>>  */
  /**
   * Returns a new Query that contains all clauses (conditions, sorting, etc.) from this Query
   * as well as the ones passed as arguments.
   *
   * You can pass conditions as multiple arguments or a single array.
   */
  // $FlowFixMe
  var _proto = Query.prototype;
  _proto.extend = function extend() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var clauses = (0, _fp.fromArrayOrSpread)(args, 'Collection.query', 'Clause');
    var collection = this.collection;
    var _this$_rawDescription = this._rawDescription,
      where = _this$_rawDescription.where,
      sortBy = _this$_rawDescription.sortBy,
      take = _this$_rawDescription.take,
      skip = _this$_rawDescription.skip,
      joinTables = _this$_rawDescription.joinTables,
      nestedJoinTables = _this$_rawDescription.nestedJoinTables,
      lokiTransform = _this$_rawDescription.lokiTransform,
      sql = _this$_rawDescription.sql;
    (0, _invariant["default"])(!sql, 'Cannot extend an unsafe SQL query');

    // TODO: Move this & tests to QueryDescription
    return new Query(collection, [Q.experimentalJoinTables(joinTables)].concat((0, _toConsumableArray2["default"])(nestedJoinTables.map(function (_ref) {
      var from = _ref.from,
        to = _ref.to;
      return Q.experimentalNestedJoin(from, to);
    })), (0, _toConsumableArray2["default"])(where), (0, _toConsumableArray2["default"])(sortBy), (0, _toConsumableArray2["default"])(take ? [Q.take(take)] : []), (0, _toConsumableArray2["default"])(skip ? [Q.skip(skip)] : []), (0, _toConsumableArray2["default"])(lokiTransform ? [Q.unsafeLokiTransform(lokiTransform)] : []), (0, _toConsumableArray2["default"])(clauses)));
  }

  /**
   * `query.pipe(fn)` is a FP convenience for `fn(query)`
   */;
  _proto.pipe = function pipe(transform) {
    return transform(this);
  }

  /**
   * Fetches the list of records matching this query
   *
   * Tip: For convenience, you can also use `await query`
   */;
  _proto.fetch = function fetch() {
    var _this = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this.collection._fetchQuery(_this, callback);
    });
  };
  _proto.then = function then(onFulfill, onReject) {
    // $FlowFixMe
    return this.fetch().then(onFulfill, onReject);
  }

  /**
   * Returns an `Rx.Observable` that tracks the list of records matching this query
   *
   * Tip: When using `withObservables`, you can simply pass the query without calling `.observe()`
   *
   * Warning: Changes to individual records in the array are NOT observed. Use `observeWithColumns`
   */;
  _proto.observe = function observe() {
    var _this2 = this;
    return _rx.Observable.create(function (observer) {
      return _this2._cachedSubscribable.subscribe(function (records) {
        observer.next(records);
      });
    });
  }

  /**
   * Same as {@link Query#observe}, but also emits when any of the records on the list
   * has one of its `columnNames` changed.
   */;
  _proto.observeWithColumns = function observeWithColumns(columnNames) {
    var _this3 = this;
    return _rx.Observable.create(function (observer) {
      return _this3.experimentalSubscribeWithColumns(columnNames, function (records) {
        observer.next(records);
      });
    });
  }

  /**
   * Fetches the number of records matching this query
   *
   * Tip: For convenience you can also use `await query.count`
   */;
  _proto.fetchCount = function fetchCount() {
    var _this4 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this4.collection._fetchCount(_this4, callback);
    });
  };
  /**
   * Returns an `Rx.Observable` that tracks the number of matching records
   *
   * Note: By default, the count is throttled. Pass `false` to opt out of throttling.
   */
  _proto.observeCount = function observeCount() {
    var _this5 = this;
    var isThrottled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    return _rx.Observable.create(function (observer) {
      var subscribable = isThrottled ? _this5._cachedCountThrottledSubscribable : _this5._cachedCountSubscribable;
      return subscribable.subscribe(function (count) {
        observer.next(count);
      });
    });
  }

  /**
   * Fetches the list of IDs of records matching this query
   *
   * Note: This is faster than using `fetch()` if you only need IDs
   */;
  _proto.fetchIds = function fetchIds() {
    var _this6 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this6.collection._fetchIds(_this6, callback);
    });
  }

  /**
   * Fetches an array of raw results of this query from the database.
   * These are plain JavaScript types and objects, not `Model` instances
   *
   * Warning: You MUST NOT mutate these objects, this can corrupt the database!
   *
   * This is useful as a performance optimization or for running non-standard raw queries
   * (e.g. pragmas, statistics, groupped results, records with extra columns, etc...)
   */;
  _proto.unsafeFetchRaw = function unsafeFetchRaw() {
    var _this7 = this;
    return (0, _Result.toPromise)(function (callback) {
      return _this7.collection._unsafeFetchRaw(_this7, callback);
    });
  }

  /**
   * Rx-free equivalent of `.observe()`
   */;
  _proto.experimentalSubscribe = function experimentalSubscribe(subscriber) {
    return this._cachedSubscribable.subscribe(subscriber);
  }

  /**
   * Rx-free equivalent of `.observeWithColumns()`
   */;
  _proto.experimentalSubscribeWithColumns = function experimentalSubscribeWithColumns(columnNames, subscriber) {
    return (0, _subscribeToQueryWithColumns["default"])(this, columnNames, subscriber);
  }

  /**
   * Rx-free equivalent of `.observeCount()`
   */;
  _proto.experimentalSubscribeToCount = function experimentalSubscribeToCount(subscriber) {
    return this._cachedCountSubscribable.subscribe(subscriber);
  }

  /**
   * Marks all records matching this query as deleted (they will be deleted permenantly after sync)
   *
   * Note: This method must be called within a Writer {@link Database#write}.
   *
   * @see {Model#markAsDeleted}
   */;
  _proto.markAllAsDeleted =
  /*#__PURE__*/
  function () {
    var _markAllAsDeleted = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var records;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.fetch();
          case 2:
            records = _context.sent;
            _context.next = 5;
            return (0, _allPromises["default"])(function (record) {
              return record.markAsDeleted();
            }, records);
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function markAllAsDeleted() {
      return _markAllAsDeleted.apply(this, arguments);
    }
    return markAllAsDeleted;
  }()
  /**
   * Permanently deletes all records matching this query
   *
   * Note: Do not use this when using Sync, as deletion will not be synced.
   *
   * Note: This method must be called within a Writer {@link Database#write}.
   *
   * @see {Model#destroyPermanently}
   */
  ;
  _proto.destroyAllPermanently =
  /*#__PURE__*/
  function () {
    var _destroyAllPermanently = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var records;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return this.fetch();
          case 2:
            records = _context2.sent;
            _context2.next = 5;
            return (0, _allPromises["default"])(function (record) {
              return record.destroyPermanently();
            }, records);
          case 5:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));
    function destroyAllPermanently() {
      return _destroyAllPermanently.apply(this, arguments);
    }
    return destroyAllPermanently;
  }() // MARK: - Internals
  /**
   * `Model` subclass associated with this query
   */
  ;
  // Serialized version of Query (e.g. for sending to web worker)
  _proto.serialize = function serialize() {
    var table = this.table,
      description = this.description,
      associations = this.associations;
    return {
      table: table,
      description: description,
      associations: associations
    };
  };
  return (0, _createClass2["default"])(Query, [{
    key: "count",
    get: function get() {
      var model = this;
      return {
        then: function then(onFulfill, onReject) {
          // $FlowFixMe
          return model.fetchCount().then(onFulfill, onReject);
        }
      };
    }
  }, {
    key: "modelClass",
    get: function get() {
      return this.collection.modelClass;
    }

    /**
     * Table name of the Collection associated with this query
     */
  }, {
    key: "table",
    get: function get() {
      // $FlowFixMe
      return this.modelClass.table;
    }

    // TODO: Should any of the below be public API? Is this any useful outside of Watermelon
    // internals? If so, should it even be here, not `_`-prefixed?
  }, {
    key: "secondaryTables",
    get: function get() {
      return this.description.joinTables.concat(this.description.nestedJoinTables.map(function (_ref2) {
        var to = _ref2.to;
        return to;
      }));
    }
  }, {
    key: "allTables",
    get: function get() {
      return [this.table].concat(this.secondaryTables);
    }
  }, {
    key: "associations",
    get: function get() {
      return (0, _helpers.getAssociations)(this.description, this.modelClass, this.collection.db);
    }
  }]);
}(), _Query._wmelonTag = 'query', _Query), _descriptor = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "_cachedSubscribable", [_lazy["default"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this8 = this;
    return new _subscriptions.SharedSubscribable(function (subscriber) {
      return (0, _subscribeToQuery["default"])(_this8, subscriber);
    });
  }
}), _descriptor2 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "_cachedCountSubscribable", [_lazy["default"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this9 = this;
    return new _subscriptions.SharedSubscribable(function (subscriber) {
      return (0, _subscribeToCount["default"])(_this9, false, subscriber);
    });
  }
}), _descriptor3 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "_cachedCountThrottledSubscribable", [_lazy["default"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this10 = this;
    return new _subscriptions.SharedSubscribable(function (subscriber) {
      return (0, _subscribeToCount["default"])(_this10, true, subscriber);
    });
  }
}), _class);