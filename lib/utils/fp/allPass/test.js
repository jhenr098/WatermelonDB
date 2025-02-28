"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('allPass', function () {
  it("works correctly", function () {
    var isFoo = function isFoo(x) {
      return x.foo;
    };
    var isBar = function isBar(x) {
      return x.bar;
    };
    expect((0, _index["default"])([isFoo])({
      foo: true
    })).toBe(true);
    expect((0, _index["default"])([isFoo])({
      foo: true,
      bar: true
    })).toBe(true);
    expect((0, _index["default"])([isFoo])({
      bar: true
    })).toBe(false);
    expect((0, _index["default"])([isBar])({
      bar: true
    })).toBe(true);
    expect((0, _index["default"])([isBar])({
      bar: true,
      foo: true
    })).toBe(true);
    expect((0, _index["default"])([isBar])({
      foo: true
    })).toBe(false);
    expect((0, _index["default"])([isFoo, isBar])({})).toBe(false);
    expect((0, _index["default"])([isFoo, isBar])({
      foo: true
    })).toBe(false);
    expect((0, _index["default"])([isFoo, isBar])({
      bar: true
    })).toBe(false);
    expect((0, _index["default"])([isFoo, isBar])({
      foo: true,
      bar: true
    })).toBe(true);
    expect((0, _index["default"])([])({})).toBe(true);
  });
});