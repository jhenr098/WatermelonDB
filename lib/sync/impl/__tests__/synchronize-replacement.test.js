"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _utils = require("../../../__tests__/utils");
var _helpers = require("./helpers");
var _index = require("../../index");
describe('synchronize - replacement syncs', function () {
  it('can synchronize using replacement strategy', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _makeDatabase, database, projects, tasks, comments, pullChanges, pushChanges, log;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _makeDatabase = (0, _helpers.makeDatabase)(), database = _makeDatabase.database, projects = _makeDatabase.projects, tasks = _makeDatabase.tasks, comments = _makeDatabase.comments;
          _context2.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          pullChanges = /*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
              return _regenerator["default"].wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt("return", {
                      changes: (0, _helpers.makeChangeSet)({
                        mock_projects: {
                          updated: [
                          // no changes, keep
                          {
                            id: 'pSynced'
                          }]
                        },
                        mock_tasks: {
                          updated: [
                          // update
                          {
                            id: 'tSynced',
                            name: 'remote',
                            description: 'remote'
                          },
                          // create
                          {
                            id: 'new_task',
                            name: 'remote'
                          }]
                        }
                      }),
                      timestamp: 1500,
                      experimentalStrategy: 'replacement'
                    });
                  case 1:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function pullChanges() {
              return _ref2.apply(this, arguments);
            };
          }();
          pushChanges = jest.fn();
          log = {};
          _context2.next = 8;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: pushChanges,
            sendCreatedAsUpdated: true,
            log: log
          });
        case 8:
          _context2.t0 = expect;
          _context2.next = 11;
          return (0, _helpers.getRaw)(tasks, 'tSynced');
        case 11:
          _context2.t1 = _context2.sent;
          (0, _context2.t0)(_context2.t1).toMatchObject({
            _status: 'synced',
            _changed: '',
            name: 'remote'
          });
          _context2.t2 = expect;
          _context2.next = 16;
          return (0, _helpers.countAll)([projects, tasks, comments]);
        case 16:
          _context2.t3 = _context2.sent;
          (0, _context2.t2)(_context2.t3).toBe(3 + 4);
          _context2.t4 = expect;
          _context2.next = 21;
          return (0, _helpers.allDeletedRecords)([projects, tasks, comments]);
        case 21:
          _context2.t5 = _context2.sent;
          (0, _context2.t4)(_context2.t5).toEqual([]);
          // expect 4 created records to be sent
          expect(pushChanges).toHaveBeenCalledTimes(1);
          expect(log.localChangeCount).toBe(4);
        case 25:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  it("fails on incorrect strategy", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var _makeDatabase2, database, check;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _makeDatabase2 = (0, _helpers.makeDatabase)(), database = _makeDatabase2.database;
          check = function check(strategy) {
            return (0, _utils.expectToRejectWithMessage)((0, _index.synchronize)({
              database: database,
              pullChanges: function () {
                var _pullChanges = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
                  return _regenerator["default"].wrap(function _callee3$(_context3) {
                    while (1) switch (_context3.prev = _context3.next) {
                      case 0:
                        return _context3.abrupt("return", {
                          changes: _helpers.emptyChangeSet,
                          timestamp: 1500,
                          experimentalStrategy: strategy
                        });
                      case 1:
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
              pushChanges: jest.fn()
            }), 'Invalid pull strategy');
          };
          _context4.next = 4;
          return check('bad');
        case 4:
          _context4.next = 6;
          return check({
            "default": 'bad',
            override: {}
          });
        case 6:
          _context4.next = 8;
          return check({
            "default": 'incremental',
            override: {
              mock_projects: 'bad'
            }
          });
        case 8:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
});