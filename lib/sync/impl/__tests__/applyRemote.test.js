"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _rambdax = require("rambdax");
var _utils = require("../../../__tests__/utils");
var Q = _interopRequireWildcard(require("../../../QueryDescription"));
var _helpers = require("./helpers");
var _index = require("../index");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var testApplyRemoteChanges = function testApplyRemoteChanges(db, set) {
  var extraContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return db.write(function () {
    return (0, _index.applyRemoteChanges)((0, _helpers.makeChangeSet)(set), (0, _extends2["default"])({
      db: db
    }, extraContext));
  });
};
describe('applyRemoteChanges', function () {
  it('does nothing if no remote changes', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _makeDatabase, database, localChanges1, localChanges2;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _makeDatabase = (0, _helpers.makeDatabase)(), database = _makeDatabase.database;
          _context.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _context.next = 5;
          return (0, _index.fetchLocalChanges)(database);
        case 5:
          localChanges1 = _context.sent;
          _context.next = 8;
          return database.write(function () {
            return (0, _index.applyRemoteChanges)(_helpers.emptyChangeSet, {
              db: database
            });
          });
        case 8:
          _context.next = 10;
          return (0, _index.fetchLocalChanges)(database);
        case 10:
          localChanges2 = _context.sent;
          expect(localChanges1).toEqual(localChanges2);
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  // Note: We need to test all possible status combinations - xproduct of:
  // remote: created/updated/deleted
  // local: synced/created/updated/deleted/doesn't exist
  // (15 cases)
  it('can create, update, delete records', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _makeDatabase2, database, projects, tasks, comments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _makeDatabase2 = (0, _helpers.makeDatabase)(), database = _makeDatabase2.database, projects = _makeDatabase2.projects, tasks = _makeDatabase2.tasks, comments = _makeDatabase2.comments;
          _context2.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _context2.next = 5;
          return testApplyRemoteChanges(database, {
            mock_projects: {
              // create / doesn't exist - create
              created: [{
                id: 'new_project',
                name: 'remote'
              }]
            },
            mock_tasks: {
              // update / synced - update (stay synced)
              updated: [{
                id: 'tSynced',
                name: 'remote'
              }]
            },
            mock_comments: {
              // delete / synced - destroy
              deleted: ['cSynced']
            }
          });
        case 5:
          _context2.next = 7;
          return (0, _helpers.expectSyncedAndMatches)(projects, 'new_project', {
            name: 'remote'
          });
        case 7:
          _context2.next = 9;
          return (0, _helpers.expectSyncedAndMatches)(tasks, 'tSynced', {
            name: 'remote'
          });
        case 9:
          _context2.next = 11;
          return (0, _helpers.expectDoesNotExist)(comments, 'cSynced');
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  it('can resolve update conflicts', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var _makeDatabase3, database, tasks, comments;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _makeDatabase3 = (0, _helpers.makeDatabase)(), database = _makeDatabase3.database, tasks = _makeDatabase3.tasks, comments = _makeDatabase3.comments;
          _context3.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _context3.next = 5;
          return testApplyRemoteChanges(database, {
            mock_tasks: {
              updated: [
              // update / updated - resolve and update (stay updated)
              {
                id: 'tUpdated',
                name: 'remote',
                description: 'remote'
              }]
            },
            mock_comments: {
              // update / deleted - ignore (will be synced anyway)
              updated: [{
                id: 'cDeleted',
                body: 'remote'
              }]
            }
          });
        case 5:
          _context3.next = 7;
          return (0, _helpers.expectSyncedAndMatches)(tasks, 'tUpdated', {
            _status: 'updated',
            _changed: 'name,position',
            name: 'local',
            // local change preserved
            position: 100,
            description: 'remote',
            // remote change
            project_id: 'orig' // unchanged
          });
        case 7:
          _context3.next = 9;
          return (0, _helpers.expectSyncedAndMatches)(comments, 'cDeleted', {
            _status: 'deleted',
            body: ''
          });
        case 9:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
  it('can delete records in all edge cases', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var _makeDatabase4, database, projects;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _makeDatabase4 = (0, _helpers.makeDatabase)(), database = _makeDatabase4.database, projects = _makeDatabase4.projects;
          _context4.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _context4.next = 5;
          return testApplyRemoteChanges(database, {
            mock_projects: {
              deleted: ['does_not_exist',
              // delete / doesn't exist - ignore
              'pCreated',
              // delete / created - weird. destroy
              'pUpdated',
              // delete / updated - destroy
              'pDeleted' // delete / deleted - destroy
              ]
            }
          });
        case 5:
          _context4.next = 7;
          return (0, _helpers.expectDoesNotExist)(projects, 'does_not_exist');
        case 7:
          _context4.next = 9;
          return (0, _helpers.expectDoesNotExist)(projects, 'pCreated');
        case 9:
          _context4.next = 11;
          return (0, _helpers.expectDoesNotExist)(projects, 'pUpdated');
        case 11:
          _context4.next = 13;
          return (0, _helpers.expectDoesNotExist)(projects, 'pDeleted');
        case 13:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
  it('can handle sync failure cases', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var _makeDatabase5, database, tasks;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _makeDatabase5 = (0, _helpers.makeDatabase)(), database = _makeDatabase5.database, tasks = _makeDatabase5.tasks;
          _context5.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _context5.next = 5;
          return testApplyRemoteChanges(database, {
            mock_tasks: {
              // these cases can occur when sync fails for some reason and the same records are fetched and reapplied:
              created: [
              // create / synced - resolve and update (stay synced)
              {
                id: 'tSynced',
                name: 'remote'
              },
              // create / updated - resolve and update (stay updated)
              {
                id: 'tUpdated',
                name: 'remote',
                description: 'remote'
              },
              // create / deleted - destroy and recreate? (or just un-delete?)
              {
                id: 'tDeleted',
                name: 'remote'
              }]
            }
          });
        case 5:
          _context5.next = 7;
          return (0, _helpers.expectSyncedAndMatches)(tasks, 'tSynced', {
            name: 'remote'
          });
        case 7:
          _context5.next = 9;
          return (0, _helpers.expectSyncedAndMatches)(tasks, 'tUpdated', {
            _status: 'updated',
            _changed: 'name,position',
            name: 'local',
            // local change preserved
            position: 100,
            description: 'remote',
            // remote change
            project_id: 'orig' // unchanged
          });
        case 9:
          _context5.next = 11;
          return (0, _helpers.expectSyncedAndMatches)(tasks, 'tDeleted', {
            name: 'remote'
          });
        case 11:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  })));
  it('can handle weird edge cases', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var _makeDatabase6, database, projects, tasks;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _makeDatabase6 = (0, _helpers.makeDatabase)(), database = _makeDatabase6.database, projects = _makeDatabase6.projects, tasks = _makeDatabase6.tasks;
          _context6.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _context6.next = 5;
          return testApplyRemoteChanges(database, {
            mock_projects: {
              created: [
              // create / created - very weird case. resolve and update
              // this and update/created could happen if app crashes after pushing
              {
                id: 'pCreated1',
                name: 'remote'
              }]
            },
            mock_tasks: {
              updated: [
              // update / created - very weird. resolve and update
              {
                id: 'tCreated',
                name: 'remote'
              },
              // update / doesn't exist - create (stay synced)
              {
                id: 'does_not_exist',
                name: 'remote'
              }]
            }
          });
        case 5:
          _context6.t0 = expect;
          _context6.next = 8;
          return (0, _helpers.getRaw)(projects, 'pCreated1');
        case 8:
          _context6.t1 = _context6.sent;
          (0, _context6.t0)(_context6.t1).toMatchObject({
            _status: 'created',
            _changed: '',
            name: 'remote'
          });
          _context6.t2 = expect;
          _context6.next = 13;
          return (0, _helpers.getRaw)(tasks, 'tCreated');
        case 13:
          _context6.t3 = _context6.sent;
          (0, _context6.t2)(_context6.t3).toMatchObject({
            _status: 'created',
            _changed: '',
            name: 'remote'
          });
          _context6.next = 17;
          return (0, _helpers.expectSyncedAndMatches)(tasks, 'does_not_exist', {
            name: 'remote'
          });
        case 17:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  })));
  describe('replacement sync', function () {
    it("can clear database using replacement strategy", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      var _makeDatabase7, database, projects, tasks, comments;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            _makeDatabase7 = (0, _helpers.makeDatabase)(), database = _makeDatabase7.database, projects = _makeDatabase7.projects, tasks = _makeDatabase7.tasks, comments = _makeDatabase7.comments; // create only synced/updated records
            _context8.next = 3;
            return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7() {
              return _regenerator["default"].wrap(function _callee7$(_context7) {
                while (1) switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return database.batch((0, _helpers.prepareCreateFromRaw)(projects, {
                      id: 'p1',
                      name: 'orig'
                    }), (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: 't1',
                      _status: 'updated',
                      _updated: 'name',
                      name: 'local'
                    }));
                  case 2:
                  case "end":
                    return _context7.stop();
                }
              }, _callee7);
            })));
          case 3:
            _context8.t0 = expect;
            _context8.next = 6;
            return (0, _helpers.countAll)([projects, tasks, comments]);
          case 6:
            _context8.t1 = _context8.sent;
            (0, _context8.t0)(_context8.t1).toBe(2);
            _context8.next = 10;
            return testApplyRemoteChanges(database, {}, {
              strategy: 'replacement'
            });
          case 10:
            _context8.t2 = expect;
            _context8.next = 13;
            return (0, _helpers.countAll)([projects, tasks, comments]);
          case 13:
            _context8.t3 = _context8.sent;
            (0, _context8.t2)(_context8.t3).toBe(0);
            _context8.t4 = expect;
            _context8.next = 18;
            return (0, _helpers.allDeletedRecords)([projects, tasks, comments]);
          case 18:
            _context8.t5 = _context8.sent;
            (0, _context8.t4)(_context8.t5).toEqual([]);
          case 20:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    })));
    it("can clear database using replacement strategy (but locally created are preserved)", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      var _makeDatabase8, database, projects, tasks, comments;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            _makeDatabase8 = (0, _helpers.makeDatabase)(), database = _makeDatabase8.database, projects = _makeDatabase8.projects, tasks = _makeDatabase8.tasks, comments = _makeDatabase8.comments;
            _context9.next = 3;
            return (0, _helpers.makeLocalChanges)(database);
          case 3:
            _context9.t0 = expect;
            _context9.next = 6;
            return (0, _helpers.countAll)([projects, tasks, comments]);
          case 6:
            _context9.t1 = _context9.sent;
            (0, _context9.t0)(_context9.t1).toBe(10);
            _context9.next = 10;
            return testApplyRemoteChanges(database, {}, {
              strategy: 'replacement'
            });
          case 10:
            _context9.t2 = expect;
            _context9.next = 13;
            return (0, _helpers.countAll)([projects, tasks, comments]);
          case 13:
            _context9.t3 = _context9.sent;
            (0, _context9.t2)(_context9.t3).toBe(4);
            _context9.t4 = expect;
            _context9.next = 18;
            return (0, _helpers.allDeletedRecords)([projects, tasks, comments]);
          case 18:
            _context9.t5 = _context9.sent;
            (0, _context9.t4)(_context9.t5).toEqual([]);
          case 20:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    })));
    it("can apply changes using replacement strategy", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10() {
      var _makeDatabase9, database, projects, tasks, comments, recordsInDataset, createdRecordsKept;
      return _regenerator["default"].wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            _makeDatabase9 = (0, _helpers.makeDatabase)(), database = _makeDatabase9.database, projects = _makeDatabase9.projects, tasks = _makeDatabase9.tasks, comments = _makeDatabase9.comments;
            _context10.next = 3;
            return (0, _helpers.makeLocalChanges)(database);
          case 3:
            _context10.next = 5;
            return testApplyRemoteChanges(database, {
              mock_projects: {
                created: [
                // same as local
                {
                  id: 'pSynced'
                },
                // created / created - resolve and update
                {
                  id: 'pCreated1'
                },
                // newly created by remote
                {
                  id: 'new_project',
                  name: 'remote'
                }],
                updated: [
                // updated / created - resolve and update
                {
                  id: 'pCreated2',
                  name: 'remote'
                },
                // updated / updated - resolve and update (actually no remote change)
                {
                  id: 'pUpdated',
                  name: 'remote'
                }]
              },
              mock_tasks: {
                created: [
                // created / updated - resolve and update
                {
                  id: 'tUpdated',
                  name: 'remote',
                  description: 'remote'
                }]
              },
              mock_comments: {
                deleted: [
                // explicit deletions aren't disallowed when doing replacement strategy
                // (but pointless unless you do replacement per-collection)
                'cUpdated', 'cDeleted', 'cDestroyed', 'cDoesNotExist',
                // exception: if record is created locally, it wouldn't be deleted if not in this list
                // (weird edge that shouldn't happen, but it's not incorrect - if first replacement sync failed to mark
                // records as synced after push, but were received by server and added to list of records to push-delete,
                // then this could theoretically happen)
                'cCreated']
              }
            }, {
              strategy: 'replacement'
            });
          case 5:
            _context10.next = 7;
            return (0, _helpers.expectSyncedAndMatches)(projects, 'pSynced', {});
          case 7:
            _context10.t0 = expect;
            _context10.next = 10;
            return (0, _helpers.getRaw)(projects, 'pCreated1');
          case 10:
            _context10.t1 = _context10.sent;
            (0, _context10.t0)(_context10.t1).toMatchObject({
              _status: 'created',
              _changed: '',
              name: ''
            });
            _context10.next = 14;
            return (0, _helpers.expectSyncedAndMatches)(projects, 'new_project', {
              name: 'remote'
            });
          case 14:
            _context10.t2 = expect;
            _context10.next = 17;
            return (0, _helpers.getRaw)(projects, 'pCreated2');
          case 17:
            _context10.t3 = _context10.sent;
            (0, _context10.t2)(_context10.t3).toMatchObject({
              _status: 'created',
              _changed: '',
              name: 'remote'
            });
            _context10.t4 = expect;
            _context10.next = 22;
            return (0, _helpers.getRaw)(projects, 'pUpdated');
          case 22:
            _context10.t5 = _context10.sent;
            (0, _context10.t4)(_context10.t5).toMatchObject({
              _status: 'updated',
              _changed: 'name',
              name: 'local'
            });
            _context10.t6 = expect;
            _context10.next = 27;
            return (0, _helpers.getRaw)(tasks, 'tUpdated');
          case 27:
            _context10.t7 = _context10.sent;
            (0, _context10.t6)(_context10.t7).toMatchObject({
              _status: 'updated',
              _changed: 'name,position',
              name: 'local',
              position: 100,
              description: 'remote',
              project_id: 'orig'
            });
            _context10.next = 31;
            return (0, _helpers.expectDoesNotExist)(comments, 'cSynced');
          case 31:
            _context10.next = 33;
            return (0, _helpers.expectDoesNotExist)(comments, 'cUpdated');
          case 33:
            recordsInDataset = 6;
            createdRecordsKept = 1; // tCreated. pCreated1/pCreated2 are in dataset, cCreated is explicitly deleted
            _context10.t8 = expect;
            _context10.next = 38;
            return (0, _helpers.countAll)([projects, tasks, comments]);
          case 38:
            _context10.t9 = _context10.sent;
            (0, _context10.t8)(_context10.t9).toBe(recordsInDataset + createdRecordsKept);
            _context10.t10 = expect;
            _context10.next = 43;
            return (0, _helpers.allDeletedRecords)([projects, tasks, comments]);
          case 43:
            _context10.t11 = _context10.sent;
            (0, _context10.t10)(_context10.t11).toEqual([]);
          case 45:
          case "end":
            return _context10.stop();
        }
      }, _callee10);
    })));
    it("can apply changes using replacement with per-table granularity", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee11() {
      var _makeDatabase10, database, projects, tasks, comments;
      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            _makeDatabase10 = (0, _helpers.makeDatabase)(), database = _makeDatabase10.database, projects = _makeDatabase10.projects, tasks = _makeDatabase10.tasks, comments = _makeDatabase10.comments;
            _context11.next = 3;
            return (0, _helpers.makeLocalChanges)(database);
          case 3:
            _context11.next = 5;
            return testApplyRemoteChanges(database, {
              mock_projects: {
                updated: [
                // same as local
                {
                  id: 'pSynced'
                },
                // newly created by remote
                {
                  id: 'new_project',
                  name: 'remote'
                }]
              },
              mock_tasks: {
                created: [{
                  id: 'new_task'
                }]
              }
            }, {
              strategy: {
                "default": 'incremental',
                override: {
                  mock_projects: 'replacement'
                }
              }
            });
          case 5:
            _context11.t0 = expect;
            _context11.next = 8;
            return (0, _helpers.countAll)([projects]);
          case 8:
            _context11.t1 = _context11.sent;
            (0, _context11.t0)(_context11.t1).toBe(2 + 2);
            _context11.t2 = expect;
            _context11.next = 13;
            return (0, _helpers.allDeletedRecords)([projects]);
          case 13:
            _context11.t3 = _context11.sent;
            (0, _context11.t2)(_context11.t3).toEqual([]);
            _context11.t4 = expect;
            _context11.next = 18;
            return (0, _helpers.countAll)([tasks, comments]);
          case 18:
            _context11.t5 = _context11.sent;
            (0, _context11.t4)(_context11.t5).toBe(4 + 3);
            _context11.t6 = expect;
            _context11.next = 23;
            return (0, _helpers.allDeletedRecords)([tasks, comments]);
          case 23:
            _context11.t7 = _context11.sent;
            (0, _context11.t6)(_context11.t7).toEqual(['tDeleted', 'cDeleted']);
          case 25:
          case "end":
            return _context11.stop();
        }
      }, _callee11);
    })));
    it("can apply changes using partial replacement", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee13() {
      var _makeDatabase11, database, projects, tasks, comments;
      return _regenerator["default"].wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            _makeDatabase11 = (0, _helpers.makeDatabase)(), database = _makeDatabase11.database, projects = _makeDatabase11.projects, tasks = _makeDatabase11.tasks, comments = _makeDatabase11.comments;
            _context13.next = 3;
            return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee12() {
              var recs;
              return _regenerator["default"].wrap(function _callee12$(_context12) {
                while (1) switch (_context12.prev = _context12.next) {
                  case 0:
                    recs = [
                    // records in the "needs replacement" segment
                    (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: '1',
                      project_id: 'deleted'
                    }),
                    // deleted remotely
                    (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: '2',
                      project_id: 'deleted'
                    }),
                    // deleted remotely
                    (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: '2_del',
                      project_id: 'deleted'
                    }),
                    // deleted remotely and locally
                    (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: '3',
                      project_id: 'permsChanged'
                    }),
                    // unchanged
                    (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: '3b',
                      _status: 'updated',
                      _changed: 'name',
                      project_id: 'permsChanged',
                      name: 'local'
                    }),
                    // updated remotely
                    (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: '3_del',
                      project_id: 'permsChanged'
                    }),
                    // locally deleted
                    (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: '4',
                      project_id: 'permsChanged'
                    }),
                    // lost access (deleted)
                    (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: '5',
                      _status: 'created',
                      project_id: 'deleted'
                    }),
                    // other records, that will be processed incrementally
                    (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: 'a',
                      project_id: 'foo'
                    }),
                    // deleted remotely
                    (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: 'b',
                      project_id: 'foo'
                    }),
                    // updated remotely
                    (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: 'c',
                      project_id: 'bar'
                    }),
                    // unchanged
                    (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: 'c1',
                      _status: 'updated',
                      project_id: 'bar'
                    }),
                    // unchanged
                    (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: 'c_del'
                    }),
                    // locally deleted
                    (0, _helpers.prepareCreateFromRaw)(tasks, {
                      id: 'd',
                      _status: 'created',
                      project_id: 'baz'
                    }) // created locally
                    ];
                    _context12.next = 3;
                    return database.batch(recs);
                  case 3:
                    _context12.next = 5;
                    return recs.find(function (rec) {
                      return rec.id === '2_del';
                    }).markAsDeleted();
                  case 5:
                    _context12.next = 7;
                    return recs.find(function (rec) {
                      return rec.id === '3_del';
                    }).markAsDeleted();
                  case 7:
                    _context12.next = 9;
                    return recs.find(function (rec) {
                      return rec.id === 'c_del';
                    }).markAsDeleted();
                  case 9:
                    return _context12.abrupt("return", recs);
                  case 10:
                  case "end":
                    return _context12.stop();
                }
              }, _callee12);
            })));
          case 3:
            _context13.next = 5;
            return testApplyRemoteChanges(database, {
              mock_tasks: {
                updated: [
                // replacement segment
                {
                  id: '3',
                  project_id: 'permsChanged'
                },
                // unchanged
                {
                  id: '3b',
                  project_id: 'permsChanged',
                  name: 'orig'
                },
                // unchanged (but updated locally)
                {
                  id: '3_del',
                  project_id: 'permsChanged'
                },
                // unchanged (but deleted locally)
                {
                  id: '6',
                  project_id: 'permsChanged'
                },
                // new
                // incremental changes
                {
                  id: 'b',
                  name: 'remote'
                }, {
                  id: 'e'
                } // new
                ],
                deleted: ['a']
              }
            }, {
              strategy: {
                "default": 'replacement',
                override: {},
                experimentalQueryRecordsForReplacement: {
                  mock_tasks: function mock_tasks() {
                    return [Q.where('project_id', Q.oneOf(['deleted', 'permsChanged']))];
                  }
                }
              }
            });
          case 5:
            _context13.t0 = expect;
            _context13.next = 8;
            return (0, _helpers.allIds)([tasks]);
          case 8:
            _context13.t1 = _context13.sent.sort();
            (0, _context13.t0)(_context13.t1).toEqual([
            // replacement
            '3', '3b', '5', '6',
            // incremental
            'b', 'c', 'c1', 'd', 'e'].sort());
            _context13.t2 = expect;
            _context13.next = 13;
            return (0, _helpers.getRaw)(tasks, 'b');
          case 13:
            _context13.t3 = _context13.sent;
            (0, _context13.t2)(_context13.t3).toMatchObject({
              name: 'remote'
            });
            _context13.t4 = expect;
            _context13.next = 18;
            return (0, _helpers.getRaw)(tasks, '3b');
          case 18:
            _context13.t5 = _context13.sent;
            (0, _context13.t4)(_context13.t5).toMatchObject({
              _status: 'updated',
              name: 'local'
            });
            _context13.t6 = expect;
            _context13.next = 23;
            return (0, _helpers.allDeletedRecords)([tasks]);
          case 23:
            _context13.t7 = _context13.sent;
            (0, _context13.t6)(_context13.t7).toEqual(['c_del',
            // kept (not in replacement segment)
            // 2_del not kept (in replacement segment, but not in dataset)
            '3_del' // kept (in dataset, needs to be pushed)
            ]);
            _context13.t8 = expect;
            _context13.next = 28;
            return (0, _helpers.countAll)([projects, comments]);
          case 28:
            _context13.t9 = _context13.sent;
            (0, _context13.t8)(_context13.t9).toBe(0);
          case 30:
          case "end":
            return _context13.stop();
        }
      }, _callee13);
    })));
  });
  describe('timestamp management', function () {
    it("doesn't touch created_at/updated_at when applying updates", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee14() {
      var _makeDatabase12, database, comments;
      return _regenerator["default"].wrap(function _callee14$(_context14) {
        while (1) switch (_context14.prev = _context14.next) {
          case 0:
            _makeDatabase12 = (0, _helpers.makeDatabase)(), database = _makeDatabase12.database, comments = _makeDatabase12.comments;
            _context14.next = 3;
            return (0, _helpers.makeLocalChanges)(database);
          case 3:
            _context14.next = 5;
            return testApplyRemoteChanges(database, {
              mock_comments: {
                updated: [{
                  id: 'cSynced',
                  body: 'remote'
                }]
              }
            });
          case 5:
            _context14.next = 7;
            return (0, _helpers.expectSyncedAndMatches)(comments, 'cSynced', {
              created_at: 1000,
              updated_at: 2000,
              body: 'remote'
            });
          case 7:
          case "end":
            return _context14.stop();
        }
      }, _callee14);
    })));
    it('can replace created_at/updated_at during sync', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee15() {
      var _makeDatabase13, database, comments;
      return _regenerator["default"].wrap(function _callee15$(_context15) {
        while (1) switch (_context15.prev = _context15.next) {
          case 0:
            _makeDatabase13 = (0, _helpers.makeDatabase)(), database = _makeDatabase13.database, comments = _makeDatabase13.comments;
            _context15.next = 3;
            return (0, _helpers.makeLocalChanges)(database);
          case 3:
            _context15.next = 5;
            return testApplyRemoteChanges(database, {
              mock_comments: {
                created: [{
                  id: 'cNew',
                  created_at: 1,
                  updated_at: 2
                }],
                updated: [{
                  id: 'cSynced',
                  created_at: 10,
                  updated_at: 20
                }]
              }
            });
          case 5:
            _context15.next = 7;
            return (0, _helpers.expectSyncedAndMatches)(comments, 'cNew', {
              created_at: 1,
              updated_at: 2,
              body: ''
            });
          case 7:
            _context15.next = 9;
            return (0, _helpers.expectSyncedAndMatches)(comments, 'cSynced', {
              created_at: 10,
              updated_at: 20,
              body: ''
            });
          case 9:
          case "end":
            return _context15.stop();
        }
      }, _callee15);
    })));
  });
  it.skip("doesn't destroy dependent objects", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee16() {
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
        case "end":
          return _context16.stop();
      }
    }, _callee16);
  })));
  it.skip('only emits one collection batch change', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee17() {
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
        case "end":
          return _context17.stop();
      }
    }, _callee17);
  })));
  it('rejects invalid records', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee18() {
    var _makeDatabase14, database, expectChangeFails, expectCreateFails, expectUpdateFails;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          _makeDatabase14 = (0, _helpers.makeDatabase)(), database = _makeDatabase14.database;
          expectChangeFails = function expectChangeFails(changes) {
            return (0, _utils.expectToRejectWithMessage)(testApplyRemoteChanges(database, {
              mock_projects: changes
            }), /invalid raw record/i);
          };
          expectCreateFails = function expectCreateFails(raw) {
            return expectChangeFails({
              created: [raw]
            });
          };
          expectUpdateFails = function expectUpdateFails(raw) {
            return expectChangeFails({
              updated: [raw]
            });
          };
          _context18.next = 6;
          return expectCreateFails({
            id: 'foo',
            _status: 'created'
          });
        case 6:
          _context18.next = 8;
          return expectCreateFails({
            id: 'foo',
            _changed: 'bla'
          });
        case 8:
          _context18.next = 10;
          return expectCreateFails({
            foo: 'bar'
          });
        case 10:
          _context18.next = 12;
          return expectUpdateFails({
            id: 'foo',
            _status: 'created'
          });
        case 12:
          _context18.next = 14;
          return expectUpdateFails({
            id: 'foo',
            _changed: 'bla'
          });
        case 14:
          _context18.next = 16;
          return expectUpdateFails({
            foo: 'bar'
          });
        case 16:
          _context18.t0 = expect;
          _context18.next = 19;
          return (0, _index.fetchLocalChanges)(database);
        case 19:
          _context18.t1 = _context18.sent;
          (0, _context18.t0)(_context18.t1).toEqual(_helpers.emptyLocalChanges);
        case 21:
        case "end":
          return _context18.stop();
      }
    }, _callee18);
  })));
  it("safely skips collections that don't exist", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee19() {
    var _makeDatabase15, database;
    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) switch (_context19.prev = _context19.next) {
        case 0:
          _makeDatabase15 = (0, _helpers.makeDatabase)(), database = _makeDatabase15.database;
          _context19.next = 3;
          return testApplyRemoteChanges(database, {
            invalid_project: {
              created: [{
                id: 'foo'
              }]
            }
          });
        case 3:
          _context19.next = 5;
          return testApplyRemoteChanges(database, {
            __proto__: {
              created: [{
                id: 'foo'
              }]
            }
          });
        case 5:
        case "end":
          return _context19.stop();
      }
    }, _callee19);
  })));
  it("doesn't currupt RecordCache (regression test)", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee20() {
    var _makeDatabase16, database, cloneDatabase, _yield$makeLocalChang, tSynced, previousRaw;
    return _regenerator["default"].wrap(function _callee20$(_context20) {
      while (1) switch (_context20.prev = _context20.next) {
        case 0:
          // eslint-disable-next-line
          _makeDatabase16 = (0, _helpers.makeDatabase)(), database = _makeDatabase16.database, cloneDatabase = _makeDatabase16.cloneDatabase;
          _context20.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _yield$makeLocalChang = _context20.sent;
          tSynced = _yield$makeLocalChang.tSynced;
          _context20.next = 7;
          return cloneDatabase();
        case 7:
          database = _context20.sent;
          // touch tSynced, but don't actually create its JS model
          previousRaw = (0, _rambdax.omit)(['_status', '_changed'], tSynced._raw);
          _context20.next = 11;
          return testApplyRemoteChanges(database, {
            mock_tasks: {
              updated: [(0, _extends2["default"])({
                id: 'tSynced'
              }, previousRaw)]
            }
          });
        case 11:
          _context20.next = 13;
          return database.get('mock_tasks').find('tSynced');
        case 13:
        case "end":
          return _context20.stop();
      }
    }, _callee20);
  })));
});