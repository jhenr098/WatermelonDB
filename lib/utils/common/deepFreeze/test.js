"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('deepFreeze', function () {
  it('can deep freeze an object', function () {
    var obj = {
      foo: {
        bar: [],
        baz: {
          blah: 1
        }
      }
    };
    var second = (0, _index["default"])(obj);
    expect(second).toBe(obj);
    expect(obj.foo.baz.blah).toBe(1);
    expect(function () {
      obj.foo = {};
    }).toThrow();
    expect(function () {
      obj.foo.bar.push(1);
    }).toThrow();
    expect(function () {
      obj.foo.baz.blah = 2;
    }).toThrow();
    expect(obj.foo.baz.blah).toBe(1);
    expect(obj.foo.bar.length).toBe(0);
  });
});