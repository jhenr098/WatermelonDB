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
var prepareTask = function prepareTask(tasks, isCompleted) {
  return tasks.prepareCreate(function (mock) {
    mock.isCompleted = isCompleted;
  });
};
var createTask = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(tasks, isCompleted) {
    var task;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          task = prepareTask(tasks, isCompleted);
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
  return function createTask(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var updateTask = function updateTask(task, updater) {
  return task.collection.database.write(function () {
    return task.update(updater);
  });
};
describe('subscribeToCount', function () {
  it('observes changes to count', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _mockDatabase, db, tasks, query, observer, unsubscribe, waitForNextQuery, t1, t2, t3;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _mockDatabase = (0, _testModels.mockDatabase)(), db = _mockDatabase.db, tasks = _mockDatabase.tasks;
          query = tasks.query(Q.where('is_completed', true)); // start observing
          observer = jest.fn();
          unsubscribe = (0, _index["default"])(query, false, observer);
          waitForNextQuery = function waitForNextQuery() {
            return tasks.query().fetch();
          };
          _context2.next = 7;
          return waitForNextQuery();
        case 7:
          // wait for initial query to go through

          expect(observer).toHaveBeenCalledTimes(1);
          expect(observer).toHaveBeenLastCalledWith(0);

          // add matching model
          _context2.next = 11;
          return db.write(function () {
            return createTask(tasks, true);
          });
        case 11:
          t1 = _context2.sent;
          _context2.next = 14;
          return waitForNextQuery();
        case 14:
          expect(observer).toHaveBeenCalledTimes(2);
          expect(observer).toHaveBeenLastCalledWith(1);

          // add many
          _context2.next = 18;
          return db.write(function () {
            t2 = prepareTask(tasks, true);
            t3 = prepareTask(tasks, true);
            return db.batch(t2, t3);
          });
        case 18:
          _context2.next = 20;
          return waitForNextQuery();
        case 20:
          expect(observer).toHaveBeenCalledTimes(3);
          expect(observer).toHaveBeenLastCalledWith(3);

          // irrelevant chagne
          _context2.next = 24;
          return updateTask(t2, function () {
            t2.name = 'hello';
          });
        case 24:
          _context2.next = 26;
          return waitForNextQuery();
        case 26:
          expect(observer).toHaveBeenCalledTimes(3);

          // remove some
          _context2.next = 29;
          return db.write(function () {
            return t2.destroyPermanently();
          });
        case 29:
          _context2.next = 31;
          return waitForNextQuery();
        case 31:
          expect(observer).toHaveBeenCalledTimes(4);
          expect(observer).toHaveBeenLastCalledWith(2);

          // change to no longer match
          _context2.next = 35;
          return updateTask(t1, function () {
            t1.isCompleted = false;
          });
        case 35:
          _context2.next = 37;
          return waitForNextQuery();
        case 37:
          expect(observer).toHaveBeenCalledTimes(5);
          expect(observer).toHaveBeenLastCalledWith(1);

          // ensure record subscriptions are disposed properly
          unsubscribe();
          _context2.next = 42;
          return updateTask(t3, function () {
            t3.isCompleted = false;
          });
        case 42:
          expect(observer).toHaveBeenCalledTimes(5);
        case 43:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
});