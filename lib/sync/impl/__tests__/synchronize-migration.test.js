"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _testModels = require("../../../__tests__/testModels");
var _utils = require("../../../__tests__/utils");
var _migrations = require("../../../Schema/migrations");
var _helpers = require("./helpers");
var _index = require("../../index");
var _index2 = require("../index");
describe('synchronize - migration syncs', function () {
  var testSchema10 = (0, _extends2["default"])({}, _testModels.testSchema, {
    version: 10
  });
  var migrations = (0, _migrations.schemaMigrations)({
    migrations: [{
      toVersion: 10,
      steps: [(0, _migrations.addColumns)({
        table: 'attachment_versions',
        columns: [{
          name: 'reactions',
          type: 'string'
        }]
      })]
    }, {
      toVersion: 9,
      steps: [(0, _migrations.createTable)({
        name: 'attachments',
        columns: [{
          name: 'parent_id',
          type: 'string',
          isIndexed: true
        }]
      })]
    }, {
      toVersion: 8,
      steps: []
    }]
  });
  it("remembers synced schema version on first sync", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _mockDatabase, database, pullChanges;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _mockDatabase = (0, _testModels.mockDatabase)({
            schema: testSchema10,
            migrations: migrations
          }), database = _mockDatabase.database;
          pullChanges = jest.fn((0, _helpers.emptyPull)());
          _context.next = 4;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: jest.fn(),
            migrationsEnabledAtVersion: 7
          });
        case 4:
          expect(pullChanges).toHaveBeenCalledWith({
            lastPulledAt: null,
            schemaVersion: 10,
            migration: null
          });
          _context.t0 = expect;
          _context.next = 8;
          return (0, _index2.getLastPulledSchemaVersion)(database);
        case 8:
          _context.t1 = _context.sent;
          (0, _context.t0)(_context.t1).toBe(10);
          _context.t2 = expect;
          _context.next = 13;
          return database.adapter.getLocal('__watermelon_last_pulled_schema_version');
        case 13:
          _context.t3 = _context.sent;
          (0, _context.t2)(_context.t3).toBe('10');
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  it("remembers synced schema version on first sync, even if migrations are not enabled", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _mockDatabase2, database, pullChanges;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _mockDatabase2 = (0, _testModels.mockDatabase)({
            schema: testSchema10
          }), database = _mockDatabase2.database;
          pullChanges = jest.fn((0, _helpers.emptyPull)());
          _context2.next = 4;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: jest.fn()
          });
        case 4:
          expect(pullChanges).toHaveBeenCalledWith({
            lastPulledAt: null,
            schemaVersion: 10,
            migration: null
          });
          _context2.t0 = expect;
          _context2.next = 8;
          return (0, _index2.getLastPulledSchemaVersion)(database);
        case 8:
          _context2.t1 = _context2.sent;
          (0, _context2.t0)(_context2.t1).toBe(10);
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  it("does not remember schema version if migration syncs are not enabled", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var _mockDatabase3, database, pullChanges;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _mockDatabase3 = (0, _testModels.mockDatabase)({
            schema: testSchema10
          }), database = _mockDatabase3.database;
          _context3.next = 3;
          return (0, _index2.setLastPulledAt)(database, 100);
        case 3:
          pullChanges = jest.fn((0, _helpers.emptyPull)());
          _context3.next = 6;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: jest.fn()
          });
        case 6:
          expect(pullChanges).toHaveBeenCalledWith({
            lastPulledAt: 100,
            schemaVersion: 10,
            migration: null
          });
          _context3.t0 = expect;
          _context3.next = 10;
          return (0, _index2.getLastPulledSchemaVersion)(database);
        case 10:
          _context3.t1 = _context3.sent;
          (0, _context3.t0)(_context3.t1).toBe(null);
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
  it("performs no migration if up to date", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var _mockDatabase4, database, pullChanges;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _mockDatabase4 = (0, _testModels.mockDatabase)({
            schema: testSchema10,
            migrations: migrations
          }), database = _mockDatabase4.database;
          _context4.next = 3;
          return (0, _index2.setLastPulledAt)(database, 1500);
        case 3:
          _context4.next = 5;
          return (0, _index2.setLastPulledSchemaVersion)(database, 10);
        case 5:
          pullChanges = jest.fn((0, _helpers.emptyPull)(2500));
          _context4.next = 8;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: jest.fn(),
            migrationsEnabledAtVersion: 7
          });
        case 8:
          expect(pullChanges).toHaveBeenCalledWith({
            lastPulledAt: 1500,
            schemaVersion: 10,
            migration: null
          });
          _context4.t0 = expect;
          _context4.next = 12;
          return (0, _index2.getLastPulledSchemaVersion)(database);
        case 12:
          _context4.t1 = _context4.sent;
          (0, _context4.t0)(_context4.t1).toBe(10);
        case 14:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
  it("performs migration sync on schema version bump", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var _mockDatabase5, database, pullChanges;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _mockDatabase5 = (0, _testModels.mockDatabase)({
            schema: testSchema10,
            migrations: migrations
          }), database = _mockDatabase5.database;
          _context5.next = 3;
          return (0, _index2.setLastPulledAt)(database, 1500);
        case 3:
          _context5.next = 5;
          return (0, _index2.setLastPulledSchemaVersion)(database, 9);
        case 5:
          pullChanges = jest.fn((0, _helpers.emptyPull)(2500));
          _context5.next = 8;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: jest.fn(),
            migrationsEnabledAtVersion: 7
          });
        case 8:
          expect(pullChanges).toHaveBeenCalledWith({
            lastPulledAt: 1500,
            schemaVersion: 10,
            migration: {
              from: 9,
              tables: [],
              columns: [{
                table: 'attachment_versions',
                columns: ['reactions']
              }]
            }
          });
          _context5.t0 = expect;
          _context5.next = 12;
          return (0, _index2.getLastPulledSchemaVersion)(database);
        case 12:
          _context5.t1 = _context5.sent;
          (0, _context5.t0)(_context5.t1).toBe(10);
        case 14:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  })));
  it("performs fallback migration sync", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var _mockDatabase6, database, pullChanges;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _mockDatabase6 = (0, _testModels.mockDatabase)({
            schema: testSchema10,
            migrations: migrations
          }), database = _mockDatabase6.database;
          _context6.next = 3;
          return (0, _index2.setLastPulledAt)(database, 1500);
        case 3:
          pullChanges = jest.fn((0, _helpers.emptyPull)(2500));
          _context6.next = 6;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: pullChanges,
            pushChanges: jest.fn(),
            migrationsEnabledAtVersion: 8
          });
        case 6:
          expect(pullChanges).toHaveBeenCalledWith({
            lastPulledAt: 1500,
            schemaVersion: 10,
            migration: {
              from: 8,
              tables: ['attachments'],
              columns: [{
                table: 'attachment_versions',
                columns: ['reactions']
              }]
            }
          });
          _context6.t0 = expect;
          _context6.next = 10;
          return (0, _index2.getLastPulledSchemaVersion)(database);
        case 10:
          _context6.t1 = _context6.sent;
          (0, _context6.t0)(_context6.t1).toBe(10);
        case 12:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  })));
  it("does not remember schema version if pull fails", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    var _mockDatabase7, database;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _mockDatabase7 = (0, _testModels.mockDatabase)({
            schema: testSchema10,
            migrations: migrations
          }), database = _mockDatabase7.database;
          _context7.next = 3;
          return (0, _index.synchronize)({
            database: database,
            pullChanges: jest.fn(function () {
              return Promise.reject(new Error('pull-fail'));
            }),
            pushChanges: jest.fn(),
            migrationsEnabledAtVersion: 8
          })["catch"](function (e) {
            return e;
          });
        case 3:
          _context7.t0 = expect;
          _context7.next = 6;
          return (0, _index2.getLastPulledSchemaVersion)(database);
        case 6:
          _context7.t1 = _context7.sent;
          (0, _context7.t0)(_context7.t1).toBe(null);
        case 8:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  })));
  it("fails on programmer errors", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8() {
    var _mockDatabase8, database;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _mockDatabase8 = (0, _testModels.mockDatabase)({
            schema: testSchema10,
            migrations: migrations
          }), database = _mockDatabase8.database;
          _context8.next = 3;
          return (0, _utils.expectToRejectWithMessage)((0, _index.synchronize)({
            database: database,
            migrationsEnabledAtVersion: '9'
          }), 'Invalid migrationsEnabledAtVersion');
        case 3:
          _context8.next = 5;
          return (0, _utils.expectToRejectWithMessage)((0, _index.synchronize)({
            database: database,
            migrationsEnabledAtVersion: 11
          }), 'migrationsEnabledAtVersion must not be greater than current schema version');
        case 5:
          _context8.next = 7;
          return (0, _utils.expectToRejectWithMessage)((0, _index.synchronize)({
            database: (0, _testModels.mockDatabase)({
              schema: testSchema10
            }).db,
            migrationsEnabledAtVersion: 9
          }), 'Migration syncs cannot be enabled on a database that does not support migrations');
        case 7:
          _context8.next = 9;
          return (0, _utils.expectToRejectWithMessage)((0, _index.synchronize)({
            database: database,
            migrationsEnabledAtVersion: 6
          }), "migrationsEnabledAtVersion is too low - not possible to migrate from schema version 6");
        case 9:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  })));
  it("fails on last synced schema version > current schema version", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    var _mockDatabase9, database;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _mockDatabase9 = (0, _testModels.mockDatabase)({
            schema: testSchema10,
            migrations: migrations
          }), database = _mockDatabase9.database;
          _context9.next = 3;
          return (0, _index2.setLastPulledAt)(database, 1500);
        case 3:
          _context9.next = 5;
          return (0, _index2.setLastPulledSchemaVersion)(database, 11);
        case 5:
          _context9.next = 7;
          return (0, _utils.expectToRejectWithMessage)((0, _index.synchronize)({
            database: database,
            migrationsEnabledAtVersion: 10
          }), /Last synced schema version \(11\) is greater than current schema version \(10\)/);
        case 7:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  })));
});