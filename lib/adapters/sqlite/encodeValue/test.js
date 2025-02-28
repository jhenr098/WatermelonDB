"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _common = require("../../../utils/common");
var _index = _interopRequireDefault(require("./index"));
describe('SQLite encodeValue', function () {
  it('encodes SQLite values', function () {
    expect((0, _index["default"])(true)).toBe('1');
    expect((0, _index["default"])(false)).toBe('0');
    expect((0, _index["default"])(null)).toBe('null');
    expect((0, _index["default"])(10)).toBe('10');
    expect((0, _index["default"])(3.14)).toBe('3.14');
    expect((0, _index["default"])("foo 'bar \"baz\" blah' hah")).toBe("'foo ''bar \"baz\" blah'' hah'");
  });
  it('catches invalid values', function () {
    var spy = jest.spyOn(_common.logger, 'error').mockImplementation(function () {});
    expect((0, _index["default"])(undefined)).toBe('null');
    expect((0, _index["default"])(NaN)).toBe('null');
    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
    expect(function () {
      return (0, _index["default"])([]);
    }).toThrow();
    expect(function () {
      return (0, _index["default"])({});
    }).toThrow();
  });
});