"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _Query = _interopRequireDefault(require("../../Query"));
var Q = _interopRequireWildcard(require("../../QueryDescription"));
var _index = _interopRequireDefault(require("./index"));
var _canEncode = _interopRequireDefault(require("./canEncode"));
var _databaseTests = require("../../__tests__/databaseTests");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var mockModelClass = {
  table: 'tasks'
};
var mockCollection = {
  modelClass: mockModelClass
};
var makeDescription = function makeDescription(conditions) {
  return new _Query["default"](mockCollection, conditions).description;
};
var makeMatcher = function makeMatcher(conditions) {
  return (0, _index["default"])(makeDescription(conditions));
};
var expectTrue = function expectTrue(matcher, raw) {
  return expect(matcher(raw)).toBe(true);
};
var expectFalse = function expectFalse(matcher, raw) {
  return expect(matcher(raw)).toBe(false);
};
var unencodableQueries = [[Q.on('projects', 'team_id', 'abcdef')], [Q.experimentalJoinTables(['foo'])], [Q.experimentalNestedJoin('foo', 'bar')], [Q.sortBy('left_column', 'asc')], [Q.take(100)], [Q.take(100)], [Q.unsafeLokiTransform(function () {})], [Q.unsafeSqlQuery('select * from tasks')]];
describe('SQLite encodeMatcher', function () {
  _databaseTests.matchTests.forEach(function (testCase) {
    it("passes db test: ".concat(testCase.name), function () {
      if (testCase.skipMatcher) {
        return;
      }
      var matcher = makeMatcher(testCase.query);
      testCase.matching.forEach(function (matchingRaw) {
        expectTrue(matcher, matchingRaw);
      });
      testCase.nonMatching.forEach(function (nonMatchingRaw) {
        expectFalse(matcher, nonMatchingRaw);
      });
    });
  });
  it('passes big-list-of-naughty-string matches', function () {
    _databaseTests.naughtyMatchTests.forEach(function (testCase) {
      // console.log(testCase.name)
      var matcher = makeMatcher(testCase.query);
      testCase.matching.forEach(function (matchingRaw) {
        expectTrue(matcher, matchingRaw);
      });
      testCase.nonMatching.forEach(function (nonMatchingRaw) {
        expectFalse(matcher, nonMatchingRaw);
      });
    });
  });
  it('throws on queries it cannot encode', function () {
    unencodableQueries.forEach(function (query) {
      // console.log(query)
      expect(function () {
        return makeMatcher(query);
      }).toThrow("can't be encoded into a matcher");
    });
    expect(function () {
      return makeMatcher([Q.or(Q.on('projects', 'team_id', 'abcdef'))]);
    }).toThrow('Illegal Q.on');
    expect(function () {
      return makeMatcher([Q.or(Q.unsafeSqlExpr(''))]);
    }).toThrow('Illegal');
    expect(function () {
      return makeMatcher([Q.or(Q.unsafeLokiExpr({}))]);
    }).toThrow('Illegal');
  });
});
describe('canEncodeMatcher', function () {
  it("can tell you if a query is encodable", function () {
    expect((0, _canEncode["default"])(makeDescription([Q.where('foo', 'bar')]))).toBe(true);
    unencodableQueries.forEach(function (query) {
      expect((0, _canEncode["default"])(makeDescription(query))).toBe(false);
    });
  });
});