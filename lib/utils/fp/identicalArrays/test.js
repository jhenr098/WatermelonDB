"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('identicalArrays', function () {
  it('checks if arrays have identical contents', function () {
    expect((0, _index["default"])([], [])).toBe(true);
    expect((0, _index["default"])([1], [1])).toBe(true);
    expect((0, _index["default"])([true], [true])).toBe(true);
    expect((0, _index["default"])(['foo'], ['foo'])).toBe(true);
    // false
    expect((0, _index["default"])(['foo', 'bar'], ['foo'])).toBe(false);
    expect((0, _index["default"])(['foo'], ['foo', 'bar'])).toBe(false);
    expect((0, _index["default"])(['foo'], ['bar'])).toBe(false);
    expect((0, _index["default"])([1], [true])).toBe(false);
  });
});