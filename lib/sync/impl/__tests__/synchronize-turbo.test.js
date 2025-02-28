"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _utils = require("../../../__tests__/utils");
var _helpers = require("./helpers");
var _index = require("../../index");
var _index2 = require("../index");
describe('synchronize - turbo', function () {
  it("validates turbo sync settings", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _makeDatabase, database;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _makeDatabase = (0, _helpers.makeDatabase)(), database = _makeDatabase.database;
          _context.next = 3;
          return (0, _utils.expectToRejectWithMessage)((0, _index.synchronize)({
            database: database,
            pullChanges: function pullChanges() {
              return {
                syncJson: '{}'
              };
            },
            unsafeTurbo: true,
            _unsafeBatchPerCollection: true
          }), 'unsafeTurbo must not be used with _unsafeBatchPerCollection');
        case 3:
          _context.next = 5;
          return (0, _utils.expectToRejectWithMessage)((0, _index.synchronize)({
            database: database,
            pullChanges: function pullChanges() {
              return {};
            },
            unsafeTurbo: true
          }), 'missing syncJson/syncJsonId');
        case 5:
          _context.next = 7;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: (0, _helpers.emptyPull)()
          });
        case 7:
          _context.next = 9;
          return (0, _utils.expectToRejectWithMessage)((0, _index.synchronize)({
            database: database,
            pullChanges: function pullChanges() {
              return {
                syncJson: '{} '
              };
            },
            unsafeTurbo: true
          }), 'unsafeTurbo can only be used as the first sync');
        case 9:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  it("can pull with turbo login", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _makeDatabase2, database, adapter, json, log, jsonId;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _makeDatabase2 = (0, _helpers.makeDatabase)(), database = _makeDatabase2.database, adapter = _makeDatabase2.adapter; // FIXME: Test on real native db instead of mocking
          adapter.provideSyncJson = jest.fn().mockImplementationOnce(function (id, json, callback) {
            return callback({
              value: true
            });
          });
          adapter.unsafeLoadFromSync = jest.fn().mockImplementationOnce(function (id, callback) {
            return callback({
              value: {
                timestamp: 1011
              }
            });
          });
          json = '{ hello! }';
          log = {};
          _context2.next = 7;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: function pullChanges() {
              return {
                syncJson: json
              };
            },
            unsafeTurbo: true,
            log: log
          });
        case 7:
          _context2.t0 = expect;
          _context2.next = 10;
          return (0, _index2.getLastPulledAt)(database);
        case 10:
          _context2.t1 = _context2.sent;
          (0, _context2.t0)(_context2.t1).toBe(1011);
          expect(log.lastPulledAt).toBe(null);
          expect(log.newLastPulledAt).toBe(1011);
          expect(adapter.provideSyncJson.mock.calls.length).toBe(1);
          jsonId = adapter.provideSyncJson.mock.calls[0][0];
          expect((0, _typeof2["default"])(jsonId)).toBe('number');
          expect(adapter.provideSyncJson.mock.calls[0][1]).toBe(json);
          expect(adapter.unsafeLoadFromSync.mock.calls.length).toBe(1);
          expect(adapter.unsafeLoadFromSync.mock.calls[0][0]).toBe(jsonId);
        case 20:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  it("can pull with turbo login (using native id)", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var _makeDatabase3, database, adapter, log;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _makeDatabase3 = (0, _helpers.makeDatabase)(), database = _makeDatabase3.database, adapter = _makeDatabase3.adapter; // FIXME: Test on real native db instead of mocking
          adapter.provideSyncJson = jest.fn();
          adapter.unsafeLoadFromSync = jest.fn().mockImplementationOnce(function (id, callback) {
            return callback({
              value: {
                timestamp: 1012
              }
            });
          });
          log = {};
          _context3.next = 6;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: function pullChanges() {
              return {
                syncJsonId: 2137
              };
            },
            unsafeTurbo: true,
            log: log
          });
        case 6:
          _context3.t0 = expect;
          _context3.next = 9;
          return (0, _index2.getLastPulledAt)(database);
        case 9:
          _context3.t1 = _context3.sent;
          (0, _context3.t0)(_context3.t1).toBe(1012);
          expect(log.lastPulledAt).toBe(null);
          expect(log.newLastPulledAt).toBe(1012);
          expect(adapter.provideSyncJson.mock.calls.length).toBe(0);
          expect(adapter.unsafeLoadFromSync.mock.calls.length).toBe(1);
          expect(adapter.unsafeLoadFromSync.mock.calls[0][0]).toBe(2137);
        case 16:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
  describe('onDidPullChanges', function () {
    it("calls onDidPullChanges", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var _makeDatabase4, database, onDidPullChanges;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _makeDatabase4 = (0, _helpers.makeDatabase)(), database = _makeDatabase4.database;
            onDidPullChanges = jest.fn();
            _context4.next = 4;
            return (0, _index.synchronize)({
              database: database,
              pullChanges: function pullChanges() {
                return {
                  changes: {},
                  timestamp: 1000,
                  hello: 'hi'
                };
              },
              onDidPullChanges: onDidPullChanges
            });
          case 4:
            expect(onDidPullChanges).toHaveBeenCalledTimes(1);
            expect(onDidPullChanges).toHaveBeenCalledWith({
              timestamp: 1000,
              hello: 'hi'
            });
          case 6:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    })));
    it("calls onDidPullChanges in turbo", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var _makeDatabase5, database, adapter, onDidPullChanges;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _makeDatabase5 = (0, _helpers.makeDatabase)(), database = _makeDatabase5.database, adapter = _makeDatabase5.adapter; // FIXME: Test on real native db instead of mocking
            adapter.unsafeLoadFromSync = jest.fn().mockImplementationOnce(function (id, callback) {
              return callback({
                value: {
                  timestamp: 1000,
                  hello: 'hi'
                }
              });
            });
            onDidPullChanges = jest.fn();
            _context5.next = 5;
            return (0, _index.synchronize)({
              database: database,
              pullChanges: function pullChanges() {
                return {
                  syncJsonId: 0
                };
              },
              unsafeTurbo: true,
              onDidPullChanges: onDidPullChanges
            });
          case 5:
            expect(onDidPullChanges).toHaveBeenCalledTimes(1);
            expect(onDidPullChanges).toHaveBeenCalledWith({
              timestamp: 1000,
              hello: 'hi'
            });
          case 7:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    })));
  });
});