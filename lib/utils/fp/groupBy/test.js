"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('groupBy', function () {
  it("works correctly", function () {
    var xs = [{
      name: 'A',
      score: 1
    }, {
      name: 'B',
      score: 2
    }, {
      name: 'C',
      score: 1
    }, {
      name: 'D',
      score: 2
    }];
    var a = xs[0],
      b = xs[1],
      c = xs[2],
      d = xs[3];
    expect((0, _index["default"])(function (x) {
      return x.score;
    })(xs)).toEqual({
      1: [a, c],
      2: [b, d]
    });
    expect((0, _index["default"])(function (x) {
      return x.name;
    })(xs)).toEqual({
      A: [a],
      B: [b],
      C: [c],
      D: [d]
    });
    expect((0, _index["default"])(function (x) {
      return x.name;
    })([])).toEqual({});
  });
});