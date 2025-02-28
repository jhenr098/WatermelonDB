"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _lodash = _interopRequireDefault(require("lodash.clonedeep"));
var _helpers = require("./helpers");
var _index = require("../index");
var _index2 = require("../../index");
describe('fetchLocalChanges', function () {
  it('returns empty object if no changes', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _makeDatabase, database;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _makeDatabase = (0, _helpers.makeDatabase)(), database = _makeDatabase.database;
          _context.t0 = expect;
          _context.next = 4;
          return (0, _index.fetchLocalChanges)(database);
        case 4:
          _context.t1 = _context.sent;
          (0, _context.t0)(_context.t1).toEqual(_helpers.emptyLocalChanges);
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  it('fetches all local changes', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _makeDatabase2, database, cloneDatabase, _yield$makeLocalChang, pCreated1, pCreated2, pUpdated, tCreated, tUpdated, tDeleted, cCreated, cUpdated, expectedChanges, expectedAffectedRecords, result, result2;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          // eslint-disable-next-line
          _makeDatabase2 = (0, _helpers.makeDatabase)(), database = _makeDatabase2.database, cloneDatabase = _makeDatabase2.cloneDatabase;
          _context2.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _yield$makeLocalChang = _context2.sent;
          pCreated1 = _yield$makeLocalChang.pCreated1;
          pCreated2 = _yield$makeLocalChang.pCreated2;
          pUpdated = _yield$makeLocalChang.pUpdated;
          tCreated = _yield$makeLocalChang.tCreated;
          tUpdated = _yield$makeLocalChang.tUpdated;
          tDeleted = _yield$makeLocalChang.tDeleted;
          cCreated = _yield$makeLocalChang.cCreated;
          cUpdated = _yield$makeLocalChang.cUpdated;
          // check
          expect(pCreated1._raw._status).toBe('created');
          expect(pUpdated._raw._status).toBe('updated');
          expect(pUpdated._raw._changed).toBe('name');
          expect(tDeleted._raw._status).toBe('deleted');
          expectedChanges = (0, _lodash["default"])((0, _helpers.makeChangeSet)({
            mock_projects: {
              created: [pCreated2._raw, pCreated1._raw],
              updated: [pUpdated._raw],
              deleted: ['pDeleted']
            },
            mock_tasks: {
              created: [tCreated._raw],
              updated: [tUpdated._raw],
              deleted: ['tDeleted']
            },
            mock_comments: {
              created: [cCreated._raw],
              updated: [cUpdated._raw],
              deleted: ['cDeleted']
            }
          }));
          expectedAffectedRecords = [pCreated2, pCreated1, pUpdated, tCreated, tUpdated, cCreated, cUpdated];
          _context2.next = 20;
          return (0, _index.fetchLocalChanges)(database);
        case 20:
          result = _context2.sent;
          expect(result.changes).toEqual(expectedChanges);
          expect(result.affectedRecords).toEqual(expectedAffectedRecords);

          // simulate reload
          _context2.next = 25;
          return cloneDatabase();
        case 25:
          database = _context2.sent;
          _context2.next = 28;
          return (0, _index.fetchLocalChanges)(database);
        case 28:
          result2 = _context2.sent;
          expect(result2.changes).toEqual(expectedChanges);
          expect(result2.affectedRecords.map(function (r) {
            return r._raw;
          })).toEqual(expectedAffectedRecords.map(function (r) {
            return r._raw;
          }));
        case 31:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  it('returns object copies', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var _makeDatabase3, database, _yield$makeLocalChang2, pUpdated, _yield$fetchLocalChan, changes, changesCloned;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _makeDatabase3 = (0, _helpers.makeDatabase)(), database = _makeDatabase3.database;
          _context3.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _yield$makeLocalChang2 = _context3.sent;
          pUpdated = _yield$makeLocalChang2.pUpdated;
          _context3.next = 7;
          return (0, _index.fetchLocalChanges)(database);
        case 7:
          _yield$fetchLocalChan = _context3.sent;
          changes = _yield$fetchLocalChan.changes;
          changesCloned = (0, _lodash["default"])(changes); // raws should be cloned - further changes don't affect result
          _context3.next = 12;
          return database.write(function () {
            return pUpdated.update(function (p) {
              p.name = 'y';
            });
          });
        case 12:
          expect(changes).toEqual(changesCloned);
        case 13:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
});
describe('hasUnsyncedChanges', function () {
  it('has no unsynced changes by default', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var _makeDatabase4, database;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _makeDatabase4 = (0, _helpers.makeDatabase)(), database = _makeDatabase4.database;
          _context4.t0 = expect;
          _context4.next = 4;
          return (0, _index2.hasUnsyncedChanges)({
            database: database
          });
        case 4:
          _context4.t1 = _context4.sent;
          (0, _context4.t0)(_context4.t1).toBe(false);
        case 6:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
  it('has unsynced changes if made', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var _makeDatabase5, database;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _makeDatabase5 = (0, _helpers.makeDatabase)(), database = _makeDatabase5.database;
          _context5.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _context5.t0 = expect;
          _context5.next = 6;
          return (0, _index2.hasUnsyncedChanges)({
            database: database
          });
        case 6:
          _context5.t1 = _context5.sent;
          (0, _context5.t0)(_context5.t1).toBe(true);
        case 8:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  })));
  it('just one update is enough', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    var _makeDatabase6, database, collection, record;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _makeDatabase6 = (0, _helpers.makeDatabase)(), database = _makeDatabase6.database;
          collection = database.get('mock_comments');
          _context7.next = 4;
          return database.write(function () {
            return collection.create(function (rec) {
              rec._raw._status = 'synced';
            });
          });
        case 4:
          record = _context7.sent;
          _context7.t0 = expect;
          _context7.next = 8;
          return (0, _index2.hasUnsyncedChanges)({
            database: database
          });
        case 8:
          _context7.t1 = _context7.sent;
          (0, _context7.t0)(_context7.t1).toBe(false);
          _context7.next = 12;
          return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
            return _regenerator["default"].wrap(function _callee6$(_context6) {
              while (1) switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return record.update(function () {
                    record.body = 'changed';
                  });
                case 2:
                case "end":
                  return _context6.stop();
              }
            }, _callee6);
          })));
        case 12:
          _context7.t2 = expect;
          _context7.next = 15;
          return (0, _index2.hasUnsyncedChanges)({
            database: database
          });
        case 15:
          _context7.t3 = _context7.sent;
          (0, _context7.t2)(_context7.t3).toBe(true);
        case 17:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  })));
  it('just one delete is enough', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8() {
    var _makeDatabase7, database, collection, record;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _makeDatabase7 = (0, _helpers.makeDatabase)(), database = _makeDatabase7.database;
          collection = database.get('mock_comments');
          _context8.next = 4;
          return database.write(function () {
            return collection.create(function (rec) {
              rec._raw._status = 'synced';
            });
          });
        case 4:
          record = _context8.sent;
          _context8.t0 = expect;
          _context8.next = 8;
          return (0, _index2.hasUnsyncedChanges)({
            database: database
          });
        case 8:
          _context8.t1 = _context8.sent;
          (0, _context8.t0)(_context8.t1).toBe(false);
          _context8.next = 12;
          return database.write(function () {
            return record.markAsDeleted();
          });
        case 12:
          _context8.t2 = expect;
          _context8.next = 15;
          return (0, _index2.hasUnsyncedChanges)({
            database: database
          });
        case 15:
          _context8.t3 = _context8.sent;
          (0, _context8.t2)(_context8.t3).toBe(true);
        case 17:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  })));
});