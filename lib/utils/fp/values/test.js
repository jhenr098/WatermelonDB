"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('values', function () {
  it("works correctly", function () {
    expect((0, _index["default"])({
      foo: '1',
      bar: 2,
      baz: null
    })).toEqual(['1', 2, null]);
    expect((0, _index["default"])({})).toEqual([]);
  });
});