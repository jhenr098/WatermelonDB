"use strict";

var _index = require("./index");
var _stepsForMigration = require("./stepsForMigration");
describe('schemaMigrations()', function () {
  it('returns a basic schema migrations spec', function () {
    var migrations = (0, _index.schemaMigrations)({
      migrations: []
    });
    expect(migrations).toEqual({
      sortedMigrations: [],
      validated: true,
      minVersion: 1,
      maxVersion: 1
    });
    var migrations2 = (0, _index.schemaMigrations)({
      migrations: [{
        toVersion: 2,
        steps: []
      }]
    });
    expect(migrations2).toEqual({
      validated: true,
      minVersion: 1,
      maxVersion: 2,
      sortedMigrations: [{
        toVersion: 2,
        steps: []
      }]
    });
    var migrations3 = (0, _index.schemaMigrations)({
      migrations: [{
        toVersion: 4,
        steps: []
      }]
    });
    expect(migrations3).toEqual({
      validated: true,
      minVersion: 3,
      maxVersion: 4,
      sortedMigrations: [{
        toVersion: 4,
        steps: []
      }]
    });
  });
  it('returns a complex schema migrations spec', function () {
    var migrations = (0, _index.schemaMigrations)({
      migrations: [{
        toVersion: 4,
        steps: []
      }, {
        toVersion: 3,
        steps: [(0, _index.createTable)({
          name: 'comments',
          columns: [{
            name: 'post_id',
            type: 'string',
            isIndexed: true
          }, {
            name: 'body',
            type: 'string'
          }]
        }), (0, _index.addColumns)({
          table: 'posts',
          columns: [{
            name: 'author_id',
            type: 'string',
            isIndexed: true
          }]
        })]
      }, {
        toVersion: 2,
        steps: [(0, _index.addColumns)({
          table: 'posts',
          columns: [{
            name: 'subtitle',
            type: 'string',
            isOptional: true
          }, {
            name: 'is_pinned',
            type: 'boolean'
          }]
        })]
      }]
    });
    expect(migrations).toEqual({
      validated: true,
      minVersion: 1,
      maxVersion: 4,
      sortedMigrations: [{
        toVersion: 2,
        steps: [{
          type: 'add_columns',
          table: 'posts',
          columns: [{
            name: 'subtitle',
            type: 'string',
            isOptional: true
          }, {
            name: 'is_pinned',
            type: 'boolean'
          }]
        }]
      }, {
        toVersion: 3,
        steps: [{
          type: 'create_table',
          schema: {
            name: 'comments',
            columns: {
              post_id: {
                name: 'post_id',
                type: 'string',
                isIndexed: true
              },
              body: {
                name: 'body',
                type: 'string'
              }
            },
            columnArray: [{
              name: 'post_id',
              type: 'string',
              isIndexed: true
            }, {
              name: 'body',
              type: 'string'
            }]
          }
        }, {
          type: 'add_columns',
          table: 'posts',
          columns: [{
            name: 'author_id',
            type: 'string',
            isIndexed: true
          }]
        }]
      }, {
        toVersion: 4,
        steps: []
      }]
    });
  });
  it('throws if migration spec is malformed', function () {
    expect(function () {
      return (0, _index.schemaMigrations)({
        migrations: [{}]
      });
    }).toThrow('Invalid migration');
    expect(function () {
      return (0, _index.schemaMigrations)({
        migrations: [{
          toVersion: 0,
          steps: []
        }]
      });
    }).toThrow(/minimum.*is 2/i);
    expect(function () {
      return (0, _index.schemaMigrations)({
        migrations: [{
          toVersion: 1,
          steps: []
        }]
      });
    }).toThrow(/minimum.*is 2/i);
    expect(function () {
      return (0, _index.schemaMigrations)({
        migrations: [{
          toVersion: 2,
          steps: [{
            table: 'x'
          }]
        }]
      });
    }).toThrow('Invalid migration steps');
  });
  it("throws if there are gaps or duplicates in migrations", function () {
    expect(function () {
      return (0, _index.schemaMigrations)({
        migrations: [{
          toVersion: 2,
          steps: []
        }, {
          toVersion: 2,
          steps: []
        }]
      });
    }).toThrow('duplicates');
    expect(function () {
      return (0, _index.schemaMigrations)({
        migrations: [{
          toVersion: 5,
          steps: []
        }, {
          toVersion: 4,
          steps: []
        }, {
          toVersion: 2,
          steps: []
        }]
      });
    }).toThrow('gaps');

    // missing migrations from 2 to x are ok
    expect(function () {
      return (0, _index.schemaMigrations)({
        migrations: [{
          toVersion: 6,
          steps: []
        }, {
          toVersion: 5,
          steps: []
        }, {
          toVersion: 4,
          steps: []
        }]
      });
    }).not.toThrow();

    // chronological is ok too
    expect(function () {
      return (0, _index.schemaMigrations)({
        migrations: [{
          toVersion: 4,
          steps: []
        }, {
          toVersion: 5,
          steps: []
        }, {
          toVersion: 6,
          steps: []
        }]
      });
    }).not.toThrow();
  });
});
describe('migration step functions', function () {
  it('throws if createTable() is malformed', function () {
    expect(function () {
      return (0, _index.createTable)({
        columns: []
      });
    }).toThrow('name');
    expect(function () {
      return (0, _index.createTable)({
        name: 'foo',
        columns: [{
          name: 'x',
          type: 'blah'
        }]
      });
    }).toThrow('type');
  });
  it('throws if addColumns() is malformed', function () {
    expect(function () {
      return (0, _index.addColumns)({
        columns: [{}]
      });
    }).toThrow('table');
    expect(function () {
      return (0, _index.addColumns)({
        table: 'foo'
      });
    }).toThrow('columns');
    expect(function () {
      return (0, _index.addColumns)({
        table: 'foo',
        columns: {
          name: 'x',
          type: 'blah'
        }
      });
    }).toThrow('columns');
    expect(function () {
      return (0, _index.addColumns)({
        table: 'foo',
        columns: [{
          name: 'x',
          type: 'blah'
        }]
      });
    }).toThrow('type');
  });
  it('throws if unsafeExecuteSql() is malformed', function () {
    expect(function () {
      return (0, _index.unsafeExecuteSql)();
    }).toThrow('not a string');
    expect(function () {
      return (0, _index.unsafeExecuteSql)('delete from table_a');
    }).toThrow('semicolon');
    expect(function () {
      return (0, _index.unsafeExecuteSql)('delete from table_a;');
    }).not.toThrow();
  });
});
describe('stepsForMigration', function () {
  it('finds the right migration steps', function () {
    var step1 = (0, _index.addColumns)({
      table: 'posts',
      columns: [{
        name: 'subtitle',
        type: 'string',
        isOptional: true
      }, {
        name: 'is_pinned',
        type: 'boolean'
      }]
    });
    var step2 = (0, _index.addColumns)({
      table: 'posts',
      columns: [{
        name: 'author_id',
        type: 'string',
        isIndexed: true
      }]
    });
    var step3 = (0, _index.createTable)({
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
    var migrations = (0, _index.schemaMigrations)({
      migrations: [{
        toVersion: 5,
        steps: [step2, step3]
      }, {
        toVersion: 4,
        steps: []
      }, {
        toVersion: 3,
        steps: [step1]
      }]
    });
    expect((0, _stepsForMigration.stepsForMigration)({
      migrations: migrations,
      fromVersion: 2,
      toVersion: 3
    })).toEqual([step1]);
    expect((0, _stepsForMigration.stepsForMigration)({
      migrations: migrations,
      fromVersion: 2,
      toVersion: 4
    })).toEqual([step1]);
    expect((0, _stepsForMigration.stepsForMigration)({
      migrations: migrations,
      fromVersion: 2,
      toVersion: 5
    })).toEqual([step1, step2, step3]);
    expect((0, _stepsForMigration.stepsForMigration)({
      migrations: migrations,
      fromVersion: 3,
      toVersion: 5
    })).toEqual([step2, step3]);
    expect((0, _stepsForMigration.stepsForMigration)({
      migrations: migrations,
      fromVersion: 3,
      toVersion: 4
    })).toEqual([]);
    expect((0, _stepsForMigration.stepsForMigration)({
      migrations: migrations,
      fromVersion: 4,
      toVersion: 5
    })).toEqual([step2, step3]);

    // if no available steps, return null
    expect((0, _stepsForMigration.stepsForMigration)({
      migrations: (0, _index.schemaMigrations)({
        migrations: []
      }),
      fromVersion: 1,
      toVersion: 2
    })).toEqual(null);
    expect((0, _stepsForMigration.stepsForMigration)({
      migrations: migrations,
      fromVersion: 1,
      toVersion: 2
    })).toEqual(null);
    expect((0, _stepsForMigration.stepsForMigration)({
      migrations: migrations,
      fromVersion: 1,
      toVersion: 3
    })).toEqual(null);
    expect((0, _stepsForMigration.stepsForMigration)({
      migrations: migrations,
      fromVersion: 1,
      toVersion: 5
    })).toEqual(null);
    expect((0, _stepsForMigration.stepsForMigration)({
      migrations: migrations,
      fromVersion: 3,
      toVersion: 6
    })).toEqual(null);
    expect((0, _stepsForMigration.stepsForMigration)({
      migrations: migrations,
      fromVersion: 5,
      toVersion: 6
    })).toEqual(null);
  });
});