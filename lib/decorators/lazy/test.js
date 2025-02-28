"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));
var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));
var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));
var _index = _interopRequireDefault(require("./index"));
describe('decorators/lazy', function () {
  it('calculates value on first evaluation only', function () {
    var _class, _descriptor;
    var fooMakesCounter = 0;
    var makeFoo = function makeFoo() {
      fooMakesCounter += 1;
      return {
        id: fooMakesCounter
      };
    };
    var X = (_class = function X() {
      (0, _initializerDefineProperty2["default"])(this, "foo", _descriptor, this);
    }, _descriptor = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "foo", [_index["default"]], {
      configurable: true,
      enumerable: true,
      writable: true,
      initializer: function initializer() {
        return makeFoo();
      }
    }), _class);
    var x = new X();

    // No evaluation on construction
    expect(fooMakesCounter).toBe(0);

    // Check first evaluation
    var foo = x.foo;
    expect(foo).toEqual({
      id: 1
    });
    expect(fooMakesCounter).toBe(1);

    // No subsequent evaluations
    expect(x.foo).toBe(foo);
    expect(x.foo).toEqual({
      id: 1
    });
    expect(fooMakesCounter).toBe(1);

    // Try another object
    var x2 = new X();
    expect(fooMakesCounter).toBe(1);
    expect(x2.foo).toEqual({
      id: 2
    });
    expect(x2.foo).toEqual({
      id: 2
    });
    expect(fooMakesCounter).toBe(2);
  });
});