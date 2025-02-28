"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _rambdax = require("rambdax");
var _testModels = require("../../__tests__/testModels");
var Q = _interopRequireWildcard(require("../../QueryDescription"));
var _index = _interopRequireDefault(require("./index"));
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
describe('subscribeToQueryWithColumns', function () {
  function fullObservationTest(_x5, _x6, _x7) {
    return _fullObservationTest.apply(this, arguments);
  }
  function _fullObservationTest() {
    _fullObservationTest = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(mockDb, query, asyncSource) {
      var _expect;
      var db, tasks, projects, observer, unsubscribe, waitForNextQuery, m1, m2, m3, m4;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            db = mockDb.db, tasks = mockDb.tasks, projects = mockDb.projects; // preparation - create mock project
            _context5.next = 3;
            return db.write(function () {
              return db.batch(projects.prepareCreateFromDirtyRaw({
                id: 'MOCK_PROJECT'
              }));
            });
          case 3:
            // start observing
            observer = jest.fn();
            unsubscribe = (0, _index["default"])(query, ['position'], observer);
            waitForNextQuery = function waitForNextQuery() {
              return tasks.query().fetch();
            };
            _context5.next = 8;
            return waitForNextQuery();
          case 8:
            // wait for initial query to go through

            expect(observer).toHaveBeenCalledTimes(1);
            expect(observer).toHaveBeenLastCalledWith([]);

            // make some models
            _context5.next = 12;
            return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
              return _regenerator["default"].wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    m1 = prepareTask(tasks, 'name1', true, 10);
                    m2 = prepareTask(tasks, 'name2', true, 20);
                    m3 = prepareTask(tasks, 'name3', false, 30);
                    _context4.next = 5;
                    return db.batch(m1, prepareTask(tasks, 'name_irrelevant', false, 30), m2, m3);
                  case 5:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4);
            })));
          case 12:
            _context5.t0 = asyncSource;
            if (!_context5.t0) {
              _context5.next = 16;
              break;
            }
            _context5.next = 16;
            return waitForNextQuery();
          case 16:
            expect(observer).toHaveBeenCalledTimes(2);
            expect(observer).toHaveBeenLastCalledWith([m1, m2]);

            // add matching model
            _context5.next = 20;
            return db.write(function () {
              return createTask(tasks, 'name4', true, 40);
            });
          case 20:
            m4 = _context5.sent;
            _context5.t1 = asyncSource;
            if (!_context5.t1) {
              _context5.next = 25;
              break;
            }
            _context5.next = 25;
            return waitForNextQuery();
          case 25:
            expect(observer).toHaveBeenCalledTimes(3);
            expect(observer).toHaveBeenLastCalledWith([m1, m2, m4]);

            // remove matching model
            _context5.next = 29;
            return db.write(function () {
              return m1.markAsDeleted();
            });
          case 29:
            _context5.t2 = asyncSource;
            if (!_context5.t2) {
              _context5.next = 33;
              break;
            }
            _context5.next = 33;
            return waitForNextQuery();
          case 33:
            expect(observer).toHaveBeenCalledTimes(4);
            expect(observer).toHaveBeenLastCalledWith([m2, m4]);

            // some irrelevant change (no emission)
            _context5.next = 37;
            return updateTask(m2, function (task) {
              task.name = 'changed name';
            });
          case 37:
            _context5.t3 = asyncSource;
            if (!_context5.t3) {
              _context5.next = 41;
              break;
            }
            _context5.next = 41;
            return waitForNextQuery();
          case 41:
            expect(observer).toHaveBeenCalledTimes(4);

            // change model to start matching
            _context5.next = 44;
            return updateTask(m3, function (task) {
              task.isCompleted = true;
            });
          case 44:
            _context5.t4 = asyncSource;
            if (!_context5.t4) {
              _context5.next = 48;
              break;
            }
            _context5.next = 48;
            return waitForNextQuery();
          case 48:
            expect(observer).toHaveBeenCalledTimes(5);
            expect((0, _rambdax.last)(observer.mock.calls)[0]).toHaveLength(3);
            expect((0, _rambdax.last)(observer.mock.calls)[0]).toEqual(expect.arrayContaining([m2, m3, m4]));

            // change model to no longer match
            // make sure changed model isn't re-emitted before source query removes it
            _context5.next = 53;
            return updateTask(m2, function (task) {
              task.isCompleted = false;
            });
          case 53:
            _context5.t5 = asyncSource;
            if (!_context5.t5) {
              _context5.next = 57;
              break;
            }
            _context5.next = 57;
            return waitForNextQuery();
          case 57:
            expect(observer).toHaveBeenCalledTimes(6);
            expect((0, _rambdax.last)(observer.mock.calls)[0]).toHaveLength(2);
            expect((0, _rambdax.last)(observer.mock.calls)[0]).toEqual(expect.arrayContaining([m3, m4]));

            // change a relevant field in previously-observed record (no emission)
            _context5.next = 62;
            return updateTask(m2, function (task) {
              task.position = 10;
            });
          case 62:
            _context5.t6 = asyncSource;
            if (!_context5.t6) {
              _context5.next = 66;
              break;
            }
            _context5.next = 66;
            return waitForNextQuery();
          case 66:
            expect(observer).toHaveBeenCalledTimes(6);

            // make multiple simultaneous changes to observed records - expect only one emission
            _context5.next = 69;
            return db.write(function () {
              return db.batch(m2.prepareUpdate(function () {
                // not observed anymore - irrelevant
                m2.position = 100;
              }), m3.prepareUpdate(function () {
                m3.position = 100;
              }), m4.prepareUpdate(function () {
                m4.position = 100;
              }));
            });
          case 69:
            _context5.t7 = asyncSource;
            if (!_context5.t7) {
              _context5.next = 73;
              break;
            }
            _context5.next = 73;
            return waitForNextQuery();
          case 73:
            expect(observer).toHaveBeenCalledTimes(7);
            (_expect = expect(observer)).toHaveBeenLastCalledWith.apply(_expect, (0, _toConsumableArray2["default"])(observer.mock.calls[observer.mock.calls.length - 2]));

            // make an irrelevant change to recently changed record (no emission)
            // Note: This is a regression check for a situation where task had a relevant change,
            // but new record state was not cached, so another irrelevant change triggered an update
            _context5.next = 77;
            return updateTask(m4, function (task) {
              task.name = 'different name';
            });
          case 77:
            _context5.t8 = asyncSource;
            if (!_context5.t8) {
              _context5.next = 81;
              break;
            }
            _context5.next = 81;
            return waitForNextQuery();
          case 81:
            expect(observer).toHaveBeenCalledTimes(7);

            // make irrelevant changes to secondary table (async join query)
            if (!asyncSource) {
              _context5.next = 88;
              break;
            }
            _context5.next = 85;
            return db.write(function () {
              return db.batch(projects.prepareCreate(), projects.prepareCreate());
            });
          case 85:
            _context5.next = 87;
            return waitForNextQuery();
          case 87:
            expect(observer).toHaveBeenCalledTimes(7);
          case 88:
            // ensure record subscriptions are disposed properly
            unsubscribe();
            _context5.next = 91;
            return updateTask(m3, function (mock) {
              mock.position += 1;
            });
          case 91:
            expect(observer).toHaveBeenCalledTimes(7);
          case 92:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return _fullObservationTest.apply(this, arguments);
  }
  it('observes changes correctly - test with simple observer', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var mockDb, query;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          mockDb = (0, _testModels.mockDatabase)();
          query = mockDb.tasks.query(Q.where('is_completed', true));
          _context2.next = 4;
          return fullObservationTest(mockDb, query, false);
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  it('observes changes correctly - test with reloading observer', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var mockDb, query;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          mockDb = (0, _testModels.mockDatabase)();
          query = mockDb.tasks.query(Q.where('is_completed', true),
          // fake query to force to use reloading observer
          Q.on('mock_projects', Q.where('id', Q.notEq(null))));
          _context3.next = 4;
          return fullObservationTest(mockDb, query, true);
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
});