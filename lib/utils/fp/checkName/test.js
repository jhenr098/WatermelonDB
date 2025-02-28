"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('checkName', function () {
  it('returns safe names as-is', function () {
    expect((0, _index["default"])('tasks')).toBe('tasks');
    expect((0, _index["default"])('tag_assignments')).toBe('tag_assignments');
    expect((0, _index["default"])('a')).toBe('a');
  });
  it("keeps returning a safe name as is", function () {
    expect((0, _index["default"])('tasks')).toBe('tasks');
    expect((0, _index["default"])('tasks')).toBe('tasks');
  });
  it('does not allow unsafe names', function () {
    var unsafeNames = ['"hey"', "'hey'", '`hey`', 'hey)', 'hey --', "foo' and delete * from users --", '$loki', '__foo', '__proto__', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', 'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'constructor', 'prototype', 'rowid', 'oid', '_rowid_', 'ROWID', '_ROWID_', '0foo', 'fó', 'cześć', 'русском', 'foo_русском', '❤️', 'hey\nhey', 'whatsup\n', '\nwhatsup', 'sqlite_master', 'sqlite_stat', 'sqlite_stat1', 'sqlite_stat3', 0, undefined, null, [], {}, NaN];
    unsafeNames.forEach(function (name) {
      // console.log(name)
      expect(function () {
        return (0, _index["default"])(name);
      }).toThrow('Unsafe name');
    });
  });
});