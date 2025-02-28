"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
var _index2 = require("../index");
var createCommentsTable = (0, _index2.createTable)({
  name: 'comments',
  columns: [{
    name: 'post_id',
    type: 'string',
    isIndexed: true
  }, {
    name: 'body',
    type: 'string'
  }]
});
var test = function test(migrations, from, to) {
  return (0, _index["default"])((0, _index2.schemaMigrations)({
    migrations: migrations
  }), from, to);
};
var testSteps = function testSteps(steps) {
  return (0, _index["default"])((0, _index2.schemaMigrations)({
    migrations: [{
      toVersion: 2,
      steps: steps
    }]
  }), 1, 2);
};
describe('getSyncChanges', function () {
  it('returns null for from==to', function () {
    expect(test([{
      toVersion: 2,
      steps: [createCommentsTable]
    }], 2, 2)).toEqual(null);
  });
  it('returns empty changes for empty steps', function () {
    expect(testSteps([])).toEqual({
      from: 1,
      tables: [],
      columns: []
    });
  });
  it('returns created tables', function () {
    expect(testSteps([createCommentsTable])).toEqual({
      from: 1,
      tables: ['comments'],
      columns: []
    });
  });
  it('returns added columns', function () {
    expect(testSteps([(0, _index2.addColumns)({
      table: 'posts',
      columns: [{
        name: 'subtitle',
        type: 'string',
        isOptional: true
      }, {
        name: 'is_pinned',
        type: 'boolean'
      }]
    })])).toEqual({
      from: 1,
      tables: [],
      columns: [{
        table: 'posts',
        columns: ['subtitle', 'is_pinned']
      }]
    });
  });
  it('combines added columns from multiple migration steps', function () {
    expect(testSteps([(0, _index2.addColumns)({
      table: 'posts',
      columns: [{
        name: 'subtitle',
        type: 'string',
        isOptional: true
      }]
    }), (0, _index2.addColumns)({
      table: 'posts',
      columns: [{
        name: 'is_pinned',
        type: 'boolean'
      }]
    }), (0, _index2.addColumns)({
      table: 'posts',
      columns: [{
        name: 'author_id',
        type: 'string',
        isIndexed: true
      }]
    })])).toEqual({
      from: 1,
      tables: [],
      columns: [{
        table: 'posts',
        columns: ['subtitle', 'is_pinned', 'author_id']
      }]
    });
  });
  it('skips added columns for a table if it is also added', function () {
    expect(testSteps([createCommentsTable, (0, _index2.addColumns)({
      table: 'comments',
      columns: [{
        name: 'reactions',
        type: 'string',
        isOptional: true
      }]
    })])).toEqual({
      from: 1,
      tables: ['comments'],
      columns: []
    });
  });
  it('skips duplicates', function () {
    // technically, a duplicate createTable or addColumn would crash
    // but this is in case future migration types could do something like it
    expect(testSteps([createCommentsTable, createCommentsTable, (0, _index2.addColumns)({
      table: 'posts',
      columns: [{
        name: 'subtitle',
        type: 'string',
        isOptional: true
      }]
    }), (0, _index2.addColumns)({
      table: 'posts',
      columns: [{
        name: 'subtitle',
        type: 'string',
        isOptional: true
      }]
    })])).toEqual({
      from: 1,
      tables: ['comments'],
      columns: [{
        table: 'posts',
        columns: ['subtitle']
      }]
    });
  });
  var bigMigrations = [{
    toVersion: 10,
    steps: [
      // No changes
    ]
  }, {
    toVersion: 9,
    steps: [(0, _index2.addColumns)({
      table: 'attachment_versions',
      columns: [{
        name: 'reactions',
        type: 'string'
      }]
    })]
  }, {
    toVersion: 8,
    steps: [(0, _index2.addColumns)({
      table: 'workspaces',
      columns: [{
        name: 'plan_info',
        type: 'string',
        isOptional: true
      }, {
        name: 'limits',
        type: 'string'
      }]
    })]
  }, {
    toVersion: 7,
    steps: [(0, _index2.createTable)({
      name: 'attachments',
      columns: [{
        name: 'parent_id',
        type: 'string',
        isIndexed: true
      }]
    })]
  }, {
    toVersion: 6,
    steps: [(0, _index2.createTable)({
      name: 'attachment_versions',
      columns: [{
        name: 'name',
        type: 'string'
      }, {
        name: 'size',
        type: 'number'
      }, {
        name: 'status',
        type: 'string',
        isIndexed: true
      }, {
        name: 'mime_type',
        type: 'string'
      }, {
        name: 'attachment_id',
        type: 'string',
        isIndexed: true
      }, {
        name: 'author_id',
        type: 'string'
      }, {
        name: 'created_at',
        type: 'number'
      }],
      unsafeSql: function unsafeSql(sql) {
        return sql;
      }
    }), (0, _index2.unsafeExecuteSql)(';')]
  }, {
    toVersion: 5,
    steps: [(0, _index2.addColumns)({
      table: 'comments',
      columns: [{
        name: 'is_pinned',
        type: 'boolean'
      }, {
        name: 'extra',
        type: 'string'
      }]
    }), (0, _index2.addColumns)({
      table: 'projects',
      columns: [{
        name: 'extra',
        type: 'string'
      }]
    })]
  }, {
    toVersion: 4,
    steps: []
  }, {
    toVersion: 3,
    steps: [(0, _index2.addColumns)({
      table: 'task_recurrences',
      columns: [{
        name: 'project_id',
        type: 'string'
      }]
    })]
  }, {
    toVersion: 2,
    steps: [(0, _index2.addColumns)({
      table: 'projects',
      columns: [{
        name: 'preferences',
        type: 'string',
        isOptional: true
      }]
    })]
  }];
  it('can handle a complex migration steps list', function () {
    expect(test(bigMigrations, 1, 10)).toEqual({
      from: 1,
      tables: ['attachment_versions', 'attachments'],
      columns: [{
        table: 'projects',
        columns: ['preferences', 'extra']
      }, {
        table: 'task_recurrences',
        columns: ['project_id']
      }, {
        table: 'comments',
        columns: ['is_pinned', 'extra']
      }, {
        table: 'workspaces',
        columns: ['plan_info', 'limits']
      }]
    });
  });
  it("returns only the necessary range of migrations", function () {
    expect(test(bigMigrations, 6, 10)).toEqual({
      from: 6,
      tables: ['attachments'],
      columns: [{
        table: 'workspaces',
        columns: ['plan_info', 'limits']
      }, {
        table: 'attachment_versions',
        columns: ['reactions']
      }]
    });
    expect(test(bigMigrations, 8, 10)).toEqual({
      from: 8,
      tables: [],
      columns: [{
        table: 'attachment_versions',
        columns: ['reactions']
      }]
    });
    expect(test(bigMigrations, 9, 10)).toEqual({
      from: 9,
      tables: [],
      columns: []
    });
    expect(test(bigMigrations, 10, 10)).toEqual(null);
  });
  it("fails on incorrect migrations", function () {
    expect(function () {
      return test(bigMigrations, 0, 9);
    }).toThrow();
    expect(function () {
      return test(bigMigrations, 8, 11);
    }).toThrow();
  });
  it('fails early on unknown migration steps', function () {
    var possibleFutureTypes = ['broken', 'rename_table', 'rename_column', 'add_column_index', 'make_column_optional', 'make_column_required', 'destroy_table', 'destroy_column'];
    possibleFutureTypes.forEach(function (type) {
      expect(function () {
        return testSteps([{
          type: type
        }]);
      }).toThrow('Unknown migration step type');
    });
    expect(function () {
      return testSteps([{
        type: undefined
      }]);
    }).toThrow('Invalid migration steps');
  });
});