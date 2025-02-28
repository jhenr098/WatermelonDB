"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _testModels = require("../__tests__/testModels");
var _Model3 = _interopRequireDefault(require("../Model"));
var Q = _interopRequireWildcard(require("../QueryDescription"));
var _index = _interopRequireDefault(require("./index"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
// TODO: Standardize these mocks (same as in sqlite encodeQuery, query test)
var MockTask = /*#__PURE__*/function (_Model) {
  function MockTask() {
    return _Model.apply(this, arguments) || this;
  }
  (0, _inheritsLoose2["default"])(MockTask, _Model);
  return MockTask;
}(_Model3["default"]);
MockTask.table = 'mock_tasks';
MockTask.associations = {
  projects: {
    type: 'belongs_to',
    key: 'project_id'
  },
  tag_assignments: {
    type: 'has_many',
    foreignKey: 'task_id'
  },
  fake1: {
    type: 'has_many',
    foreignKey: 'task_id'
  }
};
var MockProject = /*#__PURE__*/function (_Model2) {
  function MockProject() {
    return _Model2.apply(this, arguments) || this;
  }
  (0, _inheritsLoose2["default"])(MockProject, _Model2);
  return MockProject;
}(_Model3["default"]);
MockProject.table = 'projects';
MockProject.associations = {
  teams: {
    type: 'belongs_to',
    key: 'team_id'
  },
  fake1: {
    type: 'belongs_to',
    key: 'team_id'
  }
};
var mockCollection = Object.freeze({
  modelClass: MockTask,
  db: {
    get: function get(table) {
      return table === 'projects' ? {
        modelClass: MockProject
      } : undefined;
    }
  }
});
describe('Query', function () {
  describe('description properties', function () {
    it('returns tables correctly for simple queries', function () {
      var query = new _index["default"](mockCollection, [Q.where('id', 'abcdef')]);
      expect(query.table).toBe('mock_tasks');
      expect(query.secondaryTables).toEqual([]);
      expect(query.allTables).toEqual(['mock_tasks']);
    });
    it('returns tables correctly for complex queries', function () {
      var query = new _index["default"](mockCollection, [Q.where('id', 'abcdef'), Q.on('projects', 'team_id', 'abcdef')]);
      expect(query.table).toBe('mock_tasks');
      expect(query.secondaryTables).toEqual(['projects']);
      expect(query.allTables).toEqual(['mock_tasks', 'projects']);
    });
    it('returns associations correctly for simple queries', function () {
      var query = new _index["default"](mockCollection, [Q.where('id', 'abcdef')]);
      expect(query.associations).toEqual([]);
    });
    it('returns associations correctly for more complex queries', function () {
      var query = new _index["default"](mockCollection, [Q.on('projects', 'team_id', 'abcdef'), Q.where('left_column', 'right_value'), Q.on('tag_assignments', 'tag_id', Q.oneOf(['a', 'b', 'c']))]);
      expect(query.secondaryTables).toEqual(['projects', 'tag_assignments']);
      expect(query.associations).toEqual([{
        from: 'mock_tasks',
        to: 'projects',
        info: {
          type: 'belongs_to',
          key: 'project_id'
        }
      }, {
        from: 'mock_tasks',
        to: 'tag_assignments',
        info: {
          type: 'has_many',
          foreignKey: 'task_id'
        }
      }]);
    });
    it('returns associations correctly for explicit joins', function () {
      var query = new _index["default"](mockCollection, [Q.experimentalJoinTables(['projects']), Q.experimentalNestedJoin('projects', 'teams'), Q.on('projects', Q.on('teams', 'foo', 'bar'))]);
      expect(query.secondaryTables).toEqual(['projects', 'teams']);
      expect(query.associations).toEqual([{
        from: 'mock_tasks',
        to: 'projects',
        info: {
          type: 'belongs_to',
          key: 'project_id'
        }
      }, {
        from: 'projects',
        to: 'teams',
        info: {
          type: 'belongs_to',
          key: 'team_id'
        }
      }]);
    });
    it("throws an error on incorrect associations", function () {
      expect(function () {
        return new _index["default"](mockCollection, [Q.experimentalJoinTables(['blaublams'])]).associations;
      }).toThrow("Query on 'mock_tasks' joins with 'blaublams', but MockTask does not have associations={} defined for 'blaublams'");
      expect(function () {
        return new _index["default"](mockCollection, [Q.experimentalNestedJoin('blaublams', 'flaflas')]).associations;
      }).toThrow("Query on 'mock_tasks' has a nested join with 'blaublams', but collection for 'blaublams' cannot be found");
      expect(function () {
        return new _index["default"](mockCollection, [Q.experimentalNestedJoin('projects', 'flaflas')]).associations;
      }).toThrow("Query on 'mock_tasks' has a nested join from 'projects' to 'flaflas', but MockProject does not have associations={} defined for 'flaflas'");
    });
  });
  describe('Query.extend()', function () {
    it('can return extended query', function () {
      var query = new _index["default"](mockCollection, [Q.on('projects', 'team_id', 'abcdef'), Q.where('left_column', 'right_value')]);
      var extendedQuery = query.extend(Q.on('tag_assignments', 'tag_id', Q.oneOf(['a', 'b', 'c'])), Q.where('id', 'abcdef'));
      var expectedQuery = new _index["default"](mockCollection, [Q.on('projects', 'team_id', 'abcdef'), Q.where('left_column', 'right_value'), Q.on('tag_assignments', 'tag_id', Q.oneOf(['a', 'b', 'c'])), Q.where('id', 'abcdef')]);
      expect(extendedQuery.collection).toBe(expectedQuery.collection);
      expect(extendedQuery.modelClass).toBe(expectedQuery.modelClass);
      expect(extendedQuery.description).toEqual(expectedQuery.description);
      expect(extendedQuery.secondaryTables).toEqual(expectedQuery.secondaryTables);
      expect(extendedQuery.associations).toEqual(expectedQuery.associations);
      expect(extendedQuery._rawDescription).toEqual(expectedQuery._rawDescription);
    });
    it('can return extended query for sortBy, take and skip', function () {
      var query = new _index["default"](mockCollection, [Q.sortBy('sortable', Q.desc), Q.skip(60), Q.take(20)]);
      var extendedQuery = query.extend(Q.sortBy('sortable2'), Q.skip(40), Q.take(10));
      var expectedQuery = new _index["default"](mockCollection, [Q.sortBy('sortable', Q.desc), Q.sortBy('sortable2', Q.asc), Q.skip(40), Q.take(10)]);
      expect(extendedQuery.serialize()).toEqual(expectedQuery.serialize());
      expect(extendedQuery._rawDescription).toEqual(expectedQuery._rawDescription);
    });
    it('can return extended query and leave take and skip clauses intact', function () {
      var query = new _index["default"](mockCollection, [Q.sortBy('sortable', Q.desc), Q.skip(60), Q.take(20)]);
      var extendedQuery = query.extend(Q.sortBy('sortable2'));
      var expectedQuery = new _index["default"](mockCollection, [Q.sortBy('sortable', Q.desc), Q.sortBy('sortable2', Q.asc), Q.skip(60), Q.take(20)]);
      expect(extendedQuery.serialize()).toEqual(expectedQuery.serialize());
      expect(extendedQuery._rawDescription).toEqual(expectedQuery._rawDescription);
    });
    it("can extend query for join tables", function () {
      var query = new _index["default"](mockCollection, [Q.experimentalJoinTables(['projects', 'tag_assignments']), Q.experimentalNestedJoin('projects', 'teams')]);
      var extendedQuery = query.extend(Q.experimentalJoinTables(['projects', 'fake1']), Q.experimentalNestedJoin('projects', 'fake1'));
      var expectedQuery = new _index["default"](mockCollection, [Q.experimentalJoinTables(['projects', 'tag_assignments', 'fake1']), Q.experimentalNestedJoin('projects', 'teams'), Q.experimentalNestedJoin('projects', 'fake1')]);
      expect(extendedQuery.serialize()).toEqual(expectedQuery.serialize());
    });
    it("can extend query with unsafeLokiTransform", function () {
      var fn = function fn() {};
      var query = new _index["default"](mockCollection, [Q.unsafeLokiTransform(fn)]);
      var extendedQuery = query.extend(Q.where('foo', 'bar'));
      var expectedQuery = new _index["default"](mockCollection, [Q.unsafeLokiTransform(fn), Q.where('foo', 'bar')]);
      expect(extendedQuery.serialize()).toEqual(expectedQuery.serialize());
    });
    it('can return double extended query', function () {
      var query = new _index["default"](mockCollection, [Q.on('projects', 'team_id', 'abcdef')]);
      var extendedQuery = query.extend(Q.on('tag_assignments', 'tag_id', Q.oneOf(['a', 'b', 'c'])), Q.where('left_column', 'right_value')).extend(Q.on('projects', 'team_id', 'abcdefg'), Q.where('id', 'abcdef'));
      var expectedQuery = new _index["default"](mockCollection, [Q.on('projects', 'team_id', 'abcdef'), Q.on('tag_assignments', 'tag_id', Q.oneOf(['a', 'b', 'c'])), Q.where('left_column', 'right_value'), Q.on('projects', 'team_id', 'abcdefg'), Q.where('id', 'abcdef')]);
      expect(extendedQuery.collection).toBe(expectedQuery.collection);
      expect(extendedQuery.modelClass).toBe(expectedQuery.modelClass);
      expect(extendedQuery.description).toEqual(expectedQuery.description);
      expect(extendedQuery.secondaryTables).toEqual(expectedQuery.secondaryTables);
      expect(extendedQuery.associations).toEqual(expectedQuery.associations);
      expect(extendedQuery._rawDescription).toEqual(expectedQuery._rawDescription);
    });
    it("cannot extend an unsafe SQL query", function () {
      var query = new _index["default"](mockCollection, [Q.unsafeSqlQuery('select * from tasks')]);
      expect(function () {
        return query.extend();
      }).toThrow('Cannot extend an unsafe SQL query');
    });
    it("can pass array instead of a list", function () {
      var query = new _index["default"](mockCollection, [Q.on('projects', 'team_id', 'abcdef'), Q.where('left_column', 'right_value')]);
      var clauses = [Q.on('tag_assignments', 'tag_id', Q.oneOf(['a', 'b', 'c'])), Q.where('id', 'abcdef')];
      expect(query.extend(clauses).serialize()).toEqual(query.extend.apply(query, clauses).serialize());
    });
  });
  it('can pipe query', function () {
    var query = new _index["default"](mockCollection, [Q.on('projects', 'team_id', 'abcdef')]);
    var identity = function identity(a) {
      return a;
    };
    expect(query.pipe(identity)).toBe(query);
    var wrap = function wrap(q) {
      return {
        wrapped: q
      };
    };
    expect(query.pipe(wrap).wrapped).toBe(query);
  });
  it('returns serializable version of Query', function () {
    var query = new _index["default"](mockCollection, [Q.on('projects', 'team_id', 'abcdef'), Q.where('left_column', 'right_value'), Q.on('tag_assignments', 'tag_id', Q.oneOf(['a', 'b', 'c']))]);
    expect(query.serialize()).toEqual({
      table: 'mock_tasks',
      description: query.description,
      associations: query.associations
    });
  });
  describe('fetching', function () {
    it.skip("can fetch query", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })));
    it.skip("can fetch count", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    })));
    it("is thenable", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var _mockDatabase, database, tasks, queryAll, m1, m2;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _mockDatabase = (0, _testModels.mockDatabase)(), database = _mockDatabase.database, tasks = _mockDatabase.tasks;
            queryAll = new _index["default"](tasks, []);
            m1 = tasks.prepareCreate();
            m2 = tasks.prepareCreate();
            _context3.next = 6;
            return database.write(function () {
              return database.batch(m1, m2);
            });
          case 6:
            _context3.t0 = expect;
            _context3.next = 9;
            return queryAll;
          case 9:
            _context3.t1 = _context3.sent;
            (0, _context3.t0)(_context3.t1).toEqual([m1, m2]);
            _context3.t2 = expect;
            _context3.next = 14;
            return queryAll.then(function (records) {
              return records.length;
            });
          case 14:
            _context3.t3 = _context3.sent;
            (0, _context3.t2)(_context3.t3).toBe(2);
          case 16:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    })));
    it("count is thenable", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var _mockDatabase2, database, tasks, queryAll;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _mockDatabase2 = (0, _testModels.mockDatabase)(), database = _mockDatabase2.database, tasks = _mockDatabase2.tasks;
            queryAll = new _index["default"](tasks, []);
            _context4.next = 4;
            return database.write(function () {
              return database.batch(tasks.prepareCreate(), tasks.prepareCreate());
            });
          case 4:
            _context4.t0 = expect;
            _context4.next = 7;
            return queryAll.count;
          case 7:
            _context4.t1 = _context4.sent;
            (0, _context4.t0)(_context4.t1).toEqual(2);
            _context4.t2 = expect;
            _context4.next = 12;
            return queryAll.count.then(function (length) {
              return length * 2;
            });
          case 12:
            _context4.t3 = _context4.sent;
            (0, _context4.t2)(_context4.t3).toBe(4);
          case 14:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    })));
  });
  describe('observation', function () {
    // NOTE: Sanity checks only. Concrete tests: observation/
    var waitFor = function waitFor(database) {
      return (
        // make sure we wait until end of DB queue without triggering query for
        // easy counting
        database.adapter.getLocal('nothing')
      );
    };
    var testQueryObservation = /*#__PURE__*/function () {
      var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(makeSubscribe, withColumns) {
        var _mockDatabase3, database, tasks, adapterSpy, query, observer, unsubscribe, t1, observer2, unsubscribe2;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _mockDatabase3 = (0, _testModels.mockDatabase)(), database = _mockDatabase3.database, tasks = _mockDatabase3.tasks;
              adapterSpy = jest.spyOn(database.adapter.underlyingAdapter, 'query');
              query = new _index["default"](tasks, []);
              observer = jest.fn();
              unsubscribe = makeSubscribe(query, observer);
              _context5.next = 7;
              return waitFor(database);
            case 7:
              expect(adapterSpy).toHaveBeenCalledTimes(1);
              expect(observer).toHaveBeenCalledTimes(1);
              expect(observer).toHaveBeenLastCalledWith([]);
              _context5.next = 12;
              return database.write(function () {
                return tasks.create();
              });
            case 12:
              t1 = _context5.sent;
              _context5.next = 15;
              return waitFor(database);
            case 15:
              expect(observer).toHaveBeenCalledTimes(2);
              expect(observer).toHaveBeenLastCalledWith([t1]);

              // check if cached
              observer2 = jest.fn();
              unsubscribe2 = makeSubscribe(query, observer2);
              if (!withColumns) {
                _context5.next = 22;
                break;
              }
              _context5.next = 22;
              return waitFor(database);
            case 22:
              expect(observer2).toHaveBeenCalledTimes(1);
              expect(observer2).toHaveBeenLastCalledWith([t1]);
              expect(adapterSpy).toHaveBeenCalledTimes(withColumns ? 2 : 1);
              unsubscribe();
              unsubscribe2();
            case 27:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      return function testQueryObservation(_x, _x2) {
        return _ref5.apply(this, arguments);
      };
    }();
    it('can observe query', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return testQueryObservation(function (query, subscriber) {
              var subscription = query.observe().subscribe(subscriber);
              return function () {
                return subscription.unsubscribe();
              };
            });
          case 2:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    })));
    it('can subscribe to query', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return testQueryObservation(function (query, subscriber) {
              return query.experimentalSubscribe(subscriber);
            });
          case 2:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    })));
    it('can observe query with columns', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return testQueryObservation(function (query, subscriber) {
              var subscription = query.observeWithColumns(['name']).subscribe(subscriber);
              return function () {
                return subscription.unsubscribe();
              };
            }, true);
          case 2:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    })));
    it('can subscribe to query with columns', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return testQueryObservation(function (query, subscriber) {
              return query.experimentalSubscribeWithColumns(['name'], subscriber);
            }, true);
          case 2:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    })));
    var testCountObservation = /*#__PURE__*/function () {
      var _ref10 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10(makeSubscribe, isThrottled) {
        var _mockDatabase4, database, tasks, adapterSpy, query, observer, unsubscribe, observer2, unsubscribe2;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              _mockDatabase4 = (0, _testModels.mockDatabase)(), database = _mockDatabase4.database, tasks = _mockDatabase4.tasks;
              adapterSpy = jest.spyOn(database.adapter.underlyingAdapter, 'count');
              query = new _index["default"](tasks, []);
              observer = jest.fn();
              unsubscribe = makeSubscribe(query, observer);
              _context10.next = 7;
              return waitFor(database);
            case 7:
              expect(adapterSpy).toHaveBeenCalledTimes(1);
              expect(observer).toHaveBeenCalledTimes(1);
              expect(observer).toHaveBeenLastCalledWith(0);
              if (!isThrottled) {
                _context10.next = 13;
                break;
              }
              _context10.next = 13;
              return new Promise(function (resolve) {
                setTimeout(resolve, 300);
              });
            case 13:
              _context10.next = 15;
              return database.write(function () {
                return tasks.create();
              });
            case 15:
              _context10.next = 17;
              return waitFor(database);
            case 17:
              expect(adapterSpy).toHaveBeenCalledTimes(2);
              expect(observer).toHaveBeenCalledTimes(2);
              expect(observer).toHaveBeenLastCalledWith(1);

              // check if cached
              observer2 = jest.fn();
              unsubscribe2 = makeSubscribe(query, observer2);
              expect(observer2).toHaveBeenCalledTimes(1);
              expect(observer2).toHaveBeenLastCalledWith(1);
              expect(adapterSpy).toHaveBeenCalledTimes(2);
              unsubscribe();
              unsubscribe2();
            case 27:
            case "end":
              return _context10.stop();
          }
        }, _callee10);
      }));
      return function testCountObservation(_x3, _x4) {
        return _ref10.apply(this, arguments);
      };
    }();
    it('can observe (throttled) count', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee11() {
      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return testCountObservation(function (query, subscriber) {
              var subscription = query.observeCount(true).subscribe(subscriber);
              return function () {
                return subscription.unsubscribe();
              };
            }, true);
          case 2:
          case "end":
            return _context11.stop();
        }
      }, _callee11);
    })));
    it('can observe (unthrottled) count', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee12() {
      return _regenerator["default"].wrap(function _callee12$(_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return testCountObservation(function (query, subscriber) {
              var subscription = query.observeCount(false).subscribe(subscriber);
              return function () {
                return subscription.unsubscribe();
              };
            });
          case 2:
          case "end":
            return _context12.stop();
        }
      }, _callee12);
    })));
    it('can subscribe to count', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee13() {
      return _regenerator["default"].wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return testCountObservation(function (query, subscriber) {
              return query.experimentalSubscribeToCount(subscriber);
            });
          case 2:
          case "end":
            return _context13.stop();
        }
      }, _callee13);
    })));
  });
  describe('mass delete', function () {
    var testMassDelete = /*#__PURE__*/function () {
      var _ref14 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee14(methodName) {
        var _mockDatabase5, database, tasks, query, queryAll;
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              _mockDatabase5 = (0, _testModels.mockDatabase)(), database = _mockDatabase5.database, tasks = _mockDatabase5.tasks;
              query = new _index["default"](tasks, [Q.where('name', 'foo')]);
              queryAll = new _index["default"](tasks, []);
              _context14.next = 5;
              return database.write(function () {
                return database.batch(tasks.prepareCreate(function (t) {
                  t.name = 'foo';
                }), tasks.prepareCreate(function (t) {
                  t.name = 'foo';
                }), tasks.prepareCreate(function (t) {
                  t.name = 'foo';
                }), tasks.prepareCreate(), tasks.prepareCreate());
              });
            case 5:
              _context14.t0 = expect;
              _context14.next = 8;
              return queryAll.fetchCount();
            case 8:
              _context14.t1 = _context14.sent;
              (0, _context14.t0)(_context14.t1).toBe(5);
              _context14.t2 = expect;
              _context14.next = 13;
              return query.fetchCount();
            case 13:
              _context14.t3 = _context14.sent;
              (0, _context14.t2)(_context14.t3).toBe(3);
              _context14.next = 17;
              return database.write(function () {
                return query[methodName]();
              });
            case 17:
              _context14.t4 = expect;
              _context14.next = 20;
              return queryAll.fetchCount();
            case 20:
              _context14.t5 = _context14.sent;
              (0, _context14.t4)(_context14.t5).toBe(2);
              _context14.t6 = expect;
              _context14.next = 25;
              return query.fetchCount();
            case 25:
              _context14.t7 = _context14.sent;
              (0, _context14.t6)(_context14.t7).toBe(0);
            case 27:
            case "end":
              return _context14.stop();
          }
        }, _callee14);
      }));
      return function testMassDelete(_x5) {
        return _ref14.apply(this, arguments);
      };
    }();
    it('can mark all as deleted', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee15() {
      return _regenerator["default"].wrap(function _callee15$(_context15) {
        while (1) switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return testMassDelete('markAllAsDeleted');
          case 2:
          case "end":
            return _context15.stop();
        }
      }, _callee15);
    })));
    it('can destroy all permanently', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee16() {
      return _regenerator["default"].wrap(function _callee16$(_context16) {
        while (1) switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return testMassDelete('destroyAllPermanently');
          case 2:
          case "end":
            return _context16.stop();
        }
      }, _callee16);
    })));
  });
  it("has wmelon tag", function () {
    var query = new _index["default"](mockCollection, [Q.where('id', 'abcdef')]);
    expect(query.constructor._wmelonTag).toBe('query');
  });
});