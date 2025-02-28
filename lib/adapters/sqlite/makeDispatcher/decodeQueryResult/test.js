"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('decodeQueryResult', function () {
  it("decodes query result", function () {
    expect((0, _index["default"])([])).toEqual([]);
    expect((0, _index["default"])([['a', 'b', 'c']])).toEqual([]);
    expect((0, _index["default"])([['a', 'b', 'c'], [1, 2, 3]])).toEqual([{
      a: 1,
      b: 2,
      c: 3
    }]);
    expect((0, _index["default"])([['a', 'b', 'c'], 'foo'])).toEqual(['foo']);
    expect((0, _index["default"])([['a', 'b', 'c'], 'foo', [1, 2, 3], 'bar', [10, 20, 30]])).toEqual(['foo', {
      a: 1,
      b: 2,
      c: 3
    }, 'bar', {
      a: 10,
      b: 20,
      c: 30
    }]);
  });
});