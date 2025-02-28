"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _helpers = require("./helpers");
describe('addToRawSet', function () {
  it('transforms raw set', function () {
    expect((0, _helpers.addToRawSet)('', 'foo')).toBe('foo');
    expect((0, _helpers.addToRawSet)('foo', 'bar')).toBe('foo,bar');
    expect((0, _helpers.addToRawSet)('foo,bar', 'baz')).toBe('foo,bar,baz');
    expect((0, _helpers.addToRawSet)('foo,bar', 'foo')).toBe('foo,bar');
    expect((0, _helpers.addToRawSet)('foo,bar', 'bar')).toBe('foo,bar');
  });
});
describe('setRawColumnChange', function () {
  it('adds to _changed if needed', function () {
    var test = function test(input, column, output) {
      var raw = (0, _extends2["default"])({}, input);
      (0, _helpers.setRawColumnChange)(raw, column);
      expect(raw).toEqual(output);
    };
    test({
      _status: 'synced',
      _changed: ''
    }, 'foo', {
      _status: 'updated',
      _changed: 'foo'
    });
    test({
      _status: 'created',
      _changed: ''
    }, 'foo', {
      _status: 'created',
      _changed: 'foo'
    });
    test({
      _status: 'updated',
      _changed: ''
    }, 'foo', {
      _status: 'updated',
      _changed: 'foo'
    });
    test({
      _status: 'updated',
      _changed: 'foo,bar'
    }, 'bar', {
      _status: 'updated',
      _changed: 'foo,bar'
    });
  });
});