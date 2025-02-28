"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _testModels = require("../__tests__/testModels");
var Q = _interopRequireWildcard(require("../QueryDescription"));
var _subscribeToQueryWithColumns = _interopRequireDefault(require("./subscribeToQueryWithColumns"));
var _subscribeToQuery = _interopRequireDefault(require("./subscribeToQuery"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var prepareTask = function prepareTask(tasks, name, isCompleted, position) {
  return tasks.prepareCreate(function (mock) {
    mock.name = name;
    mock.isCompleted = isCompleted;
    mock.position = position;
    mock.project.id = 'MOCK_PROJECT';
  });
};
var createTask = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(tasks, name, isCompleted, position) {
    var task;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          task = prepareTask(tasks, name, isCompleted, position);
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
  return function createTask(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();
var updateTask = function updateTask(task, updater) {
  return task.collection.database.write(function () {
    return task.update(updater);
  });
};
describe('common observation tests', function () {
  function updatesListBeforeModelTest(_x5, _x6) {
    return _updatesListBeforeModelTest.apply(this, arguments);
  }
  function _updatesListBeforeModelTest() {
    _updatesListBeforeModelTest = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(mockDb, subscribe) {
      var db, tasks, projects, task, events, listObserver, listUnsubscribe, waitForNextQuery, taskObserver, taskUnsubsribe, taskObserver2, taskUnsubsribe2;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            // If we observe a list of records, and then for each of them we observe the record
            // We must emit list changes first - otherwise, a change to a record that removes it from the list
            // will re-render its component unnecessarily before the whole list is re-rendered to remove it
            db = mockDb.db, tasks = mockDb.tasks, projects = mockDb.projects; // create a task
            _context7.next = 3;
            return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
              return _regenerator["default"].wrap(function _callee6$(_context6) {
                while (1) switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return db.batch(projects.prepareCreateFromDirtyRaw({
                      id: 'MOCK_PROJECT'
                    }));
                  case 2:
                    return _context6.abrupt("return", createTask(tasks, 'task', true, 30));
                  case 3:
                  case "end":
                    return _context6.stop();
                }
              }, _callee6);
            })));
          case 3:
            task = _context7.sent;
            // start observing list
            events = [];
            listObserver = jest.fn(function () {
              return events.push('list');
            });
            listUnsubscribe = subscribe(listObserver); //
            waitForNextQuery = function waitForNextQuery() {
              return tasks.query().fetch();
            };
            _context7.next = 10;
            return waitForNextQuery();
          case 10:
            // wait for initial query to go through
            expect(listObserver).toHaveBeenLastCalledWith([task]);
            expect(events.join(',')).toBe('list');

            // start observing task (two ways)
            taskObserver = jest.fn(function () {
              return events.push('task');
            });
            taskUnsubsribe = task.experimentalSubscribe(taskObserver);
            taskObserver2 = jest.fn(function () {
              return events.push('task2');
            });
            taskUnsubsribe2 = task.observe().subscribe(taskObserver2);
            expect(events.join(',')).toBe('list,task2');

            // make a change removing from list
            _context7.next = 19;
            return updateTask(task, function () {
              task.isCompleted = false;
            });
          case 19:
            _context7.next = 21;
            return waitForNextQuery();
          case 21:
            expect(listObserver).toHaveBeenLastCalledWith([]);
            expect(events.join(',')).toBe('list,task2,list,task2,task');

            // clean up
            listUnsubscribe();
            taskUnsubsribe();
            taskUnsubsribe2.unsubscribe();
          case 26:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }));
    return _updatesListBeforeModelTest.apply(this, arguments);
  }
  var simpleQuery = Q.where('is_completed', true);
  var complexQuery = [Q.where('is_completed', true),
  // fake query to force to use reloading observer
  Q.on('mock_projects', Q.where('id', Q.notEq(null)))];
  it("updates list before model - test with subscribeToSimpleQuery", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var mockDb;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          mockDb = (0, _testModels.mockDatabase)();
          _context2.next = 3;
          return updatesListBeforeModelTest(mockDb, function (observer) {
            return (0, _subscribeToQuery["default"])(mockDb.tasks.query(simpleQuery), observer);
          });
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  it("updates list before model - test with reloadingObserver", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var mockDb;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          mockDb = (0, _testModels.mockDatabase)();
          _context3.next = 3;
          return updatesListBeforeModelTest(mockDb, function (observer) {
            var _mockDb$tasks;
            return (0, _subscribeToQuery["default"])((_mockDb$tasks = mockDb.tasks).query.apply(_mockDb$tasks, complexQuery), observer);
          });
        case 3:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
  it("updates list before model - test with subscribeToQueryWithColumns and simple observer", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var mockDb;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          mockDb = (0, _testModels.mockDatabase)();
          _context4.next = 3;
          return updatesListBeforeModelTest(mockDb, function (observer) {
            return (0, _subscribeToQueryWithColumns["default"])(mockDb.tasks.query(simpleQuery), ['position'], observer);
          });
        case 3:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
  it("updates list before model - test with subscribeToQueryWithColumns and reloading observer", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var mockDb;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          mockDb = (0, _testModels.mockDatabase)();
          _context5.next = 3;
          return updatesListBeforeModelTest(mockDb, function (observer) {
            var _mockDb$tasks2;
            return (0, _subscribeToQueryWithColumns["default"])((_mockDb$tasks2 = mockDb.tasks).query.apply(_mockDb$tasks2, complexQuery), ['position'], observer);
          });
        case 3:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  })));
});