"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
var _Schema = require("../../../Schema");
var _RawRecord = require("../../../RawRecord");
var _index = _interopRequireWildcard(require("./index"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var testSchema = (0, _Schema.appSchema)({
  version: 1,
  tables: [(0, _Schema.tableSchema)({
    name: 'tasks',
    columns: [{
      name: 'author_id',
      type: 'string',
      isIndexed: true
    }, {
      name: 'order',
      type: 'number',
      isOptional: true
    }, {
      name: 'created_at',
      type: 'number'
    }, {
      name: 'is_followed',
      type: 'boolean'
    }]
  })]
});
var tasks = testSchema.tables.tasks;
var sanitize = function sanitize(raw) {
  return (0, _RawRecord.sanitizedRaw)(raw, tasks);
};
describe('encodeInsertSql', function () {
  it("encodes insert for a table", function () {
    expect((0, _index.encodeInsertSql)(tasks)).toBe("insert into \"tasks\" (\"id\", \"_status\", \"_changed\", \"author_id\", \"order\", \"created_at\", \"is_followed\") values (?, ?, ?, ?, ?, ?, ?)");
  });
});
describe('encodeUpdateSql', function () {
  it("encodes update for a table", function () {
    expect((0, _index.encodeUpdateSql)(tasks)).toBe("update \"tasks\" set \"_status\" = ?, \"_changed\" = ?, \"author_id\" = ?, \"order\" = ?, \"created_at\" = ?, \"is_followed\" = ? where \"id\" is ?");
  });
});
describe('encodeInsertArgs', function () {
  it("encodes sql args for the insert query", function () {
    expect((0, _index.encodeInsertArgs)(tasks, sanitize({
      id: 'abcdef'
    }))).toEqual(['abcdef', 'created', '', '', null, 0, false]);
    expect((0, _index.encodeInsertArgs)(tasks, sanitize({
      id: 'abcdef',
      _status: 'updated',
      _changed: 'order',
      author_id: 'a1',
      order: 3.14,
      created_at: 1234567890,
      is_followed: true
    }))).toEqual(['abcdef', 'updated', 'order', 'a1', 3.14, 1234567890, true]);
  });
});
describe('encodeUpdateArgs', function () {
  it("encodes sql args for the update query", function () {
    expect((0, _index.encodeUpdateArgs)(tasks, sanitize({
      id: 'abcdef'
    }))).toEqual(['created', '', '', null, 0, false, 'abcdef']);
    expect((0, _index.encodeUpdateArgs)(tasks, sanitize({
      id: 'abcdef',
      _status: 'updated',
      _changed: 'order',
      author_id: 'a1',
      order: 3.14,
      created_at: 1234567890,
      is_followed: true
    }))).toEqual(['updated', 'order', 'a1', 3.14, 1234567890, true, 'abcdef']);
  });
});
describe('groupOperations', function () {
  it("can group operations by type and table", function () {
    expect((0, _index.groupOperations)([])).toEqual([]);
    expect((0, _index.groupOperations)([['create', 't1', 1], ['create', 't1', 2], ['create', 't1', 3]])).toEqual([['create', 't1', [1, 2, 3]]]);
    expect((0, _index.groupOperations)([['create', 't1', 10], ['create', 't1', 11], ['create', 't2', 21], ['create', 't1', 12], ['update', 't1', 31], ['update', 't1', 32]])).toEqual([['create', 't1', [10, 11]], ['create', 't2', [21]], ['create', 't1', [12]], ['update', 't1', [31, 32]]]);
  });
});
describe('encodeBatch', function () {
  it("can encode a native batch", function () {
    expect((0, _index["default"])([], testSchema)).toEqual([]);
    expect((0, _index["default"])([['create', 'tasks', sanitize({
      id: 't1'
    })], ['create', 'tasks', sanitize({
      id: 't2'
    })], ['update', 'tasks', sanitize({
      id: 't3'
    })], ['markAsDeleted', 'tasks', 'foo'], ['destroyPermanently', 'tasks', 'bar'], ['destroyPermanently', 'tasks', 'baz']], testSchema)).toEqual([[1, 'tasks', (0, _index.encodeInsertSql)(tasks), [(0, _index.encodeInsertArgs)(tasks, sanitize({
      id: 't1'
    })), (0, _index.encodeInsertArgs)(tasks, sanitize({
      id: 't2'
    }))]], [0, null, (0, _index.encodeUpdateSql)(tasks), [(0, _index.encodeUpdateArgs)(tasks, sanitize({
      id: 't3'
    }))]], [-1, 'tasks', "update \"tasks\" set \"_status\" = 'deleted' where \"id\" == ?", [['foo']]], [-1, 'tasks', "delete from \"tasks\" where \"id\" == ?", [['bar'], ['baz']]]]);
  });
  it("can recreate indices for large batches", function () {
    expect((0, _index["default"])(Array(1000).fill(['markAsDeleted', 'tasks', 'foo']), testSchema)).toEqual([[0, null, 'drop index if exists "tasks_author_id"', [[]]], [0, null, 'drop index if exists "tasks__status"', [[]]], [-1, 'tasks', "update \"tasks\" set \"_status\" = 'deleted' where \"id\" == ?", Array(1000).fill(['foo'])], [0, null, 'create index if not exists "tasks_author_id" on "tasks" ("author_id")', [[]]], [0, null, 'create index if not exists "tasks__status" on "tasks" ("_status")', [[]]]]);
  });
});