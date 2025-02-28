"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = expectToRejectWithMessage;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
function expectToRejectWithMessage(_x, _x2) {
  return _expectToRejectWithMessage.apply(this, arguments);
}
function _expectToRejectWithMessage() {
  _expectToRejectWithMessage = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(promise, message) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return expect(promise).rejects.toMatchObject({
            // $FlowFixMe
            message: expect.stringMatching(message)
          });
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _expectToRejectWithMessage.apply(this, arguments);
}