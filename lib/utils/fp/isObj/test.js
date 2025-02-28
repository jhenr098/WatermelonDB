"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('isObj', function () {
  it('checks for objects correctly', function () {
    expect((0, _index["default"])({})).toBe(true);
    expect((0, _index["default"])({
      foo: 1,
      bar: 2
    })).toBe(true);
    var A = function A() {};
    expect((0, _index["default"])(new A())).toBe(true);
    expect((0, _index["default"])([])).toBe(false);
    expect((0, _index["default"])([{}, 1, 2])).toBe(false);
    expect((0, _index["default"])(0)).toBe(false);
    expect((0, _index["default"])(1)).toBe(false);
    expect((0, _index["default"])(true)).toBe(false);
    expect((0, _index["default"])(false)).toBe(false);
    expect((0, _index["default"])(null)).toBe(false);
    expect((0, _index["default"])(undefined)).toBe(false);
    expect((0, _index["default"])('')).toBe(false);
    expect((0, _index["default"])('hey')).toBe(false);
    expect((0, _index["default"])(function () {})).toBe(false);
  });
});