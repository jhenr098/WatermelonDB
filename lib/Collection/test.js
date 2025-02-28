"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _utils = require("../__tests__/utils");
var _fp = require("../utils/fp");
var _Query = _interopRequireDefault(require("../Query"));
var Q = _interopRequireWildcard(require("../QueryDescription"));
var _common = require("../utils/common");
var _Result = require("../utils/fp/Result");
var _testModels = require("../__tests__/testModels");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var mockQuery = function mockQuery(collection) {
  return new _Query["default"](collection, [Q.where('a', 'b')]);
};
describe('Collection', function () {
  it("exposes database", function () {
    var _mockDatabase = (0, _testModels.mockDatabase)(),
      db = _mockDatabase.db,
      projects = _mockDatabase.projects;
    expect(projects.database).toBe(db);
    expect(projects.db).toBe(db);
  });
  it('exposes schema', function () {
    var _mockDatabase2 = (0, _testModels.mockDatabase)(),
      tasks = _mockDatabase2.tasks,
      projects = _mockDatabase2.projects;
    expect(tasks.schema).toBe(_testModels.testSchema.tables.mock_tasks);
    expect(tasks.schema.name).toBe('mock_tasks');
    expect(tasks.schema.columns.name).toEqual({
      name: 'name',
      type: 'string'
    });
    expect(projects.schema).toBe(_testModels.testSchema.tables.mock_projects);
  });
  it("exposes query()", function () {
    var _mockDatabase3 = (0, _testModels.mockDatabase)(),
      tasks = _mockDatabase3.tasks;
    var conditions = [Q.where('a', 'b'), Q.where('c', 'd')];
    var query = tasks.query.apply(tasks, conditions);
    expect(query).toBeInstanceOf(_Query["default"]);
    expect(query.collection).toBe(tasks);
  });
  it("query() can accept both a spread and an array", function () {
    var _mockDatabase4 = (0, _testModels.mockDatabase)(),
      tasks = _mockDatabase4.tasks;
    var conditions = [Q.where('a', 'b'), Q.where('c', 'd')];
    expect(tasks.query.apply(tasks, conditions).description).toEqual(tasks.query(conditions).description);
  });
});
describe('finding records', function () {
  it('finds records in cache if available', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _mockDatabase5, collection, m1, m2;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _mockDatabase5 = (0, _testModels.mockDatabase)(), collection = _mockDatabase5.tasks;
          m1 = new _testModels.MockTask(collection, {
            id: 'm1'
          });
          collection._cache.add(m1);
          _context.t0 = expect;
          _context.next = 6;
          return collection.find('m1');
        case 6:
          _context.t1 = _context.sent;
          (0, _context.t0)(_context.t1).toBe(m1);
          m2 = new _testModels.MockTask(collection, {
            id: 'm2'
          });
          collection._cache.add(m2);
          _context.t2 = expect;
          _context.next = 13;
          return collection.find('m1');
        case 13:
          _context.t3 = _context.sent;
          (0, _context.t2)(_context.t3).toBe(m1);
          _context.t4 = expect;
          _context.next = 18;
          return collection.find('m2');
        case 18:
          _context.t5 = _context.sent;
          (0, _context.t4)(_context.t5).toBe(m2);
        case 20:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  it('finds records in database if not in cache', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _mockDatabase6, collection, adapter, m1, m1Cached;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _mockDatabase6 = (0, _testModels.mockDatabase)(), collection = _mockDatabase6.tasks, adapter = _mockDatabase6.adapter; // TODO: Don't mock
          // TODO: Should ID (not raw) response be tested?
          adapter.find = jest.fn().mockImplementation(function (table, id, callback) {
            return callback({
              value: {
                id: 'm1'
              }
            });
          });

          // calls db
          _context2.next = 4;
          return collection.find('m1');
        case 4:
          m1 = _context2.sent;
          expect(m1._raw).toEqual({
            id: 'm1'
          });
          expect(m1.id).toBe('m1');
          expect(m1.table).toBe('mock_tasks');
          expect(m1.collection).toBe(collection);
          expect(collection._cache.map.size).toBe(1);

          // check call
          expect(adapter.find.mock.calls[0]).toEqual(['mock_tasks', 'm1', expect.anything()]);

          // second find will be from cache
          _context2.next = 13;
          return collection.find('m1');
        case 13:
          m1Cached = _context2.sent;
          expect(m1Cached).toBe(m1);
          expect(collection._cache.map.size).toBe(1);
          expect(adapter.find.mock.calls.length).toBe(1);
        case 17:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  it('rejects promise if record cannot be found', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var _mockDatabase7, collection, adapter, findSpy;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _mockDatabase7 = (0, _testModels.mockDatabase)(), collection = _mockDatabase7.tasks, adapter = _mockDatabase7.adapter;
          findSpy = jest.spyOn(adapter, 'find');
          _context3.next = 4;
          return expect(collection.find('m1')).rejects.toBeInstanceOf(Error);
        case 4:
          _context3.next = 6;
          return expect(collection.find('m1')).rejects.toBeInstanceOf(Error);
        case 6:
          expect(findSpy.mock.calls.length).toBe(2);
        case 7:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
  it('quickly rejects for invalid IDs', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var _mockDatabase8, tasks;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _mockDatabase8 = (0, _testModels.mockDatabase)(), tasks = _mockDatabase8.tasks;
          _context4.next = 3;
          return (0, _utils.expectToRejectWithMessage)(tasks.find(), 'Invalid record ID');
        case 3:
          _context4.next = 5;
          return (0, _utils.expectToRejectWithMessage)(tasks.find(null), 'Invalid record ID');
        case 5:
          _context4.next = 7;
          return (0, _utils.expectToRejectWithMessage)(tasks.find({}), 'Invalid record ID');
        case 7:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
});
describe('fetching queries', function () {
  it('fetches queries and caches records', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var _mockDatabase9, collection, adapter, query, models;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _mockDatabase9 = (0, _testModels.mockDatabase)(), collection = _mockDatabase9.tasks, adapter = _mockDatabase9.adapter;
          adapter.query = jest.fn().mockImplementation(function (query, cb) {
            return cb({
              value: [{
                id: 'm1'
              }, {
                id: 'm2'
              }]
            });
          });
          query = mockQuery(collection); // fetch, check models
          _context5.next = 5;
          return (0, _Result.toPromise)(function (callback) {
            return collection._fetchQuery(query, callback);
          });
        case 5:
          models = _context5.sent;
          expect(models.length).toBe(2);
          expect(models[0]._raw).toEqual({
            id: 'm1'
          });
          expect(models[0].id).toBe('m1');
          expect(models[0].table).toBe('mock_tasks');
          expect(models[1]._raw).toEqual({
            id: 'm2'
          });

          // check if records were cached
          expect(collection._cache.map.size).toBe(2);
          expect(collection._cache.map.get('m1')).toBe(models[0]);
          expect(collection._cache.map.get('m2')).toBe(models[1]);

          // check if query was passed correctly
          expect(adapter.query.mock.calls.length).toBe(1);
          expect(adapter.query.mock.calls[0][0]).toEqual(query.serialize());
        case 16:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  })));
  it('fetches query records from cache if possible', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var _mockDatabase10, collection, adapter, m1, models;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _mockDatabase10 = (0, _testModels.mockDatabase)(), collection = _mockDatabase10.tasks, adapter = _mockDatabase10.adapter;
          adapter.query = jest.fn().mockImplementation(function (query, cb) {
            return cb({
              value: ['m1', {
                id: 'm2'
              }]
            });
          });
          m1 = new _testModels.MockTask(collection, {
            id: 'm1'
          });
          collection._cache.add(m1);

          // fetch, check models
          _context6.next = 6;
          return (0, _Result.toPromise)(function (cb) {
            return collection._fetchQuery(mockQuery(collection), cb);
          });
        case 6:
          models = _context6.sent;
          expect(models.length).toBe(2);
          expect(models[0]).toBe(m1);
          expect(models[1]._raw).toEqual({
            id: 'm2'
          });

          // check cache
          expect(collection._cache.map.get('m2')).toBe(models[1]);
        case 11:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  })));
  it('fetches query records from cache even if full raw object was sent', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    var _mockDatabase11, collection, adapter, m1, spy, models;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _mockDatabase11 = (0, _testModels.mockDatabase)(), collection = _mockDatabase11.tasks, adapter = _mockDatabase11.adapter;
          adapter.query = jest.fn().mockImplementation(function (query, cb) {
            return cb({
              value: [{
                id: 'm1'
              }, {
                id: 'm2'
              }]
            });
          });
          m1 = new _testModels.MockTask(collection, {
            id: 'm1'
          });
          collection._cache.add(m1);

          // fetch, check if error occured
          spy = jest.spyOn(_common.logger, 'warn').mockImplementation(function () {});
          _context7.next = 7;
          return (0, _Result.toPromise)(function (cb) {
            return collection._fetchQuery(mockQuery(collection), cb);
          });
        case 7:
          models = _context7.sent;
          expect(spy).toHaveBeenCalledTimes(1);
          spy.mockRestore();

          // check models
          expect(models.length).toBe(2);
          expect(models[0]).toBe(m1);
          expect(models[1]._raw).toEqual({
            id: 'm2'
          });
        case 13:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  })));
  it('fetches counts', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8() {
    var _mockDatabase12, collection, adapter, query;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _mockDatabase12 = (0, _testModels.mockDatabase)(), collection = _mockDatabase12.tasks, adapter = _mockDatabase12.adapter;
          adapter.count = jest.fn().mockImplementationOnce(function (query, callback) {
            return callback({
              value: 5
            });
          });
          query = mockQuery(collection);
          _context8.t0 = expect;
          _context8.next = 6;
          return (0, _Result.toPromise)(function (callback) {
            return collection._fetchCount(query, callback);
          });
        case 6:
          _context8.t1 = _context8.sent;
          (0, _context8.t0)(_context8.t1).toBe(5);
          expect(adapter.count.mock.calls.length).toBe(1);
          expect(adapter.count.mock.calls[0][0]).toEqual(query.serialize());
        case 10:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  })));
  it('fetches ids', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    var _mockDatabase13, collection, adapter, query;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _mockDatabase13 = (0, _testModels.mockDatabase)(), collection = _mockDatabase13.tasks, adapter = _mockDatabase13.adapter;
          adapter.queryIds = jest.fn().mockImplementationOnce(function (query, callback) {
            return callback({
              value: ['a', 'b']
            });
          });
          query = mockQuery(collection);
          _context9.t0 = expect;
          _context9.next = 6;
          return (0, _Result.toPromise)(function (callback) {
            return collection._fetchIds(query, callback);
          });
        case 6:
          _context9.t1 = _context9.sent;
          (0, _context9.t0)(_context9.t1).toEqual(['a', 'b']);
          expect(adapter.queryIds.mock.calls.length).toBe(1);
          expect(adapter.queryIds.mock.calls[0][0]).toEqual(query.serialize());
        case 10:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  })));
  it('fetches raws', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10() {
    var _mockDatabase14, collection, adapter, query;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _mockDatabase14 = (0, _testModels.mockDatabase)(), collection = _mockDatabase14.tasks, adapter = _mockDatabase14.adapter;
          adapter.unsafeQueryRaw = jest.fn().mockImplementationOnce(function (query, callback) {
            return callback({
              value: [{
                a: 0,
                b: 1
              }]
            });
          });
          query = mockQuery(collection);
          _context10.t0 = expect;
          _context10.next = 6;
          return (0, _Result.toPromise)(function (callback) {
            return collection._unsafeFetchRaw(query, callback);
          });
        case 6:
          _context10.t1 = _context10.sent;
          (0, _context10.t0)(_context10.t1).toEqual([{
            a: 0,
            b: 1
          }]);
          expect(adapter.unsafeQueryRaw.mock.calls.length).toBe(1);
          expect(adapter.unsafeQueryRaw.mock.calls[0][0]).toEqual(query.serialize());
        case 10:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  })));
});
describe('creating new records', function () {
  it('can create records', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee11() {
    var _mockDatabase15, collection, adapter, db, dbBatchSpy, observer, newModelSpy, m1;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _mockDatabase15 = (0, _testModels.mockDatabase)(), collection = _mockDatabase15.tasks, adapter = _mockDatabase15.adapter, db = _mockDatabase15.db;
          dbBatchSpy = jest.spyOn(adapter, 'batch');
          observer = jest.fn();
          collection.changes.subscribe(observer);

          // Check Model._prepareCreate was called
          newModelSpy = jest.spyOn(_testModels.MockTask, '_prepareCreate');
          _context11.next = 7;
          return db.write(function () {
            return collection.create();
          });
        case 7:
          m1 = _context11.sent;
          // Check database insert, cache insert, observers update
          expect(m1._preparedState).toBe(null);
          expect(newModelSpy).toHaveBeenCalledTimes(1);
          expect(dbBatchSpy).toHaveBeenCalledTimes(1);
          expect(dbBatchSpy).toHaveBeenCalledWith([['create', 'mock_tasks', m1._raw]], expect.anything());
          expect(observer).toHaveBeenCalledTimes(1);
          expect(observer).toHaveBeenCalledWith([{
            record: m1,
            type: 'created'
          }]);
          expect(collection._cache.get(m1.id)).toBe(m1);
          _context11.t0 = expect;
          _context11.next = 18;
          return collection.find(m1.id);
        case 18:
          _context11.t1 = _context11.sent;
          (0, _context11.t0)(_context11.t1).toBe(m1);
        case 20:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  })));
  it('can prepare records', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee12() {
    var _mockDatabase16, collection, database, observer, newModelSpy, m1;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _mockDatabase16 = (0, _testModels.mockDatabase)(), collection = _mockDatabase16.tasks, database = _mockDatabase16.database;
          database.adapter = {}; // make sure not called
          observer = jest.fn();
          collection.changes.subscribe(observer);
          newModelSpy = jest.spyOn(_testModels.MockTask, '_prepareCreate');
          m1 = collection.prepareCreate();
          expect(m1._preparedState).toBe('create');
          expect(newModelSpy).toHaveBeenCalledTimes(1);
          expect(observer).toHaveBeenCalledTimes(0);
          _context12.next = 11;
          return expect(collection.find(m1.id)).rejects.toBeInstanceOf(Error);
        case 11:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  })));
  it('can prepare records from raw', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee13() {
    var _mockDatabase17, collection, newModelSpy, m1;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _mockDatabase17 = (0, _testModels.mockDatabase)(), collection = _mockDatabase17.tasks;
          newModelSpy = jest.spyOn(_testModels.MockTask, '_prepareCreateFromDirtyRaw');
          m1 = collection.prepareCreateFromDirtyRaw({
            col3: 'hello'
          });
          expect(m1._preparedState).toBe('create');
          expect(newModelSpy).toHaveBeenCalledTimes(1);
        case 5:
        case "end":
          return _context13.stop();
      }
    }, _callee13);
  })));
  it('can prepare a disposable record from raw', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee14() {
    var _mockDatabase18, collection, newModelSpy, m1;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _mockDatabase18 = (0, _testModels.mockDatabase)(), collection = _mockDatabase18.tasks;
          newModelSpy = jest.spyOn(_testModels.MockTask, '_disposableFromDirtyRaw');
          m1 = collection.disposableFromDirtyRaw({
            col3: 'hello'
          });
          expect(m1.syncStatus).toBe('disposable');
          expect(newModelSpy).toHaveBeenCalledTimes(1);
        case 5:
        case "end":
          return _context14.stop();
      }
    }, _callee14);
  })));
  it('disallows record creating outside of a writer', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee15() {
    var _mockDatabase19, database, tasks;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          _mockDatabase19 = (0, _testModels.mockDatabase)(), database = _mockDatabase19.database, tasks = _mockDatabase19.tasks;
          _context15.next = 3;
          return (0, _utils.expectToRejectWithMessage)(tasks.create(_fp.noop), 'can only be called from inside of a Writer');
        case 3:
          _context15.next = 5;
          return (0, _utils.expectToRejectWithMessage)(database.read(function () {
            return tasks.create(_fp.noop);
          }), 'can only be called from inside of a Writer');
        case 5:
          _context15.next = 7;
          return database.write(function () {
            return tasks.create(_fp.noop);
          });
        case 7:
        case "end":
          return _context15.stop();
      }
    }, _callee15);
  })));
});
describe('Collection observation', function () {
  it('can subscribe to collection changes', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee16() {
    var _mockDatabase20, database, tasks, subscriber1, unsubscribe1, t1, subscriber2, unsubscribe2;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          _mockDatabase20 = (0, _testModels.mockDatabase)(), database = _mockDatabase20.database, tasks = _mockDatabase20.tasks;
          _context16.next = 3;
          return database.write(function () {
            return tasks.create();
          });
        case 3:
          subscriber1 = jest.fn();
          unsubscribe1 = tasks.experimentalSubscribe(subscriber1);
          expect(subscriber1).toHaveBeenCalledTimes(0);
          _context16.next = 8;
          return database.write(function () {
            return tasks.create();
          });
        case 8:
          t1 = _context16.sent;
          expect(subscriber1).toHaveBeenCalledTimes(1);
          expect(subscriber1).toHaveBeenLastCalledWith([{
            record: t1,
            type: 'created'
          }]);
          subscriber2 = jest.fn();
          unsubscribe2 = tasks.experimentalSubscribe(subscriber2);
          _context16.next = 15;
          return database.write(function () {
            return t1.update();
          });
        case 15:
          expect(subscriber1).toHaveBeenCalledTimes(2);
          expect(subscriber2).toHaveBeenCalledTimes(1);
          expect(subscriber2).toHaveBeenLastCalledWith([{
            record: t1,
            type: 'updated'
          }]);
          unsubscribe1();
          _context16.next = 21;
          return database.write(function () {
            return t1.markAsDeleted();
          });
        case 21:
          expect(subscriber1).toHaveBeenCalledTimes(2);
          expect(subscriber2).toHaveBeenCalledTimes(2);
          expect(subscriber2).toHaveBeenLastCalledWith([{
            record: t1,
            type: 'destroyed'
          }]);
          unsubscribe2();
          _context16.next = 27;
          return database.write(function () {
            return tasks.create();
          });
        case 27:
          expect(subscriber2).toHaveBeenCalledTimes(2);
        case 28:
        case "end":
          return _context16.stop();
      }
    }, _callee16);
  })));
  it('unsubscribe can safely be called more than once', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee17() {
    var _mockDatabase21, database, tasks, subscriber1, unsubscribe1, unsubscribe2;
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          _mockDatabase21 = (0, _testModels.mockDatabase)(), database = _mockDatabase21.database, tasks = _mockDatabase21.tasks;
          subscriber1 = jest.fn();
          unsubscribe1 = tasks.experimentalSubscribe(subscriber1);
          expect(subscriber1).toHaveBeenCalledTimes(0);
          unsubscribe2 = tasks.experimentalSubscribe(function () {});
          unsubscribe2();
          unsubscribe2();
          _context17.next = 9;
          return database.write(function () {
            return tasks.create();
          });
        case 9:
          expect(subscriber1).toHaveBeenCalledTimes(1);
          unsubscribe1();
        case 11:
        case "end":
          return _context17.stop();
      }
    }, _callee17);
  })));
  it("can subscribe with the same subscriber multiple times", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee18() {
    var _mockDatabase22, database, tasks, trigger, subscriber, unsubscribe1, unsubscribe2;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          _mockDatabase22 = (0, _testModels.mockDatabase)(), database = _mockDatabase22.database, tasks = _mockDatabase22.tasks;
          trigger = function trigger() {
            return database.write(function () {
              return tasks.create();
            });
          };
          subscriber = jest.fn();
          unsubscribe1 = tasks.experimentalSubscribe(subscriber);
          expect(subscriber).toHaveBeenCalledTimes(0);
          _context18.next = 7;
          return trigger();
        case 7:
          expect(subscriber).toHaveBeenCalledTimes(1);
          unsubscribe2 = tasks.experimentalSubscribe(subscriber);
          _context18.next = 11;
          return trigger();
        case 11:
          expect(subscriber).toHaveBeenCalledTimes(3);
          unsubscribe2();
          unsubscribe2(); // noop
          _context18.next = 16;
          return trigger();
        case 16:
          expect(subscriber).toHaveBeenCalledTimes(4);
          unsubscribe1();
          _context18.next = 20;
          return trigger();
        case 20:
          expect(subscriber).toHaveBeenCalledTimes(4);
        case 21:
        case "end":
          return _context18.stop();
      }
    }, _callee18);
  })));
});