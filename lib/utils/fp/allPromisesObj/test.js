"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _index = _interopRequireDefault(require("./index"));
describe('allPromisesObj', function () {
  it("works correctly", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var delayed;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          delayed = function delayed(ms) {
            return new Promise(function (resolve) {
              setTimeout(function () {
                return resolve(ms);
              }, ms);
            });
          };
          _context.t0 = expect;
          _context.next = 4;
          return (0, _index["default"])({
            a: delayed(2),
            b: delayed(1),
            c: delayed(3)
          });
        case 4:
          _context.t1 = _context.sent;
          (0, _context.t0)(_context.t1).toEqual({
            a: 2,
            b: 1,
            c: 3
          });
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
});