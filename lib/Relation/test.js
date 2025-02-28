"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _testModels = require("../__tests__/testModels");
var _index = _interopRequireDefault(require("./index"));
describe('Relation', function () {
  it('gets id', function () {
    var _mockDatabase = (0, _testModels.mockDatabase)(),
      tasks = _mockDatabase.tasks;
    var primary = new _testModels.MockTask(tasks, {
      project_id: 's1'
    });
    var relation = new _index["default"](primary, 'mock_projects', 'project_id', {
      isImmutable: false
    });
    expect(relation.id).toBe('s1');
    primary._isEditing = true;
    primary.projectId = 's2';
    expect(relation.id).toBe('s2');
  });
  it('sets id', function () {
    var _mockDatabase2 = (0, _testModels.mockDatabase)(),
      tasks = _mockDatabase2.tasks,
      projects = _mockDatabase2.projects;
    var primary = new _testModels.MockTask(tasks, {
      project_id: null
    });
    var secondary = new _testModels.MockProject(projects, {
      id: 's1'
    });
    var relation = new _index["default"](primary, 'mock_projects', 'project_id', {
      isImmutable: false
    });
    expect(relation.id).toBe(null);
    primary._isEditing = true;
    relation.id = secondary.id;
    expect(relation.id).toBe('s1');
    expect(primary.projectId).toBe('s1');
  });
  it('sets record', function () {
    var _mockDatabase3 = (0, _testModels.mockDatabase)(),
      tasks = _mockDatabase3.tasks,
      projects = _mockDatabase3.projects;
    var primary = new _testModels.MockTask(tasks, {});
    var secondary = new _testModels.MockProject(projects, {
      id: 's1'
    });
    var relation = new _index["default"](primary, 'mock_projects', 'project_id', {
      isImmutable: false
    });
    primary._isEditing = true;
    relation.set(secondary);
    expect(relation.id).toBe('s1');
  });
  it('allows setting id/record only on create/prepareCreate when immutable', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _mockDatabase4, tasks, comments, db, secondary, primary, secondary2, primary2;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _mockDatabase4 = (0, _testModels.mockDatabase)(), tasks = _mockDatabase4.tasks, comments = _mockDatabase4.comments, db = _mockDatabase4.db;
          _context.next = 3;
          return db.write(function () {
            return tasks.create(function (mock) {
              mock.name = 'foo';
            });
          });
        case 3:
          secondary = _context.sent;
          _context.next = 6;
          return db.write(function () {
            return comments.create(function (mock) {
              mock.task.id = secondary.id;
            });
          });
        case 6:
          primary = _context.sent;
          expect(primary.task.id).toBe(secondary.id);
          expect(function () {
            return primary.prepareUpdate(function (mock) {
              mock.task.id = 'foo';
            });
          }).toThrow();
          _context.next = 11;
          return db.write(function () {
            return comments.create(function (mock) {
              mock.name = 'bar';
            });
          });
        case 11:
          secondary2 = _context.sent;
          primary2 = comments.prepareCreate(function (mock) {
            mock.task.id = secondary.id;
            expect(mock.task.id).toBe(secondary.id);
            mock.task.set(secondary2);
            expect(mock.task.id).toBe(secondary2.id);
          });
          expect(primary2.task.id).toBe(secondary2.id);
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  it('observers related record', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _mockDatabase5, tasks, projects, db, secondary, primary, relation, observer, subscription;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _mockDatabase5 = (0, _testModels.mockDatabase)(), tasks = _mockDatabase5.tasks, projects = _mockDatabase5.projects, db = _mockDatabase5.db;
          _context2.next = 3;
          return db.write(function () {
            return projects.create(function (mock) {
              mock.name = 'foo';
            });
          });
        case 3:
          secondary = _context2.sent;
          _context2.next = 6;
          return db.write(function () {
            return tasks.create(function (mock) {
              mock.projectId = secondary.id;
            });
          });
        case 6:
          primary = _context2.sent;
          relation = new _index["default"](primary, 'mock_projects', 'project_id', {
            isImmutable: false
          });
          observer = jest.fn();
          subscription = relation.observe().subscribe(observer);
          _context2.next = 12;
          return new Promise(process.nextTick);
        case 12:
          // give time to propagate

          expect(observer).toHaveBeenCalledWith(secondary);
          _context2.next = 15;
          return db.write(function () {
            return secondary.update(function (mock) {
              mock.name = 'bar';
            });
          });
        case 15:
          expect(observer).toHaveBeenCalledTimes(2);
          subscription.unsubscribe();
        case 17:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  it('fetches current record', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var _mockDatabase6, tasks, projects, db, secondary, primary, relation, currentRecord, newSecondary;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _mockDatabase6 = (0, _testModels.mockDatabase)(), tasks = _mockDatabase6.tasks, projects = _mockDatabase6.projects, db = _mockDatabase6.db;
          _context3.next = 3;
          return db.write(function () {
            return projects.create(function (mock) {
              mock.name = 'foo';
            });
          });
        case 3:
          secondary = _context3.sent;
          _context3.next = 6;
          return db.write(function () {
            return tasks.create(function (mock) {
              mock.projectId = secondary.id;
            });
          });
        case 6:
          primary = _context3.sent;
          relation = new _index["default"](primary, 'mock_projects', 'project_id', {
            isImmutable: false
          });
          _context3.next = 10;
          return relation.fetch();
        case 10:
          currentRecord = _context3.sent;
          expect(currentRecord).toBe(secondary);
          _context3.next = 14;
          return db.write(function () {
            return projects.create(function (mock) {
              mock.name = 'bar';
            });
          });
        case 14:
          newSecondary = _context3.sent;
          db.write(function () {
            return primary.update(function (mock) {
              mock.projectId = newSecondary.id;
            });
          });
          _context3.next = 18;
          return relation.fetch();
        case 18:
          currentRecord = _context3.sent;
          expect(currentRecord).toBe(newSecondary);

          // test thenable syntax
          _context3.t0 = expect;
          _context3.next = 23;
          return relation;
        case 23:
          _context3.t1 = _context3.sent;
          (0, _context3.t0)(_context3.t1).toBe(currentRecord);
          _context3.t2 = expect;
          _context3.next = 28;
          return relation.then(function (model) {
            return [model];
          });
        case 28:
          _context3.t3 = _context3.sent;
          (0, _context3.t2)(_context3.t3).toEqual([currentRecord]);
        case 30:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
  it('caches observable', function () {
    var _mockDatabase7 = (0, _testModels.mockDatabase)(),
      tasks = _mockDatabase7.tasks;
    var model = new _testModels.MockTask(tasks, {});
    var relation = new _index["default"](model, 't1', 'c1', {
      isImmutable: false
    });
    var observable1 = relation.observe();
    var observable2 = relation.observe();
    expect(observable1).toBe(observable2);
  });
  it("has wmelon tag", function () {
    var _mockDatabase8 = (0, _testModels.mockDatabase)(),
      tasks = _mockDatabase8.tasks;
    var model = new _testModels.MockTask(tasks, {});
    var relation = new _index["default"](model, 't1', 'c1', {
      isImmutable: false
    });
    expect(relation.constructor._wmelonTag).toBe('relation');
  });
});