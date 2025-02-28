"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _Schema = require("../../../Schema");
var _migrations = require("../../../Schema/migrations");
var _index = require("./index");
/* eslint-disable prefer-template */

var expectedCommonSchema = 'create table "local_storage" ("key" varchar(16) primary key not null, "value" text not null);' + 'create index "local_storage_key_index" on "local_storage" ("key");';
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
      isOptional: true,
      isIndexed: true
    }, {
      name: 'created_at',
      type: 'number'
    }]
  }), (0, _Schema.tableSchema)({
    name: 'comments',
    columns: [{
      name: 'is_ended',
      type: 'boolean'
    }, {
      name: 'reactions',
      type: 'number'
    }]
  })]
});
describe('encodeSchema', function () {
  it('encodes schema', function () {
    expect((0, _index.encodeSchema)(testSchema)).toBe(expectedCommonSchema + 'create table "tasks" ("id" primary key, "_changed", "_status", "author_id", "order", "created_at");' + 'create index if not exists "tasks_author_id" on "tasks" ("author_id");' + 'create index if not exists "tasks_order" on "tasks" ("order");' + 'create index if not exists "tasks__status" on "tasks" ("_status");' + 'create table "comments" ("id" primary key, "_changed", "_status", "is_ended", "reactions");' + 'create index if not exists "comments__status" on "comments" ("_status");');
  });
  it("encodes schema with unsafe SQL", function () {
    var testSchema2 = (0, _Schema.appSchema)({
      version: 1,
      tables: [(0, _Schema.tableSchema)({
        name: 'tasks',
        columns: [{
          name: 'author_id',
          type: 'string',
          isIndexed: true
        }],
        unsafeSql: function unsafeSql(sql) {
          return sql.replace(/create table "tasks" [^)]+\)/, '$& without rowid');
        }
      })],
      unsafeSql: function unsafeSql(sql, kind) {
        if (kind !== 'setup') {
          throw new Error('expected different unsafeSql kind');
        }
        return "create blabla;".concat(sql);
      }
    });
    expect((0, _index.encodeSchema)(testSchema2)).toBe('' + 'create blabla;' + expectedCommonSchema + 'create table "tasks" ("id" primary key, "_changed", "_status", "author_id") without rowid;' + 'create index if not exists "tasks_author_id" on "tasks" ("author_id");' + 'create index if not exists "tasks__status" on "tasks" ("_status");');
  });
});
describe('encodeIndices', function () {
  it("encodes creation of indices", function () {
    expect((0, _index.encodeCreateIndices)(testSchema)).toBe('' + 'create index if not exists "tasks_author_id" on "tasks" ("author_id");' + 'create index if not exists "tasks_order" on "tasks" ("order");' + 'create index if not exists "tasks__status" on "tasks" ("_status");' + 'create index if not exists "comments__status" on "comments" ("_status");');
  });
  it("encodes removal of indices", function () {
    expect((0, _index.encodeDropIndices)(testSchema)).toBe('' + 'drop index if exists "tasks_author_id";' + 'drop index if exists "tasks_order";' + 'drop index if exists "tasks__status";' + 'drop index if exists "comments__status";');
  });
  it("encodes creation of indices with unsafe sql", function () {
    var testSchema2 = (0, _extends2["default"])({}, testSchema, {
      unsafeSql: function unsafeSql(sql, kind) {
        if (kind !== 'create_indices') {
          throw new Error('expected different unsafeSql kind');
        }
        return sql + 'boop';
      }
    });
    expect((0, _index.encodeCreateIndices)(testSchema2)).toBe('' + 'create index if not exists "tasks_author_id" on "tasks" ("author_id");' + 'create index if not exists "tasks_order" on "tasks" ("order");' + 'create index if not exists "tasks__status" on "tasks" ("_status");' + 'create index if not exists "comments__status" on "comments" ("_status");' + 'boop');
  });
  it("encodes removal of indices with unsafe sql", function () {
    var testSchema2 = (0, _extends2["default"])({}, testSchema, {
      unsafeSql: function unsafeSql(sql, kind) {
        if (kind !== 'drop_indices') {
          throw new Error('expected different unsafeSql kind');
        }
        return sql.replace(/drop/g, 'yeet');
      }
    });
    expect((0, _index.encodeDropIndices)(testSchema2)).toBe('' + 'yeet index if exists "tasks_author_id";' + 'yeet index if exists "tasks_order";' + 'yeet index if exists "tasks__status";' + 'yeet index if exists "comments__status";');
  });
});
describe('encodeMigrationSteps', function () {
  it('encodes migrations', function () {
    var migrationSteps = [(0, _migrations.addColumns)({
      table: 'posts',
      columns: [{
        name: 'subtitle',
        type: 'string',
        isOptional: true
      }]
    }), (0, _migrations.createTable)({
      name: 'comments',
      columns: [{
        name: 'post_id',
        type: 'string',
        isIndexed: true
      }, {
        name: 'body',
        type: 'string'
      }]
    }), (0, _migrations.addColumns)({
      table: 'posts',
      columns: [{
        name: 'author_id',
        type: 'string',
        isIndexed: true
      }, {
        name: 'is_pinned',
        type: 'boolean',
        isIndexed: true
      }]
    })];
    expect((0, _index.encodeMigrationSteps)(migrationSteps)).toBe('' + "alter table \"posts\" add \"subtitle\";" + "update \"posts\" set \"subtitle\" = null;" + "create table \"comments\" (\"id\" primary key, \"_changed\", \"_status\", \"post_id\", \"body\");" + "create index if not exists \"comments_post_id\" on \"comments\" (\"post_id\");" + "create index if not exists \"comments__status\" on \"comments\" (\"_status\");" + "alter table \"posts\" add \"author_id\";" + "update \"posts\" set \"author_id\" = '';" + "create index if not exists \"posts_author_id\" on \"posts\" (\"author_id\");" + "alter table \"posts\" add \"is_pinned\";" + "update \"posts\" set \"is_pinned\" = 0;" + "create index if not exists \"posts_is_pinned\" on \"posts\" (\"is_pinned\");");
  });
  it("encodes migrations with unsafe SQL", function () {
    var migrationSteps = [(0, _migrations.addColumns)({
      table: 'posts',
      columns: [{
        name: 'subtitle',
        type: 'string',
        isOptional: true
      }],
      unsafeSql: function unsafeSql(sql) {
        return "".concat(sql, "bla;");
      }
    }), (0, _migrations.createTable)({
      name: 'comments',
      columns: [{
        name: 'body',
        type: 'string'
      }],
      unsafeSql: function unsafeSql(sql) {
        return sql.replace(/create table [^)]+\)/, '$& without rowid');
      }
    }), (0, _migrations.unsafeExecuteSql)('boop;')];
    expect((0, _index.encodeMigrationSteps)(migrationSteps)).toBe('' + "alter table \"posts\" add \"subtitle\";" + "update \"posts\" set \"subtitle\" = null;" + 'bla;' + "create table \"comments\" (\"id\" primary key, \"_changed\", \"_status\", \"body\") without rowid;" + "create index if not exists \"comments__status\" on \"comments\" (\"_status\");" + 'boop;');
  });
});