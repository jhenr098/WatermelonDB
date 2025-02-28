"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _utils = require("../../../__tests__/utils");
var _helpers = require("./helpers");
var _index = require("../../index");
var _index2 = require("../index");
describe('synchronize - aborts', function () {
  it('aborts on concurrent synchronization', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _makeDatabase, database, delayPromise, syncWithDelay, sync1, sync2;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _makeDatabase = (0, _helpers.makeDatabase)(), database = _makeDatabase.database;
          delayPromise = function delayPromise(delay) {
            return new Promise(function (resolve) {
              setTimeout(resolve, delay);
            });
          };
          syncWithDelay = function syncWithDelay(delay) {
            return (0, _index.synchronize)({
              database: database,
              pullChanges: function pullChanges() {
                return delayPromise(delay).then((0, _helpers.emptyPull)(delay));
              },
              pushChanges: jest.fn()
            });
          };
          sync1 = syncWithDelay(100);
          sync2 = syncWithDelay(300)["catch"](function (error) {
            return error;
          });
          _context.t0 = expect;
          _context.next = 8;
          return sync1;
        case 8:
          _context.t1 = _context.sent;
          (0, _context.t0)(_context.t1).toBe(undefined);
          _context.t2 = expect;
          _context.next = 13;
          return sync2;
        case 13:
          _context.t3 = _context.sent;
          (0, _context.t2)(_context.t3).toMatchObject({
            message: expect.stringMatching(/concurrent sync/i)
          });
          _context.t4 = expect;
          _context.next = 18;
          return (0, _index2.getLastPulledAt)(database);
        case 18:
          _context.t5 = _context.sent;
          (0, _context.t4)(_context.t5).toBe(100);
        case 20:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  it('aborts if database is cleared during sync', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var _makeDatabase2, database, projects, pushChanges;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _makeDatabase2 = (0, _helpers.makeDatabase)(), database = _makeDatabase2.database, projects = _makeDatabase2.projects;
          pushChanges = jest.fn();
          _context3.next = 4;
          return (0, _utils.expectToRejectWithMessage)((0, _index.synchronize)({
            database: database,
            pullChanges: jest.fn(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
              return _regenerator["default"].wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return database.write(function () {
                      return database.unsafeResetDatabase();
                    });
                  case 2:
                    return _context2.abrupt("return", {
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
                  case 3:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2);
            }))),
            pushChanges: pushChanges
          }), 'database was reset');
        case 4:
          _context3.next = 6;
          return (0, _utils.expectToRejectWithMessage)(projects.find('new_project'), 'not found');
        case 6:
          expect(pushChanges).not.toHaveBeenCalled();
        case 7:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
  it('aborts if database is cleared during sync — different case', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var _makeDatabase3, database, projects;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _makeDatabase3 = (0, _helpers.makeDatabase)(), database = _makeDatabase3.database, projects = _makeDatabase3.projects;
          _context4.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _context4.next = 5;
          return (0, _utils.expectToRejectWithMessage)((0, _index.synchronize)({
            database: database,
            pullChanges: function pullChanges() {
              return {
                changes: (0, _helpers.makeChangeSet)({
                  mock_projects: {
                    created: [{
                      id: 'new_project',
                      name: 'remote'
                    }]
                  }
                }),
                timestamp: 1500
              };
            },
            pushChanges: function pushChanges() {
              return database.write(function () {
                return database.unsafeResetDatabase();
              });
            }
          }), 'database was reset');
        case 5:
          _context4.next = 7;
          return (0, _utils.expectToRejectWithMessage)(projects.find('new_project'), 'not found');
        case 7:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
});