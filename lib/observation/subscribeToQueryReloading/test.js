"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _testModels = require("../../__tests__/testModels");
var Q = _interopRequireWildcard(require("../../QueryDescription"));
var _index = _interopRequireDefault(require("./index"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var prepareTask = function prepareTask(tasks, name, isCompleted) {
  return tasks.prepareCreate(function (mock) {
    mock.name = name;
    mock.isCompleted = isCompleted;
    mock.project.id = 'MOCK_PROJECT';
  });
};
var createTask = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(tasks, name, isCompleted) {
    var task;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          task = prepareTask(tasks, name, isCompleted);
          _context.next = 3;
          return tasks.database.batch(task);
        case 3:
          return _context.abrupt("return", task);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function createTask(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var updateTask = function updateTask(task, updater) {
  return task.collection.database.write(function () {
    return task.update(updater);
  });
};
describe('subscribeToQueryReloading', function () {
  it('observes changes to query', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _mockDatabase, db, tasks, projects, query, project, m1, m2, m3, observer, unsubscribe, waitForNextQuery, m4;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _mockDatabase = (0, _testModels.mockDatabase)(), db = _mockDatabase.db, tasks = _mockDatabase.tasks, projects = _mockDatabase.projects;
          query = tasks.query(Q.where('is_completed', true), Q.on('mock_projects', Q.where('name', 'hello'))); // preparation - create mock project
          _context2.next = 4;
          return db.write(function () {
            project = projects.prepareCreateFromDirtyRaw({
              id: 'MOCK_PROJECT',
              name: 'hello'
            });
            m1 = prepareTask(tasks, 'name1', true);
            m2 = prepareTask(tasks, 'name2', true);
            m3 = prepareTask(tasks, 'name3', false);
            return db.batch(project, m1, m2, m3);
          });
        case 4:
          // start observing
          observer = jest.fn();
          unsubscribe = (0, _index["default"])(query, observer);
          waitForNextQuery = function waitForNextQuery() {
            return tasks.query().fetch();
          };
          _context2.next = 9;
          return waitForNextQuery();
        case 9:
          // wait for initial query to go through

          expect(observer).toHaveBeenCalledTimes(1);
          expect(observer).toHaveBeenLastCalledWith([m1, m2]);

          // add matching model
          _context2.next = 13;
          return db.write(function () {
            return createTask(tasks, 'name4', true);
          });
        case 13:
          m4 = _context2.sent;
          _context2.next = 16;
          return waitForNextQuery();
        case 16:
          expect(observer).toHaveBeenCalledTimes(2);
          expect(observer).toHaveBeenLastCalledWith([m1, m2, m4]);

          // remove matching model
          _context2.next = 20;
          return db.write(function () {
            return m1.markAsDeleted();
          });
        case 20:
          _context2.next = 22;
          return waitForNextQuery();
        case 22:
          expect(observer).toHaveBeenCalledTimes(3);
          expect(observer).toHaveBeenLastCalledWith([m2, m4]);

          // some irrelevant change (no emission)
          _context2.next = 26;
          return updateTask(m2, function (task) {
            task.name = 'changed name';
          });
        case 26:
          _context2.next = 28;
          return waitForNextQuery();
        case 28:
          expect(observer).toHaveBeenCalledTimes(3);

          // change model in other table
          _context2.next = 31;
          return db.write(function () {
            return project.update(function () {
              project.name = 'other';
            });
          });
        case 31:
          _context2.next = 33;
          return waitForNextQuery();
        case 33:
          expect(observer).toHaveBeenCalledTimes(4);
          expect(observer).toHaveBeenLastCalledWith([]);

          // ensure record subscriptions are disposed properly
          unsubscribe();
          _context2.next = 38;
          return db.write(function () {
            return project.update(function () {
              project.name = 'hello';
            });
          });
        case 38:
          expect(observer).toHaveBeenCalledTimes(4);
        case 39:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  it('calls observer even if query is empty (regression test)', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var _mockDatabase2, tasks, observer, unsubscribe, waitForNextQuery;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _mockDatabase2 = (0, _testModels.mockDatabase)(), tasks = _mockDatabase2.tasks;
          observer = jest.fn();
          unsubscribe = (0, _index["default"])(tasks.query(), observer);
          waitForNextQuery = function waitForNextQuery() {
            return tasks.query().fetch();
          };
          _context3.next = 6;
          return waitForNextQuery();
        case 6:
          // wait for initial query to go through

          expect(observer).toHaveBeenCalledTimes(1);
          expect(observer).toHaveBeenLastCalledWith([]);
          unsubscribe();
        case 9:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
});