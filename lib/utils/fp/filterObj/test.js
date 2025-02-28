"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('filterObj', function () {
  it("works correctly", function () {
    var obj = {
      c: 20,
      a: 5,
      b: 10
    };
    expect((0, _index["default"])(function (x) {
      return x > 9;
    }, obj)).toEqual({
      c: 20,
      b: 10
    });
    expect((0, _index["default"])(function (x) {
      return x < 11;
    })(obj)).toEqual({
      a: 5,
      b: 10
    });
    expect((0, _index["default"])(function (x) {
      return x < 0;
    })(obj)).toEqual({});
    expect((0, _index["default"])(function (x) {
      return x < 11;
    }, {})).toEqual({});
    // TODO: Should we test for __proto__ ?
  });
});