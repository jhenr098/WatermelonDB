"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
var Q = _interopRequireWildcard(require("../index"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
describe('queryWithoutDeleted', function () {
  var whereNotDeleted = Q.where('_status', Q.notEq('deleted'));
  it('builds empty query without deleted', function () {
    var query = Q.queryWithoutDeleted(Q.buildQueryDescription([]));
    expect(query).toEqual(Q.buildQueryDescription([whereNotDeleted]));
  });
  it('builds simple query without deleted', function () {
    var query = Q.queryWithoutDeleted(Q.buildQueryDescription([Q.where('left_column', 'right_value')]));
    expect(query).toEqual(Q.buildQueryDescription([Q.where('left_column', 'right_value'), whereNotDeleted]));
  });
  it('supports simple 2 JOIN queries on one table and JOIN query on another without deleted', function () {
    var query = Q.queryWithoutDeleted(Q.buildQueryDescription([Q.on('projects', 'col1', 'value'), Q.on('projects', 'col2', 'value'), Q.where('left_column', 'right_value'), Q.on('tag_assignments', 'col3', Q.gt(Q.column('col4')))]));
    expect(query).toEqual(Q.buildQueryDescription([Q.on('projects', [Q.where('col1', 'value'), whereNotDeleted]), Q.on('projects', [Q.where('col2', 'value'), whereNotDeleted]), Q.where('left_column', 'right_value'), Q.on('tag_assignments', [Q.where('col3', Q.gt(Q.column('col4'))), whereNotDeleted]), whereNotDeleted]));
  });
  it("supports nested Q.ons", function () {
    var query = Q.queryWithoutDeleted(Q.buildQueryDescription([Q.experimentalJoinTables(['projects', 'tag_assignments']), Q.or(Q.where('is_followed', true), Q.on('projects', [Q.where('is_followed', true), Q.where('foo', 'bar')]), Q.and(Q.on('tag_assignments', 'foo', 'bar')))]));
    expect(query).toEqual(Q.buildQueryDescription([Q.experimentalJoinTables(['projects', 'tag_assignments']), Q.or(Q.where('is_followed', true), Q.on('projects', [Q.where('is_followed', true), Q.where('foo', 'bar'), whereNotDeleted]), Q.and(Q.on('tag_assignments', [Q.where('foo', 'bar'), whereNotDeleted]))), whereNotDeleted]));
  });
  it("supports Q.ons on Q.on", function () {
    var query = Q.queryWithoutDeleted(Q.buildQueryDescription([
    // TODO: Test deeper nestings
    Q.experimentalJoinTables(['projects']), Q.experimentalNestedJoin('projects', 'teams'), Q.on('projects', Q.on('teams', 'foo', 'bar')), Q.or(Q.on('projects', Q.on('teams', Q.on('organizations', 'foo', 'bar'))))]));
    expect(query).toEqual(Q.buildQueryDescription([Q.experimentalJoinTables(['projects']), Q.experimentalNestedJoin('projects', 'teams'), Q.on('projects', [Q.on('teams', [Q.where('foo', 'bar'), whereNotDeleted]), whereNotDeleted]), Q.or(Q.on('projects', [Q.on('teams', [Q.on('organizations', [Q.where('foo', 'bar'), whereNotDeleted]), whereNotDeleted]), whereNotDeleted])), whereNotDeleted]));
  });
});