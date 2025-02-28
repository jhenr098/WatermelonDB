"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
var Q = _interopRequireWildcard(require("../index"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
describe('buildQueryDescription', function () {
  it('builds empty query', function () {
    var query = Q.buildQueryDescription([]);
    expect(query).toEqual({
      where: [],
      joinTables: [],
      nestedJoinTables: [],
      sortBy: []
    });
  });
  it('builds simple query', function () {
    var query = Q.buildQueryDescription([Q.where('left_column', 'right_value')]);
    expect(query).toEqual({
      where: [{
        type: 'where',
        left: 'left_column',
        comparison: {
          operator: 'eq',
          right: {
            value: 'right_value'
          }
        }
      }],
      joinTables: [],
      nestedJoinTables: [],
      sortBy: []
    });
  });
  it('accepts multiple conditions and value types', function () {
    var query = Q.buildQueryDescription([Q.where('col1', 'val1'), Q.where('col2', 2), Q.where('col3', true), Q.where('col4', false), Q.where('col5', null)]);
    expect(query).toEqual({
      where: [{
        type: 'where',
        left: 'col1',
        comparison: {
          operator: 'eq',
          right: {
            value: 'val1'
          }
        }
      }, {
        type: 'where',
        left: 'col2',
        comparison: {
          operator: 'eq',
          right: {
            value: 2
          }
        }
      }, {
        type: 'where',
        left: 'col3',
        comparison: {
          operator: 'eq',
          right: {
            value: true
          }
        }
      }, {
        type: 'where',
        left: 'col4',
        comparison: {
          operator: 'eq',
          right: {
            value: false
          }
        }
      }, {
        type: 'where',
        left: 'col5',
        comparison: {
          operator: 'eq',
          right: {
            value: null
          }
        }
      }],
      joinTables: [],
      nestedJoinTables: [],
      sortBy: []
    });
  });
  it('supports multiple operators', function () {
    var query = Q.buildQueryDescription([Q.where('col1', Q.eq('val1')), Q.where('col2', Q.gt(2)), Q.where('col3', Q.gte(3)), Q.where('col3_5', Q.weakGt(3.5)), Q.where('col4', Q.lt(4)), Q.where('col5', Q.lte(5)), Q.where('col6', Q.notEq(null)), Q.where('col7', Q.oneOf([1, 2, 3])), Q.where('col8', Q.notIn(['a', 'b', 'c'])), Q.where('col9', Q.between(10, 11)), Q.where('col10', Q.like('%abc')), Q.where('col11', Q.notLike('def%')), Q.where('col12', Q.includes('foo'))]);
    expect(query).toEqual({
      where: [{
        type: 'where',
        left: 'col1',
        comparison: {
          operator: 'eq',
          right: {
            value: 'val1'
          }
        }
      }, {
        type: 'where',
        left: 'col2',
        comparison: {
          operator: 'gt',
          right: {
            value: 2
          }
        }
      }, {
        type: 'where',
        left: 'col3',
        comparison: {
          operator: 'gte',
          right: {
            value: 3
          }
        }
      }, {
        type: 'where',
        left: 'col3_5',
        comparison: {
          operator: 'weakGt',
          right: {
            value: 3.5
          }
        }
      }, {
        type: 'where',
        left: 'col4',
        comparison: {
          operator: 'lt',
          right: {
            value: 4
          }
        }
      }, {
        type: 'where',
        left: 'col5',
        comparison: {
          operator: 'lte',
          right: {
            value: 5
          }
        }
      }, {
        type: 'where',
        left: 'col6',
        comparison: {
          operator: 'notEq',
          right: {
            value: null
          }
        }
      }, {
        type: 'where',
        left: 'col7',
        comparison: {
          operator: 'oneOf',
          right: {
            values: [1, 2, 3]
          }
        }
      }, {
        type: 'where',
        left: 'col8',
        comparison: {
          operator: 'notIn',
          right: {
            values: ['a', 'b', 'c']
          }
        }
      }, {
        type: 'where',
        left: 'col9',
        comparison: {
          operator: 'between',
          right: {
            values: [10, 11]
          }
        }
      }, {
        type: 'where',
        left: 'col10',
        comparison: {
          operator: 'like',
          right: {
            value: '%abc'
          }
        }
      }, {
        type: 'where',
        left: 'col11',
        comparison: {
          operator: 'notLike',
          right: {
            value: 'def%'
          }
        }
      }, {
        type: 'where',
        left: 'col12',
        comparison: {
          operator: 'includes',
          right: {
            value: 'foo'
          }
        }
      }],
      joinTables: [],
      nestedJoinTables: [],
      sortBy: []
    });
  });
  it('supports column comparisons', function () {
    var query = Q.buildQueryDescription([Q.where('left_column', Q.gte(Q.column('right_column')))]);
    expect(query).toEqual({
      where: [{
        type: 'where',
        left: 'left_column',
        comparison: {
          operator: 'gte',
          right: {
            column: 'right_column'
          }
        }
      }],
      joinTables: [],
      nestedJoinTables: [],
      sortBy: []
    });
  });
  it('supports AND/OR nesting', function () {
    var query = Q.buildQueryDescription([Q.where('col1', 'value'), Q.or(Q.where('col2', true), Q.where('col3', null), Q.and(Q.where('col4', Q.gt(5)), Q.where('col5', Q.notIn([6, 7]))))]);
    expect(query).toEqual({
      where: [{
        type: 'where',
        left: 'col1',
        comparison: {
          operator: 'eq',
          right: {
            value: 'value'
          }
        }
      }, {
        type: 'or',
        conditions: [{
          type: 'where',
          left: 'col2',
          comparison: {
            operator: 'eq',
            right: {
              value: true
            }
          }
        }, {
          type: 'where',
          left: 'col3',
          comparison: {
            operator: 'eq',
            right: {
              value: null
            }
          }
        }, {
          type: 'and',
          conditions: [{
            type: 'where',
            left: 'col4',
            comparison: {
              operator: 'gt',
              right: {
                value: 5
              }
            }
          }, {
            type: 'where',
            left: 'col5',
            comparison: {
              operator: 'notIn',
              right: {
                values: [6, 7]
              }
            }
          }]
        }]
      }],
      joinTables: [],
      nestedJoinTables: [],
      sortBy: []
    });
  });
  it("supports unsafe SQL and Loki expressions", function () {
    var query = Q.buildQueryDescription([Q.unsafeSqlExpr("some sql"), Q.unsafeLokiExpr({
      column: {
        $jgt: 5
      }
    }), Q.and(Q.unsafeSqlExpr("some sql")), Q.or(Q.unsafeLokiExpr({
      column: {
        $jgt: 5
      }
    }))]);
    expect(query).toEqual({
      where: [{
        type: 'sql',
        expr: "some sql"
      }, {
        type: 'loki',
        expr: {
          column: {
            $jgt: 5
          }
        }
      }, {
        type: 'and',
        conditions: [{
          type: 'sql',
          expr: "some sql"
        }]
      }, {
        type: 'or',
        conditions: [{
          type: 'loki',
          expr: {
            column: {
              $jgt: 5
            }
          }
        }]
      }],
      joinTables: [],
      nestedJoinTables: [],
      sortBy: []
    });
  });
  it("supports unsafe Loki transform", function () {
    var transform = function transform(records, _loki) {
      return records;
    };
    var query = Q.buildQueryDescription([Q.unsafeLokiTransform(transform)]);
    expect(query).toEqual({
      where: [],
      joinTables: [],
      nestedJoinTables: [],
      sortBy: [],
      lokiTransform: transform
    });
  });
  it("supports unsafe SQL queries", function () {
    var query = Q.buildQueryDescription([Q.unsafeSqlQuery("select * from tasks where foo = 'bar'")]);
    expect(query).toEqual({
      where: [],
      joinTables: [],
      nestedJoinTables: [],
      sortBy: [],
      sql: {
        type: 'sqlQuery',
        sql: "select * from tasks where foo = 'bar'",
        values: []
      }
    });
  });
  it("supports unsafe SQL queries with placeholder values", function () {
    var query = Q.buildQueryDescription([Q.unsafeSqlQuery('select * from tasks where foo = ? and bar = ?', ['hello', 'world'])]);
    expect(query).toEqual({
      where: [],
      joinTables: [],
      nestedJoinTables: [],
      sortBy: [],
      sql: {
        type: 'sqlQuery',
        sql: 'select * from tasks where foo = ? and bar = ?',
        values: ['hello', 'world']
      }
    });
  });
  it("prevents use of unsafe sql queries with other clauses", function () {
    expect(function () {
      Q.buildQueryDescription([Q.unsafeSqlQuery("select * from tasks where foo = 'bar'"), Q.where('foo', 'bar')]);
    }).toThrow('Cannot use Q.unsafeSqlQuery with');
    expect(function () {
      Q.buildQueryDescription([Q.where('foo', 'bar'), Q.unsafeSqlQuery("select * from tasks where foo = 'bar'")]);
    }).toThrow('Cannot use Q.unsafeSqlQuery with');
  });
  it("allows unsafe SQL queries to be properly observable", function () {
    var query = Q.buildQueryDescription([Q.experimentalJoinTables(['projects']), Q.experimentalNestedJoin('projects', 'teams'), Q.unsafeSqlQuery('select tasks.* from tasks ' + 'left join projects on tasks.project_id is projects.id ' + 'left join teams on projects.team_id is teams.id ')]);
    expect(query).toEqual({
      where: [],
      joinTables: ['projects'],
      nestedJoinTables: [{
        from: 'projects',
        to: 'teams'
      }],
      sortBy: [],
      sql: {
        type: 'sqlQuery',
        sql: 'select tasks.* from tasks ' + 'left join projects on tasks.project_id is projects.id ' + 'left join teams on projects.team_id is teams.id ',
        values: []
      }
    });
  });
  it('supports simple JOIN queries', function () {
    var query = Q.buildQueryDescription([Q.on('foreign_table', 'foreign_column', 'value'), Q.where('left_column', 'right_value'), Q.on('foreign_table2', 'foreign_column2', Q.gt(Q.column('foreign_column3')))]);
    expect(query).toEqual({
      where: [{
        type: 'on',
        table: 'foreign_table',
        conditions: [{
          type: 'where',
          left: 'foreign_column',
          comparison: {
            operator: 'eq',
            right: {
              value: 'value'
            }
          }
        }]
      }, {
        type: 'where',
        left: 'left_column',
        comparison: {
          operator: 'eq',
          right: {
            value: 'right_value'
          }
        }
      }, {
        type: 'on',
        table: 'foreign_table2',
        conditions: [{
          type: 'where',
          left: 'foreign_column2',
          comparison: {
            operator: 'gt',
            right: {
              column: 'foreign_column3'
            }
          }
        }]
      }],
      joinTables: ['foreign_table', 'foreign_table2'],
      nestedJoinTables: [],
      sortBy: []
    });
  });
  it("supports nesting Q.on inside and/or", function () {
    var query = Q.buildQueryDescription([Q.experimentalJoinTables(['projects', 'foreign_table2']), Q.or(Q.where('is_followed', true), Q.on('projects', 'is_followed', true), Q.and(Q.on('foreign_table2', 'foo', 'bar')))]);
    expect(query).toEqual({
      where: [{
        type: 'or',
        conditions: [{
          type: 'where',
          left: 'is_followed',
          comparison: {
            operator: 'eq',
            right: {
              value: true
            }
          }
        }, {
          type: 'on',
          table: 'projects',
          conditions: [{
            type: 'where',
            left: 'is_followed',
            comparison: {
              operator: 'eq',
              right: {
                value: true
              }
            }
          }]
        }, {
          type: 'and',
          conditions: [{
            type: 'on',
            table: 'foreign_table2',
            conditions: [{
              type: 'where',
              left: 'foo',
              comparison: {
                operator: 'eq',
                right: {
                  value: 'bar'
                }
              }
            }]
          }]
        }]
      }],
      joinTables: ['projects', 'foreign_table2'],
      nestedJoinTables: [],
      sortBy: []
    });
  });
  it("supports multiple conditions on Q.on", function () {
    var query = Q.buildQueryDescription([Q.on('projects', [Q.where('foo', 'bar'), Q.or(Q.where('bar', 'baz'), Q.where('bla', 'boop'))])]);
    expect(query).toEqual({
      where: [{
        type: 'on',
        table: 'projects',
        conditions: [{
          type: 'where',
          left: 'foo',
          comparison: {
            operator: 'eq',
            right: {
              value: 'bar'
            }
          }
        }, {
          type: 'or',
          conditions: [{
            type: 'where',
            left: 'bar',
            comparison: {
              operator: 'eq',
              right: {
                value: 'baz'
              }
            }
          }, {
            type: 'where',
            left: 'bla',
            comparison: {
              operator: 'eq',
              right: {
                value: 'boop'
              }
            }
          }]
        }]
      }],
      joinTables: ['projects'],
      nestedJoinTables: [],
      sortBy: []
    });
  });
  it("supports deep nesting Q.on inside Q.on", function () {
    var query = Q.buildQueryDescription([Q.experimentalNestedJoin('projects', 'teams'), Q.experimentalNestedJoin('teams', 'organizations'), Q.on('projects', Q.on('teams', Q.on('organizations', 'foo', 'bar')))]);
    expect(query).toEqual({
      where: [{
        type: 'on',
        table: 'projects',
        conditions: [{
          type: 'on',
          table: 'teams',
          conditions: [{
            type: 'on',
            table: 'organizations',
            conditions: [{
              type: 'where',
              left: 'foo',
              comparison: {
                operator: 'eq',
                right: {
                  value: 'bar'
                }
              }
            }]
          }]
        }]
      }],
      joinTables: ['projects'],
      nestedJoinTables: [{
        from: 'projects',
        to: 'teams'
      }, {
        from: 'teams',
        to: 'organizations'
      }],
      sortBy: []
    });
  });
  it("supports Q.on shortcut syntaxes", function () {
    var expected = Q.on('projects', [Q.where('foo', Q.eq('bar'))]);
    expect(Q.on('projects', 'foo', 'bar')).toEqual(expected);
    expect(Q.on('projects', 'foo', Q.eq('bar'))).toEqual(expected);
    expect(Q.on('projects', Q.where('foo', 'bar'))).toEqual(expected);
    expect(Q.on('projects', Q.and(Q.where('foo', 'bar'), Q.where('bar', 'baz')))).toEqual(Q.on('projects', [Q.where('foo', 'bar'), Q.where('bar', 'baz')]));
  });
  it("supports passing conditions as array or via spread", function () {
    var conditions = [Q.where('col1', 'value'), Q.where('col2', true), Q.where('col3', null)];
    expect(Q.and.apply(Q, conditions)).toEqual(Q.and(conditions));
    expect(Q.or.apply(Q, conditions)).toEqual(Q.or(conditions));
  });
  it('supports sorting query', function () {
    var query = Q.buildQueryDescription([Q.sortBy('sortable_column', Q.desc)]);
    expect(query).toEqual({
      where: [],
      joinTables: [],
      nestedJoinTables: [],
      sortBy: [{
        type: 'sortBy',
        sortColumn: 'sortable_column',
        sortOrder: 'desc'
      }]
    });
  });
  it('does not support skip operator without take operator', function () {
    expect(function () {
      Q.buildQueryDescription([Q.skip(100)]);
    }).toThrow('cannot skip without take');
  });
  it('support multiple skip operators but only take the last', function () {
    var query = Q.buildQueryDescription([Q.take(100), Q.skip(200), Q.skip(400), Q.skip(800)]);
    expect(query).toEqual({
      where: [],
      joinTables: [],
      nestedJoinTables: [],
      sortBy: [],
      take: 100,
      skip: 800
    });
  });
  it('deep freezes the query in dev', function () {
    var make = function make() {
      return Q.buildQueryDescription([Q.where('left_column', 'right_value')]);
    };
    var query = make();
    expect(function () {
      query.foo = [];
    }).toThrow();
    expect(function () {
      query.where[0].comparison.right = {};
    }).toThrow();
    expect(query).toEqual(make());
  });
  it('freezes oneOf/notIn, even in production', function () {
    var env = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'production';
      var ohJustAnArray = [1, 2, 3];
      var anotherArray = ['a', 'b', 'c'];
      Q.buildQueryDescription([Q.where('col7', Q.oneOf(ohJustAnArray)), Q.where('col8', Q.notIn(anotherArray))]);
      expect(function () {
        return ohJustAnArray.push(4);
      }).toThrow();
      expect(function () {
        return anotherArray.push('d');
      }).toThrow();
      expect(ohJustAnArray.length).toBe(3);
      expect(anotherArray.length).toBe(3);
    } finally {
      process.env.NODE_ENV = env;
    }
  });
  it('catches bad types', function () {
    expect(function () {
      return Q.eq({});
    }).toThrow('Invalid value passed to query');
    expect(function () {
      return Q.where('foo', undefined);
    }).toThrow('undefined');
    // TODO: oneOf/notIn values?
    expect(function () {
      return Q.oneOf({});
    }).toThrow('not an array');
    expect(function () {
      return Q.oneOf('a', 'b', 'c');
    }).toThrow('not an array');
    expect(function () {
      return Q.notIn({});
    }).toThrow('not an array');
    expect(function () {
      return Q.like(null);
    }).toThrow('not a string');
    expect(function () {
      return Q.like({});
    }).toThrow('not a string');
    expect(function () {
      return Q.notLike(null);
    }).toThrow('not a string');
    expect(function () {
      return Q.notLike({});
    }).toThrow('not a string');
    expect(function () {
      return Q.includes(null);
    }).toThrow('not a string');
    expect(function () {
      return Q.sanitizeLikeString(null);
    }).toThrow('not a string');
    expect(function () {
      return Q.column({});
    }).toThrow('not a string');
    expect(function () {
      return Q.take('0');
    }).toThrow('not a number');
    expect(function () {
      return Q.skip('0');
    }).toThrow('not a number');
    expect(function () {
      return Q.unsafeSqlExpr({});
    }).toThrow('not a string');
    expect(function () {
      return Q.unsafeLokiExpr();
    }).toThrow('not an object');
    expect(function () {
      return Q.unsafeLokiExpr('hey');
    }).toThrow('not an object');
    expect(function () {
      return Q.unsafeSqlQuery(null);
    }).toThrow('not a string');
    expect(function () {
      return Q.unsafeSqlQuery('foo', null);
    }).toThrow('not an array');
  });
  it("catches bad argument values", function () {
    expect(function () {
      return Q.sortBy('foo', 'ascasc');
    }).toThrow('Invalid sortOrder');
    expect(function () {
      return Q.where('foo', Q.unsafeSqlExpr('is RANDOM()'));
    }).toThrow();
    expect(function () {
      return Q.where('foo', Q.unsafeLokiExpr('is RANDOM()'));
    }).toThrow();
    expect(function () {
      return Q.and(Q.like('foo'));
    }).toThrow('can only contain');
    expect(function () {
      return Q.or(Q.like('foo'));
    }).toThrow('can only contain');
    expect(function () {
      return Q.or(Q.unsafeSqlQuery('foo'));
    }).toThrow('can only contain');
    expect(function () {
      return Q.on('foo', Q.column('foo'));
    }).toThrow('can only contain');
    expect(function () {
      return Q.buildQueryDescription([Q.like('foo')]);
    }).toThrow('Invalid Query clause passed');
    expect(function () {
      return Q.experimentalJoinTables('foo', 'bar');
    }).toThrow('expected an array');
  });
  it('protect against passing Watermelon look-alike objects', function () {
    // protect against passing something that could be a user-input Object (risk is when Watermelon users pass stuff from JSON without validation), but is unintended or even malicious in some way
    expect(function () {
      return Q.eq({
        column: 'foo'
      });
    }).toThrow(/Invalid { column: }/);
    expect(function () {
      return Q.where('foo', {
        operator: 'eq',
        right: {
          value: 'foo'
        }
      });
    }).toThrow('Invalid Comparison');
    expect(function () {
      return Q.where('foo', {});
    }).toThrow('Invalid Comparison');
    expect(function () {
      return Q.on('table', 'foo', {});
    }).toThrow('Invalid Comparison');
    expect(function () {
      return Q.on('table', 'foo', Q.eq({
        column: 'foo'
      }));
    }).toThrow(/Invalid { column: }/);
  });
  it("protects against unsafe column and table names passed", function () {
    expect(function () {
      return Q.column('sqlite_master');
    }).toThrow('Unsafe name');
    expect(function () {
      return Q.column('hey` or --');
    }).toThrow('Unsafe name');
    expect(function () {
      return Q.where('rowid', 10);
    }).toThrow('Unsafe name');
    expect(function () {
      return Q.sortBy('sqlite_master', 'asc');
    }).toThrow('Unsafe name');
    expect(function () {
      return Q.on('sqlite_master', 'foo', 'bar');
    }).toThrow('Unsafe name');
    expect(function () {
      return Q.on('sqlite_master', Q.where('foo', 'bar'));
    }).toThrow('Unsafe name');
    expect(function () {
      return Q.experimentalJoinTables(['foo', 'sqlite_master']);
    }).toThrow('Unsafe name');
    expect(function () {
      return Q.experimentalNestedJoin('sqlite_master', 'foo');
    }).toThrow('Unsafe name');
    expect(function () {
      return Q.experimentalNestedJoin('foo', 'sqlite_master');
    }).toThrow('Unsafe name');
  });
});