"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('areRecordsEqual', function () {
  it("works correctly", function () {
    expect((0, _index["default"])({}, {})).toBe(true);
    expect((0, _index["default"])({
      a: 3.14,
      b: 'b',
      c: true
    }, {
      a: 3.14,
      b: 'b',
      c: true
    })).toBe(true);
    expect((0, _index["default"])({
      a: 3.14,
      b: 'b'
    }, {
      a: 3.14,
      b: 'c'
    })).toBe(false);
    expect((0, _index["default"])({
      a: 3.14,
      b: 'b'
    }, {
      a: 3.14
    })).toBe(false);
    expect((0, _index["default"])({
      a: 3.14,
      b: false
    }, {
      a: 3.14
    })).toBe(false);
    expect((0, _index["default"])({
      a: 3.14,
      b: null
    }, {
      a: 3.14
    })).toBe(false);
    expect((0, _index["default"])({
      a: 3.14,
      b: undefined
    }, {
      a: 3.14
    })).toBe(false);
    expect((0, _index["default"])({
      a: 3.14,
      b: undefined
    }, {
      a: 3.14,
      b: null
    })).toBe(false);
    expect((0, _index["default"])({
      a: 3.14,
      b: 0
    }, {
      a: 3.14,
      b: '0'
    })).toBe(false);
    expect((0, _index["default"])({
      a: 3.14,
      b: 0
    }, {
      a: 3.14,
      b: false
    })).toBe(false);
  });
});