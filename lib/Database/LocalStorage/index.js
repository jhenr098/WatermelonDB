"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
exports.localStorageKey = localStorageKey;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _common = require("../../utils/common");
function localStorageKey(name) {
  return name;
}
var LocalStorage = exports["default"] = /*#__PURE__*/function () {
  function LocalStorage(database) {
    this._db = database;
  }

  // Get value from LocalStorage (returns value deserialized from JSON)
  // Returns `undefined` if not found
  var _proto = LocalStorage.prototype;
  _proto.get =
  /*#__PURE__*/
  function () {
    var _get = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(key) {
      var json;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this._db.adapter.getLocal(key);
          case 2:
            json = _context.sent;
            return _context.abrupt("return", json == null ? undefined : JSON.parse(json));
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function get(_x) {
      return _get.apply(this, arguments);
    }
    return get;
  }() // Experimental: Same as get(), but can be called synchronously
  ;
  _proto._getSync = function _getSync(key, callback) {
    this._db.adapter.underlyingAdapter.getLocal(key, function (result) {
      var json = result.value ? result.value : undefined;
      var value = json == null ? undefined : JSON.parse(json);
      callback(value);
    });
  }

  // Set value to LocalStorage
  // Only JSON-serializable values are allowed and well-behaved:
  // strings, numbers, booleans, and null; as well as arrays and objects only containing those
  //
  // Serializing other values will either throw an error (e.g. function passed) or be serialized
  // such that deserializing it won't yield an equal value (e.g. NaN to null, Dates to a string)
  // See details:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description
  ;
  _proto.set =
  /*#__PURE__*/
  function () {
    var _set = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(key, value) {
      var json;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            json = JSON.stringify(value);
            (0, _common.invariant)(typeof json === 'string', 'Value not JSON-serializable');
            return _context2.abrupt("return", this._db.adapter.setLocal(key, json));
          case 3:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));
    function set(_x2, _x3) {
      return _set.apply(this, arguments);
    }
    return set;
  }();
  _proto.remove = /*#__PURE__*/function () {
    var _remove = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(key) {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", this._db.adapter.removeLocal(key));
          case 1:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this);
    }));
    function remove(_x4) {
      return _remove.apply(this, arguments);
    }
    return remove;
  }();
  return LocalStorage;
}();