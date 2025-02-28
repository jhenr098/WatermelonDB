"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _utils = require("../__tests__/utils");
var _testModels = require("../__tests__/testModels");
var _fp = require("../utils/fp");
var _common = require("../utils/common");
var Q = _interopRequireWildcard(require("../QueryDescription"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
describe('Database', function () {
  it("implements get()", function () {
    var _mockDatabase = (0, _testModels.mockDatabase)(),
      database = _mockDatabase.database;
    expect(database.get('mock_tasks').table).toBe('mock_tasks');
    expect(database.get('mock_tasks')).toBe(database.collections.get('mock_tasks'));
    expect(database.get('mock_comments')).toBe(database.collections.get('mock_comments'));
  });
  it("implements localStorage", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _mockDatabase2, database;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _mockDatabase2 = (0, _testModels.mockDatabase)(), database = _mockDatabase2.database;
          _context.next = 3;
          return database.localStorage.set('foo', 'bar');
        case 3:
          _context.t0 = expect;
          _context.next = 6;
          return database.localStorage.get('foo');
        case 6:
          _context.t1 = _context.sent;
          (0, _context.t0)(_context.t1).toBe('bar');
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  describe('unsafeResetDatabase', function () {
    it('can reset database', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var _mockDatabase3, database, tasks, m1, m2;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _mockDatabase3 = (0, _testModels.mockDatabase)(), database = _mockDatabase3.database, tasks = _mockDatabase3.tasks;
            _context2.next = 3;
            return database.write(function () {
              return tasks.create();
            });
          case 3:
            m1 = _context2.sent;
            _context2.next = 6;
            return database.write(function () {
              return tasks.create();
            });
          case 6:
            m2 = _context2.sent;
            _context2.t0 = expect;
            _context2.next = 10;
            return tasks.find(m1.id);
          case 10:
            _context2.t1 = _context2.sent;
            (0, _context2.t0)(_context2.t1).toBe(m1);
            _context2.t2 = expect;
            _context2.next = 15;
            return tasks.find(m2.id);
          case 15:
            _context2.t3 = _context2.sent;
            (0, _context2.t2)(_context2.t3).toBe(m2);
            _context2.next = 19;
            return database.write(function () {
              return database.unsafeResetDatabase();
            });
          case 19:
            _context2.next = 21;
            return (0, _utils.expectToRejectWithMessage)(tasks.find(m1.id), 'not found');
          case 21:
            _context2.next = 23;
            return (0, _utils.expectToRejectWithMessage)(tasks.find(m2.id), 'not found');
          case 23:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    })));
    it('throws error if reset is called from outside a writer', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var _mockDatabase4, database, tasks, m1;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _mockDatabase4 = (0, _testModels.mockDatabase)(), database = _mockDatabase4.database, tasks = _mockDatabase4.tasks;
            _context3.next = 3;
            return database.write(function () {
              return tasks.create();
            });
          case 3:
            m1 = _context3.sent;
            _context3.next = 6;
            return (0, _utils.expectToRejectWithMessage)(database.unsafeResetDatabase(), 'can only be called from inside of a Writer');
          case 6:
            _context3.next = 8;
            return (0, _utils.expectToRejectWithMessage)(database.read(function () {
              return database.unsafeResetDatabase();
            }), 'can only be called from inside of a Writer');
          case 8:
            _context3.t0 = expect;
            _context3.next = 11;
            return tasks.find(m1.id);
          case 11:
            _context3.t1 = _context3.sent;
            (0, _context3.t0)(_context3.t1).toBe(m1);
          case 13:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    })));
    it('increments reset count after every reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var _mockDatabase5, database;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _mockDatabase5 = (0, _testModels.mockDatabase)(), database = _mockDatabase5.database;
            expect(database._resetCount).toBe(0);
            _context4.next = 4;
            return database.write(function () {
              return database.unsafeResetDatabase();
            });
          case 4:
            expect(database._resetCount).toBe(1);
            _context4.next = 7;
            return database.write(function () {
              return database.unsafeResetDatabase();
            });
          case 7:
            expect(database._resetCount).toBe(2);
          case 8:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    })));
    it('prevents Adapter from being called during reset db', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var _mockDatabase6, database, checkAdapter, resetPromise;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _mockDatabase6 = (0, _testModels.mockDatabase)(), database = _mockDatabase6.database;
            checkAdapter = /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) switch (_context5.prev = _context5.next) {
                    case 0:
                      _context5.t0 = expect;
                      _context5.next = 3;
                      return database.adapter.getLocal('test');
                    case 3:
                      _context5.t1 = _context5.sent;
                      (0, _context5.t0)(_context5.t1).toBe(null);
                      expect(database.adapter.underlyingAdapter).not.toBeFalsy();
                      expect(database.adapter.schema).not.toBeFalsy();
                    case 7:
                    case "end":
                      return _context5.stop();
                  }
                }, _callee5);
              }));
              return function checkAdapter() {
                return _ref6.apply(this, arguments);
              };
            }();
            _context6.next = 4;
            return checkAdapter();
          case 4:
            resetPromise = database.write(function () {
              return database.unsafeResetDatabase();
            });
            expect(function () {
              return database.adapter.underlyingAdapter;
            }).toThrow(/Cannot call database.adapter.underlyingAdapter while the database is being reset/);
            expect(function () {
              return database.adapter.schema;
            }).toThrow(/Cannot call database.adapter.schema/);
            expect(function () {
              return database.adapter.migrations;
            }).toThrow(/Cannot call database.adapter.migrations/);
            expect(function () {
              return database.adapter.getLocal('test');
            }).toThrow(/Cannot call database.adapter.getLocal/);
            expect(function () {
              return database.adapter.setLocal('test', 'trap');
            }).toThrow(/Cannot call database.adapter.setLocal/);
            _context6.next = 12;
            return resetPromise;
          case 12:
            _context6.next = 14;
            return checkAdapter();
          case 14:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    })));
    it('Cancels Database experimental subscribers during reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var _mockDatabase7, database, tasks, subscriber1, unsubscribe1, subscriber2, consoleErrorSpy;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            _mockDatabase7 = (0, _testModels.mockDatabase)(), database = _mockDatabase7.database, tasks = _mockDatabase7.tasks; // sanity check first
            subscriber1 = jest.fn();
            unsubscribe1 = database.experimentalSubscribe(['mock_tasks'], subscriber1);
            _context7.next = 5;
            return database.write(function () {
              return tasks.create();
            });
          case 5:
            expect(subscriber1).toHaveBeenCalledTimes(1);
            unsubscribe1();
            _context7.next = 9;
            return database.write(function () {
              return database.unsafeResetDatabase();
            });
          case 9:
            _context7.next = 11;
            return database.write(function () {
              return tasks.create();
            });
          case 11:
            expect(subscriber1).toHaveBeenCalledTimes(1);

            // keep subscriber during reset
            subscriber2 = jest.fn();
            database.experimentalSubscribe(['mock_tasks'], subscriber2);
            consoleErrorSpy = jest.spyOn(console, 'log');
            _context7.next = 17;
            return database.write(function () {
              return database.unsafeResetDatabase();
            });
          case 17:
            // check that error was logged
            expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
            expect(consoleErrorSpy).toHaveBeenCalledWith('Application error! Unexpected 1 Database subscribers were detected during database.unsafeResetDatabase() call. App should not hold onto subscriptions or Watermelon objects while resetting database.');

            // check that subscriber was killed
            _context7.next = 21;
            return database.write(function () {
              return tasks.create();
            });
          case 21:
            expect(subscriber2).toHaveBeenCalledTimes(0);
          case 22:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    })));
    it.skip('Cancels withChangesForTables observation during reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    })));
    it.skip('Cancels Collection change observation during reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    })));
    it.skip('Cancels Collection experimental subscribers during reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10() {
      return _regenerator["default"].wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
          case "end":
            return _context10.stop();
        }
      }, _callee10);
    })));
    it.skip('Cancels Model change observation during reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee11() {
      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
          case "end":
            return _context11.stop();
        }
      }, _callee11);
    })));
    it.skip('Cancels Model experimental subscribers during reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee12() {
      return _regenerator["default"].wrap(function _callee12$(_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
          case "end":
            return _context12.stop();
        }
      }, _callee12);
    })));
    it.skip('Cancels Query observation during reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee13() {
      return _regenerator["default"].wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
          case "end":
            return _context13.stop();
        }
      }, _callee13);
    })));
    it.skip('Cancels Query experimental subscribers during reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee14() {
      return _regenerator["default"].wrap(function _callee14$(_context14) {
        while (1) switch (_context14.prev = _context14.next) {
          case 0:
          case "end":
            return _context14.stop();
        }
      }, _callee14);
    })));
    it.skip('Cancels Relation observation during reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee15() {
      return _regenerator["default"].wrap(function _callee15$(_context15) {
        while (1) switch (_context15.prev = _context15.next) {
          case 0:
          case "end":
            return _context15.stop();
        }
      }, _callee15);
    })));
    it.skip('Cancels Relation experimental subscribers during reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee16() {
      return _regenerator["default"].wrap(function _callee16$(_context16) {
        while (1) switch (_context16.prev = _context16.next) {
          case 0:
          case "end":
            return _context16.stop();
        }
      }, _callee16);
    })));
    it('Signals internally when database is being reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee18() {
      var _mockDatabase8, database, promise, promise2;
      return _regenerator["default"].wrap(function _callee18$(_context18) {
        while (1) switch (_context18.prev = _context18.next) {
          case 0:
            _mockDatabase8 = (0, _testModels.mockDatabase)(), database = _mockDatabase8.database;
            expect(database._isBeingReset).toBe(false);
            promise = database.write(function () {
              return database.unsafeResetDatabase();
            });
            expect(database._isBeingReset).toBe(true);
            _context18.next = 6;
            return promise;
          case 6:
            expect(database._isBeingReset).toBe(false);

            // force reset to fail
            database.adapter.unsafeResetDatabase = /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee17() {
              return _regenerator["default"].wrap(function _callee17$(_context17) {
                while (1) switch (_context17.prev = _context17.next) {
                  case 0:
                    throw new Error('forced');
                  case 1:
                  case "end":
                    return _context17.stop();
                }
              }, _callee17);
            }));
            promise2 = database.write(function () {
              return database.unsafeResetDatabase();
            });
            expect(database._isBeingReset).toBe(true);
            _context18.next = 12;
            return (0, _utils.expectToRejectWithMessage)(promise2, 'forced');
          case 12:
            expect(database._isBeingReset).toBe(false);
          case 13:
          case "end":
            return _context18.stop();
        }
      }, _callee18);
    })));
    it.skip('Disallows <many methods> calls during reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee19() {
      return _regenerator["default"].wrap(function _callee19$(_context19) {
        while (1) switch (_context19.prev = _context19.next) {
          case 0:
          case "end":
            return _context19.stop();
        }
      }, _callee19);
    })));
    it.skip('Makes old Model objects unsable after reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee20() {
      return _regenerator["default"].wrap(function _callee20$(_context20) {
        while (1) switch (_context20.prev = _context20.next) {
          case 0:
          case "end":
            return _context20.stop();
        }
      }, _callee20);
    })));
    it.skip('Makes old Query objects unsable after reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee21() {
      return _regenerator["default"].wrap(function _callee21$(_context21) {
        while (1) switch (_context21.prev = _context21.next) {
          case 0:
          case "end":
            return _context21.stop();
        }
      }, _callee21);
    })));
    it.skip('Makes old Relation objects unsable after reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee22() {
      return _regenerator["default"].wrap(function _callee22$(_context22) {
        while (1) switch (_context22.prev = _context22.next) {
          case 0:
          case "end":
            return _context22.stop();
        }
      }, _callee22);
    })));
    // TODO: Write a regression test for https://github.com/Nozbe/WatermelonDB/commit/237e041d0d8aa4b3529fbf522f8d29c776fd4c0e
  });
  describe('Database.batch()', function () {
    it('can batch records', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee23() {
      var _mockDatabase9, database, cloneDatabase, tasksCollection, commentsCollection, adapterBatchSpy, m1, m2, m3, m4, tasksCollectionObserver, commentsCollectionObserver, m5, m6, recordObserver, batchPromise, createdRecords, fetchedM1, fetchedM2, fetchedM3, fetchedM4;
      return _regenerator["default"].wrap(function _callee23$(_context23) {
        while (1) switch (_context23.prev = _context23.next) {
          case 0:
            _mockDatabase9 = (0, _testModels.mockDatabase)(), database = _mockDatabase9.database, cloneDatabase = _mockDatabase9.cloneDatabase, tasksCollection = _mockDatabase9.tasks, commentsCollection = _mockDatabase9.comments;
            adapterBatchSpy = jest.spyOn(database.adapter, 'batch'); // m1, m2 will be used to test batch-updates
            _context23.next = 4;
            return database.write(function () {
              return tasksCollection.create();
            });
          case 4:
            m1 = _context23.sent;
            _context23.next = 7;
            return database.write(function () {
              return commentsCollection.create();
            });
          case 7:
            m2 = _context23.sent;
            _context23.next = 10;
            return database.write(function () {
              return tasksCollection.create();
            });
          case 10:
            m3 = _context23.sent;
            _context23.next = 13;
            return database.write(function () {
              return commentsCollection.create();
            });
          case 13:
            m4 = _context23.sent;
            tasksCollectionObserver = jest.fn();
            tasksCollection.changes.subscribe(tasksCollectionObserver);
            commentsCollectionObserver = jest.fn();
            commentsCollection.changes.subscribe(commentsCollectionObserver);

            // m5, m6 will be used to test batch-creates
            m5 = tasksCollection.prepareCreate();
            m6 = commentsCollection.prepareCreate();
            recordObserver = jest.fn();
            m1.observe().subscribe(recordObserver);
            batchPromise = database.write(function () {
              return database.batch(m6, m1.prepareUpdate(function () {
                m1.name = 'bar1';
              }), m5, m2.prepareUpdate(function () {
                m2.body = 'baz1';
              }), m3.prepareMarkAsDeleted(), m4.prepareDestroyPermanently());
            });
            expect(m1._preparedState).toBe(null);
            expect(m2._preparedState).toBe(null);
            _context23.next = 27;
            return batchPromise;
          case 27:
            expect(adapterBatchSpy).toHaveBeenCalledTimes(5);
            expect(adapterBatchSpy).toHaveBeenLastCalledWith([['create', 'mock_comments', m6._raw], ['update', 'mock_tasks', m1._raw], ['create', 'mock_tasks', m5._raw], ['update', 'mock_comments', m2._raw], ['markAsDeleted', 'mock_tasks', m3.id], ['destroyPermanently', 'mock_comments', m4.id]]);
            expect(tasksCollectionObserver).toHaveBeenCalledTimes(1);
            expect(commentsCollectionObserver).toHaveBeenCalledTimes(1);
            expect(tasksCollectionObserver).toHaveBeenCalledWith([{
              record: m1,
              type: 'updated'
            }, {
              record: m5,
              type: 'created'
            }, {
              record: m3,
              type: 'destroyed'
            }]);
            expect(commentsCollectionObserver).toHaveBeenCalledWith([{
              record: m6,
              type: 'created'
            }, {
              record: m2,
              type: 'updated'
            }, {
              record: m4,
              type: 'destroyed'
            }]);
            createdRecords = [m5, m6];
            createdRecords.forEach(function (record) {
              expect(record._preparedState).toBe(null);
              expect(record.collection._cache.get(record.id)).toBe(record);
            });
            expect(recordObserver).toHaveBeenCalledTimes(2);

            // simulate reload -- check if changes actually got saved
            _context23.next = 38;
            return cloneDatabase();
          case 38:
            database = _context23.sent;
            tasksCollection = database.collections.get('mock_tasks');
            commentsCollection = database.collections.get('mock_comments');
            _context23.next = 43;
            return tasksCollection.find(m1.id);
          case 43:
            fetchedM1 = _context23.sent;
            _context23.next = 46;
            return commentsCollection.find(m2.id);
          case 46:
            fetchedM2 = _context23.sent;
            expect(fetchedM1.name).toBe('bar1');
            expect(fetchedM2.body).toBe('baz1');
            _context23.next = 51;
            return tasksCollection.find(m3.id);
          case 51:
            fetchedM3 = _context23.sent;
            _context23.next = 54;
            return commentsCollection.query(Q.where('id', m4.id)).fetch();
          case 54:
            fetchedM4 = _context23.sent;
            expect(fetchedM3._raw._status).toBe('deleted');
            expect(fetchedM4.length).toBe(0);
          case 57:
          case "end":
            return _context23.stop();
        }
      }, _callee23);
    })));
    it('ignores falsy values passed', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee24() {
      var _mockDatabase10, database, tasksCollection, adapterBatchSpy, model;
      return _regenerator["default"].wrap(function _callee24$(_context24) {
        while (1) switch (_context24.prev = _context24.next) {
          case 0:
            _mockDatabase10 = (0, _testModels.mockDatabase)(), database = _mockDatabase10.database, tasksCollection = _mockDatabase10.tasks;
            adapterBatchSpy = jest.spyOn(database.adapter, 'batch');
            model = tasksCollection.prepareCreate();
            _context24.next = 5;
            return database.write(function () {
              return database.batch(null, model, false, undefined);
            });
          case 5:
            expect(adapterBatchSpy).toHaveBeenCalledTimes(1);
            expect(adapterBatchSpy).toHaveBeenLastCalledWith([['create', 'mock_tasks', model._raw]]);
          case 7:
          case "end":
            return _context24.stop();
        }
      }, _callee24);
    })));
    it("can batch with an array passed as argument", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee25() {
      var _mockDatabase11, database, tasksCollection, adapterBatchSpy, model;
      return _regenerator["default"].wrap(function _callee25$(_context25) {
        while (1) switch (_context25.prev = _context25.next) {
          case 0:
            _mockDatabase11 = (0, _testModels.mockDatabase)(), database = _mockDatabase11.database, tasksCollection = _mockDatabase11.tasks;
            adapterBatchSpy = jest.spyOn(database.adapter, 'batch');
            model = tasksCollection.prepareCreate();
            _context25.next = 5;
            return database.write(function () {
              return database.batch([null, model, false, undefined]);
            });
          case 5:
            expect(adapterBatchSpy).toHaveBeenCalledTimes(1);
            expect(adapterBatchSpy).toHaveBeenLastCalledWith([['create', 'mock_tasks', model._raw]]);
          case 7:
          case "end":
            return _context25.stop();
        }
      }, _callee25);
    })));
    it('throws error if attempting to batch records without a pending operation', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee26() {
      var _mockDatabase12, database, tasks, m1;
      return _regenerator["default"].wrap(function _callee26$(_context26) {
        while (1) switch (_context26.prev = _context26.next) {
          case 0:
            _mockDatabase12 = (0, _testModels.mockDatabase)(), database = _mockDatabase12.database, tasks = _mockDatabase12.tasks;
            _context26.next = 3;
            return database.write(function () {
              return tasks.create();
            });
          case 3:
            m1 = _context26.sent;
            _context26.next = 6;
            return (0, _utils.expectToRejectWithMessage)(database.write(function () {
              return database.batch(m1);
            }), 'prepared create/update/delete');
          case 6:
          case "end":
            return _context26.stop();
        }
      }, _callee26);
    })));
    it("throws error if attempting to batch a disposable record", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee27() {
      var _mockDatabase13, database, tasks, m1;
      return _regenerator["default"].wrap(function _callee27$(_context27) {
        while (1) switch (_context27.prev = _context27.next) {
          case 0:
            _mockDatabase13 = (0, _testModels.mockDatabase)(), database = _mockDatabase13.database, tasks = _mockDatabase13.tasks;
            m1 = tasks.disposableFromDirtyRaw({
              name: 'hello'
            });
            _context27.next = 4;
            return (0, _utils.expectToRejectWithMessage)(database.write(function () {
              return database.batch(m1);
            }), 'disposable');
          case 4:
          case "end":
            return _context27.stop();
        }
      }, _callee27);
    })));
    it('throws error if batch is called outside of a writer', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee28() {
      var _mockDatabase14, database, tasks, _yield$tasks$query$fe, _yield$tasks$query$fe2, task;
      return _regenerator["default"].wrap(function _callee28$(_context28) {
        while (1) switch (_context28.prev = _context28.next) {
          case 0:
            _mockDatabase14 = (0, _testModels.mockDatabase)(), database = _mockDatabase14.database, tasks = _mockDatabase14.tasks;
            _context28.next = 3;
            return (0, _utils.expectToRejectWithMessage)(database.batch(tasks.prepareCreate(_fp.noop)), 'can only be called from inside of a Writer');
          case 3:
            _context28.next = 5;
            return (0, _utils.expectToRejectWithMessage)(database.read(function () {
              return database.batch(tasks.prepareCreate(_fp.noop));
            }), 'can only be called from inside of a Writer');
          case 5:
            _context28.next = 7;
            return database.write(function () {
              return database.batch(tasks.prepareCreate(function (task) {
                task.name = 'foo1';
              }));
            });
          case 7:
            _context28.next = 9;
            return tasks.query().fetch();
          case 9:
            _yield$tasks$query$fe = _context28.sent;
            _yield$tasks$query$fe2 = (0, _slicedToArray2["default"])(_yield$tasks$query$fe, 1);
            task = _yield$tasks$query$fe2[0];
            expect(task.name).toBe('foo1');
          case 13:
          case "end":
            return _context28.stop();
        }
      }, _callee28);
    })));
    it("throws an error if invalid arguments", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee29() {
      var _mockDatabase15, database;
      return _regenerator["default"].wrap(function _callee29$(_context29) {
        while (1) switch (_context29.prev = _context29.next) {
          case 0:
            _mockDatabase15 = (0, _testModels.mockDatabase)(), database = _mockDatabase15.database;
            _context29.next = 3;
            return (0, _utils.expectToRejectWithMessage)(database.batch([], null), 'multiple arrays were passed');
          case 3:
          case "end":
            return _context29.stop();
        }
      }, _callee29);
    })));
    it("prints debug information in verbose mode", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee31() {
      var _mockDatabase16, database, tasks, projects, spy;
      return _regenerator["default"].wrap(function _callee31$(_context31) {
        while (1) switch (_context31.prev = _context31.next) {
          case 0:
            _mockDatabase16 = (0, _testModels.mockDatabase)(), database = _mockDatabase16.database, tasks = _mockDatabase16.tasks, projects = _mockDatabase16.projects;
            spy = jest.spyOn(_common.logger, 'debug');
            database.experimentalIsVerbose = true;
            _context31.next = 5;
            return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee30() {
              var t1, t2, p1;
              return _regenerator["default"].wrap(function _callee30$(_context30) {
                while (1) switch (_context30.prev = _context30.next) {
                  case 0:
                    t1 = tasks.prepareCreate();
                    t2 = tasks.prepareCreate();
                    p1 = projects.prepareCreate();
                    _context30.next = 5;
                    return database.batch(t1, t2, p1);
                  case 5:
                    expect(spy).toHaveBeenCalledWith("prepareCreate: mock_tasks#".concat(t1.id));
                    expect(spy).toHaveBeenCalledWith("prepareCreate: mock_tasks#".concat(t2.id));
                    expect(spy).toHaveBeenCalledWith("prepareCreate: mock_projects#".concat(p1.id));
                    expect(spy).toHaveBeenLastCalledWith("batch: create mock_tasks#".concat(t1.id, ", create mock_tasks#").concat(t2.id, ", create mock_projects#").concat(p1.id));
                    t1.prepareUpdate();
                    t2.prepareMarkAsDeleted();
                    p1.prepareDestroyPermanently();
                    _context30.next = 14;
                    return database.batch(t1, t2, p1);
                  case 14:
                    expect(spy).toHaveBeenCalledWith("prepareUpdate: mock_tasks#".concat(t1.id));
                    expect(spy).toHaveBeenCalledWith("prepareMarkAsDeleted: mock_tasks#".concat(t2.id));
                    expect(spy).toHaveBeenCalledWith("prepareDestroyPermanently: mock_projects#".concat(p1.id));
                    expect(spy).toHaveBeenLastCalledWith("batch: update mock_tasks#".concat(t1.id, ", markAsDeleted mock_tasks#").concat(t2.id, ", destroyPermanently mock_projects#").concat(p1.id));
                  case 18:
                  case "end":
                    return _context30.stop();
                }
              }, _callee30);
            })));
          case 5:
          case "end":
            return _context31.stop();
        }
      }, _callee31);
    })));
  });
  describe('Observation', function () {
    it('implements withChangesForTables', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee34() {
      var _mockDatabase17, database, projects, tasks, comments, observer, m1, m2, m3;
      return _regenerator["default"].wrap(function _callee34$(_context34) {
        while (1) switch (_context34.prev = _context34.next) {
          case 0:
            _mockDatabase17 = (0, _testModels.mockDatabase)(), database = _mockDatabase17.database, projects = _mockDatabase17.projects, tasks = _mockDatabase17.tasks, comments = _mockDatabase17.comments;
            observer = jest.fn();
            database.withChangesForTables(['mock_projects', 'mock_tasks']).subscribe(observer);
            expect(observer).toHaveBeenCalledTimes(1);
            _context34.next = 6;
            return database.write(function () {
              return projects.create();
            });
          case 6:
            _context34.next = 8;
            return database.write(function () {
              return projects.create();
            });
          case 8:
            m1 = _context34.sent;
            _context34.next = 11;
            return database.write(function () {
              return tasks.create();
            });
          case 11:
            m2 = _context34.sent;
            _context34.next = 14;
            return database.write(function () {
              return comments.create();
            });
          case 14:
            m3 = _context34.sent;
            expect(observer).toHaveBeenCalledTimes(4);
            expect(observer).toHaveBeenCalledWith([{
              record: m1,
              type: 'created'
            }]);
            expect(observer).toHaveBeenLastCalledWith([{
              record: m2,
              type: 'created'
            }]);
            _context34.next = 20;
            return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee32() {
              return _regenerator["default"].wrap(function _callee32$(_context32) {
                while (1) switch (_context32.prev = _context32.next) {
                  case 0:
                    _context32.next = 2;
                    return m1.update();
                  case 2:
                    _context32.next = 4;
                    return m2.update();
                  case 4:
                    _context32.next = 6;
                    return m3.update();
                  case 6:
                  case "end":
                    return _context32.stop();
                }
              }, _callee32);
            })));
          case 20:
            expect(observer).toHaveBeenCalledTimes(6);
            expect(observer).toHaveBeenLastCalledWith([{
              record: m2,
              type: 'updated'
            }]);
            _context34.next = 24;
            return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee33() {
              return _regenerator["default"].wrap(function _callee33$(_context33) {
                while (1) switch (_context33.prev = _context33.next) {
                  case 0:
                    _context33.next = 2;
                    return m1.destroyPermanently();
                  case 2:
                    _context33.next = 4;
                    return m2.destroyPermanently();
                  case 4:
                    _context33.next = 6;
                    return m3.destroyPermanently();
                  case 6:
                  case "end":
                    return _context33.stop();
                }
              }, _callee33);
            })));
          case 24:
            expect(observer).toHaveBeenCalledTimes(8);
            expect(observer).toHaveBeenCalledWith([{
              record: m1,
              type: 'destroyed'
            }]);
            expect(observer).toHaveBeenLastCalledWith([{
              record: m2,
              type: 'destroyed'
            }]);
          case 27:
          case "end":
            return _context34.stop();
        }
      }, _callee34);
    })));
    it('can subscribe to change signals for particular tables', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee35() {
      var _mockDatabase18, database, projects, tasks, comments, subscriber1, unsubscribe1, subscriber2, unsubscribe2, subscriber3, unsubscribe3, p1;
      return _regenerator["default"].wrap(function _callee35$(_context35) {
        while (1) switch (_context35.prev = _context35.next) {
          case 0:
            _mockDatabase18 = (0, _testModels.mockDatabase)(), database = _mockDatabase18.database, projects = _mockDatabase18.projects, tasks = _mockDatabase18.tasks, comments = _mockDatabase18.comments;
            subscriber1 = jest.fn();
            unsubscribe1 = database.experimentalSubscribe([], subscriber1);
            _context35.next = 5;
            return database.write(function () {
              return tasks.create();
            });
          case 5:
            subscriber2 = jest.fn();
            unsubscribe2 = database.experimentalSubscribe(['mock_tasks'], subscriber2);
            subscriber3 = jest.fn();
            unsubscribe3 = database.experimentalSubscribe(['mock_tasks', 'mock_projects'], subscriber3);
            _context35.next = 11;
            return database.write(function () {
              return projects.create();
            });
          case 11:
            p1 = _context35.sent;
            _context35.next = 14;
            return database.write(function () {
              return tasks.create();
            });
          case 14:
            _context35.next = 16;
            return database.write(function () {
              return comments.create();
            });
          case 16:
            expect(subscriber1).toHaveBeenCalledTimes(0);
            expect(subscriber2).toHaveBeenCalledTimes(1);
            expect(subscriber3).toHaveBeenCalledTimes(2);
            expect(subscriber2).toHaveBeenLastCalledWith();
            _context35.next = 22;
            return database.write(function () {
              return database.batch(projects.prepareCreate(), projects.prepareCreate(), tasks.prepareCreate());
            });
          case 22:
            expect(subscriber2).toHaveBeenCalledTimes(2);
            expect(subscriber3).toHaveBeenCalledTimes(3);
            _context35.next = 26;
            return database.write(function () {
              return p1.update();
            });
          case 26:
            expect(subscriber2).toHaveBeenCalledTimes(2);
            expect(subscriber3).toHaveBeenCalledTimes(4);
            unsubscribe1();
            unsubscribe2();
            _context35.next = 32;
            return database.write(function () {
              return database.batch(tasks.prepareCreate(), p1.prepareDestroyPermanently());
            });
          case 32:
            expect(subscriber1).toHaveBeenCalledTimes(0);
            expect(subscriber2).toHaveBeenCalledTimes(2);
            expect(subscriber3).toHaveBeenCalledTimes(5);
            unsubscribe3();
          case 36:
          case "end":
            return _context35.stop();
        }
      }, _callee35);
    })));
    it('unsubscribe can safely be called more than once', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee36() {
      var _mockDatabase19, database, tasks, subscriber1, unsubscribe1, unsubscribe2;
      return _regenerator["default"].wrap(function _callee36$(_context36) {
        while (1) switch (_context36.prev = _context36.next) {
          case 0:
            _mockDatabase19 = (0, _testModels.mockDatabase)(), database = _mockDatabase19.database, tasks = _mockDatabase19.tasks;
            subscriber1 = jest.fn();
            unsubscribe1 = database.experimentalSubscribe(['mock_tasks'], subscriber1);
            expect(subscriber1).toHaveBeenCalledTimes(0);
            unsubscribe2 = database.experimentalSubscribe(['mock_tasks'], function () {});
            unsubscribe2();
            unsubscribe2();
            _context36.next = 9;
            return database.write(function () {
              return tasks.create();
            });
          case 9:
            expect(subscriber1).toHaveBeenCalledTimes(1);
            unsubscribe1();
          case 11:
          case "end":
            return _context36.stop();
        }
      }, _callee36);
    })));
    it("can subscribe with the same subscriber multiple times", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee37() {
      var _mockDatabase20, database, tasks, subscriber, unsubscribe1, unsubscribe2;
      return _regenerator["default"].wrap(function _callee37$(_context37) {
        while (1) switch (_context37.prev = _context37.next) {
          case 0:
            _mockDatabase20 = (0, _testModels.mockDatabase)(), database = _mockDatabase20.database, tasks = _mockDatabase20.tasks;
            subscriber = jest.fn();
            unsubscribe1 = database.experimentalSubscribe(['mock_tasks'], subscriber);
            _context37.next = 5;
            return database.write(function () {
              return tasks.create();
            });
          case 5:
            expect(subscriber).toHaveBeenCalledTimes(1);
            unsubscribe2 = database.experimentalSubscribe(['mock_tasks'], subscriber);
            _context37.next = 9;
            return database.write(function () {
              return tasks.create();
            });
          case 9:
            expect(subscriber).toHaveBeenCalledTimes(3);
            unsubscribe2();
            unsubscribe2(); // noop
            _context37.next = 14;
            return database.write(function () {
              return tasks.create();
            });
          case 14:
            expect(subscriber).toHaveBeenCalledTimes(4);
            unsubscribe1();
            _context37.next = 18;
            return database.write(function () {
              return tasks.create();
            });
          case 18:
            expect(subscriber).toHaveBeenCalledTimes(4);
          case 19:
          case "end":
            return _context37.stop();
        }
      }, _callee37);
    })));
    it('has new objects cached before calling subscribers (regression test)', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee38() {
      var _mockDatabase21, database, projects, tasks, project, task, observerCalled, taskPromise, observer;
      return _regenerator["default"].wrap(function _callee38$(_context38) {
        while (1) switch (_context38.prev = _context38.next) {
          case 0:
            _mockDatabase21 = (0, _testModels.mockDatabase)(), database = _mockDatabase21.database, projects = _mockDatabase21.projects, tasks = _mockDatabase21.tasks;
            project = projects.prepareCreate();
            task = tasks.prepareCreate(function (t) {
              t.project.set(project);
            });
            observerCalled = 0;
            taskPromise = null;
            observer = jest.fn(function () {
              observerCalled += 1;
              if (observerCalled === 1) {
                // nothing happens
              } else if (observerCalled === 2) {
                taskPromise = tasks.find(task.id);
              }
            });
            database.withChangesForTables(['mock_projects']).subscribe(observer);
            expect(observer).toHaveBeenCalledTimes(1);
            _context38.next = 10;
            return database.write(function () {
              return database.batch(project, task);
            });
          case 10:
            expect(observer).toHaveBeenCalledTimes(2);

            // check if task is already cached
            _context38.t0 = expect;
            _context38.next = 14;
            return taskPromise;
          case 14:
            _context38.t1 = _context38.sent;
            (0, _context38.t0)(_context38.t1).toBe(task);
          case 16:
          case "end":
            return _context38.stop();
        }
      }, _callee38);
    })));
  });
  var delayPromise = function delayPromise() {
    return new Promise(function (resolve) {
      setTimeout(resolve, 100);
    });
  };
  describe('Database readers/writers', function () {
    it('can execute a writer block', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee39() {
      var _mockDatabase22, database, action;
      return _regenerator["default"].wrap(function _callee39$(_context39) {
        while (1) switch (_context39.prev = _context39.next) {
          case 0:
            _mockDatabase22 = (0, _testModels.mockDatabase)(), database = _mockDatabase22.database;
            action = jest.fn(function () {
              return Promise.resolve(true);
            });
            _context39.next = 4;
            return database.write(action);
          case 4:
            expect(action).toHaveBeenCalledTimes(1);
          case 5:
          case "end":
            return _context39.stop();
        }
      }, _callee39);
    })));
    it('queues writers/readers', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee41() {
      var _mockDatabase23, database, actions, promise0, promise2, writer3, promise3;
      return _regenerator["default"].wrap(function _callee41$(_context41) {
        while (1) switch (_context41.prev = _context41.next) {
          case 0:
            _mockDatabase23 = (0, _testModels.mockDatabase)(), database = _mockDatabase23.database;
            actions = [jest.fn(delayPromise), jest.fn(delayPromise), jest.fn(delayPromise)];
            promise0 = database.write(actions[0]);
            database.read(actions[1]);
            expect(actions[0]).toHaveBeenCalledTimes(1);
            expect(actions[1]).toHaveBeenCalledTimes(0);
            _context41.next = 8;
            return promise0;
          case 8:
            promise2 = database.write(actions[2]);
            expect(actions[0]).toHaveBeenCalledTimes(1);
            expect(actions[1]).toHaveBeenCalledTimes(0);
            expect(actions[2]).toHaveBeenCalledTimes(0);
            _context41.next = 14;
            return promise2;
          case 14:
            expect(actions[0]).toHaveBeenCalledTimes(1);
            expect(actions[1]).toHaveBeenCalledTimes(1);
            expect(actions[2]).toHaveBeenCalledTimes(1);

            // after queue is empty I can queue again and have result immediately
            writer3 = jest.fn(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee40() {
              return _regenerator["default"].wrap(function _callee40$(_context40) {
                while (1) switch (_context40.prev = _context40.next) {
                  case 0:
                    return _context40.abrupt("return", 42);
                  case 1:
                  case "end":
                    return _context40.stop();
                }
              }, _callee40);
            })));
            promise3 = database.write(writer3);
            expect(writer3).toHaveBeenCalledTimes(1);
            _context41.next = 22;
            return promise3;
          case 22:
          case "end":
            return _context41.stop();
        }
      }, _callee41);
    })));
    it('returns value from reader/writer', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee44() {
      var _mockDatabase24, database;
      return _regenerator["default"].wrap(function _callee44$(_context44) {
        while (1) switch (_context44.prev = _context44.next) {
          case 0:
            _mockDatabase24 = (0, _testModels.mockDatabase)(), database = _mockDatabase24.database;
            _context44.t0 = expect;
            _context44.next = 4;
            return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee42() {
              return _regenerator["default"].wrap(function _callee42$(_context42) {
                while (1) switch (_context42.prev = _context42.next) {
                  case 0:
                    return _context42.abrupt("return", 42);
                  case 1:
                  case "end":
                    return _context42.stop();
                }
              }, _callee42);
            })));
          case 4:
            _context44.t1 = _context44.sent;
            (0, _context44.t0)(_context44.t1).toBe(42);
            _context44.t2 = expect;
            _context44.next = 9;
            return database.read(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee43() {
              return _regenerator["default"].wrap(function _callee43$(_context43) {
                while (1) switch (_context43.prev = _context43.next) {
                  case 0:
                    return _context43.abrupt("return", 420);
                  case 1:
                  case "end":
                    return _context43.stop();
                }
              }, _callee43);
            })));
          case 9:
            _context44.t3 = _context44.sent;
            (0, _context44.t2)(_context44.t3).toBe(420);
          case 11:
          case "end":
            return _context44.stop();
        }
      }, _callee44);
    })));
    it('passes error from reader/writer', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee46() {
      var _mockDatabase25, database;
      return _regenerator["default"].wrap(function _callee46$(_context46) {
        while (1) switch (_context46.prev = _context46.next) {
          case 0:
            _mockDatabase25 = (0, _testModels.mockDatabase)(), database = _mockDatabase25.database;
            _context46.next = 3;
            return (0, _utils.expectToRejectWithMessage)(database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee45() {
              return _regenerator["default"].wrap(function _callee45$(_context45) {
                while (1) switch (_context45.prev = _context45.next) {
                  case 0:
                    throw new Error('test error');
                  case 1:
                  case "end":
                    return _context45.stop();
                }
              }, _callee45);
            }))), 'test error');
          case 3:
          case "end":
            return _context46.stop();
        }
      }, _callee46);
    })));
    it("can distinguish between writers and readers running", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee48() {
      var _mockDatabase26, db, actions, promise0, promise2, promise3;
      return _regenerator["default"].wrap(function _callee48$(_context48) {
        while (1) switch (_context48.prev = _context48.next) {
          case 0:
            _mockDatabase26 = (0, _testModels.mockDatabase)(), db = _mockDatabase26.db;
            actions = [jest.fn(delayPromise), jest.fn(delayPromise), jest.fn(delayPromise)];
            promise0 = db.write(actions[0]);
            db.read(actions[1]);
            expect(db._workQueue.isWriterRunning).toBe(true);
            _context48.next = 7;
            return promise0;
          case 7:
            promise2 = db.write(actions[2]);
            expect(db._workQueue.isWriterRunning).toBe(false);
            _context48.next = 11;
            return promise2;
          case 11:
            expect(db._workQueue.isWriterRunning).toBe(false);
            promise3 = db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee47() {
              return _regenerator["default"].wrap(function _callee47$(_context47) {
                while (1) switch (_context47.prev = _context47.next) {
                  case 0:
                    return _context47.abrupt("return", 42);
                  case 1:
                  case "end":
                    return _context47.stop();
                }
              }, _callee47);
            })));
            expect(db._workQueue.isWriterRunning).toBe(true);
            _context48.next = 16;
            return promise3;
          case 16:
            expect(db._workQueue.isWriterRunning).toBe(false);
          case 17:
          case "end":
            return _context48.stop();
        }
      }, _callee48);
    })));
    it('queues actions correctly even if some error out', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee53() {
      var _mockDatabase27, database, actions, promises, action5, promise5;
      return _regenerator["default"].wrap(function _callee53$(_context53) {
        while (1) switch (_context53.prev = _context53.next) {
          case 0:
            _mockDatabase27 = (0, _testModels.mockDatabase)(), database = _mockDatabase27.database;
            actions = [/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee49() {
              return _regenerator["default"].wrap(function _callee49$(_context49) {
                while (1) switch (_context49.prev = _context49.next) {
                  case 0:
                    return _context49.abrupt("return", true);
                  case 1:
                  case "end":
                    return _context49.stop();
                }
              }, _callee49);
            })), /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee50() {
              return _regenerator["default"].wrap(function _callee50$(_context50) {
                while (1) switch (_context50.prev = _context50.next) {
                  case 0:
                    throw new Error('error1');
                  case 1:
                  case "end":
                    return _context50.stop();
                }
              }, _callee50);
            })), /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee51() {
              return _regenerator["default"].wrap(function _callee51$(_context51) {
                while (1) switch (_context51.prev = _context51.next) {
                  case 0:
                    _context51.next = 2;
                    return delayPromise();
                  case 2:
                    return _context51.abrupt("return", 42);
                  case 3:
                  case "end":
                    return _context51.stop();
                }
              }, _callee51);
            })), function () {
              throw new Error('error2'); // sync error
            }, function () {
              return delayPromise();
            }];
            promises = actions.map(function (action) {
              return database.write(action).then(
              // jest will automatically fail the test if a promise rejects even though we're testing it later
              function (value) {
                return ['value', value];
              }, function (error) {
                return ['error', error];
              });
            });
            _context53.next = 5;
            return promises[4];
          case 5:
            // after queue is empty I can queue again
            action5 = jest.fn(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee52() {
              return _regenerator["default"].wrap(function _callee52$(_context52) {
                while (1) switch (_context52.prev = _context52.next) {
                  case 0:
                    return _context52.abrupt("return", 42);
                  case 1:
                  case "end":
                    return _context52.stop();
                }
              }, _callee52);
            })));
            promise5 = database.read(action5);
            expect(action5).toHaveBeenCalledTimes(1);

            // check if right answers
            _context53.t0 = expect;
            _context53.next = 11;
            return promises[0];
          case 11:
            _context53.t1 = _context53.sent;
            (0, _context53.t0)(_context53.t1).toEqual(['value', true]);
            _context53.t2 = expect;
            _context53.next = 16;
            return promises[1];
          case 16:
            _context53.t3 = _context53.sent;
            (0, _context53.t2)(_context53.t3).toMatchObject(['error', {
              message: 'error1'
            }]);
            _context53.t4 = expect;
            _context53.next = 21;
            return promises[2];
          case 21:
            _context53.t5 = _context53.sent;
            (0, _context53.t4)(_context53.t5).toEqual(['value', 42]);
            _context53.t6 = expect;
            _context53.next = 26;
            return promises[3];
          case 26:
            _context53.t7 = _context53.sent;
            (0, _context53.t6)(_context53.t7).toMatchObject(['error', {
              message: 'error2'
            }]);
            _context53.t8 = expect;
            _context53.next = 31;
            return promises[4];
          case 31:
            _context53.t9 = _context53.sent;
            (0, _context53.t8)(_context53.t9).toEqual(['value', undefined]);
            _context53.next = 35;
            return promise5;
          case 35:
          case "end":
            return _context53.stop();
        }
      }, _callee53);
    })));
    it('action calling another action directly will get stuck', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee55() {
      var _mockDatabase28, database, called, subaction;
      return _regenerator["default"].wrap(function _callee55$(_context55) {
        while (1) switch (_context55.prev = _context55.next) {
          case 0:
            _mockDatabase28 = (0, _testModels.mockDatabase)(), database = _mockDatabase28.database;
            called = 0;
            subaction = function subaction() {
              return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee54() {
                return _regenerator["default"].wrap(function _callee54$(_context54) {
                  while (1) switch (_context54.prev = _context54.next) {
                    case 0:
                      called += 1;
                    case 1:
                    case "end":
                      return _context54.stop();
                  }
                }, _callee54);
              })));
            };
            _context55.next = 5;
            return database.write(function () {
              subaction();
              return delayPromise(); // don't await subaction, just see it will never be called
            });
          case 5:
            expect(called).toBe(0);
          case 6:
          case "end":
            return _context55.stop();
        }
      }, _callee55);
    })));
    it("can call readers with callReader", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee59() {
      var _mockDatabase29, db, action1, action2, action3;
      return _regenerator["default"].wrap(function _callee59$(_context59) {
        while (1) switch (_context59.prev = _context59.next) {
          case 0:
            _mockDatabase29 = (0, _testModels.mockDatabase)(), db = _mockDatabase29.db;
            action1 = function action1() {
              return db.read(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee56() {
                return _regenerator["default"].wrap(function _callee56$(_context56) {
                  while (1) switch (_context56.prev = _context56.next) {
                    case 0:
                      return _context56.abrupt("return", 42);
                    case 1:
                    case "end":
                      return _context56.stop();
                  }
                }, _callee56);
              })));
            };
            action2 = function action2() {
              return db.read(/*#__PURE__*/function () {
                var _ref58 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee57(reader) {
                  return _regenerator["default"].wrap(function _callee57$(_context57) {
                    while (1) switch (_context57.prev = _context57.next) {
                      case 0:
                        return _context57.abrupt("return", reader.callReader(function () {
                          return action1();
                        }));
                      case 1:
                      case "end":
                        return _context57.stop();
                    }
                  }, _callee57);
                }));
                return function (_x) {
                  return _ref58.apply(this, arguments);
                };
              }());
            };
            action3 = function action3() {
              return db.read(/*#__PURE__*/function () {
                var _ref59 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee58(reader) {
                  return _regenerator["default"].wrap(function _callee58$(_context58) {
                    while (1) switch (_context58.prev = _context58.next) {
                      case 0:
                        return _context58.abrupt("return", reader.callReader(function () {
                          return action2();
                        }));
                      case 1:
                      case "end":
                        return _context58.stop();
                    }
                  }, _callee58);
                }));
                return function (_x2) {
                  return _ref59.apply(this, arguments);
                };
              }());
            };
            _context59.t0 = expect;
            _context59.next = 7;
            return action3();
          case 7:
            _context59.t1 = _context59.sent;
            (0, _context59.t0)(_context59.t1).toBe(42);
          case 9:
          case "end":
            return _context59.stop();
        }
      }, _callee59);
    })));
    it("can call writers with callWriter", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee63() {
      var _mockDatabase30, db, action0, action1, action2;
      return _regenerator["default"].wrap(function _callee63$(_context63) {
        while (1) switch (_context63.prev = _context63.next) {
          case 0:
            _mockDatabase30 = (0, _testModels.mockDatabase)(), db = _mockDatabase30.db;
            action0 = function action0() {
              return db.read(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee60() {
                return _regenerator["default"].wrap(function _callee60$(_context60) {
                  while (1) switch (_context60.prev = _context60.next) {
                    case 0:
                      return _context60.abrupt("return", 42);
                    case 1:
                    case "end":
                      return _context60.stop();
                  }
                }, _callee60);
              })));
            };
            action1 = function action1() {
              return db.write(/*#__PURE__*/function () {
                var _ref62 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee61(writer) {
                  return _regenerator["default"].wrap(function _callee61$(_context61) {
                    while (1) switch (_context61.prev = _context61.next) {
                      case 0:
                        return _context61.abrupt("return", writer.callReader(function () {
                          return action0();
                        }));
                      case 1:
                      case "end":
                        return _context61.stop();
                    }
                  }, _callee61);
                }));
                return function (_x3) {
                  return _ref62.apply(this, arguments);
                };
              }());
            };
            action2 = function action2() {
              return db.write(/*#__PURE__*/function () {
                var _ref63 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee62(writer) {
                  return _regenerator["default"].wrap(function _callee62$(_context62) {
                    while (1) switch (_context62.prev = _context62.next) {
                      case 0:
                        return _context62.abrupt("return", writer.callWriter(function () {
                          return action1();
                        }));
                      case 1:
                      case "end":
                        return _context62.stop();
                    }
                  }, _callee62);
                }));
                return function (_x4) {
                  return _ref63.apply(this, arguments);
                };
              }());
            };
            _context63.t0 = expect;
            _context63.next = 7;
            return action2();
          case 7:
            _context63.t1 = _context63.sent;
            (0, _context63.t0)(_context63.t1).toBe(42);
          case 9:
          case "end":
            return _context63.stop();
        }
      }, _callee63);
    })));
    it("cannot call writers from readers", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee67() {
      var _mockDatabase31, db, writer;
      return _regenerator["default"].wrap(function _callee67$(_context67) {
        while (1) switch (_context67.prev = _context67.next) {
          case 0:
            _mockDatabase31 = (0, _testModels.mockDatabase)(), db = _mockDatabase31.db;
            writer = function writer() {
              return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee64() {
                return _regenerator["default"].wrap(function _callee64$(_context64) {
                  while (1) switch (_context64.prev = _context64.next) {
                    case 0:
                      return _context64.abrupt("return", 42);
                    case 1:
                    case "end":
                      return _context64.stop();
                  }
                }, _callee64);
              })));
            };
            _context67.next = 4;
            return (0, _utils.expectToRejectWithMessage)(db.read(/*#__PURE__*/function () {
              var _ref66 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee65(reader) {
                return _regenerator["default"].wrap(function _callee65$(_context65) {
                  while (1) switch (_context65.prev = _context65.next) {
                    case 0:
                      return _context65.abrupt("return", reader.callWriter(function () {
                        return writer();
                      }));
                    case 1:
                    case "end":
                      return _context65.stop();
                  }
                }, _callee65);
              }));
              return function (_x5) {
                return _ref66.apply(this, arguments);
              };
            }()), 'is not a function');
          case 4:
            _context67.next = 6;
            return (0, _utils.expectToRejectWithMessage)(db.read(/*#__PURE__*/function () {
              var _ref67 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee66(reader) {
                return _regenerator["default"].wrap(function _callee66$(_context66) {
                  while (1) switch (_context66.prev = _context66.next) {
                    case 0:
                      return _context66.abrupt("return", reader.callReader(function () {
                        return writer();
                      }));
                    case 1:
                    case "end":
                      return _context66.stop();
                  }
                }, _callee66);
              }));
              return function (_x6) {
                return _ref67.apply(this, arguments);
              };
            }()), 'Cannot call a writer block from a reader block');
          case 6:
          case "end":
            return _context67.stop();
        }
      }, _callee67);
    })));
    it('sub actions skip the line only once', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee70() {
      var _mockDatabase32, db, called1, called2, action1, action2;
      return _regenerator["default"].wrap(function _callee70$(_context70) {
        while (1) switch (_context70.prev = _context70.next) {
          case 0:
            _mockDatabase32 = (0, _testModels.mockDatabase)(), db = _mockDatabase32.db;
            called1 = 0;
            called2 = 0;
            action1 = function action1() {
              return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee68() {
                return _regenerator["default"].wrap(function _callee68$(_context68) {
                  while (1) switch (_context68.prev = _context68.next) {
                    case 0:
                      called1 += 1;
                    case 1:
                    case "end":
                      return _context68.stop();
                  }
                }, _callee68);
              })));
            };
            action2 = function action2() {
              return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee69() {
                return _regenerator["default"].wrap(function _callee69$(_context69) {
                  while (1) switch (_context69.prev = _context69.next) {
                    case 0:
                      called2 += 1;
                    case 1:
                    case "end":
                      return _context69.stop();
                  }
                }, _callee69);
              })));
            };
            _context70.next = 7;
            return db.write(function (writer) {
              writer.callWriter(function () {
                return action1();
              });
              action2();
              return delayPromise(); // don't await subaction, just see it will never be called
            });
          case 7:
            expect(called1).toBe(1);
            expect(called2).toBe(0);
          case 9:
          case "end":
            return _context70.stop();
        }
      }, _callee70);
    })));
    it("ensures that callReader/callWriter calls a reader/writer", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee77() {
      var _mockDatabase33, db, expectError, action;
      return _regenerator["default"].wrap(function _callee77$(_context77) {
        while (1) switch (_context77.prev = _context77.next) {
          case 0:
            _mockDatabase33 = (0, _testModels.mockDatabase)(), db = _mockDatabase33.db;
            expectError = function expectError(promise) {
              return (0, _utils.expectToRejectWithMessage)(promise, 'callReader/callWriter call must call a reader/writer synchronously');
            };
            action = function action() {
              return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee71() {
                return _regenerator["default"].wrap(function _callee71$(_context71) {
                  while (1) switch (_context71.prev = _context71.next) {
                    case 0:
                      return _context71.abrupt("return", 42);
                    case 1:
                    case "end":
                      return _context71.stop();
                  }
                }, _callee71);
              })));
            };
            _context77.next = 5;
            return expectError(db.write(/*#__PURE__*/function () {
              var _ref73 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee72(writer) {
                return _regenerator["default"].wrap(function _callee72$(_context72) {
                  while (1) switch (_context72.prev = _context72.next) {
                    case 0:
                      return _context72.abrupt("return", writer.callWriter(function () {}));
                    case 1:
                    case "end":
                      return _context72.stop();
                  }
                }, _callee72);
              }));
              return function (_x7) {
                return _ref73.apply(this, arguments);
              };
            }()));
          case 5:
            _context77.next = 7;
            return expectError(db.write(/*#__PURE__*/function () {
              var _ref74 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee73(writer) {
                return _regenerator["default"].wrap(function _callee73$(_context73) {
                  while (1) switch (_context73.prev = _context73.next) {
                    case 0:
                      return _context73.abrupt("return", writer.callReader(function () {}));
                    case 1:
                    case "end":
                      return _context73.stop();
                  }
                }, _callee73);
              }));
              return function (_x8) {
                return _ref74.apply(this, arguments);
              };
            }()));
          case 7:
            _context77.next = 9;
            return expectError(db.read(/*#__PURE__*/function () {
              var _ref75 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee74(reader) {
                return _regenerator["default"].wrap(function _callee74$(_context74) {
                  while (1) switch (_context74.prev = _context74.next) {
                    case 0:
                      return _context74.abrupt("return", reader.callReader(function () {}));
                    case 1:
                    case "end":
                      return _context74.stop();
                  }
                }, _callee74);
              }));
              return function (_x9) {
                return _ref75.apply(this, arguments);
              };
            }()));
          case 9:
            _context77.next = 11;
            return expectError(db.write(/*#__PURE__*/function () {
              var _ref76 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee76(writer) {
                return _regenerator["default"].wrap(function _callee76$(_context76) {
                  while (1) switch (_context76.prev = _context76.next) {
                    case 0:
                      return _context76.abrupt("return", writer.callWriter(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee75() {
                        return _regenerator["default"].wrap(function _callee75$(_context75) {
                          while (1) switch (_context75.prev = _context75.next) {
                            case 0:
                              _context75.next = 2;
                              return delayPromise();
                            case 2:
                              return _context75.abrupt("return", action());
                            case 3:
                            case "end":
                              return _context75.stop();
                          }
                        }, _callee75);
                      }))));
                    case 1:
                    case "end":
                      return _context76.stop();
                  }
                }, _callee76);
              }));
              return function (_x10) {
                return _ref76.apply(this, arguments);
              };
            }()));
          case 11:
          case "end":
            return _context77.stop();
        }
      }, _callee77);
    })));
    it("can batch from a writer interface", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee79() {
      var _mockDatabase34, db, tasks, adapterBatchSpy, t1, t2;
      return _regenerator["default"].wrap(function _callee79$(_context79) {
        while (1) switch (_context79.prev = _context79.next) {
          case 0:
            _mockDatabase34 = (0, _testModels.mockDatabase)(), db = _mockDatabase34.db, tasks = _mockDatabase34.tasks;
            adapterBatchSpy = jest.spyOn(db.adapter, 'batch');
            _context79.next = 4;
            return db.write(/*#__PURE__*/function () {
              var _ref79 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee78(writer) {
                return _regenerator["default"].wrap(function _callee78$(_context78) {
                  while (1) switch (_context78.prev = _context78.next) {
                    case 0:
                      _context78.next = 2;
                      return tasks.create();
                    case 2:
                      t1 = _context78.sent;
                      t2 = tasks.prepareCreate();
                      _context78.next = 6;
                      return writer.batch(t2, t1.prepareUpdate(function () {}), null, false, undefined);
                    case 6:
                    case "end":
                      return _context78.stop();
                  }
                }, _callee78);
              }));
              return function (_x11) {
                return _ref79.apply(this, arguments);
              };
            }());
          case 4:
            expect(adapterBatchSpy).toHaveBeenCalledTimes(2);
            expect(adapterBatchSpy).toHaveBeenLastCalledWith([['create', 'mock_tasks', t2._raw], ['update', 'mock_tasks', t1._raw]]);
          case 6:
          case "end":
            return _context79.stop();
        }
      }, _callee79);
    })));
    it("ensures that reader/writer interface is not used after block is done", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee83() {
      var _mockDatabase35, db, sth, saved, action0, promise, expectError;
      return _regenerator["default"].wrap(function _callee83$(_context83) {
        while (1) switch (_context83.prev = _context83.next) {
          case 0:
            _mockDatabase35 = (0, _testModels.mockDatabase)(), db = _mockDatabase35.db;
            sth = function sth() {
              return db.read(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee80() {
                return _regenerator["default"].wrap(function _callee80$(_context80) {
                  while (1) switch (_context80.prev = _context80.next) {
                    case 0:
                      return _context80.abrupt("return", 42);
                    case 1:
                    case "end":
                      return _context80.stop();
                  }
                }, _callee80);
              })));
            };
            action0 = function action0() {
              return db.write(/*#__PURE__*/function () {
                var _ref82 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee81(writer) {
                  return _regenerator["default"].wrap(function _callee81$(_context81) {
                    while (1) switch (_context81.prev = _context81.next) {
                      case 0:
                        saved = writer;
                      case 1:
                      case "end":
                        return _context81.stop();
                    }
                  }, _callee81);
                }));
                return function (_x12) {
                  return _ref82.apply(this, arguments);
                };
              }());
            };
            promise = action0();
            saved.callReader(function () {
              return sth();
            });
            saved.callWriter(function () {
              return sth();
            });
            saved.batch();
            _context83.next = 9;
            return promise;
          case 9:
            expectError = function expectError(work) {
              return expect(work).toThrow('Illegal call on a reader/writer that should no longer be running');
            };
            expectError(function () {
              return saved.callReader(function () {
                return sth();
              });
            });
            expectError(function () {
              return saved.callWriter(function () {
                return sth();
              });
            });
            expectError(function () {
              return saved.batch();
            });
            db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee82() {
              return _regenerator["default"].wrap(function _callee82$(_context82) {
                while (1) switch (_context82.prev = _context82.next) {
                  case 0:
                  case "end":
                    return _context82.stop();
                }
              }, _callee82);
            })));
            expectError(function () {
              return saved.callReader(function () {
                return sth();
              });
            });
          case 15:
          case "end":
            return _context83.stop();
        }
      }, _callee83);
    })));
    it('aborts all pending actions if database is reset', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee90() {
      var _mockDatabase36, database, promise1, promise2, promise3, dangerousActionsCalled, safeActionsCalled, manyActions, promises;
      return _regenerator["default"].wrap(function _callee90$(_context90) {
        while (1) switch (_context90.prev = _context90.next) {
          case 0:
            _mockDatabase36 = (0, _testModels.mockDatabase)(), database = _mockDatabase36.database;
            dangerousActionsCalled = 0;
            safeActionsCalled = 0;
            manyActions = /*#__PURE__*/function () {
              var _ref85 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee87() {
                return _regenerator["default"].wrap(function _callee87$(_context87) {
                  while (1) switch (_context87.prev = _context87.next) {
                    case 0:
                      // this will be called before reset:
                      promise1 = database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee84() {
                        return _regenerator["default"].wrap(function _callee84$(_context84) {
                          while (1) switch (_context84.prev = _context84.next) {
                            case 0:
                              return _context84.abrupt("return", 1);
                            case 1:
                            case "end":
                              return _context84.stop();
                          }
                        }, _callee84);
                      })));
                      _context87.next = 3;
                      return promise1;
                    case 3:
                      // this will be called after reset:
                      promise2 = database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee85() {
                        return _regenerator["default"].wrap(function _callee85$(_context85) {
                          while (1) switch (_context85.prev = _context85.next) {
                            case 0:
                              dangerousActionsCalled += 1;
                            case 1:
                            case "end":
                              return _context85.stop();
                          }
                        }, _callee85);
                      })));
                      _context87.next = 6;
                      return promise2;
                    case 6:
                      promise3 = database.read(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee86() {
                        return _regenerator["default"].wrap(function _callee86$(_context86) {
                          while (1) switch (_context86.prev = _context86.next) {
                            case 0:
                              dangerousActionsCalled += 1;
                            case 1:
                            case "end":
                              return _context86.stop();
                          }
                        }, _callee86);
                      })));
                      _context87.next = 9;
                      return promise3;
                    case 9:
                    case "end":
                      return _context87.stop();
                  }
                }, _callee87);
              }));
              return function manyActions() {
                return _ref85.apply(this, arguments);
              };
            }();
            promises = manyActions()["catch"](function (e) {
              return e;
            });
            _context90.next = 7;
            return database.write(function () {
              return database.unsafeResetDatabase();
            });
          case 7:
            _context90.next = 9;
            return Promise.all([database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee88() {
              return _regenerator["default"].wrap(function _callee88$(_context88) {
                while (1) switch (_context88.prev = _context88.next) {
                  case 0:
                    safeActionsCalled += 1;
                  case 1:
                  case "end":
                    return _context88.stop();
                }
              }, _callee88);
            }))), database.read(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee89() {
              return _regenerator["default"].wrap(function _callee89$(_context89) {
                while (1) switch (_context89.prev = _context89.next) {
                  case 0:
                    safeActionsCalled += 1;
                  case 1:
                  case "end":
                    return _context89.stop();
                }
              }, _callee89);
            })))]);
          case 9:
            _context90.t0 = expect;
            _context90.next = 12;
            return promises;
          case 12:
            _context90.t1 = _context90.sent;
            (0, _context90.t0)(_context90.t1).toMatchObject({
              message: expect.stringMatching('database was reset')
            });
            _context90.t2 = expect;
            _context90.next = 17;
            return promise1;
          case 17:
            _context90.t3 = _context90.sent;
            (0, _context90.t2)(_context90.t3).toBe(1);
            _context90.next = 21;
            return (0, _utils.expectToRejectWithMessage)(promise2, 'database was reset');
          case 21:
            expect(promise3).toBe(undefined); // code will never reach this point
            expect(dangerousActionsCalled).toBe(0);
            expect(safeActionsCalled).toBe(2);
          case 24:
          case "end":
            return _context90.stop();
        }
      }, _callee90);
    })));
  });
});