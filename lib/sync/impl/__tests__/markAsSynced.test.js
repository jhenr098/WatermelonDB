"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _helpers = require("./helpers");
var _index = require("../index");
describe('markLocalChangesAsSynced', function () {
  it('does nothing for empty local changes', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _makeDatabase, database, destroyDeletedRecordsSpy, localChanges1, localChanges2;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _makeDatabase = (0, _helpers.makeDatabase)(), database = _makeDatabase.database;
          destroyDeletedRecordsSpy = jest.spyOn(database.adapter, 'destroyDeletedRecords');
          _context.next = 4;
          return (0, _helpers.makeLocalChanges)(database);
        case 4:
          _context.next = 6;
          return (0, _index.fetchLocalChanges)(database);
        case 6:
          localChanges1 = _context.sent;
          _context.next = 9;
          return (0, _index.markLocalChangesAsSynced)(database, {
            changes: _helpers.emptyChangeSet,
            affectedRecords: []
          });
        case 9:
          _context.next = 11;
          return (0, _index.fetchLocalChanges)(database);
        case 11:
          localChanges2 = _context.sent;
          expect(localChanges1).toEqual(localChanges2);

          // Should NOT call `database.adapter.destroyDeletedRecords` if no records present
          expect(destroyDeletedRecordsSpy).toHaveBeenCalledTimes(0);
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  it('marks local changes as synced', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _makeDatabase2, database, projects, tasks, comments, projectCount, taskCount, projectList, taskList;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _makeDatabase2 = (0, _helpers.makeDatabase)(), database = _makeDatabase2.database, projects = _makeDatabase2.projects, tasks = _makeDatabase2.tasks, comments = _makeDatabase2.comments;
          _context2.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _context2.next = 5;
          return projects.query().fetchCount();
        case 5:
          projectCount = _context2.sent;
          _context2.next = 8;
          return tasks.query().fetchCount();
        case 8:
          taskCount = _context2.sent;
          _context2.t0 = _index.markLocalChangesAsSynced;
          _context2.t1 = database;
          _context2.next = 13;
          return (0, _index.fetchLocalChanges)(database);
        case 13:
          _context2.t2 = _context2.sent;
          _context2.next = 16;
          return (0, _context2.t0)(_context2.t1, _context2.t2);
        case 16:
          _context2.t3 = expect;
          _context2.next = 19;
          return (0, _index.fetchLocalChanges)(database);
        case 19:
          _context2.t4 = _context2.sent;
          (0, _context2.t3)(_context2.t4).toEqual(_helpers.emptyLocalChanges);
          _context2.next = 23;
          return projects.query().fetch();
        case 23:
          projectList = _context2.sent;
          _context2.next = 26;
          return tasks.query().fetch();
        case 26:
          taskList = _context2.sent;
          expect(projectList.length).toBe(projectCount);
          expect(taskList.length).toBe(taskCount);

          // all objects marked as synced
          expect(projectList.every(function (record) {
            return record.syncStatus === 'synced';
          })).toBe(true);
          expect(taskList.every(function (record) {
            return record.syncStatus === 'synced';
          })).toBe(true);

          // no objects marked as deleted
          _context2.t5 = expect;
          _context2.next = 34;
          return (0, _helpers.allDeletedRecords)([projects, tasks, comments]);
        case 34:
          _context2.t6 = _context2.sent;
          (0, _context2.t5)(_context2.t6).toEqual([]);
        case 36:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  it("doesn't modify updated_at timestamps", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var _makeDatabase3, database, comments, updatedAt;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _makeDatabase3 = (0, _helpers.makeDatabase)(), database = _makeDatabase3.database, comments = _makeDatabase3.comments;
          _context3.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _context3.next = 5;
          return (0, _helpers.getRaw)(comments, 'cUpdated');
        case 5:
          updatedAt = _context3.sent.updated_at;
          _context3.t0 = _index.markLocalChangesAsSynced;
          _context3.t1 = database;
          _context3.next = 10;
          return (0, _index.fetchLocalChanges)(database);
        case 10:
          _context3.t2 = _context3.sent;
          _context3.next = 13;
          return (0, _context3.t0)(_context3.t1, _context3.t2);
        case 13:
          _context3.next = 15;
          return (0, _helpers.expectSyncedAndMatches)(comments, 'cCreated', {
            created_at: 1000,
            updated_at: 2000
          });
        case 15:
          _context3.next = 17;
          return (0, _helpers.expectSyncedAndMatches)(comments, 'cUpdated', {
            created_at: 1000,
            updated_at: updatedAt
          });
        case 17:
          _context3.next = 19;
          return (0, _helpers.expectSyncedAndMatches)(comments, 'cSynced', {
            created_at: 1000,
            updated_at: 2000
          });
        case 19:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
  it("doesn't mark as synced records that changed since changes were fetched", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var _makeDatabase4, database, projects, tasks, destroyDeletedRecordsSpy, _yield$makeLocalChang, pSynced, tSynced, tCreated, tUpdated, cSynced, cCreated, cUpdated, cDeleted, localChanges, newProject, localChanges2;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _makeDatabase4 = (0, _helpers.makeDatabase)(), database = _makeDatabase4.database, projects = _makeDatabase4.projects, tasks = _makeDatabase4.tasks;
          destroyDeletedRecordsSpy = jest.spyOn(database.adapter, 'destroyDeletedRecords');
          _context5.next = 4;
          return (0, _helpers.makeLocalChanges)(database);
        case 4:
          _yield$makeLocalChang = _context5.sent;
          pSynced = _yield$makeLocalChang.pSynced;
          tSynced = _yield$makeLocalChang.tSynced;
          tCreated = _yield$makeLocalChang.tCreated;
          tUpdated = _yield$makeLocalChang.tUpdated;
          cSynced = _yield$makeLocalChang.cSynced;
          cCreated = _yield$makeLocalChang.cCreated;
          cUpdated = _yield$makeLocalChang.cUpdated;
          cDeleted = _yield$makeLocalChang.cDeleted;
          _context5.next = 15;
          return (0, _index.fetchLocalChanges)(database);
        case 15:
          localChanges = _context5.sent;
          _context5.next = 18;
          return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
            return _regenerator["default"].wrap(function _callee4$(_context4) {
              while (1) switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return projects.create();
                case 2:
                  newProject = _context4.sent;
                  _context4.next = 5;
                  return pSynced.update(function () {
                    pSynced.name = 'local2';
                  });
                case 5:
                  _context4.next = 7;
                  return tSynced.markAsDeleted();
                case 7:
                  _context4.next = 9;
                  return cSynced.destroyPermanently();
                case 9:
                  _context4.next = 11;
                  return tCreated.update(function () {
                    tCreated.name = 'local2';
                  });
                case 11:
                  _context4.next = 13;
                  return tUpdated.update(function () {
                    tUpdated.name = 'local2'; // change what was already changed
                    tUpdated.description = 'local2'; // new change
                  });
                case 13:
                  _context4.next = 15;
                  return cCreated.markAsDeleted();
                case 15:
                  _context4.next = 17;
                  return cUpdated.markAsDeleted();
                case 17:
                  _context4.next = 19;
                  return cDeleted.destroyPermanently();
                case 19:
                case "end":
                  return _context4.stop();
              }
            }, _callee4);
          })));
        case 18:
          expect(destroyDeletedRecordsSpy).toHaveBeenCalledTimes(0);

          // mark local changes as synced; check if new changes are still pending sync
          _context5.next = 21;
          return (0, _index.markLocalChangesAsSynced)(database, localChanges);
        case 21:
          expect(destroyDeletedRecordsSpy).toHaveBeenCalledTimes(3);
          expect(destroyDeletedRecordsSpy).toHaveBeenCalledWith('mock_projects', ['pDeleted']);
          expect(destroyDeletedRecordsSpy).toHaveBeenCalledWith('mock_tasks', ['tDeleted']);
          expect(destroyDeletedRecordsSpy).toHaveBeenCalledWith('mock_comments', ['cDeleted']);
          destroyDeletedRecordsSpy.mockClear();
          _context5.next = 28;
          return (0, _index.fetchLocalChanges)(database);
        case 28:
          localChanges2 = _context5.sent;
          expect(localChanges2.changes).toEqual((0, _helpers.makeChangeSet)({
            mock_projects: {
              created: [newProject._raw],
              updated: [pSynced._raw]
            },
            mock_tasks: {
              created: [tCreated._raw],
              updated: [tUpdated._raw],
              deleted: ['tSynced']
            },
            mock_comments: {
              deleted: ['cUpdated', 'cCreated']
            }
          }));
          expect((0, _helpers.sorted)(localChanges2.affectedRecords)).toEqual((0, _helpers.sorted)([newProject, tCreated, pSynced, tUpdated]));
          expect(destroyDeletedRecordsSpy).toHaveBeenCalledTimes(0);
          _context5.next = 34;
          return (0, _helpers.expectSyncedAndMatches)(tasks, 'tUpdated', {
            _status: 'updated',
            // TODO: ideally position would probably not be here
            _changed: 'name,position,description',
            name: 'local2',
            description: 'local2',
            position: 100
          });
        case 34:
          _context5.next = 36;
          return (0, _index.markLocalChangesAsSynced)(database, localChanges2);
        case 36:
          expect(destroyDeletedRecordsSpy).toHaveBeenCalledTimes(2);
          _context5.t0 = expect;
          _context5.next = 40;
          return (0, _index.fetchLocalChanges)(database);
        case 40:
          _context5.t1 = _context5.sent;
          (0, _context5.t0)(_context5.t1).toEqual(_helpers.emptyLocalChanges);
          expect(destroyDeletedRecordsSpy).toHaveBeenCalledTimes(2);
          expect(destroyDeletedRecordsSpy).toHaveBeenCalledWith('mock_tasks', ['tSynced']);
          expect(destroyDeletedRecordsSpy).toHaveBeenCalledWith('mock_comments', ['cUpdated', 'cCreated']);
        case 45:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  })));
  it("doesn't mark as synced records in the rejectedIds object", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var _makeDatabase5, database, comments, _yield$makeLocalChang2, pCreated1, pUpdated, localChanges, localChanges2;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _makeDatabase5 = (0, _helpers.makeDatabase)(), database = _makeDatabase5.database, comments = _makeDatabase5.comments;
          _context6.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _yield$makeLocalChang2 = _context6.sent;
          pCreated1 = _yield$makeLocalChang2.pCreated1;
          pUpdated = _yield$makeLocalChang2.pUpdated;
          _context6.next = 8;
          return (0, _index.fetchLocalChanges)(database);
        case 8:
          localChanges = _context6.sent;
          _context6.next = 11;
          return (0, _index.markLocalChangesAsSynced)(database, localChanges, {
            mock_projects: ['pCreated1', 'pUpdated'],
            mock_comments: ['cDeleted']
          });
        case 11:
          _context6.next = 13;
          return (0, _index.fetchLocalChanges)(database);
        case 13:
          localChanges2 = _context6.sent;
          expect(localChanges2.changes).toEqual((0, _helpers.makeChangeSet)({
            mock_projects: {
              created: [pCreated1._raw],
              updated: [pUpdated._raw]
            },
            mock_comments: {
              deleted: ['cDeleted']
            }
          }));
          _context6.t0 = expect;
          _context6.next = 18;
          return (0, _helpers.allDeletedRecords)([comments]);
        case 18:
          _context6.t1 = _context6.sent;
          (0, _context6.t0)(_context6.t1).toEqual(['cDeleted']);
        case 20:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  })));
  it("can mark records as synced when ids are per-table not globally unique", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8() {
    var _makeDatabase6, database, projects, tasks, comments;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _makeDatabase6 = (0, _helpers.makeDatabase)(), database = _makeDatabase6.database, projects = _makeDatabase6.projects, tasks = _makeDatabase6.tasks, comments = _makeDatabase6.comments;
          _context8.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _context8.next = 5;
          return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7() {
            return _regenerator["default"].wrap(function _callee7$(_context7) {
              while (1) switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.next = 2;
                  return database.batch(projects.prepareCreateFromDirtyRaw({
                    id: 'hello'
                  }), tasks.prepareCreateFromDirtyRaw({
                    id: 'hello'
                  }), comments.prepareCreateFromDirtyRaw({
                    id: 'hello'
                  }));
                case 2:
                case "end":
                  return _context7.stop();
              }
            }, _callee7);
          })));
        case 5:
          _context8.t0 = _index.markLocalChangesAsSynced;
          _context8.t1 = database;
          _context8.next = 9;
          return (0, _index.fetchLocalChanges)(database);
        case 9:
          _context8.t2 = _context8.sent;
          _context8.next = 12;
          return (0, _context8.t0)(_context8.t1, _context8.t2);
        case 12:
          _context8.t3 = expect;
          _context8.next = 15;
          return (0, _index.fetchLocalChanges)(database);
        case 15:
          _context8.t4 = _context8.sent;
          (0, _context8.t3)(_context8.t4).toEqual(_helpers.emptyLocalChanges);
        case 17:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  })));
  // TODO: Unskip the test when batch collection emissions are implemented
  it.skip('only emits one collection batch change', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    var _makeDatabase7, database, projects, _yield$makeLocalChang3, pCreated1, localChanges, projectsObserver;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _makeDatabase7 = (0, _helpers.makeDatabase)(), database = _makeDatabase7.database, projects = _makeDatabase7.projects;
          _context9.next = 3;
          return (0, _helpers.makeLocalChanges)(database);
        case 3:
          _yield$makeLocalChang3 = _context9.sent;
          pCreated1 = _yield$makeLocalChang3.pCreated1;
          _context9.next = 7;
          return (0, _index.fetchLocalChanges)(database);
        case 7:
          localChanges = _context9.sent;
          projectsObserver = jest.fn();
          projects.changes.subscribe(projectsObserver);
          _context9.next = 12;
          return (0, _index.markLocalChangesAsSynced)(database, localChanges);
        case 12:
          expect(projectsObserver).toHaveBeenCalledTimes(1);
          expect(projectsObserver).toHaveBeenCalledWith([{
            type: 'created',
            record: pCreated1
          }
          // TODO: missing changes + changes in other collections
          ]);
        case 14:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  })));
  it.skip("doesn't send _status, _changed fields", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10() {
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  })));
  it.skip('only returns changed fields', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee11() {
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  })));
});