"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.devMeasureTime = devMeasureTime;
exports.devMeasureTimeAsync = devMeasureTimeAsync;
exports.getPreciseTime = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var getPreciseTimeFunction = function getPreciseTimeFunction() {
  if (typeof global !== 'undefined' && global.nativePerformanceNow) {
    return global.nativePerformanceNow;
  } else if (typeof window !== 'undefined' && window.performance && window.performance.now) {
    return window.performance.now.bind(window.performance);
  }

  // $FlowFixMe
  return Date.now;
};
var getPreciseTime = exports.getPreciseTime = getPreciseTimeFunction();
function devMeasureTime(executeBlock) {
  var start = getPreciseTime();
  var result = executeBlock();
  var time = getPreciseTime() - start;
  return [result, time];
}
function devMeasureTimeAsync(_x) {
  return _devMeasureTimeAsync.apply(this, arguments);
}
function _devMeasureTimeAsync() {
  _devMeasureTimeAsync = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(executeBlock) {
    var start, result, time;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          start = getPreciseTime();
          _context.next = 3;
          return executeBlock();
        case 3:
          result = _context.sent;
          time = getPreciseTime() - start;
          return _context.abrupt("return", [result, time]);
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _devMeasureTimeAsync.apply(this, arguments);
}