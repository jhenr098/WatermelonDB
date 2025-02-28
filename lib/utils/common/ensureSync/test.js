"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _index = _interopRequireDefault(require("./index"));
describe('ensureSync', function () {
  it('passes values through', function () {
    expect((0, _index["default"])('hello')).toBe('hello');
    expect((0, _index["default"])(true)).toBe(true);
    expect((0, _index["default"])(null)).toBe(null);
    expect((0, _index["default"])(undefined)).toBe(undefined);
  });
  it('throws an error if Promise is returned', function () {
    expect(function () {
      return (0, _index["default"])(Promise.resolve('hello'));
    }).toThrow();
    var asyncFunc = /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", 'blah');
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function asyncFunc() {
        return _ref.apply(this, arguments);
      };
    }();
    expect(function () {
      return (0, _index["default"])(asyncFunc());
    }).toThrow();
  });
});