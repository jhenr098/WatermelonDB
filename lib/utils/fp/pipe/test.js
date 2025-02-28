"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('pipe', function () {
  it("works correctly", function () {
    var add = function add(a, b) {
      return a + b;
    };
    var plus10 = function plus10(a) {
      return a + 10;
    };
    var times5 = function times5(a) {
      return a * 5;
    };
    expect((0, _index["default"])()()).toBe(undefined);
    expect((0, _index["default"])()(1, 2)).toBe(undefined);
    expect((0, _index["default"])(add)(1, 2)).toBe(3);
    expect((0, _index["default"])(add, plus10)(1, 2)).toBe(13);
    expect((0, _index["default"])(add, times5, function (x) {
      return x - 5;
    }, plus10)(3, 4)).toBe(40);
  });
});