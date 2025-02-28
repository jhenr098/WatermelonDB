"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _invariant = _interopRequireDefault(require("../../utils/common/invariant"));
var _logger = _interopRequireDefault(require("../../utils/common/logger"));
var _common = require("../common");
var _dispatcher = _interopRequireDefault(require("./dispatcher"));
// don't import the whole utils/ here!
var LokiJSAdapter = exports["default"] = /*#__PURE__*/function () {
  function LokiJSAdapter(options) {
    var _options$useWebWorker;
    this._options = options;
    this.dbName = options.dbName || 'loki';
    var schema = options.schema,
      migrations = options.migrations;
    var useWebWorker = (_options$useWebWorker = options.useWebWorker) !== null && _options$useWebWorker !== void 0 ? _options$useWebWorker : process.env.NODE_ENV !== 'test';
    this._dispatcher = new _dispatcher["default"](useWebWorker);
    this.schema = schema;
    this.migrations = migrations;
    if (process.env.NODE_ENV !== 'production') {
      (0, _invariant["default"])('useWebWorker' in options, 'LokiJSAdapter `useWebWorker` option is required. Pass `{ useWebWorker: false }` to adopt the new behavior, or `{ useWebWorker: true }` to supress this warning with no changes');
      if (options.useWebWorker === true) {
        _logger["default"].warn('LokiJSAdapter {useWebWorker: true} option is now deprecated. If you rely on this feature, please file an issue');
      }
      (0, _invariant["default"])('useIncrementalIndexedDB' in options, 'LokiJSAdapter `useIncrementalIndexedDB` option is required. Pass `{ useIncrementalIndexedDB: true }` to adopt the new behavior, or `{ useIncrementalIndexedDB: false }` to supress this warning with no changes');
      if (options.useIncrementalIndexedDB === false) {
        _logger["default"].warn('LokiJSAdapter {useIncrementalIndexedDB: false} option is now deprecated. If you rely on this feature, please file an issue');
      }
      (0, _common.validateAdapter)(this);
    }
    var callback = function callback(result) {
      return (0, _common.devSetupCallback)(result, options.onSetUpError);
    };
    this._dispatcher.call('setUp', [options], callback);
  }

  // eslint-disable-next-line no-use-before-define
  var _proto = LokiJSAdapter.prototype;
  _proto.testClone =
  /*#__PURE__*/
  function () {
    var _testClone = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var options,
        driver,
        _args = arguments;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
            // Ensure data is saved to memory
            // $FlowFixMe
            driver = this._driver;
            driver.loki.close();

            // $FlowFixMe
            return _context.abrupt("return", new LokiJSAdapter((0, _extends2["default"])({}, this._options, {
              _testLokiAdapter: driver.loki.persistenceAdapter
            }, options)));
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function testClone() {
      return _testClone.apply(this, arguments);
    }
    return testClone;
  }();
  _proto.find = function find(table, id, callback) {
    (0, _common.validateTable)(table, this.schema);
    this._dispatcher.call('find', [table, id], callback);
  };
  _proto.query = function query(_query, callback) {
    (0, _common.validateTable)(_query.table, this.schema);
    this._dispatcher.call('query', [_query], callback);
  };
  _proto.queryIds = function queryIds(query, callback) {
    (0, _common.validateTable)(query.table, this.schema);
    this._dispatcher.call('queryIds', [query], callback);
  };
  _proto.unsafeQueryRaw = function unsafeQueryRaw(query, callback) {
    (0, _common.validateTable)(query.table, this.schema);
    this._dispatcher.call('unsafeQueryRaw', [query], callback);
  };
  _proto.count = function count(query, callback) {
    (0, _common.validateTable)(query.table, this.schema);
    this._dispatcher.call('count', [query], callback);
  };
  _proto.batch = function batch(operations, callback) {
    var _this = this;
    operations.forEach(function (_ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        table = _ref2[1];
      return (0, _common.validateTable)(table, _this.schema);
    });
    // batches are only strings + raws which only have JSON-compatible values, rest is immutable
    this._dispatcher.call('batch', [operations], callback, 'shallowCloneDeepObjects');
  };
  _proto.getDeletedRecords = function getDeletedRecords(table, callback) {
    (0, _common.validateTable)(table, this.schema);
    this._dispatcher.call('getDeletedRecords', [table], callback);
  };
  _proto.destroyDeletedRecords = function destroyDeletedRecords(table, recordIds, callback) {
    (0, _common.validateTable)(table, this.schema);
    this._dispatcher.call('batch', [recordIds.map(function (id) {
      return ['destroyPermanently', table, id];
    })], callback, 'immutable', 'immutable');
  };
  _proto.unsafeLoadFromSync = function unsafeLoadFromSync(jsonId, callback) {
    callback({
      error: new Error('unsafeLoadFromSync unavailable in LokiJS')
    });
  };
  _proto.provideSyncJson = function provideSyncJson(id, syncPullResultJson, callback) {
    callback({
      error: new Error('provideSyncJson unavailable in LokiJS')
    });
  };
  _proto.unsafeResetDatabase = function unsafeResetDatabase(callback) {
    this._dispatcher.call('unsafeResetDatabase', [], callback);
  };
  _proto.unsafeExecute = function unsafeExecute(operations, callback) {
    this._dispatcher.call('unsafeExecute', [operations], callback);
  };
  _proto.getLocal = function getLocal(key, callback) {
    this._dispatcher.call('getLocal', [key], callback);
  };
  _proto.setLocal = function setLocal(key, value, callback) {
    (0, _invariant["default"])(typeof value === 'string', 'adapter.setLocal() value must be a string');
    this._dispatcher.call('setLocal', [key, value], callback);
  };
  _proto.removeLocal = function removeLocal(key, callback) {
    this._dispatcher.call('removeLocal', [key], callback);
  }

  // dev/debug utility
  ;
  // (experimental)
  _proto._fatalError = function _fatalError(error) {
    this._dispatcher.call('_fatalError', [error], function () {});
  }

  // (experimental)
  ;
  _proto._clearCachedRecords = function _clearCachedRecords() {
    this._dispatcher.call('clearCachedRecords', [], function () {});
  };
  _proto._debugDignoseMissingRecord = function _debugDignoseMissingRecord(table, id) {
    var driver = this._driver;
    if (driver) {
      var lokiCollection = driver.loki.getCollection(table);
      // if we can find the record by ID, it just means that the record cache ID was corrupted
      var didFindById = !!lokiCollection.by('id', id);
      _logger["default"].log("Did find ".concat(table, "#").concat(id, " in Loki collection by ID? ").concat(didFindById));

      // if we can't, but can filter to it, it means that Loki indices are corrupted
      var didFindByFilter = !!lokiCollection.data.filter(function (doc) {
        return doc.id === id;
      });
      _logger["default"].log("Did find ".concat(table, "#").concat(id, " in Loki collection by filtering the collection? ").concat(didFindByFilter));
    }
  };
  return (0, _createClass2["default"])(LokiJSAdapter, [{
    key: "_driver",
    get: function get() {
      // $FlowFixMe
      return this._dispatcher._worker._bridge.driver;
    }
  }]);
}();
LokiJSAdapter.adapterType = 'loki';