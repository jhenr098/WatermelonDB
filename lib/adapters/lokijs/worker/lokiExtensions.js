"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.deleteDatabase = deleteDatabase;
exports.lokiFatalError = lokiFatalError;
exports.newLoki = newLoki;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _logger = _interopRequireDefault(require("../../../utils/common/logger"));
/* eslint-disable no-undef */
// don't import the whole utils/ here!
var isIDBAvailable = function isIDBAvailable(onQuotaExceededError) {
  return new Promise(function (resolve) {
    // $FlowFixMe
    if (typeof indexedDB === 'undefined') {
      resolve(false);
    }

    // in Firefox private mode, IDB will be available, but will fail to open
    // $FlowFixMe
    var checkRequest = indexedDB.open('WatermelonIDBChecker');
    checkRequest.onsuccess = function (e) {
      var db = e.target.result;
      db.close();
      resolve(true);
    };
    checkRequest.onerror = function (event) {
      var _event$target;
      var error = event === null || event === void 0 ? void 0 : (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.error;
      // this is what Firefox in Private Mode returns:
      // DOMException: "A mutation operation was attempted on a database that did not allow mutations."
      // code: 11, name: InvalidStateError
      _logger["default"].error('[Loki] IndexedDB checker failed to open. Most likely, user is in Private Mode. It could also be a quota exceeded error. Will fall back to in-memory database.', event, error);
      if (error && error.name === 'QuotaExceededError') {
        _logger["default"].log('[Loki] Looks like disk quota was exceeded: ', error);
        onQuotaExceededError && onQuotaExceededError(error);
      }
      resolve(false);
    };
    checkRequest.onblocked = function () {
      _logger["default"].error('IndexedDB checker call is blocked');
    };
  });
};
function getLokiAdapter(_x) {
  return _getLokiAdapter.apply(this, arguments);
}
function _getLokiAdapter() {
  _getLokiAdapter = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(options) {
    var useIncrementalIndexedDB, adapter, onQuotaExceededError, dbName, _options$extraIncreme, extraIncrementalIDBOptions, IncrementalIDBAdapter, LokiIndexedAdapter, _ref, LokiMemoryAdapter;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          useIncrementalIndexedDB = options.useIncrementalIndexedDB, adapter = options._testLokiAdapter, onQuotaExceededError = options.onQuotaExceededError, dbName = options.dbName, _options$extraIncreme = options.extraIncrementalIDBOptions, extraIncrementalIDBOptions = _options$extraIncreme === void 0 ? {} : _options$extraIncreme;
          if (!adapter) {
            _context.next = 5;
            break;
          }
          return _context.abrupt("return", adapter);
        case 5:
          _context.next = 7;
          return isIDBAvailable(onQuotaExceededError);
        case 7:
          if (!_context.sent) {
            _context.next = 13;
            break;
          }
          if (!useIncrementalIndexedDB) {
            _context.next = 11;
            break;
          }
          IncrementalIDBAdapter = options._betaLoki ? require('lokijs/src/incremental-indexeddb-adapter') : require('lokijs/src/incremental-indexeddb-adapter'); // $FlowFixMe
          return _context.abrupt("return", new IncrementalIDBAdapter(extraIncrementalIDBOptions));
        case 11:
          LokiIndexedAdapter = require('lokijs/src/loki-indexed-adapter');
          return _context.abrupt("return", new LokiIndexedAdapter(dbName));
        case 13:
          // if IDB is unavailable (that happens in private mode), fall back to memory adapter
          // we could also fall back to localstorage adapter, but it will fail in all but the smallest dbs
          _ref = options._betaLoki ? require('lokijs') : require('lokijs'), LokiMemoryAdapter = _ref.LokiMemoryAdapter;
          return _context.abrupt("return", new LokiMemoryAdapter());
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getLokiAdapter.apply(this, arguments);
}
function newLoki(_x2) {
  return _newLoki.apply(this, arguments);
}
function _newLoki() {
  _newLoki = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(options) {
    var _options$extraLokiOpt, extraLokiOptions, LokiDb, loki;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _options$extraLokiOpt = options.extraLokiOptions, extraLokiOptions = _options$extraLokiOpt === void 0 ? {} : _options$extraLokiOpt;
          LokiDb = options._betaLoki ? require('lokijs') : require('lokijs'); // $FlowFixMe
          _context2.t0 = LokiDb;
          _context2.t1 = options.dbName;
          _context2.t2 = _extends2["default"];
          _context2.next = 7;
          return getLokiAdapter(options);
        case 7:
          _context2.t3 = _context2.sent;
          _context2.t4 = {
            adapter: _context2.t3,
            autosave: true,
            autosaveInterval: 500,
            verbose: true
          };
          _context2.t5 = extraLokiOptions;
          _context2.t6 = (0, _context2.t2)(_context2.t4, _context2.t5);
          loki = new _context2.t0(_context2.t1, _context2.t6);
          _context2.next = 14;
          return new Promise(function (resolve, reject) {
            loki.loadDatabase({}, function (error) {
              error ? reject(error) : resolve();
            });
          });
        case 14:
          return _context2.abrupt("return", loki);
        case 15:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _newLoki.apply(this, arguments);
}
function deleteDatabase(_x3) {
  return _deleteDatabase.apply(this, arguments);
} // In case of a fatal error, break Loki so that it cannot save its contents to disk anymore
// This might result in a loss of data in recent changes, but we assume that whatever caused the
// fatal error has corrupted the database, so we want to prevent it from being persisted
// There's no recovery from this, app must be restarted with a fresh LokiJSAdapter.
function _deleteDatabase() {
  _deleteDatabase = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(loki) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return new Promise(function (resolve, reject) {
            // Works around a race condition - Loki doesn't disable autosave or drain save queue before
            // deleting database, so it's possible to delete and then have the database be saved
            loki.close(function () {
              loki.deleteDatabase({}, function (response) {
                // LokiIndexedAdapter responds with `{ success: true }`, while
                // LokiMemory adapter just calls it with no params
                if (response && response.success || response === undefined) {
                  resolve();
                } else {
                  reject(response);
                }
              });
            });
          });
        case 2:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _deleteDatabase.apply(this, arguments);
}
function lokiFatalError(loki) {
  try {
    // below is some very ugly defensive coding, but we're fatal and don't trust anyone anymore
    var fatalHandler = function fatalHandler() {
      throw new Error('Illegal attempt to save Loki database after a fatal error');
    };
    loki.save = fatalHandler;
    loki.saveDatabase = fatalHandler;
    loki.saveDatabaseInternal = fatalHandler;
    // disable autosave
    loki.autosave = false;
    loki.autosaveDisable();
    // close db
    loki.close();
  } catch (error) {
    _logger["default"].error('Failed to perform loki fatal error');
    _logger["default"].error(error);
  }
}