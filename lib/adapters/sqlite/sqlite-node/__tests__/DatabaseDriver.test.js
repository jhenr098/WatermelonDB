"use strict";

var _DatabaseDriver = require("../DatabaseDriver");
describe('NodeJS DatabaseDriver', function () {
  test.each([['foo'], ['file:foo'], ['/path/foo'], ['foo.sqlite'],
  // ?mode=memory
  ['foo?mode=memory'], ['file:foo?mode=memory'], ['/path/foo?mode=memory'], ['foo.sqlite?mode=memory'],
  // ?bar=baz
  ['foo?bar=baz'], ['file:foo?bar=baz'], ['/path/foo?bar=baz'], ['foo.sqlite?bar=baz']])('getPath will add extension for %s', function (dbName) {
    var path = (0, _DatabaseDriver.getPath)(dbName);
    expect(path).toContain('.db');
    expect(path.split('.db')).toHaveLength(2);
  });
  test.each([[':memory:'], ['file::memory:']])('getPath will not add extension for %s', function (dbName) {
    expect((0, _DatabaseDriver.getPath)(dbName)).not.toContain('.db');
  });
});