"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('unique', function () {
  it("returns a list of unique elements, by identity", function () {
    expect((0, _index["default"])([1, 4, 5, 1, 6, 4, 1, 9])).toEqual([1, 4, 5, 6, 9]);
    expect((0, _index["default"])(['a', 'c', 'b', 'c', 'd', 'a'])).toEqual(['a', 'c', 'b', 'd']);
    var o1 = [];
    var o2 = [];
    var o3 = [];
    expect((0, _index["default"])([o1, o2, o3, o2, o1])).toEqual([o1, o2, o3]);
  });
});