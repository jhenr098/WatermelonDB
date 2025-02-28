"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _logger = _interopRequireDefault(require("../../common/logger"));
var _ = _interopRequireDefault(require("."));
var fn = function fn() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return (0, _["default"])(args, 'fn', 'arg');
};
describe('fromArrayOrSpread', function () {
  it("can return args from array or spread", function () {
    expect(fn(1, 2, 3, 4)).toEqual([1, 2, 3, 4]);
    expect(fn([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    expect(function () {
      return fn([], []);
    }).toThrow();
    var spy = jest.spyOn(_logger["default"], 'warn').mockImplementation(function () {});
    var manyArgs = Array(201).fill(1);
    expect(fn.apply(void 0, (0, _toConsumableArray2["default"])(manyArgs))).toEqual(manyArgs);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});