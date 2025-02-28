"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _rambdax = require("rambdax");
var _fp = require("../../../utils/fp");
var _common = require("../../../utils/common");
var _helpers = require("./helpers");
var _index = require("../../index");
var _index2 = require("../index");
describe('synchronize - benchmark', function () {
  it('can synchronize lots of data', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var _makeDatabase, database, projects, tasks, comments, sample, pullChanges, pushChanges, pushedChanges, pushedCounts;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _makeDatabase = (0, _helpers.makeDatabase)(), database = _makeDatabase.database, projects = _makeDatabase.projects, tasks = _makeDatabase.tasks, comments = _makeDatabase.comments; // TODO: This is kinda useless right now, but would make a great fuzz test or a benchmark
          // local changes
          sample = 500;
          _context3.next = 4;
          return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
            var createdProjects, updatedTasks, deletedComments;
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  createdProjects = (0, _rambdax.times)(function () {
                    return projects.prepareCreate(_fp.noop);
                  }, sample);
                  updatedTasks = (0, _rambdax.times)(function () {
                    return (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: (0, _common.randomId)()
                    });
                  }, sample);
                  deletedComments = (0, _rambdax.times)(function () {
                    return (0, _helpers.prepareCreateFromRaw)(comments, {
                      id: (0, _common.randomId)()
                    });
                  }, sample);
                  _context.next = 5;
                  return database.batch.apply(database, (0, _toConsumableArray2["default"])(createdProjects).concat((0, _toConsumableArray2["default"])(updatedTasks), (0, _toConsumableArray2["default"])(deletedComments)));
                case 5:
                  _context.next = 7;
                  return database.batch.apply(database, (0, _toConsumableArray2["default"])(updatedTasks.map(function (task) {
                    return task.prepareUpdate(function () {
                      task.name = 'x';
                    });
                  })));
                case 7:
                  _context.next = 9;
                  return database.batch.apply(database, (0, _toConsumableArray2["default"])(deletedComments.map(function (comment) {
                    return comment.prepareMarkAsDeleted();
                  })));
                case 9:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          })));
        case 4:
          // remote changes
          pullChanges = jest.fn(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
            return _regenerator["default"].wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  return _context2.abrupt("return", {
                    changes: (0, _helpers.makeChangeSet)({
                      mock_projects: {
                        deleted: (0, _rambdax.times)(function () {
                          return (0, _common.randomId)();
                        }, sample)
                      },
                      mock_tasks: {
                        created: (0, _rambdax.times)(function () {
                          return {
                            id: (0, _common.randomId)()
                          };
                        }, sample)
                      }
                    }),
                    timestamp: 1500
                  });
                case 1:
                case "end":
                  return _context2.stop();
              }
            }, _callee2);
          })));
          pushChanges = jest.fn(); // check
          // TODO: Remove the flag -- temporarily taking over this test to test _unsafeBatchPerCollection
          _context3.next = 8;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: pushChanges,
            _unsafeBatchPerCollection: true
          });
        case 8:
          _context3.t0 = expect;
          _context3.next = 11;
          return projects.query().fetchCount();
        case 11:
          _context3.t1 = _context3.sent;
          (0, _context3.t0)(_context3.t1).toBe(sample);
          _context3.t2 = expect;
          _context3.next = 16;
          return tasks.query().fetchCount();
        case 16:
          _context3.t3 = _context3.sent;
          (0, _context3.t2)(_context3.t3).toBe(sample + sample);
          _context3.t4 = expect;
          _context3.next = 21;
          return comments.query().fetchCount();
        case 21:
          _context3.t5 = _context3.sent;
          (0, _context3.t4)(_context3.t5).toBe(0);
          _context3.t6 = expect;
          _context3.next = 26;
          return (0, _index2.fetchLocalChanges)(database);
        case 26:
          _context3.t7 = _context3.sent;
          (0, _context3.t6)(_context3.t7).toEqual(_helpers.emptyLocalChanges);
          _context3.t8 = expect;
          _context3.next = 31;
          return (0, _index.hasUnsyncedChanges)({
            database: database
          });
        case 31:
          _context3.t9 = _context3.sent;
          (0, _context3.t8)(_context3.t9).toBe(false);
          pushedChanges = pushChanges.mock.calls[0][0].changes;
          pushedCounts = (0, _rambdax.map)((0, _rambdax.map)(_rambdax.length), pushedChanges);
          expect(pushedCounts).toEqual({
            mock_projects: {
              created: sample,
              updated: 0,
              deleted: 0
            },
            mock_project_sections: {
              created: 0,
              updated: 0,
              deleted: 0
            },
            mock_tasks: {
              created: 0,
              updated: sample,
              deleted: 0
            },
            mock_comments: {
              created: 0,
              updated: 0,
              deleted: sample
            }
          });
        case 36:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
  it("can run a large replacement sync", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var _makeDatabase2, database, tasks, sample, unchanged, modified, deleted;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _makeDatabase2 = (0, _helpers.makeDatabase)(), database = _makeDatabase2.database, tasks = _makeDatabase2.tasks;
          sample = 500;
          unchanged = (0, _rambdax.times)(function () {
            return {
              id: (0, _common.randomId)()
            };
          }, sample);
          modified = (0, _rambdax.times)(function () {
            return {
              id: (0, _common.randomId)()
            };
          }, sample);
          deleted = (0, _rambdax.times)(function () {
            return {
              id: (0, _common.randomId)()
            };
          }, sample); // create local changes
          _context6.next = 7;
          return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
            return _regenerator["default"].wrap(function _callee4$(_context4) {
              while (1) switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return database.batch.apply(database, (0, _toConsumableArray2["default"])(unchanged.map(function (raw) {
                    return (0, _helpers.prepareCreateFromRaw)(tasks, raw);
                  })).concat((0, _toConsumableArray2["default"])(modified.map(function (raw) {
                    return (0, _helpers.prepareCreateFromRaw)(tasks, (0, _extends2["default"])({}, raw, {
                      _status: 'updated',
                      _changed: 'name',
                      name: 'local',
                      description: 'orig'
                    }));
                  })), (0, _toConsumableArray2["default"])(deleted.map(function (raw) {
                    return (0, _helpers.prepareCreateFromRaw)(tasks, raw);
                  }))));
                case 2:
                case "end":
                  return _context4.stop();
              }
            }, _callee4);
          })));
        case 7:
          _context6.t0 = expect;
          _context6.next = 10;
          return (0, _helpers.countAll)([tasks]);
        case 10:
          _context6.t1 = _context6.sent;
          (0, _context6.t0)(_context6.t1).toBe(3 * sample);
          _context6.next = 14;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: function () {
              var _pullChanges = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) switch (_context5.prev = _context5.next) {
                    case 0:
                      return _context5.abrupt("return", {
                        changes: (0, _helpers.makeChangeSet)({
                          mock_tasks: {
                            updated: [].concat((0, _toConsumableArray2["default"])(unchanged), (0, _toConsumableArray2["default"])(modified.map(function (raw) {
                              return (0, _extends2["default"])({}, raw, {
                                name: 'remote',
                                description: 'remote'
                              });
                            })))
                          }
                        }),
                        timestamp: 1500,
                        experimentalStrategy: 'replacement'
                      });
                    case 1:
                    case "end":
                      return _context5.stop();
                  }
                }, _callee5);
              }));
              function pullChanges() {
                return _pullChanges.apply(this, arguments);
              }
              return pullChanges;
            }(),
            pushChanges: jest.fn()
          });
        case 14:
          _context6.t2 = expect;
          _context6.next = 17;
          return (0, _helpers.countAll)([tasks]);
        case 17:
          _context6.t3 = _context6.sent;
          (0, _context6.t2)(_context6.t3).toBe(2 * sample);
          _context6.t4 = expect;
          _context6.next = 22;
          return (0, _helpers.getRaw)(tasks, modified[0].id);
        case 22:
          _context6.t5 = _context6.sent;
          (0, _context6.t4)(_context6.t5).toMatchObject({
            _status: 'synced',
            name: 'local',
            description: 'remote'
          });
        case 24:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  })));
});