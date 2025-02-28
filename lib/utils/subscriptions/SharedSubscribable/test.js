"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _index = _interopRequireDefault(require("./index"));
describe('SharedSubscribable', function () {
  it('allows a subscription to be passed through', function () {
    var emitValue = null;
    var sourceUnsubscribe = jest.fn();
    var source = jest.fn(function (subscriber) {
      emitValue = subscriber;
      return sourceUnsubscribe;
    });
    var shared = new _index["default"](source);
    expect(source).toHaveBeenCalledTimes(0);
    expect(emitValue).toBe(null);
    expect(sourceUnsubscribe).toHaveBeenCalledTimes(0);
    var subscriber = jest.fn();
    var unsubscribe = shared.subscribe(subscriber);
    expect(source).toHaveBeenCalledTimes(1);
    expect(emitValue).not.toBe(null);
    expect(subscriber).toHaveBeenCalledTimes(0);
    emitValue('foo');
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenLastCalledWith('foo');
    emitValue('bar');
    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber).toHaveBeenLastCalledWith('bar');
    expect(sourceUnsubscribe).toHaveBeenCalledTimes(0);
    unsubscribe();
    expect(source).toHaveBeenCalledTimes(1);
    expect(sourceUnsubscribe).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledTimes(2);
  });
  it('can multicast to multiple subscribers', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var emitValue, sourceUnsubscribe, source, shared, subscriber1, unsubscribe1, subscriber2, unsubscribe2, subscriber3, unsubscribe3;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          emitValue = null;
          sourceUnsubscribe = jest.fn();
          source = jest.fn(function (subscriber) {
            emitValue = subscriber;
            return sourceUnsubscribe;
          });
          shared = new _index["default"](source);
          subscriber1 = jest.fn();
          unsubscribe1 = shared.subscribe(subscriber1);
          subscriber2 = jest.fn();
          unsubscribe2 = shared.subscribe(subscriber2);
          subscriber3 = jest.fn();
          unsubscribe3 = shared.subscribe(subscriber3);
          emitValue('foo');
          expect(subscriber1).toHaveBeenCalledTimes(1);
          expect(subscriber2).toHaveBeenCalledTimes(1);
          expect(subscriber3).toHaveBeenCalledTimes(1);
          expect(subscriber1).toHaveBeenLastCalledWith('foo');
          expect(subscriber2).toHaveBeenLastCalledWith('foo');
          unsubscribe2();
          emitValue('bar');
          expect(subscriber1).toHaveBeenCalledTimes(2);
          expect(subscriber2).toHaveBeenCalledTimes(1);
          expect(subscriber3).toHaveBeenCalledTimes(2);
          expect(subscriber3).toHaveBeenLastCalledWith('bar');
          unsubscribe3();
          emitValue('baz');
          expect(subscriber1).toHaveBeenCalledTimes(3);
          expect(subscriber2).toHaveBeenCalledTimes(1);
          expect(subscriber3).toHaveBeenCalledTimes(2);
          expect(sourceUnsubscribe).toHaveBeenCalledTimes(0);
          unsubscribe1();
          expect(sourceUnsubscribe).toHaveBeenCalledTimes(1);
          expect(source).toHaveBeenCalledTimes(1);
        case 31:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  it('reemits last value to new subscribers, if any', function () {
    var emitValue = null;
    var sourceUnsubscribe = jest.fn();
    var source = jest.fn(function (subscriber) {
      emitValue = subscriber;
      return sourceUnsubscribe;
    });
    var shared = new _index["default"](source);
    var subscriber1 = jest.fn();
    var unsubscribe1 = shared.subscribe(subscriber1);
    emitValue('foo');
    expect(subscriber1).toHaveBeenLastCalledWith('foo');
    var subscriber2 = jest.fn();
    var unsubscribe2 = shared.subscribe(subscriber2);
    expect(subscriber2).toHaveBeenCalledTimes(1);
    expect(subscriber2).toHaveBeenLastCalledWith('foo');
    emitValue('bar');
    var subscriber3 = jest.fn();
    var unsubscribe3 = shared.subscribe(subscriber3);
    expect(subscriber3).toHaveBeenCalledTimes(1);
    expect(subscriber3).toHaveBeenLastCalledWith('bar');
    unsubscribe1();
    unsubscribe2();
    unsubscribe3();
    expect(subscriber1).toHaveBeenCalledTimes(2);
    expect(subscriber2).toHaveBeenCalledTimes(2);
    expect(subscriber3).toHaveBeenCalledTimes(1);
    expect(sourceUnsubscribe).toHaveBeenCalledTimes(1);
  });
  it('source can notify subscriber synchronously with subscription', function () {
    var emitValue = null;
    var sourceUnsubscribe = jest.fn();
    var source = jest.fn(function (subscriber) {
      subscriber(10);
      emitValue = subscriber;
      return sourceUnsubscribe;
    });
    var shared = new _index["default"](source);
    var subscriber1 = jest.fn();
    var unsubscribe1 = shared.subscribe(subscriber1);
    expect(subscriber1).toHaveBeenCalledTimes(1);
    expect(subscriber1).toHaveBeenLastCalledWith(10);
    var subscriber2 = jest.fn();
    var unsubscribe2 = shared.subscribe(subscriber2);
    expect(subscriber2).toHaveBeenCalledTimes(1);
    emitValue(20);
    expect(subscriber2).toHaveBeenCalledTimes(2);
    expect(subscriber2).toHaveBeenCalledTimes(2);
    expect(subscriber2).toHaveBeenLastCalledWith(20);
    unsubscribe1();
    unsubscribe2();
    expect(sourceUnsubscribe).toHaveBeenCalledTimes(1);
  });
  it('can resubscribe to source', function () {
    var emitValue = null;
    var sourceUnsubscribe = jest.fn();
    var source = jest.fn(function (subscriber) {
      emitValue = subscriber;
      return sourceUnsubscribe;
    });
    var shared = new _index["default"](source);
    var subscriber1 = jest.fn();
    var unsubscribe1 = shared.subscribe(subscriber1);
    emitValue(20);
    var subscriber2 = jest.fn();
    var unsubscribe2 = shared.subscribe(subscriber2);
    unsubscribe1();
    unsubscribe2();
    expect(source).toHaveBeenCalledTimes(1);
    expect(sourceUnsubscribe).toHaveBeenCalledTimes(1);
    var subscriber3 = jest.fn();
    var unsubscribe3 = shared.subscribe(subscriber3);
    expect(source).toHaveBeenCalledTimes(2);
    expect(subscriber3).toHaveBeenCalledTimes(0);
    emitValue('heyey');
    expect(subscriber3).toHaveBeenCalledTimes(1);
    expect(subscriber3).toHaveBeenLastCalledWith('heyey');
    unsubscribe3();
    expect(sourceUnsubscribe).toHaveBeenCalledTimes(2);
  });
  it('too many calls to unsubscribe are safe', function () {
    var emitValue = null;
    var sourceUnsubscribe = jest.fn();
    var source = jest.fn(function (subscriber) {
      emitValue = subscriber;
      return sourceUnsubscribe;
    });
    var shared = new _index["default"](source);
    var unsubscribe1 = shared.subscribe(function () {});
    var subscriber2 = jest.fn();
    var unsubscribe2 = shared.subscribe(subscriber2);
    expect(subscriber2).toHaveBeenCalledTimes(0);
    unsubscribe1();
    unsubscribe1();
    expect(sourceUnsubscribe).toHaveBeenCalledTimes(0);
    emitValue('r u der');
    expect(subscriber2).toHaveBeenCalledTimes(1);
    expect(subscriber2).toHaveBeenLastCalledWith('r u der');
    expect(sourceUnsubscribe).toHaveBeenCalledTimes(0);
    unsubscribe2();
    expect(sourceUnsubscribe).toHaveBeenCalledTimes(1);
    unsubscribe2();
    expect(sourceUnsubscribe).toHaveBeenCalledTimes(1);
  });
  it("can subscribe with the same subscriber multiple times", function () {
    var emitValue = null;
    var source = jest.fn(function (subscriber) {
      emitValue = subscriber;
      return function () {};
    });
    var shared = new _index["default"](source);
    var subscriber = jest.fn();
    var unsubscribe1 = shared.subscribe(subscriber);
    emitValue();
    expect(subscriber).toHaveBeenCalledTimes(1);
    var unsubscribe2 = shared.subscribe(subscriber);
    expect(subscriber).toHaveBeenCalledTimes(2);
    emitValue();
    expect(subscriber).toHaveBeenCalledTimes(4);
    unsubscribe2();
    unsubscribe2(); // noop
    emitValue();
    expect(subscriber).toHaveBeenCalledTimes(5);
    unsubscribe1();
  });
  it('proteccs from rogue sources notifying after being unsubscribed from', function () {
    var emitValue = null;
    var sourceUnsubscribe = jest.fn();
    var source = jest.fn(function (subscriber) {
      emitValue = subscriber;
      return sourceUnsubscribe;
    });
    var shared = new _index["default"](source);
    var subscriber1 = jest.fn();
    var unsubscribe1 = shared.subscribe(subscriber1);
    unsubscribe1();
    expect(sourceUnsubscribe).toHaveBeenCalledTimes(1);
    expect(function () {
      return emitValue(10);
    }).toThrow('emitted a value after');
    expect(subscriber1).toHaveBeenCalledTimes(0);
    var subscriber2 = jest.fn();
    var unsubscribe2 = shared.subscribe(subscriber2);
    expect(subscriber2).toHaveBeenCalledTimes(0);
    unsubscribe2();
  });
});