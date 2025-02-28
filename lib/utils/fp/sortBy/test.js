"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('sortBy', function () {
  it("works correctly", function () {
    var a = {
      name: 'andrew',
      age: 24
    };
    var b = {
      name: 'bartholomeus',
      age: 69
    };
    var c = {
      name: 'cecil',
      age: 15
    };
    expect((0, _index["default"])(function (x) {
      return x.name;
    }, [a, b, c])).toEqual([a, b, c]);
    expect((0, _index["default"])(function (x) {
      return x.name;
    }, [c, a, b])).toEqual([a, b, c]);
    expect((0, _index["default"])(function (x) {
      return x.age;
    }, [a, b, c])).toEqual([c, a, b]);
    expect((0, _index["default"])(function (x) {
      return x.age;
    }, [b, a, c])).toEqual([c, a, b]);
    expect((0, _index["default"])(function (x) {
      return -x.age;
    }, [a, b, c])).toEqual([b, a, c]);
  });
  it("does not mutate", function () {
    var arr = [123, 4, 23];
    (0, _index["default"])(function (x) {
      return x;
    }, arr);
    expect(arr).toEqual([123, 4, 23]);
  });
});