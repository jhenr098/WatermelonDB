"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _lodash = _interopRequireDefault(require("lodash.clonedeep"));
var _rambdax = require("rambdax");
var _operators = require("rxjs/operators");
var _utils = require("../../../__tests__/utils");
var _helpers = require("./helpers");
var _index = require("../../index");
var _index2 = require("../index");
var observeDatabase = function observeDatabase(database) {
  var observer = jest.fn();
  var tables = ['mock_projects', 'mock_project_sections', 'mock_tasks', 'mock_comments'];
  expect(tables).toEqual(Object.keys(database.collections.map));
  database.withChangesForTables(tables).pipe((0, _operators.skip)(1)).subscribe(observer);
  return observer;
};
describe('synchronize', function () {
  it('can perform an empty sync', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _makeDatabase, database, observer, pullChanges;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _makeDatabase = (0, _helpers.makeDatabase)(), database = _makeDatabase.database;
          observer = observeDatabase(database);
          pullChanges = jest.fn((0, _helpers.emptyPull)());
          _context.next = 5;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: jest.fn()
          });
        case 5:
          expect(observer).toHaveBeenCalledTimes(0);
          expect(pullChanges).toHaveBeenCalledTimes(1);
          expect(pullChanges).toHaveBeenCalledWith({
            lastPulledAt: null,
            schemaVersion: 1,
            migration: null
          });
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  it("doesn't push changes if nothing to push", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _makeDatabase2, database, pushChanges;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _makeDatabase2 = (0, _helpers.makeDatabase)(), database = _makeDatabase2.database;
          pushChanges = jest.fn();
          _context2.next = 4;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: jest.fn((0, _helpers.emptyPull)()),
            pushChanges: pushChanges
          });
        case 4:
          expect(pushChanges).toHaveBeenCalledTimes(0);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  it('can log basic information about a sync', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var _makeDatabase3, database, log;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _makeDatabase3 = (0, _helpers.makeDatabase)(), database = _makeDatabase3.database;
          log = {};
          _context4.next = 4;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: function () {
              var _pullChanges = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return new Promise(function (resolve) {
                        setTimeout(resolve, 10);
                      });
                    case 2:
                      return _context3.abrupt("return", (0, _helpers.emptyPull)()());
                    case 3:
                    case "end":
                      return _context3.stop();
                  }
                }, _callee3);
              }));
              function pullChanges() {
                return _pullChanges.apply(this, arguments);
              }
              return pullChanges;
            }(),
            pushChanges: function pushChanges() {},
            log: log
          });
        case 4:
          expect(log.startedAt).toBeInstanceOf(Date);
          expect(log.finishedAt).toBeInstanceOf(Date);
          expect(log.finishedAt.getTime()).toBeGreaterThan(log.startedAt.getTime());
          expect(log.phase).toBe('done');
          expect(log.lastPulledAt).toBe(null);
          expect(log.newLastPulledAt).toBe(1500);
          expect(log.error).toBe(undefined);
          expect(log.remoteChangeCount).toBe(0);
          expect(log.localChangeCount).toBe(0);
        case 13:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
  it("notifies user about remote change count", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var _makeDatabase4, database, onWillApplyRemoteChanges, onWillApplyRemoteChanges2;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _makeDatabase4 = (0, _helpers.makeDatabase)(), database = _makeDatabase4.database;
          onWillApplyRemoteChanges = jest.fn();
          _context6.next = 4;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: (0, _helpers.emptyPull)(),
            pushChanges: function pushChanges() {},
            onWillApplyRemoteChanges: onWillApplyRemoteChanges
          });
        case 4:
          expect(onWillApplyRemoteChanges).toHaveBeenCalledTimes(1);
          expect(onWillApplyRemoteChanges).toHaveBeenCalledWith({
            remoteChangeCount: 0
          });

          // real changes
          onWillApplyRemoteChanges2 = jest.fn(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
            return _regenerator["default"].wrap(function _callee5$(_context5) {
              while (1) switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return (0, _rambdax.delay)(100);
                case 2:
                case "end":
                  return _context5.stop();
              }
            }, _callee5);
          })));
          _context6.next = 9;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: function pullChanges() {
              return {
                changes: (0, _helpers.makeChangeSet)({
                  mock_projects: {
                    created: [{
                      id: 'new_project',
                      name: 'remote'
                    }]
                  },
                  mock_tasks: {
                    updated: [{
                      id: 'task_1',
                      name: 'remote'
                    }],
                    deleted: ['task_2']
                  }
                }),
                timestamp: 1500
              };
            },
            pushChanges: function pushChanges() {},
            onWillApplyRemoteChanges: onWillApplyRemoteChanges2
          });
        case 9:
          expect(onWillApplyRemoteChanges2).toHaveBeenCalledTimes(1);
          expect(onWillApplyRemoteChanges2).toHaveBeenCalledWith({
            remoteChangeCount: 3
          });
        case 11:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  })));
  it('will not push changes if no `pushChanges`', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8() {
    var _makeDatabase5, database, pullChanges, log;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _makeDatabase5 = (0, _helpers.makeDatabase)(), database = _makeDatabase5.database;
          _context8.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          pullChanges = /*#__PURE__*/function () {
            var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7() {
              return _regenerator["default"].wrap(function _callee7$(_context7) {
                while (1) switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return new Promise(function (resolve) {
                      setTimeout(resolve, 10);
                    });
                  case 2:
                    return _context7.abrupt("return", (0, _helpers.emptyPull)()());
                  case 3:
                  case "end":
                    return _context7.stop();
                }
              }, _callee7);
            }));
            return function pullChanges() {
              return _ref7.apply(this, arguments);
            };
          }();
          log = {};
          _context8.next = 7;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            log: log
          });
        case 7:
          expect(log.startedAt).toBeInstanceOf(Date);
          expect(log.finishedAt).toBeInstanceOf(Date);
          expect(log.finishedAt.getTime()).toBeGreaterThan(log.startedAt.getTime());
          expect(log.phase).toBe('done');
        case 11:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  })));
  it('can push changes', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    var _makeDatabase6, database, localChanges, pullChanges, pushChanges, log;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _makeDatabase6 = (0, _helpers.makeDatabase)(), database = _makeDatabase6.database;
          _context9.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _context9.next = 5;
          return (0, _index2.fetchLocalChanges)(database);
        case 5:
          localChanges = _context9.sent;
          pullChanges = jest.fn((0, _helpers.emptyPull)());
          pushChanges = jest.fn();
          log = {};
          _context9.next = 11;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: pushChanges,
            log: log
          });
        case 11:
          expect(pushChanges).toHaveBeenCalledWith({
            changes: localChanges.changes,
            lastPulledAt: 1500
          });
          _context9.t0 = expect;
          _context9.next = 15;
          return (0, _index2.fetchLocalChanges)(database);
        case 15:
          _context9.t1 = _context9.sent;
          (0, _context9.t0)(_context9.t1).toEqual(_helpers.emptyLocalChanges);
          expect(log.localChangeCount).toBe(10);
        case 18:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  })));
  it('can pull changes', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee11() {
    var _makeDatabase7, database, projects, tasks, pullChanges;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _makeDatabase7 = (0, _helpers.makeDatabase)(), database = _makeDatabase7.database, projects = _makeDatabase7.projects, tasks = _makeDatabase7.tasks;
          pullChanges = jest.fn(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10() {
            return _regenerator["default"].wrap(function _callee10$(_context10) {
              while (1) switch (_context10.prev = _context10.next) {
                case 0:
                  return _context10.abrupt("return", {
                    changes: (0, _helpers.makeChangeSet)({
                      mock_projects: {
                        created: [{
                          id: 'new_project',
                          name: 'remote'
                        }],
                        updated: [{
                          id: 'pSynced',
                          name: 'remote'
                        }]
                      },
                      mock_tasks: {
                        deleted: ['tSynced']
                      }
                    }),
                    timestamp: 1500
                  });
                case 1:
                case "end":
                  return _context10.stop();
              }
            }, _callee10);
          })));
          _context11.next = 4;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: jest.fn()
          });
        case 4:
          expect(pullChanges).toHaveBeenCalledWith({
            lastPulledAt: null,
            schemaVersion: 1,
            migration: null
          });
          _context11.t0 = expect;
          _context11.next = 8;
          return (0, _index2.fetchLocalChanges)(database);
        case 8:
          _context11.t1 = _context11.sent;
          (0, _context11.t0)(_context11.t1).toEqual(_helpers.emptyLocalChanges);
          _context11.next = 12;
          return (0, _helpers.expectSyncedAndMatches)(projects, 'new_project', {
            name: 'remote'
          });
        case 12:
          _context11.next = 14;
          return (0, _helpers.expectSyncedAndMatches)(projects, 'pSynced', {
            name: 'remote'
          });
        case 14:
          _context11.next = 16;
          return (0, _helpers.expectDoesNotExist)(tasks, 'tSynced');
        case 16:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  })));
  it('can synchronize changes with conflicts', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee13() {
    var _makeDatabase8, database, projects, tasks, comments, records, tUpdatedInitial, cUpdatedInitial, localChanges, pullChanges, pushChanges, log, pushedChanges, tUpdatedResolvedExpected, cUpdatedResolvedExpected;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _makeDatabase8 = (0, _helpers.makeDatabase)(), database = _makeDatabase8.database, projects = _makeDatabase8.projects, tasks = _makeDatabase8.tasks, comments = _makeDatabase8.comments;
          _context13.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          records = _context13.sent;
          tUpdatedInitial = (0, _extends2["default"])({}, records.tUpdated._raw);
          cUpdatedInitial = (0, _extends2["default"])({}, records.cUpdated._raw);
          _context13.next = 8;
          return (0, _index2.fetchLocalChanges)(database);
        case 8:
          localChanges = _context13.sent;
          pullChanges = /*#__PURE__*/function () {
            var _ref12 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee12() {
              return _regenerator["default"].wrap(function _callee12$(_context12) {
                while (1) switch (_context12.prev = _context12.next) {
                  case 0:
                    return _context12.abrupt("return", {
                      changes: (0, _helpers.makeChangeSet)({
                        mock_projects: {
                          created: [{
                            id: 'pCreated1',
                            name: 'remote'
                          }],
                          // error - update, stay synced
                          deleted: ['pUpdated', 'does_not_exist', 'pDeleted']
                        },
                        mock_tasks: {
                          updated: [{
                            id: 'tUpdated',
                            name: 'remote',
                            description: 'remote'
                          },
                          // just a conflict; stay updated
                          {
                            id: 'tDeleted',
                            body: 'remote'
                          } // ignore
                          ]
                        },
                        mock_comments: {
                          created: [{
                            id: 'cUpdated',
                            body: 'remote',
                            task_id: 'remote'
                          } // error - resolve and update (stay updated)
                          ]
                        }
                      }),
                      timestamp: 1500
                    });
                  case 1:
                  case "end":
                    return _context12.stop();
                }
              }, _callee12);
            }));
            return function pullChanges() {
              return _ref12.apply(this, arguments);
            };
          }();
          pushChanges = jest.fn();
          log = {};
          _context13.next = 14;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: pushChanges,
            log: log
          });
        case 14:
          expect(pushChanges).toHaveBeenCalledTimes(1);
          pushedChanges = pushChanges.mock.calls[0][0].changes;
          expect(pushedChanges).not.toEqual(localChanges.changes);
          _context13.t0 = expect(pushedChanges.mock_projects.created).not;
          _context13.next = 20;
          return (0, _helpers.getRaw)(projects, 'pCreated1');
        case 20:
          _context13.t1 = _context13.sent;
          _context13.t0.toContainEqual.call(_context13.t0, _context13.t1);
          expect(pushedChanges.mock_projects.deleted).not.toContain('pDeleted');
          _context13.t2 = _extends2["default"];
          _context13.t3 = {};
          _context13.next = 27;
          return (0, _helpers.getRaw)(tasks, 'tUpdated');
        case 27:
          _context13.t4 = _context13.sent;
          _context13.t5 = {
            _status: 'updated',
            _changed: 'name,position'
          };
          tUpdatedResolvedExpected = (0, _context13.t2)(_context13.t3, _context13.t4, _context13.t5);
          expect(pushedChanges.mock_tasks.updated).toContainEqual(tUpdatedResolvedExpected);
          expect(pushedChanges.mock_tasks.deleted).toContain('tDeleted');
          _context13.t6 = _extends2["default"];
          _context13.t7 = {};
          _context13.next = 36;
          return (0, _helpers.getRaw)(comments, 'cUpdated');
        case 36:
          _context13.t8 = _context13.sent;
          _context13.t9 = {
            _status: 'updated',
            _changed: 'updated_at,body'
          };
          cUpdatedResolvedExpected = (0, _context13.t6)(_context13.t7, _context13.t8, _context13.t9);
          expect(pushedChanges.mock_comments.updated).toContainEqual(cUpdatedResolvedExpected);
          _context13.next = 42;
          return (0, _helpers.expectSyncedAndMatches)(projects, 'pCreated1', {
            name: 'remote'
          });
        case 42:
          _context13.next = 44;
          return (0, _helpers.expectDoesNotExist)(projects, 'pUpdated');
        case 44:
          _context13.next = 46;
          return (0, _helpers.expectDoesNotExist)(projects, 'pDeleted');
        case 46:
          _context13.next = 48;
          return (0, _helpers.expectSyncedAndMatches)(tasks, 'tUpdated', {
            name: 'local',
            description: 'remote'
          });
        case 48:
          _context13.next = 50;
          return (0, _helpers.expectDoesNotExist)(tasks, 'tDeleted');
        case 50:
          _context13.next = 52;
          return (0, _helpers.expectSyncedAndMatches)(comments, 'cUpdated', {
            body: 'local',
            task_id: 'remote'
          });
        case 52:
          _context13.t10 = expect;
          _context13.next = 55;
          return (0, _index2.fetchLocalChanges)(database);
        case 55:
          _context13.t11 = _context13.sent;
          (0, _context13.t10)(_context13.t11).toEqual(_helpers.emptyLocalChanges);
          // check that log is good
          expect(log.remoteChangeCount).toBe(7);
          expect(log.resolvedConflicts).toEqual([{
            local: tUpdatedInitial,
            remote: {
              id: 'tUpdated',
              name: 'remote',
              description: 'remote'
            },
            resolved: tUpdatedResolvedExpected
          }, {
            local: cUpdatedInitial,
            remote: {
              id: 'cUpdated',
              body: 'remote',
              task_id: 'remote'
            },
            resolved: cUpdatedResolvedExpected
          }]);
        case 59:
        case "end":
          return _context13.stop();
      }
    }, _callee13);
  })));
  it("allows conflict resolution to be customized", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee16() {
    var _makeDatabase9, database, projects, tasks, conflictResolver, pullChanges;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          _makeDatabase9 = (0, _helpers.makeDatabase)(), database = _makeDatabase9.database, projects = _makeDatabase9.projects, tasks = _makeDatabase9.tasks;
          _context16.next = 3;
          return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee14() {
            return _regenerator["default"].wrap(function _callee14$(_context14) {
              while (1) switch (_context14.prev = _context14.next) {
                case 0:
                  _context14.next = 2;
                  return database.batch((0, _helpers.prepareCreateFromRaw)(projects, {
                    id: 'p1',
                    _status: 'synced',
                    name: 'local'
                  }), (0, _helpers.prepareCreateFromRaw)(projects, {
                    id: 'p2',
                    _status: 'created',
                    name: 'local'
                  }), (0, _helpers.prepareCreateFromRaw)(tasks, {
                    id: 't1',
                    _status: 'synced'
                  }), (0, _helpers.prepareCreateFromRaw)(tasks, {
                    id: 't2',
                    _status: 'created'
                  }), (0, _helpers.prepareCreateFromRaw)(tasks, {
                    id: 't3',
                    _status: 'updated',
                    name: 'local',
                    _changd: 'name'
                  }));
                case 2:
                case "end":
                  return _context14.stop();
              }
            }, _callee14);
          })));
        case 3:
          conflictResolver = jest.fn(function (table, local, remote, resolved) {
            if (table === 'mock_tasks') {
              resolved.name = 'GOTCHA';
            }
            return resolved;
          });
          pullChanges = /*#__PURE__*/function () {
            var _ref15 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee15() {
              return _regenerator["default"].wrap(function _callee15$(_context15) {
                while (1) switch (_context15.prev = _context15.next) {
                  case 0:
                    return _context15.abrupt("return", {
                      changes: (0, _helpers.makeChangeSet)({
                        mock_projects: {
                          created: [{
                            id: 'p2',
                            name: 'remote'
                          }],
                          // error - update, stay synced
                          updated: [{
                            id: 'p1',
                            name: 'change'
                          }] // update
                        },
                        mock_tasks: {
                          updated: [{
                            id: 't1',
                            name: 'remote'
                          },
                          // update
                          {
                            id: 't3',
                            name: 'remote'
                          } // conflict
                          ]
                        }
                      }),
                      timestamp: 1500
                    });
                  case 1:
                  case "end":
                    return _context15.stop();
                }
              }, _callee15);
            }));
            return function pullChanges() {
              return _ref15.apply(this, arguments);
            };
          }();
          _context16.next = 7;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: jest.fn(),
            conflictResolver: conflictResolver
          });
        case 7:
          expect(conflictResolver).toHaveBeenCalledTimes(4);
          expect(conflictResolver.mock.calls[0]).toMatchObject(['mock_projects', {
            id: 'p2',
            _status: 'created',
            name: 'local'
          }, {
            name: 'remote'
          }, {
            name: 'remote'
          }]);
          expect(conflictResolver.mock.calls[1]).toMatchObject(['mock_projects', {
            id: 'p1',
            _status: 'synced'
          }, {
            name: 'change'
          }, {
            _status: 'synced'
          }]);
          expect(conflictResolver.mock.results[1].value).toBe(conflictResolver.mock.calls[1][3]);
          expect(conflictResolver.mock.calls[2]).toMatchObject(['mock_tasks', {
            id: 't1',
            _status: 'synced',
            name: ''
          }, {
            name: 'remote'
          }, {
            name: 'GOTCHA'
          } // we're mutating this arg in function, that's why
          ]);
          _context16.next = 14;
          return (0, _helpers.expectSyncedAndMatches)(tasks, 't1', {
            name: 'GOTCHA'
          });
        case 14:
          _context16.next = 16;
          return (0, _helpers.expectSyncedAndMatches)(tasks, 't3', {
            name: 'GOTCHA'
          });
        case 16:
          _context16.t0 = expect;
          _context16.next = 19;
          return (0, _index2.fetchLocalChanges)(database);
        case 19:
          _context16.t1 = _context16.sent;
          (0, _context16.t0)(_context16.t1).toEqual(_helpers.emptyLocalChanges);
        case 21:
        case "end":
          return _context16.stop();
      }
    }, _callee16);
  })));
  it('remembers last_synced_at timestamp', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee17() {
    var _makeDatabase10, database, pullChanges, log;
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          _makeDatabase10 = (0, _helpers.makeDatabase)(), database = _makeDatabase10.database;
          pullChanges = jest.fn((0, _helpers.emptyPull)(1500));
          _context17.next = 4;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: jest.fn()
          });
        case 4:
          expect(pullChanges).toHaveBeenCalledWith({
            lastPulledAt: null,
            schemaVersion: 1,
            migration: null
          });
          pullChanges = jest.fn((0, _helpers.emptyPull)(2500));
          log = {};
          _context17.next = 9;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: jest.fn(),
            log: log
          });
        case 9:
          expect(pullChanges).toHaveBeenCalledTimes(1);
          expect(pullChanges).toHaveBeenCalledWith({
            lastPulledAt: 1500,
            schemaVersion: 1,
            migration: null
          });
          _context17.t0 = expect;
          _context17.next = 14;
          return (0, _index2.getLastPulledAt)(database);
        case 14:
          _context17.t1 = _context17.sent;
          (0, _context17.t0)(_context17.t1).toBe(2500);
          expect(log.lastPulledAt).toBe(1500);
          expect(log.newLastPulledAt).toBe(2500);
          // check underlying database since it's an implicit API
          _context17.t2 = expect;
          _context17.next = 21;
          return database.adapter.getLocal('__watermelon_last_pulled_at');
        case 21:
          _context17.t3 = _context17.sent;
          (0, _context17.t2)(_context17.t3).toBe('2500');
        case 23:
        case "end":
          return _context17.stop();
      }
    }, _callee17);
  })));
  it("validates timestamp returned from pullChanges", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee18() {
    var _makeDatabase11, database;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          _makeDatabase11 = (0, _helpers.makeDatabase)(), database = _makeDatabase11.database;
          _context18.next = 3;
          return (0, _utils.expectToRejectWithMessage)((0, _index.synchronize)({
            database: database,
            pullChanges: jest.fn((0, _helpers.emptyPull)(0)),
            pushChanges: jest.fn()
          }), /pullChanges\(\) returned invalid timestamp/);
        case 3:
        case "end":
          return _context18.stop();
      }
    }, _callee18);
  })));
  it('can recover from pull failure', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee19() {
    var _makeDatabase12, database, observer, error, pullChanges, pushChanges, log, sync;
    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) switch (_context19.prev = _context19.next) {
        case 0:
          _makeDatabase12 = (0, _helpers.makeDatabase)(), database = _makeDatabase12.database; // make change to make sure pushChagnes isn't called because of pull failure and not lack of changes
          _context19.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          observer = observeDatabase(database);
          error = new Error('pull-fail');
          pullChanges = jest.fn(function () {
            return Promise.reject(error);
          });
          pushChanges = jest.fn();
          log = {};
          _context19.next = 10;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: pushChanges,
            log: log
          })["catch"](function (e) {
            return e;
          });
        case 10:
          sync = _context19.sent;
          expect(observer).toHaveBeenCalledTimes(0);
          expect(pullChanges).toHaveBeenCalledTimes(1);
          expect(pushChanges).toHaveBeenCalledTimes(0);
          expect(sync).toMatchObject({
            message: 'pull-fail'
          });
          _context19.t0 = expect;
          _context19.next = 18;
          return (0, _index2.getLastPulledAt)(database);
        case 18:
          _context19.t1 = _context19.sent;
          (0, _context19.t0)(_context19.t1).toBe(null);
          expect(log.phase).toBe('ready to pull');
          expect(log.error).toBe(error);
        case 22:
        case "end":
          return _context19.stop();
      }
    }, _callee19);
  })));
  it('can recover from push failure', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee21() {
    var _makeDatabase13, database, projects, localChanges, observer, pullChanges, pushChanges, sync;
    return _regenerator["default"].wrap(function _callee21$(_context21) {
      while (1) switch (_context21.prev = _context21.next) {
        case 0:
          _makeDatabase13 = (0, _helpers.makeDatabase)(), database = _makeDatabase13.database, projects = _makeDatabase13.projects;
          _context21.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _context21.next = 5;
          return (0, _index2.fetchLocalChanges)(database);
        case 5:
          localChanges = _context21.sent;
          observer = observeDatabase(database);
          pullChanges = /*#__PURE__*/function () {
            var _ref20 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee20() {
              return _regenerator["default"].wrap(function _callee20$(_context20) {
                while (1) switch (_context20.prev = _context20.next) {
                  case 0:
                    return _context20.abrupt("return", {
                      changes: (0, _helpers.makeChangeSet)({
                        mock_projects: {
                          created: [{
                            id: 'new_project',
                            name: 'remote'
                          }]
                        }
                      }),
                      timestamp: 1500
                    });
                  case 1:
                  case "end":
                    return _context20.stop();
                }
              }, _callee20);
            }));
            return function pullChanges() {
              return _ref20.apply(this, arguments);
            };
          }();
          pushChanges = jest.fn(function () {
            return Promise.reject(new Error('push-fail'));
          });
          _context21.next = 11;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: pushChanges
          })["catch"](function (e) {
            return e;
          });
        case 11:
          sync = _context21.sent;
          // full sync failed - local changes still awaiting sync
          expect(pushChanges).toHaveBeenCalledWith({
            changes: localChanges.changes,
            lastPulledAt: 1500
          });
          expect(sync).toMatchObject({
            message: 'push-fail'
          });
          _context21.t0 = expect;
          _context21.next = 17;
          return (0, _index2.fetchLocalChanges)(database);
        case 17:
          _context21.t1 = _context21.sent;
          (0, _context21.t0)(_context21.t1).toEqual(localChanges);
          _context21.t2 = expect;
          _context21.next = 22;
          return (0, _index2.getLastPulledAt)(database);
        case 22:
          _context21.t3 = _context21.sent;
          (0, _context21.t2)(_context21.t3).toBe(1500);
          expect(observer).toHaveBeenCalledTimes(1);
          _context21.next = 27;
          return (0, _helpers.expectSyncedAndMatches)(projects, 'new_project', {
            name: 'remote'
          });
        case 27:
        case "end":
          return _context21.stop();
      }
    }, _callee21);
  })));
  it('can safely handle local changes during sync', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee26() {
    var _makeDatabase14, database, projects, localChanges, pullChanges, betweenFetchAndMarkAction, pushChanges, syncCompleted, sync, createProject, project3, project2, betweenApplyAndFetchAction, project1, beforeApplyAction, pushedChanges, expectedPushedChanges, localChanges2;
    return _regenerator["default"].wrap(function _callee26$(_context26) {
      while (1) switch (_context26.prev = _context26.next) {
        case 0:
          _makeDatabase14 = (0, _helpers.makeDatabase)(), database = _makeDatabase14.database, projects = _makeDatabase14.projects;
          _context26.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _context26.next = 5;
          return (0, _index2.fetchLocalChanges)(database);
        case 5:
          localChanges = _context26.sent;
          pullChanges = jest.fn(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee22() {
            return _regenerator["default"].wrap(function _callee22$(_context22) {
              while (1) switch (_context22.prev = _context22.next) {
                case 0:
                  return _context22.abrupt("return", {
                    changes: (0, _helpers.makeChangeSet)({
                      mock_projects: {
                        created: [{
                          id: 'new_project',
                          name: 'remote'
                        }]
                      }
                    }),
                    timestamp: 1500
                  });
                case 1:
                case "end":
                  return _context22.stop();
              }
            }, _callee22);
          })));
          pushChanges = jest.fn(function () {
            return betweenFetchAndMarkAction();
          } // this will run before push completes
          );
          syncCompleted = false;
          sync = (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: pushChanges
          }).then(function () {
            syncCompleted = true;
          });
          createProject = function createProject(name) {
            return projects.create(function (project) {
              project.name = name;
            });
          }; // run this between fetchLocalChanges and markLocalChangesAsSynced
          // (doesn't really matter if it's before or after pushChanges is called)
          betweenFetchAndMarkAction = jest.fn(function () {
            return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee23() {
              return _regenerator["default"].wrap(function _callee23$(_context23) {
                while (1) switch (_context23.prev = _context23.next) {
                  case 0:
                    _context23.next = 2;
                    return (0, _helpers.expectSyncedAndMatches)(projects, 'new_project', {});
                  case 2:
                    expect(syncCompleted).toBe(false);
                    _context23.next = 5;
                    return createProject('project3');
                  case 5:
                    project3 = _context23.sent;
                  case 6:
                  case "end":
                    return _context23.stop();
                }
              }, _callee23);
            })), 'betweenFetchAndMarkAction');
          });

          // run this between applyRemoteChanges and fetchLocalChanges
          betweenApplyAndFetchAction = jest.fn(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee24() {
            return _regenerator["default"].wrap(function _callee24$(_context24) {
              while (1) switch (_context24.prev = _context24.next) {
                case 0:
                  _context24.next = 2;
                  return (0, _helpers.expectSyncedAndMatches)(projects, 'new_project', {});
                case 2:
                  expect(pushChanges).toHaveBeenCalledTimes(0);
                  _context24.next = 5;
                  return createProject('project2');
                case 5:
                  project2 = _context24.sent._raw;
                case 6:
                case "end":
                  return _context24.stop();
              }
            }, _callee24);
          }))); // run this before applyRemoteChanges
          beforeApplyAction = jest.fn(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee25() {
            return _regenerator["default"].wrap(function _callee25$(_context25) {
              while (1) switch (_context25.prev = _context25.next) {
                case 0:
                  _context25.next = 2;
                  return (0, _helpers.expectDoesNotExist)(projects, 'new_project');
                case 2:
                  _context25.next = 4;
                  return createProject('project1');
                case 4:
                  project1 = _context25.sent._raw;
                  database.write(betweenApplyAndFetchAction, 'betweenApplyAndFetchAction');
                case 6:
                case "end":
                  return _context25.stop();
              }
            }, _callee25);
          })));
          database.write(beforeApplyAction, 'beforeApplyAction');

          // we sync successfully and have received an object
          _context26.next = 17;
          return sync;
        case 17:
          expect(beforeApplyAction).toHaveBeenCalledTimes(1);
          expect(betweenApplyAndFetchAction).toHaveBeenCalledTimes(1);
          expect(betweenFetchAndMarkAction).toHaveBeenCalledTimes(1);
          _context26.next = 22;
          return (0, _helpers.expectSyncedAndMatches)(projects, 'new_project', {});
        case 22:
          // Expect project1, project2 to have been pushed
          pushedChanges = pushChanges.mock.calls[0][0].changes;
          expect(pushedChanges).not.toEqual(localChanges.changes);
          expectedPushedChanges = (0, _lodash["default"])(localChanges.changes);
          expectedPushedChanges.mock_projects.created = [project2, project1].concat((0, _toConsumableArray2["default"])(expectedPushedChanges.mock_projects.created));
          expect(pushedChanges).toEqual(expectedPushedChanges);

          // Expect project3 to still need pushing
          _context26.next = 29;
          return (0, _index2.fetchLocalChanges)(database);
        case 29:
          localChanges2 = _context26.sent;
          expect(localChanges2).not.toEqual(_helpers.emptyLocalChanges);
          _context26.t0 = expect;
          _context26.next = 34;
          return (0, _index.hasUnsyncedChanges)({
            database: database
          });
        case 34:
          _context26.t1 = _context26.sent;
          (0, _context26.t0)(_context26.t1).toBe(true);
          expect(localChanges2).toEqual({
            changes: (0, _helpers.makeChangeSet)({
              mock_projects: {
                created: [project3._raw]
              }
            }),
            affectedRecords: [project3]
          });
        case 37:
        case "end":
          return _context26.stop();
      }
    }, _callee26);
  })));
  it("can safely update created records during push (regression test)", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee28() {
    var _makeDatabase15, database, tasks, task, initialRaw;
    return _regenerator["default"].wrap(function _callee28$(_context28) {
      while (1) switch (_context28.prev = _context28.next) {
        case 0:
          _makeDatabase15 = (0, _helpers.makeDatabase)(), database = _makeDatabase15.database, tasks = _makeDatabase15.tasks;
          task = tasks.prepareCreateFromDirtyRaw({
            id: 't1',
            name: 'Task name',
            position: 1,
            is_completed: false,
            project_id: 'p1'
          });
          _context28.next = 4;
          return database.write(function () {
            return database.batch(task);
          });
        case 4:
          initialRaw = (0, _extends2["default"])({}, task._raw);
          expect(task._raw).toMatchObject({
            _status: 'created',
            _changed: '',
            position: 1,
            is_completed: false
          });
          _context28.next = 8;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: (0, _helpers.emptyPull)(1000),
            pushChanges: function () {
              var _pushChanges = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee27() {
                return _regenerator["default"].wrap(function _callee27$(_context27) {
                  while (1) switch (_context27.prev = _context27.next) {
                    case 0:
                      _context27.next = 2;
                      return database.write(function () {
                        return task.update(function () {
                          task.isCompleted = true;
                          task.position = 20;
                        });
                      });
                    case 2:
                    case "end":
                      return _context27.stop();
                  }
                }, _callee27);
              }));
              function pushChanges() {
                return _pushChanges.apply(this, arguments);
              }
              return pushChanges;
            }()
          });
        case 8:
          expect(task._raw).toMatchObject({
            _status: 'created',
            _changed: 'is_completed,position',
            position: 20,
            is_completed: true
          });
          _context28.next = 11;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: function pullChanges() {
              return {
                changes: (0, _helpers.makeChangeSet)({
                  mock_tasks: {
                    // backend serves the pushed record back
                    updated: [(0, _rambdax.omit)(['_changed', '_status'], initialRaw)]
                  }
                }),
                timestamp: 1500
              };
            },
            pushChanges: function pushChanges() {
              expect(task._raw).toMatchObject({
                _status: 'created',
                _changed: 'is_completed,position'
              });
            }
          });
        case 11:
          expect(task._raw).toMatchObject({
            _status: 'synced',
            _changed: '',
            position: 20,
            is_completed: true
          });
        case 12:
        case "end":
          return _context28.stop();
      }
    }, _callee28);
  })));
  it.skip("can accept remote changes received during push", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee29() {
    return _regenerator["default"].wrap(function _callee29$(_context29) {
      while (1) switch (_context29.prev = _context29.next) {
        case 0:
        case "end":
          return _context29.stop();
      }
    }, _callee29);
  })));
  it.skip("can resolve push-time sync conflicts", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee30() {
    return _regenerator["default"].wrap(function _callee30$(_context30) {
      while (1) switch (_context30.prev = _context30.next) {
        case 0:
        case "end":
          return _context30.stop();
      }
    }, _callee30);
  })));
  it.skip("only emits one collection batch change", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee31() {
    return _regenerator["default"].wrap(function _callee31$(_context31) {
      while (1) switch (_context31.prev = _context31.next) {
        case 0:
        case "end":
          return _context31.stop();
      }
    }, _callee31);
  })));
});