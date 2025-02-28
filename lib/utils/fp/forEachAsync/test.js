"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _index = _interopRequireDefault(require("./index"));
describe('forEachAsync', function () {
  it("works correctly", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var delayed, log;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          delayed = function delayed(ms) {
            return new Promise(function (resolve) {
              setTimeout(function () {
                return resolve(ms);
              }, ms);
            });
          };
          log = [];
          _context2.next = 4;
          return (0, _index["default"])([3, 1, 2], /*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(el) {
              return _regenerator["default"].wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return delayed(el);
                  case 2:
                    log.push(el * 2);
                  case 3:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x) {
              return _ref2.apply(this, arguments);
            };
          }());
        case 4:
          expect(log).toEqual([6, 2, 4]);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
});