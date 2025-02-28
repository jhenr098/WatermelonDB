"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('splitEvery', function () {
  it("works correctly", function () {
    var _long = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    var _short = [1, 2, 3];
    var empty = [];
    expect((0, _index["default"])(10, _long)).toEqual([_long]);
    expect((0, _index["default"])(3, _long)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [0]]);
    expect((0, _index["default"])(4, _short)).toEqual([_short]);
    expect((0, _index["default"])(3, _short)).toEqual([_short]);
    expect((0, _index["default"])(2, _short)).toEqual([[1, 2], [3]]);
    expect((0, _index["default"])(1, _short)).toEqual([[1], [2], [3]]);
    expect((0, _index["default"])(1, empty)).toEqual([]);
  });
});