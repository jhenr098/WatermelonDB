"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _helpers = require("./helpers");
var _index = require("../../index");
var _index2 = require("../index");
describe('synchronize - partial push rejections', function () {
  it("can partially reject a push", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _makeDatabase, database, _yield$makeLocalChang, tCreated, tUpdated, rejectedIds, log;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _makeDatabase = (0, _helpers.makeDatabase)(), database = _makeDatabase.database;
          _context.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _yield$makeLocalChang = _context.sent;
          tCreated = _yield$makeLocalChang.tCreated;
          tUpdated = _yield$makeLocalChang.tUpdated;
          rejectedIds = Object.freeze({
            mock_tasks: ['tCreated', 'tUpdated'],
            mock_comments: ['cDeleted']
          });
          log = {};
          _context.next = 10;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: jest.fn((0, _helpers.emptyPull)()),
            pushChanges: jest.fn(function () {
              return {
                experimentalRejectedIds: rejectedIds
              };
            }),
            log: log
          });
        case 10:
          _context.t0 = expect;
          _context.next = 13;
          return (0, _index2.fetchLocalChanges)(database);
        case 13:
          _context.t1 = _context.sent.changes;
          (0, _context.t0)(_context.t1).toEqual((0, _helpers.makeChangeSet)({
            mock_tasks: {
              created: [tCreated._raw],
              updated: [tUpdated._raw]
            },
            mock_comments: {
              deleted: ['cDeleted']
            }
          }));
          expect(log.rejectedIds).toBe(rejectedIds);
        case 16:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  it("can partially reject a push and make changes during push", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var _makeDatabase2, database, comments, _yield$makeLocalChang2, pCreated1, tUpdated, pCreated1Raw, newComment;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _makeDatabase2 = (0, _helpers.makeDatabase)(), database = _makeDatabase2.database, comments = _makeDatabase2.comments;
          _context4.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _yield$makeLocalChang2 = _context4.sent;
          pCreated1 = _yield$makeLocalChang2.pCreated1;
          tUpdated = _yield$makeLocalChang2.tUpdated;
          pCreated1Raw = (0, _extends2["default"])({}, pCreated1._raw);
          _context4.next = 9;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: jest.fn((0, _helpers.emptyPull)()),
            pushChanges: jest.fn(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
              return _regenerator["default"].wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                      return _regenerator["default"].wrap(function _callee2$(_context2) {
                        while (1) switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return pCreated1.update(function (p) {
                              p.name = 'updated!';
                            });
                          case 2:
                            _context2.next = 4;
                            return comments.create(function (c) {
                              c.body = 'bazinga';
                            });
                          case 4:
                            newComment = _context2.sent;
                          case 5:
                          case "end":
                            return _context2.stop();
                        }
                      }, _callee2);
                    })));
                  case 2:
                    return _context3.abrupt("return", {
                      experimentalRejectedIds: {
                        mock_tasks: ['tUpdated'],
                        mock_comments: ['cDeleted']
                      }
                    });
                  case 3:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3);
            })))
          });
        case 9:
          _context4.t0 = expect;
          _context4.next = 12;
          return (0, _index2.fetchLocalChanges)(database);
        case 12:
          _context4.t1 = _context4.sent.changes;
          (0, _context4.t0)(_context4.t1).toEqual((0, _helpers.makeChangeSet)({
            mock_projects: {
              created: [(0, _extends2["default"])({}, pCreated1Raw, {
                _changed: 'name',
                name: 'updated!'
              })]
            },
            mock_tasks: {
              updated: [tUpdated._raw]
            },
            mock_comments: {
              created: [newComment._raw],
              deleted: ['cDeleted']
            }
          }));
        case 14:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
});