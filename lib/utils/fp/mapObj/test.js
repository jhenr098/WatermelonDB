"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('mapObj', function () {
  it("works correctly", function () {
    var obj = {
      a: 5,
      b: 10,
      c: 20
    };
    expect((0, _index["default"])(function (x) {
      return x + 1;
    }, obj)).toEqual({
      a: 6,
      b: 11,
      c: 21
    });
    expect((0, _index["default"])(function (x) {
      return x + 1;
    })(obj)).toEqual({
      a: 6,
      b: 11,
      c: 21
    });
    expect((0, _index["default"])(function (x) {
      return x + 1;
    }, {})).toEqual({});
    // TODO: Should we test for __proto__ ?
  });
});