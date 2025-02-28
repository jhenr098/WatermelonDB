"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
exports.__esModule = true;
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _naughtyStrings = _interopRequireWildcard(require("../../__tests__/utils/naughtyStrings"));
var _expectToRejectWithMessage = _interopRequireDefault(require("../../__tests__/utils/expectToRejectWithMessage"));
var _Model2 = _interopRequireDefault(require("../../Model"));
var _Query = _interopRequireDefault(require("../../Query"));
var _RawRecord = require("../../RawRecord");
var Q = _interopRequireWildcard(require("../../QueryDescription"));
var _Schema = require("../../Schema");
var _migrations = require("../../Schema/migrations");
var _databaseTests = require("../../__tests__/databaseTests");
var _compat = _interopRequireDefault(require("../compat"));
var _helpers = require("./helpers");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; } /* eslint-disable jest/no-standalone-expect */
var BadModel = /*#__PURE__*/function (_Model) {
  function BadModel() {
    return _Model.apply(this, arguments) || this;
  }
  (0, _inheritsLoose2["default"])(BadModel, _Model);
  return BadModel;
}(_Model2["default"]);
BadModel.table = 'nonexistent';
var _default = exports["default"] = function _default() {
  var commonTests = [];
  var it = function it(name, test) {
    return commonTests.push([name, test]);
  };
  it.only = function (name, test) {
    return commonTests.push([name, test, true]);
  };
  it('validates adapter options', /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(_adapter, AdapterClass, extraAdapterOptions) {
      var schema, makeAdapter, adapterWithMigrations, adapterWithRealMigrations;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            schema = (0, _extends2["default"])({}, _helpers.testSchema, {
              version: 10
            });
            makeAdapter = function makeAdapter(options) {
              return new AdapterClass((0, _extends2["default"])({
                schema: schema
              }, options, extraAdapterOptions));
            };
            adapterWithMigrations = function adapterWithMigrations(migrations) {
              return makeAdapter({
                migrations: migrations
              });
            };
            expect(function () {
              return adapterWithMigrations({
                migrations: []
              });
            }).toThrow(/use schemaMigrations()/);

            // OK migrations passed
            adapterWithRealMigrations = function adapterWithRealMigrations(migrations) {
              return adapterWithMigrations((0, _migrations.schemaMigrations)({
                migrations: migrations
              }));
            };
            expect(function () {
              return adapterWithRealMigrations([{
                toVersion: 10,
                steps: []
              }]);
            }).not.toThrow();
            expect(function () {
              return adapterWithRealMigrations([{
                toVersion: 10,
                steps: []
              }, {
                toVersion: 9,
                steps: []
              }]);
            }).not.toThrow();

            // Empty migrations only allowed if version 1
            expect(function () {
              return new AdapterClass((0, _extends2["default"])({
                schema: (0, _extends2["default"])({}, _helpers.testSchema, {
                  version: 1
                }),
                migrations: (0, _migrations.schemaMigrations)({
                  migrations: []
                })
              }, extraAdapterOptions));
            }).not.toThrow();
            expect(function () {
              return adapterWithRealMigrations([]);
            }).toThrow(/Missing migration/);

            // Migrations can't be newer than schema
            expect(function () {
              return adapterWithRealMigrations([{
                toVersion: 11,
                steps: []
              }]);
            }).toThrow(/migrations can't be newer than schema/i);
            // Migration to latest version must be present
            expect(function () {
              return adapterWithRealMigrations([{
                toVersion: 9,
                steps: []
              }, {
                toVersion: 8,
                steps: []
              }]);
            }).toThrow(/Missing migration/);
          case 11:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
  it('can query and count on empty db', /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(adapter) {
      var query;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            query = (0, _helpers.taskQuery)();
            _context2.t0 = expect;
            _context2.next = 4;
            return adapter.query(query);
          case 4:
            _context2.t1 = _context2.sent;
            (0, _context2.t0)(_context2.t1).toEqual([]);
            _context2.t2 = expect;
            _context2.next = 9;
            return adapter.count(query);
          case 9:
            _context2.t3 = _context2.sent;
            (0, _context2.t2)(_context2.t3).toBe(0);
          case 11:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x4) {
      return _ref2.apply(this, arguments);
    };
  }());
  it('can create and find records (sanity test)', /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(adapter) {
      var record;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            record = (0, _helpers.mockTaskRaw)({
              id: 'abc',
              text1: 'bar',
              order: 1
            });
            _context3.next = 3;
            return adapter.batch([['create', 'tasks', record]]);
          case 3:
            _context3.t0 = expect;
            _context3.next = 6;
            return adapter.find('tasks', 'abc');
          case 6:
            _context3.t1 = _context3.sent;
            (0, _context3.t0)(_context3.t1).toBe('abc');
          case 8:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function (_x5) {
      return _ref3.apply(this, arguments);
    };
  }());
  it('can find records by ID', /*#__PURE__*/function () {
    var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(_adapter) {
      var adapter, s1, s2, s3;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            adapter = _adapter; // add a record
            s1 = (0, _helpers.mockTaskRaw)({
              id: 's1',
              text1: 'bar',
              order: 1
            });
            _context4.next = 4;
            return adapter.batch([['create', 'tasks', s1]]);
          case 4:
            _context4.t0 = expect;
            _context4.next = 7;
            return adapter.find('tasks', 's1');
          case 7:
            _context4.t1 = _context4.sent;
            (0, _context4.t0)(_context4.t1).toBe('s1');
            // add more, restart app
            s2 = (0, _helpers.mockTaskRaw)({
              id: 's2',
              bool1: true,
              order: 2
            });
            s3 = (0, _helpers.mockTaskRaw)({
              id: 's3',
              text1: 'baz'
            });
            _context4.next = 13;
            return adapter.batch([['create', 'tasks', s2], ['create', 'tasks', s3]]);
          case 13:
            _context4.next = 15;
            return adapter.testClone();
          case 15:
            adapter = _context4.sent;
            _context4.t2 = expect;
            _context4.next = 19;
            return adapter.find('tasks', 's2');
          case 19:
            _context4.t3 = _context4.sent;
            (0, _context4.t2)(_context4.t3).toEqual(s2);
            _context4.t4 = expect;
            _context4.next = 24;
            return adapter.find('tasks', 's3');
          case 24:
            _context4.t5 = _context4.sent;
            (0, _context4.t4)(_context4.t5).toEqual(s3);
            _context4.t6 = expect;
            _context4.next = 29;
            return adapter.find('tasks', 's2');
          case 29:
            _context4.t7 = _context4.sent;
            (0, _context4.t6)(_context4.t7).toBe('s2');
            _context4.t8 = expect;
            _context4.next = 34;
            return adapter.find('tasks', 's4');
          case 34:
            _context4.t9 = _context4.sent;
            (0, _context4.t8)(_context4.t9).toBe(null);
          case 36:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return function (_x6) {
      return _ref4.apply(this, arguments);
    };
  }());
  it('can cache non-global IDs on find', /*#__PURE__*/function () {
    var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(_adapter) {
      var adapter, s1, p1, p2, s2;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            adapter = _adapter; // add a record
            s1 = (0, _helpers.mockTaskRaw)({
              id: 'id1',
              text1: 'bar',
              order: 1
            });
            _context5.next = 4;
            return adapter.batch([['create', 'tasks', s1]]);
          case 4:
            _context5.t0 = expect;
            _context5.next = 7;
            return adapter.find('projects', 'id1');
          case 7:
            _context5.t1 = _context5.sent;
            (0, _context5.t0)(_context5.t1).toBe(null);
            p1 = (0, _helpers.mockProjectRaw)({
              id: 'id1',
              num1: 1,
              text1: 'foo'
            });
            _context5.next = 12;
            return adapter.batch([['create', 'projects', p1]]);
          case 12:
            _context5.t2 = expect;
            _context5.next = 15;
            return adapter.find('projects', 'id1');
          case 15:
            _context5.t3 = _context5.sent;
            (0, _context5.t2)(_context5.t3).toBe('id1');
            // add more project, restart app
            p2 = (0, _helpers.mockProjectRaw)({
              id: 'id2',
              num1: 1,
              text1: 'foo'
            });
            _context5.next = 20;
            return adapter.batch([['create', 'projects', p2]]);
          case 20:
            _context5.next = 22;
            return adapter.testClone();
          case 22:
            adapter = _context5.sent;
            s2 = (0, _helpers.mockTaskRaw)({
              id: 'id2',
              text1: 'baz',
              order: 2
            });
            _context5.next = 26;
            return adapter.batch([['create', 'tasks', s2]]);
          case 26:
            _context5.t4 = expect;
            _context5.next = 29;
            return adapter.find('tasks', 'id2');
          case 29:
            _context5.t5 = _context5.sent;
            (0, _context5.t4)(_context5.t5).toBe('id2');
            _context5.t6 = expect;
            _context5.next = 34;
            return adapter.find('projects', 'id2');
          case 34:
            _context5.t7 = _context5.sent;
            (0, _context5.t6)(_context5.t7).toEqual(p2);
            _context5.t8 = expect;
            _context5.next = 39;
            return adapter.find('projects', 'id2');
          case 39:
            _context5.t9 = _context5.sent;
            (0, _context5.t8)(_context5.t9).toBe('id2');
          case 41:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return function (_x7) {
      return _ref5.apply(this, arguments);
    };
  }());
  it('can cache non-global IDs on query', /*#__PURE__*/function () {
    var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(_adapter) {
      var adapter, s1, p1, p2, s2;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            adapter = _adapter; // add a record
            s1 = (0, _helpers.mockTaskRaw)({
              id: 'id1',
              text1: 'bar',
              order: 1
            });
            _context6.next = 4;
            return adapter.batch([['create', 'tasks', s1]]);
          case 4:
            _context6.t0 = _helpers.expectSortedEqual;
            _context6.next = 7;
            return adapter.query((0, _helpers.projectQuery)());
          case 7:
            _context6.t1 = _context6.sent;
            _context6.t2 = [];
            (0, _context6.t0)(_context6.t1, _context6.t2);
            p1 = (0, _helpers.mockProjectRaw)({
              id: 'id1',
              num1: 1,
              text1: 'foo'
            });
            _context6.next = 13;
            return adapter.batch([['create', 'projects', p1]]);
          case 13:
            _context6.t3 = _helpers.expectSortedEqual;
            _context6.next = 16;
            return adapter.query((0, _helpers.projectQuery)());
          case 16:
            _context6.t4 = _context6.sent;
            _context6.t5 = ['id1'];
            (0, _context6.t3)(_context6.t4, _context6.t5);
            // add more project, restart app
            p2 = (0, _helpers.mockProjectRaw)({
              id: 'id2',
              num1: 1,
              text1: 'foo'
            });
            _context6.next = 22;
            return adapter.batch([['create', 'projects', p2]]);
          case 22:
            _context6.next = 24;
            return adapter.testClone();
          case 24:
            adapter = _context6.sent;
            s2 = (0, _helpers.mockTaskRaw)({
              id: 'id2',
              text1: 'baz',
              order: 2
            });
            _context6.next = 28;
            return adapter.batch([['create', 'tasks', s2]]);
          case 28:
            _context6.t6 = _helpers.expectSortedEqual;
            _context6.next = 31;
            return adapter.query((0, _helpers.taskQuery)());
          case 31:
            _context6.t7 = _context6.sent;
            _context6.t8 = [s1, 'id2'];
            (0, _context6.t6)(_context6.t7, _context6.t8);
            _context6.t9 = _helpers.expectSortedEqual;
            _context6.next = 37;
            return adapter.query((0, _helpers.projectQuery)());
          case 37:
            _context6.t10 = _context6.sent;
            _context6.t11 = [p1, p2];
            (0, _context6.t9)(_context6.t10, _context6.t11);
            _context6.t12 = _helpers.expectSortedEqual;
            _context6.next = 43;
            return adapter.query((0, _helpers.taskQuery)());
          case 43:
            _context6.t13 = _context6.sent;
            _context6.t14 = ['id1', 'id2'];
            (0, _context6.t12)(_context6.t13, _context6.t14);
          case 46:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return function (_x8) {
      return _ref6.apply(this, arguments);
    };
  }());
  it('sanitizes records on find', /*#__PURE__*/function () {
    var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(_adapter) {
      var adapter, tt1;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            adapter = _adapter;
            tt1 = {
              id: 'tt1',
              task_id: 'abcdef'
            }; // Unsanitized raw!
            _context7.next = 4;
            return adapter.batch([['create', 'tag_assignments', tt1]]);
          case 4:
            _context7.next = 6;
            return adapter.testClone();
          case 6:
            adapter = _context7.sent;
            _context7.t0 = expect;
            _context7.next = 10;
            return adapter.find('tag_assignments', 'tt1');
          case 10:
            _context7.t1 = _context7.sent;
            (0, _context7.t0)(_context7.t1).toEqual((0, _RawRecord.sanitizedRaw)(tt1, _helpers.testSchema.tables.tag_assignments));
          case 12:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }));
    return function (_x9) {
      return _ref7.apply(this, arguments);
    };
  }());
  it('can query and count records', /*#__PURE__*/function () {
    var _ref8 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(adapter) {
      var record1, record2, record3;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            record1 = (0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'bar',
              bool1: false,
              order: 1
            });
            record2 = (0, _helpers.mockTaskRaw)({
              id: 't2',
              text1: 'baz',
              bool1: true,
              order: 2
            });
            record3 = (0, _helpers.mockTaskRaw)({
              id: 't3',
              text1: 'abc',
              bool1: false,
              order: 3
            });
            _context8.next = 5;
            return adapter.batch([['create', 'tasks', record1], ['create', 'tasks', record2], ['create', 'tasks', record3]]);
          case 5:
            _context8.t0 = _helpers.expectSortedEqual;
            _context8.next = 8;
            return adapter.query((0, _helpers.taskQuery)());
          case 8:
            _context8.t1 = _context8.sent;
            _context8.t2 = ['t1', 't2', 't3'];
            (0, _context8.t0)(_context8.t1, _context8.t2);
            _context8.t3 = expect;
            _context8.next = 14;
            return adapter.count((0, _helpers.taskQuery)());
          case 14:
            _context8.t4 = _context8.sent;
            (0, _context8.t3)(_context8.t4).toBe(3);
            _context8.t5 = _helpers.expectSortedEqual;
            _context8.next = 19;
            return adapter.query((0, _helpers.taskQuery)(Q.where('bool1', false)));
          case 19:
            _context8.t6 = _context8.sent;
            _context8.t7 = ['t1', 't3'];
            (0, _context8.t5)(_context8.t6, _context8.t7);
            _context8.t8 = _helpers.expectSortedEqual;
            _context8.next = 25;
            return adapter.query((0, _helpers.taskQuery)(Q.where('order', 2)));
          case 25:
            _context8.t9 = _context8.sent;
            _context8.t10 = ['t2'];
            (0, _context8.t8)(_context8.t9, _context8.t10);
            _context8.t11 = _helpers.expectSortedEqual;
            _context8.next = 31;
            return adapter.query((0, _helpers.taskQuery)(Q.where('order', 3)));
          case 31:
            _context8.t12 = _context8.sent;
            _context8.t13 = ['t3'];
            (0, _context8.t11)(_context8.t12, _context8.t13);
            _context8.t14 = expect;
            _context8.next = 37;
            return adapter.count((0, _helpers.taskQuery)(Q.where('bool1', false)));
          case 37:
            _context8.t15 = _context8.sent;
            (0, _context8.t14)(_context8.t15).toBe(2);
            _context8.t16 = _helpers.expectSortedEqual;
            _context8.next = 42;
            return adapter.query((0, _helpers.taskQuery)(Q.where('text1', 'nope')));
          case 42:
            _context8.t17 = _context8.sent;
            _context8.t18 = [];
            (0, _context8.t16)(_context8.t17, _context8.t18);
            _context8.t19 = expect;
            _context8.next = 48;
            return adapter.count((0, _helpers.taskQuery)(Q.where('text1', 'nope')));
          case 48:
            _context8.t20 = _context8.sent;
            (0, _context8.t19)(_context8.t20).toBe(0);
            _context8.t21 = expect;
            _context8.next = 53;
            return adapter.count((0, _helpers.taskQuery)(Q.where('order', 4)));
          case 53:
            _context8.t22 = _context8.sent;
            (0, _context8.t21)(_context8.t22).toBe(0);
          case 55:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));
    return function (_x10) {
      return _ref8.apply(this, arguments);
    };
  }());
  it('compacts query results', /*#__PURE__*/function () {
    var _ref9 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(_adapter) {
      var adapter, queryAll, s1, s2, s3, s3New;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            adapter = _adapter;
            queryAll = function queryAll() {
              return adapter.query((0, _helpers.taskQuery)());
            }; // add records, restart app
            s1 = (0, _helpers.mockTaskRaw)({
              id: 's1',
              order: 1
            });
            s2 = (0, _helpers.mockTaskRaw)({
              id: 's2',
              order: 2
            });
            _context9.next = 6;
            return adapter.batch([['create', 'tasks', s1], ['create', 'tasks', s2]]);
          case 6:
            _context9.next = 8;
            return adapter.testClone();
          case 8:
            adapter = _context9.sent;
            _context9.t0 = _helpers.expectSortedEqual;
            _context9.next = 12;
            return queryAll();
          case 12:
            _context9.t1 = _context9.sent;
            _context9.t2 = [s1, s2];
            (0, _context9.t0)(_context9.t1, _context9.t2);
            _context9.t3 = expect;
            _context9.next = 18;
            return queryAll();
          case 18:
            _context9.t4 = _context9.sent;
            (0, _context9.t3)(_context9.t4).toEqual(['s1', 's2']);
            _context9.next = 22;
            return adapter.batch([['update', 'tasks', s2]]);
          case 22:
            _context9.t5 = expect;
            _context9.next = 25;
            return queryAll();
          case 25:
            _context9.t6 = _context9.sent;
            (0, _context9.t5)(_context9.t6).toEqual(['s1', 's2']);
            // records added via adapter get cached automatically
            s3 = (0, _helpers.mockTaskRaw)({
              id: 's3'
            });
            _context9.next = 30;
            return adapter.batch([['create', 'tasks', s3]]);
          case 30:
            _context9.t7 = expect;
            _context9.next = 33;
            return queryAll();
          case 33:
            _context9.t8 = _context9.sent;
            (0, _context9.t7)(_context9.t8).toEqual(['s1', 's2', 's3']);
            _context9.next = 37;
            return adapter.batch([['destroyPermanently', 'tasks', s3.id]]);
          case 37:
            _context9.t9 = expect;
            _context9.next = 40;
            return queryAll();
          case 40:
            _context9.t10 = _context9.sent;
            (0, _context9.t9)(_context9.t10).toEqual(['s1', 's2']);
            s3New = (0, _helpers.mockTaskRaw)({
              id: 's3',
              bool1: true
            });
            _context9.next = 45;
            return adapter.batch([['create', 'tasks', s3New]]);
          case 45:
            _context9.t11 = expect;
            _context9.next = 48;
            return queryAll();
          case 48:
            _context9.t12 = _context9.sent;
            (0, _context9.t11)(_context9.t12).toEqual(['s1', 's2', 's3']);
            _context9.next = 52;
            return adapter.testClone();
          case 52:
            adapter = _context9.sent;
            _context9.t13 = _helpers.expectSortedEqual;
            _context9.next = 56;
            return queryAll();
          case 56:
            _context9.t14 = _context9.sent;
            _context9.t15 = [s1, s2, s3New];
            (0, _context9.t13)(_context9.t14, _context9.t15);
          case 59:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    }));
    return function (_x11) {
      return _ref9.apply(this, arguments);
    };
  }());
  it('sanitizes records on query', /*#__PURE__*/function () {
    var _ref10 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10(_adapter) {
      var adapter, t1, t2;
      return _regenerator["default"].wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            adapter = _adapter; // Unsanitized raw!
            t1 = {
              id: 't1',
              text1: 'foo',
              order: 1
            };
            t2 = {
              id: 't2',
              text2: 'bar',
              order: 2
            };
            _context10.next = 5;
            return adapter.batch([['create', 'tasks', t1], ['create', 'tasks', t2]]);
          case 5:
            _context10.next = 7;
            return adapter.testClone();
          case 7:
            adapter = _context10.sent;
            _context10.t0 = _helpers.expectSortedEqual;
            _context10.next = 11;
            return adapter.query((0, _helpers.taskQuery)());
          case 11:
            _context10.t1 = _context10.sent;
            _context10.t2 = [(0, _RawRecord.sanitizedRaw)(t1, _helpers.testSchema.tables.tasks), (0, _RawRecord.sanitizedRaw)(t2, _helpers.testSchema.tables.tasks)];
            (0, _context10.t0)(_context10.t1, _context10.t2);
          case 14:
          case "end":
            return _context10.stop();
        }
      }, _callee10);
    }));
    return function (_x12) {
      return _ref10.apply(this, arguments);
    };
  }());
  it('returns a COPY of the data', /*#__PURE__*/function () {
    var _ref11 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee11(_adapter) {
      var adapter, raw, originalRaw, fetchedRaw, _yield$adapter$query, _yield$adapter$query2, queriedRaw;
      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            adapter = _adapter;
            raw = (0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'bar'
            });
            originalRaw = (0, _extends2["default"])({}, raw);
            _context11.next = 5;
            return adapter.batch([['create', 'tasks', raw]]);
          case 5:
            _context11.next = 7;
            return adapter.testClone();
          case 7:
            adapter = _context11.sent;
            _context11.next = 10;
            return adapter.find('tasks', 't1');
          case 10:
            fetchedRaw = _context11.sent;
            // data is equal but not the same reference
            expect(fetchedRaw).toEqual(originalRaw);
            expect(fetchedRaw).toEqual(raw);
            expect(fetchedRaw).not.toBe(raw);

            // make sure same is true for query
            _context11.next = 16;
            return adapter.testClone();
          case 16:
            adapter = _context11.sent;
            _context11.next = 19;
            return adapter.query((0, _helpers.taskQuery)());
          case 19:
            _yield$adapter$query = _context11.sent;
            _yield$adapter$query2 = (0, _slicedToArray2["default"])(_yield$adapter$query, 1);
            queriedRaw = _yield$adapter$query2[0];
            expect(queriedRaw).toEqual(originalRaw);
            expect(queriedRaw).not.toBe(raw);
          case 24:
          case "end":
            return _context11.stop();
        }
      }, _callee11);
    }));
    return function (_x13) {
      return _ref11.apply(this, arguments);
    };
  }());
  it('can query record IDs', /*#__PURE__*/function () {
    var _ref12 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee12(_adapter) {
      var adapter;
      return _regenerator["default"].wrap(function _callee12$(_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
            adapter = _adapter;
            _context12.next = 3;
            return adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 's1',
              order: 1
            })], ['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 's2',
              order: 2
            })]]);
          case 3:
            _context12.next = 5;
            return adapter.testClone();
          case 5:
            adapter = _context12.sent;
            _context12.t0 = expect;
            _context12.next = 9;
            return adapter.queryIds((0, _helpers.taskQuery)());
          case 9:
            _context12.t1 = _context12.sent;
            (0, _context12.t0)(_context12.t1).toEqual(['s1', 's2']);
            _context12.t2 = expect;
            _context12.next = 14;
            return adapter.queryIds((0, _helpers.taskQuery)());
          case 14:
            _context12.t3 = _context12.sent;
            (0, _context12.t2)(_context12.t3).toEqual(['s1', 's2']);
          case 16:
          case "end":
            return _context12.stop();
        }
      }, _callee12);
    }));
    return function (_x14) {
      return _ref12.apply(this, arguments);
    };
  }());
  it('can unsafely query raws with SQL', /*#__PURE__*/function () {
    var _ref13 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee13(adapter, AdapterClass) {
      return _regenerator["default"].wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't1',
              order: 1,
              text1: 'hello'
            })], ['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't2',
              order: 2,
              text1: 'foo'
            })], ['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't3',
              order: 3,
              text1: 'bar'
            })], ['create', 'tag_assignments', (0, _helpers.mockTagAssignmentRaw)({
              id: 'ta1',
              task_id: 't1',
              num1: 5
            })], ['create', 'tag_assignments', (0, _helpers.mockTagAssignmentRaw)({
              id: 'ta2',
              task_id: 't1',
              num1: 9
            })], ['create', 'tag_assignments', (0, _helpers.mockTagAssignmentRaw)({
              id: 'ta3',
              task_id: 't3',
              num1: 3
            })]]);
          case 2:
            if (!(AdapterClass.name === 'SQLiteAdapter')) {
              _context13.next = 15;
              break;
            }
            _context13.t0 = expect;
            _context13.next = 6;
            return adapter.unsafeQueryRaw((0, _helpers.taskQuery)(Q.unsafeSqlQuery('select * from tasks where text1 = ?', ['bad'])));
          case 6:
            _context13.t1 = _context13.sent;
            (0, _context13.t0)(_context13.t1).toEqual([]);
            _context13.t2 = expect;
            _context13.next = 11;
            return adapter.unsafeQueryRaw((0, _helpers.taskQuery)(Q.unsafeSqlQuery('select tasks.text1, count(tag_assignments.id) as tags, sum(tag_assignments.num1) as magic from tasks' + ' left join tag_assignments on tasks.id = tag_assignments.task_id' + ' group by tasks.id' + ' order by tasks."order" desc')));
          case 11:
            _context13.t3 = _context13.sent;
            (0, _context13.t2)(_context13.t3).toEqual([{
              text1: 'bar',
              tags: 1,
              magic: 3
            }, {
              text1: 'foo',
              tags: 0,
              magic: null
            }, {
              text1: 'hello',
              tags: 2,
              magic: 14
            }]);
            _context13.next = 26;
            break;
          case 15:
            if (!(AdapterClass.name === 'LokiJSAdapter')) {
              _context13.next = 26;
              break;
            }
            _context13.t4 = expect;
            _context13.next = 19;
            return adapter.unsafeQueryRaw((0, _helpers.taskQuery)(Q.unsafeLokiTransform(function () {
              return [];
            })));
          case 19:
            _context13.t5 = _context13.sent;
            (0, _context13.t4)(_context13.t5).toEqual([]);
            _context13.t6 = expect;
            _context13.next = 24;
            return adapter.unsafeQueryRaw((0, _helpers.taskQuery)(Q.unsafeLokiTransform(function (raws, loki) {
              return raws.sort(function (a, b) {
                return b.order - a.order;
              }).map(function (raw) {
                var id = raw.id,
                  text1 = raw.text1;
                var assignments = loki.getCollection('tag_assignments').find({
                  task_id: id
                }).map(function (ta) {
                  return ta.num1;
                });
                return {
                  text1: text1,
                  tags: assignments.length,
                  magic: assignments.length ? assignments.reduce(function (a, b) {
                    return a + b;
                  }) : null
                };
              });
            })));
          case 24:
            _context13.t7 = _context13.sent;
            (0, _context13.t6)(_context13.t7).toEqual([{
              text1: 'bar',
              tags: 1,
              magic: 3
            }, {
              text1: 'foo',
              tags: 0,
              magic: null
            }, {
              text1: 'hello',
              tags: 2,
              magic: 14
            }]);
          case 26:
          case "end":
            return _context13.stop();
        }
      }, _callee13);
    }));
    return function (_x15, _x16) {
      return _ref13.apply(this, arguments);
    };
  }());
  it('can update records', /*#__PURE__*/function () {
    var _ref14 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee14(_adapter) {
      var adapter, raw, fetchedUpdatedRaw;
      return _regenerator["default"].wrap(function _callee14$(_context14) {
        while (1) switch (_context14.prev = _context14.next) {
          case 0:
            adapter = _adapter;
            raw = (0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'bar'
            });
            _context14.next = 4;
            return adapter.batch([['create', 'tasks', raw]]);
          case 4:
            raw.bool1 = true;
            raw.order = 2;
            _context14.next = 8;
            return adapter.batch([['update', 'tasks', raw]]);
          case 8:
            _context14.next = 10;
            return adapter.testClone();
          case 10:
            adapter = _context14.sent;
            _context14.next = 13;
            return adapter.find('tasks', 't1');
          case 13:
            fetchedUpdatedRaw = _context14.sent;
            // check raws are equal (but a copy)
            expect(fetchedUpdatedRaw.bool1).toBe(true);
            expect(fetchedUpdatedRaw.order).toBe(2);
            expect(fetchedUpdatedRaw).toEqual(raw);
            expect(fetchedUpdatedRaw).not.toBe(raw);
          case 18:
          case "end":
            return _context14.stop();
        }
      }, _callee14);
    }));
    return function (_x17) {
      return _ref14.apply(this, arguments);
    };
  }());
  it('can mark records as deleted', /*#__PURE__*/function () {
    var _ref15 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee15(adapter) {
      var m1;
      return _regenerator["default"].wrap(function _callee15$(_context15) {
        while (1) switch (_context15.prev = _context15.next) {
          case 0:
            m1 = (0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'bar1'
            });
            _context15.next = 3;
            return adapter.batch([['create', 'tasks', m1]]);
          case 3:
            _context15.t0 = expect;
            _context15.next = 6;
            return adapter.query((0, _helpers.taskQuery)());
          case 6:
            _context15.t1 = _context15.sent;
            (0, _context15.t0)(_context15.t1).toEqual(['t1']);
            _context15.next = 10;
            return adapter.batch([['markAsDeleted', 'tasks', m1.id]]);
          case 10:
            _context15.t2 = expect;
            _context15.next = 13;
            return adapter.query((0, _helpers.taskQuery)());
          case 13:
            _context15.t3 = _context15.sent;
            (0, _context15.t2)(_context15.t3).toEqual([]);
            // Check that the record is removed from cache
            // HACK: Set _status to reveal the record in query (if record was cached, there would only be ID)
            m1._status = 'synced';
            _context15.next = 18;
            return adapter.batch([['update', 'tasks', m1]]);
          case 18:
            _context15.t4 = _helpers.expectSortedEqual;
            _context15.next = 21;
            return adapter.query((0, _helpers.taskQuery)());
          case 21:
            _context15.t5 = _context15.sent;
            _context15.t6 = [m1];
            (0, _context15.t4)(_context15.t5, _context15.t6);
          case 24:
          case "end":
            return _context15.stop();
        }
      }, _callee15);
    }));
    return function (_x18) {
      return _ref15.apply(this, arguments);
    };
  }());
  it('can destroy records permanently', /*#__PURE__*/function () {
    var _ref16 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee16(adapter) {
      var m1, m2;
      return _regenerator["default"].wrap(function _callee16$(_context16) {
        while (1) switch (_context16.prev = _context16.next) {
          case 0:
            m1 = (0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'bar1'
            });
            m2 = (0, _helpers.mockTaskRaw)({
              id: 't2',
              text1: 'bar2'
            });
            _context16.next = 4;
            return adapter.batch([['create', 'tasks', m1], ['create', 'tasks', m2]]);
          case 4:
            _context16.t0 = expect;
            _context16.next = 7;
            return adapter.query((0, _helpers.taskQuery)());
          case 7:
            _context16.t1 = _context16.sent;
            (0, _context16.t0)(_context16.t1).toEqual(['t1', 't2']);
            _context16.next = 11;
            return adapter.batch([['destroyPermanently', 'tasks', m1.id], ['markAsDeleted', 'tasks', m2.id]]);
          case 11:
            _context16.t2 = expect;
            _context16.next = 14;
            return adapter.query((0, _helpers.taskQuery)());
          case 14:
            _context16.t3 = _context16.sent;
            (0, _context16.t2)(_context16.t3).toEqual([]);
            _context16.next = 18;
            return adapter.batch([['destroyPermanently', 'tasks', m2.id]]);
          case 18:
            _context16.t4 = expect;
            _context16.next = 21;
            return adapter.query((0, _helpers.taskQuery)());
          case 21:
            _context16.t5 = _context16.sent;
            (0, _context16.t4)(_context16.t5).toEqual([]);
          case 23:
          case "end":
            return _context16.stop();
        }
      }, _callee16);
    }));
    return function (_x19) {
      return _ref16.apply(this, arguments);
    };
  }());
  it('can destroy permanently records already destroyed', /*#__PURE__*/function () {
    var _ref17 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee17(adapter) {
      var m1;
      return _regenerator["default"].wrap(function _callee17$(_context17) {
        while (1) switch (_context17.prev = _context17.next) {
          case 0:
            m1 = (0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'bar1'
            });
            _context17.next = 3;
            return adapter.batch([['create', 'tasks', m1]]);
          case 3:
            _context17.t0 = expect;
            _context17.next = 6;
            return adapter.query((0, _helpers.taskQuery)());
          case 6:
            _context17.t1 = _context17.sent;
            (0, _context17.t0)(_context17.t1).toEqual(['t1']);
            _context17.next = 10;
            return adapter.batch([['destroyPermanently', 'tasks', m1.id]]);
          case 10:
            _context17.t2 = expect;
            _context17.next = 13;
            return adapter.query((0, _helpers.taskQuery)());
          case 13:
            _context17.t3 = _context17.sent;
            (0, _context17.t2)(_context17.t3).toEqual([]);
            _context17.next = 17;
            return adapter.batch([['destroyPermanently', 'tasks', m1.id]]);
          case 17:
          case "end":
            return _context17.stop();
        }
      }, _callee17);
    }));
    return function (_x20) {
      return _ref17.apply(this, arguments);
    };
  }());
  it('can get deleted record ids', /*#__PURE__*/function () {
    var _ref18 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee18(adapter) {
      var m1, m2;
      return _regenerator["default"].wrap(function _callee18$(_context18) {
        while (1) switch (_context18.prev = _context18.next) {
          case 0:
            m1 = (0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'bar1',
              order: 1
            });
            m2 = (0, _helpers.mockTaskRaw)({
              id: 't2',
              text1: 'bar2',
              order: 2
            });
            _context18.next = 4;
            return adapter.batch([['create', 'tasks', m1], ['markAsDeleted', 'tasks', m1.id], ['create', 'tasks', m2], ['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't3',
              text1: 'bar3'
            })], ['markAsDeleted', 'tasks', m2.id]]);
          case 4:
            _context18.t0 = _helpers.expectSortedEqual;
            _context18.next = 7;
            return adapter.getDeletedRecords('tasks');
          case 7:
            _context18.t1 = _context18.sent;
            _context18.t2 = ['t2', 't1'];
            (0, _context18.t0)(_context18.t1, _context18.t2);
          case 10:
          case "end":
            return _context18.stop();
        }
      }, _callee18);
    }));
    return function (_x21) {
      return _ref18.apply(this, arguments);
    };
  }());
  it('can destroy deleted records', /*#__PURE__*/function () {
    var _ref19 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee19(adapter) {
      var m1, m2, m3;
      return _regenerator["default"].wrap(function _callee19$(_context19) {
        while (1) switch (_context19.prev = _context19.next) {
          case 0:
            m1 = (0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'bar1',
              order: 1
            });
            m2 = (0, _helpers.mockTaskRaw)({
              id: 't2',
              text1: 'bar2',
              order: 2
            });
            m3 = (0, _helpers.mockTaskRaw)({
              id: 't3',
              text1: 'bar3',
              order: 3
            });
            _context19.next = 5;
            return adapter.batch([['create', 'tasks', m1], ['create', 'tasks', m2], ['create', 'tasks', m3], ['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't4',
              text1: 'bar4'
            })]]);
          case 5:
            _context19.next = 7;
            return adapter.batch([['markAsDeleted', 'tasks', m1.id], ['markAsDeleted', 'tasks', m2.id], ['markAsDeleted', 'tasks', m3.id]]);
          case 7:
            _context19.next = 9;
            return adapter.destroyDeletedRecords('tasks', ['t1', 't2']);
          case 9:
            _context19.t0 = _helpers.expectSortedEqual;
            _context19.next = 12;
            return adapter.getDeletedRecords('tasks');
          case 12:
            _context19.t1 = _context19.sent;
            _context19.t2 = ['t3'];
            (0, _context19.t0)(_context19.t1, _context19.t2);
            _context19.t3 = _helpers.expectSortedEqual;
            _context19.next = 18;
            return adapter.query((0, _helpers.taskQuery)());
          case 18:
            _context19.t4 = _context19.sent;
            _context19.t5 = ['t4'];
            (0, _context19.t3)(_context19.t4, _context19.t5);
            _context19.t6 = expect;
            _context19.next = 24;
            return adapter.find('tasks', 't1');
          case 24:
            _context19.t7 = _context19.sent;
            (0, _context19.t6)(_context19.t7).toBeNull();
            _context19.t8 = expect;
            _context19.next = 29;
            return adapter.find('tasks', 't2');
          case 29:
            _context19.t9 = _context19.sent;
            (0, _context19.t8)(_context19.t9).toBeNull();
          case 31:
          case "end":
            return _context19.stop();
        }
      }, _callee19);
    }));
    return function (_x22) {
      return _ref19.apply(this, arguments);
    };
  }());
  it('destroyDeletedRecords can handle unsafe strings', /*#__PURE__*/function () {
    var _ref20 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee20(adapter) {
      var m1, m2, m3;
      return _regenerator["default"].wrap(function _callee20$(_context20) {
        while (1) switch (_context20.prev = _context20.next) {
          case 0:
            m1 = (0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'bar1',
              order: 1
            });
            m2 = (0, _helpers.mockTaskRaw)({
              id: 't2',
              text1: 'bar2',
              order: 2
            });
            m3 = (0, _helpers.mockTaskRaw)({
              id: 't3',
              text1: 'bar3',
              order: 3
            });
            _context20.next = 5;
            return adapter.batch([['create', 'tasks', m1], ['create', 'tasks', m2], ['create', 'tasks', m3]]);
          case 5:
            _context20.next = 7;
            return adapter.batch([['markAsDeleted', 'tasks', m1.id], ['markAsDeleted', 'tasks', m2.id], ['markAsDeleted', 'tasks', m3.id]]);
          case 7:
            _context20.next = 9;
            return adapter.destroyDeletedRecords('tasks', ["') or 1=1 --"]);
          case 9:
            _context20.t0 = _helpers.expectSortedEqual;
            _context20.next = 12;
            return adapter.getDeletedRecords('tasks');
          case 12:
            _context20.t1 = _context20.sent;
            _context20.t2 = ['t1', 't2', 't3'];
            (0, _context20.t0)(_context20.t1, _context20.t2);
            _context20.t3 = _helpers.expectSortedEqual;
            _context20.next = 18;
            return adapter.query((0, _helpers.taskQuery)());
          case 18:
            _context20.t4 = _context20.sent;
            _context20.t5 = [];
            (0, _context20.t3)(_context20.t4, _context20.t5);
            _context20.next = 23;
            return adapter.destroyDeletedRecords('tasks', ["'); insert into tasks (id) values ('t4') --"]);
          case 23:
            _context20.t6 = _helpers.expectSortedEqual;
            _context20.next = 26;
            return adapter.query((0, _helpers.taskQuery)());
          case 26:
            _context20.t7 = _context20.sent;
            _context20.t8 = [];
            (0, _context20.t6)(_context20.t7, _context20.t8);
          case 29:
          case "end":
            return _context20.stop();
        }
      }, _callee20);
    }));
    return function (_x23) {
      return _ref20.apply(this, arguments);
    };
  }());
  it('can run mixed batches', /*#__PURE__*/function () {
    var _ref21 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee21(_adapter) {
      var adapter, m1, m3, m4, m2, fetched1, fetched2;
      return _regenerator["default"].wrap(function _callee21$(_context21) {
        while (1) switch (_context21.prev = _context21.next) {
          case 0:
            adapter = _adapter;
            m1 = (0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'bar'
            });
            m3 = (0, _helpers.mockTaskRaw)({
              id: 't3'
            });
            m4 = (0, _helpers.mockTaskRaw)({
              id: 't4'
            });
            _context21.next = 6;
            return adapter.batch([['create', 'tasks', m1]]);
          case 6:
            m1.bool1 = true;
            m2 = (0, _helpers.mockTaskRaw)({
              id: 't2',
              text1: 'bar',
              bool2: true,
              order: 2
            });
            _context21.next = 10;
            return adapter.batch([['create', 'tasks', m3], ['create', 'tasks', m4], ['destroyPermanently', 'tasks', m3.id], ['update', 'tasks', m1], ['create', 'tasks', m2], ['markAsDeleted', 'tasks', m4.id]]);
          case 10:
            _context21.next = 12;
            return adapter.testClone();
          case 12:
            adapter = _context21.sent;
            _context21.next = 15;
            return adapter.find('tasks', 't1');
          case 15:
            fetched1 = _context21.sent;
            expect(fetched1.bool1).toBe(true);
            expect(fetched1).toEqual(m1);
            _context21.next = 20;
            return adapter.find('tasks', 't2');
          case 20:
            fetched2 = _context21.sent;
            expect(fetched2.bool2).toBe(true);
            _context21.t0 = expect;
            _context21.next = 25;
            return adapter.find('tasks', 't3');
          case 25:
            _context21.t1 = _context21.sent;
            (0, _context21.t0)(_context21.t1).toBeNull();
            _context21.t2 = expect;
            _context21.next = 30;
            return adapter.query((0, _helpers.taskQuery)());
          case 30:
            _context21.t3 = _context21.sent;
            (0, _context21.t2)(_context21.t3).toEqual(['t1', 't2']);
            _context21.t4 = expect;
            _context21.next = 35;
            return adapter.getDeletedRecords('tasks');
          case 35:
            _context21.t5 = _context21.sent;
            (0, _context21.t4)(_context21.t5).toEqual(['t4']);
          case 37:
          case "end":
            return _context21.stop();
        }
      }, _callee21);
    }));
    return function (_x24) {
      return _ref21.apply(this, arguments);
    };
  }());
  it('batches are transactional', /*#__PURE__*/function () {
    var _ref22 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee22(adapter, AdapterClass) {
      return _regenerator["default"].wrap(function _callee22$(_context22) {
        while (1) switch (_context22.prev = _context22.next) {
          case 0:
            _context22.next = 2;
            return adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't1'
            })]]);
          case 2:
            _context22.t0 = expect;
            _context22.next = 5;
            return adapter.query((0, _helpers.taskQuery)());
          case 5:
            _context22.t1 = _context22.sent;
            (0, _context22.t0)(_context22.t1).toEqual(['t1']);
            _context22.next = 9;
            return (0, _expectToRejectWithMessage["default"])(adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't2'
            })], ['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't2'
            })] // duplicate
            ]), AdapterClass.name === 'SQLiteAdapter' ? /UNIQUE constraint failed: tasks.id/ : /Duplicate key for property id: t2/);
          case 9:
            if (!(AdapterClass.name !== 'LokiJSAdapter')) {
              _context22.next = 15;
              break;
            }
            _context22.t2 = expect;
            _context22.next = 13;
            return adapter.query((0, _helpers.taskQuery)());
          case 13:
            _context22.t3 = _context22.sent;
            (0, _context22.t2)(_context22.t3).toEqual(['t1']);
          case 15:
          case "end":
            return _context22.stop();
        }
      }, _callee22);
    }));
    return function (_x25, _x26) {
      return _ref22.apply(this, arguments);
    };
  }());
  it('can run sync-like flow', /*#__PURE__*/function () {
    var _ref23 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee23(adapter) {
      var queryAll, m1, m2, m3, toDelete;
      return _regenerator["default"].wrap(function _callee23$(_context23) {
        while (1) switch (_context23.prev = _context23.next) {
          case 0:
            queryAll = function queryAll() {
              return adapter.query((0, _helpers.taskQuery)());
            };
            m1 = (0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'bar1',
              order: 1
            });
            m2 = (0, _helpers.mockTaskRaw)({
              id: 't2',
              text1: 'bar2',
              order: 2
            });
            m3 = (0, _helpers.mockTaskRaw)({
              id: 't3',
              text1: 'bar3',
              order: 3
            });
            _context23.next = 6;
            return adapter.batch([['create', 'tasks', m1], ['create', 'tasks', m2], ['create', 'tasks', m3], ['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't4',
              text1: 'bar4'
            })], ['markAsDeleted', 'tasks', m1.id], ['markAsDeleted', 'tasks', m3.id]]);
          case 6:
            _context23.next = 8;
            return adapter.batch([['destroyPermanently', 'tasks', m1.id], ['destroyPermanently', 'tasks', m2.id]]);
          case 8:
            _context23.t0 = expect;
            _context23.next = 11;
            return queryAll();
          case 11:
            _context23.t1 = _context23.sent;
            (0, _context23.t0)(_context23.t1).toHaveLength(1);
            _context23.next = 15;
            return adapter.getDeletedRecords('tasks');
          case 15:
            toDelete = _context23.sent;
            expect(toDelete).toEqual(['t3']);
            _context23.next = 19;
            return adapter.destroyDeletedRecords('tasks', toDelete);
          case 19:
            _context23.t2 = expect;
            _context23.next = 22;
            return adapter.getDeletedRecords('tasks');
          case 22:
            _context23.t3 = _context23.sent;
            (0, _context23.t2)(_context23.t3).toHaveLength(0);
            _context23.t4 = expect;
            _context23.next = 27;
            return queryAll();
          case 27:
            _context23.t5 = _context23.sent;
            (0, _context23.t4)(_context23.t5).toHaveLength(1);
          case 29:
          case "end":
            return _context23.stop();
        }
      }, _callee23);
    }));
    return function (_x27) {
      return _ref23.apply(this, arguments);
    };
  }());
  it("can unsafely load from sync JSON", /*#__PURE__*/function () {
    var _ref24 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee25(adapter, AdapterClass, extraAdapterOptions, platform) {
      var loadFromSync, query, _require, expectedSanitizations, d, sqlBool;
      return _regenerator["default"].wrap(function _callee25$(_context25) {
        while (1) switch (_context25.prev = _context25.next) {
          case 0:
            if (AdapterClass.name === 'SQLiteAdapter' && adapter.underlyingAdapter._dispatcherType === 'jsi' && platform !== 'windows') {
              _context25.next = 4;
              break;
            }
            _context25.next = 3;
            return (0, _expectToRejectWithMessage["default"])(adapter.unsafeLoadFromSync(0), 'unsafeLoadFromSync unavailable');
          case 3:
            return _context25.abrupt("return");
          case 4:
            loadFromSync = /*#__PURE__*/function () {
              var _ref25 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee24(json) {
                var id;
                return _regenerator["default"].wrap(function _callee24$(_context24) {
                  while (1) switch (_context24.prev = _context24.next) {
                    case 0:
                      id = Math.round(Math.random() * 1000 * 1000 * 1000);
                      _context24.next = 3;
                      return adapter.provideSyncJson(id, JSON.stringify(json));
                    case 3:
                      return _context24.abrupt("return", adapter.unsafeLoadFromSync(id));
                    case 4:
                    case "end":
                      return _context24.stop();
                  }
                }, _callee24);
              }));
              return function loadFromSync(_x32) {
                return _ref25.apply(this, arguments);
              };
            }();
            _context25.next = 7;
            return loadFromSync({
              changes: {}
            });
          case 7:
            _context25.t0 = expect;
            _context25.next = 10;
            return loadFromSync({
              changes: {
                sync_tests: {
                  created: [],
                  updated: [],
                  deleted: []
                }
              },
              timestamp: 1000
            });
          case 10:
            _context25.t1 = _context25.sent;
            (0, _context25.t0)(_context25.t1).toEqual({
              timestamp: 1000
            });
            query = (0, _helpers.modelQuery)(_helpers.MockSyncTestRecord).serialize();
            _context25.t2 = expect;
            _context25.next = 16;
            return adapter.unsafeQueryRaw(query);
          case 16:
            _context25.t3 = _context25.sent;
            (0, _context25.t2)(_context25.t3).toHaveLength(0);
            _require = require('../../RawRecord/__tests__/helpers'), expectedSanitizations = _require.expectedSanitizations;
            _context25.next = 21;
            return loadFromSync({
              changes: {
                sync_tests: {
                  updated: [{
                    id: 't1'
                  }, {
                    id: 't2',
                    str: 'ab',
                    _changed: 'abc',
                    _status: 'updated',
                    this_column_does_not_exist: 'blaaagh'
                  }, {
                    id: 't3',
                    str: 'hy',
                    strN: 'true',
                    num: 3.141592137,
                    bool: null,
                    boolN: false
                  }, {
                    id: 't4',
                    num: 1623666158603
                  }],
                  created: expectedSanitizations.map(function (_ref26, i) {
                    var value = _ref26.value;
                    return {
                      // NOTE: Intentionally in wrong order
                      num: value,
                      str: value,
                      boolN: value,
                      id: "x".concat(i),
                      strN: value,
                      numN: value,
                      bool: value
                    };
                  })
                },
                tasks: {
                  created: [{
                    id: 't1',
                    text1: 'hello'
                  }]
                },
                this_table_does_not_exist: {
                  created: []
                }
              }
            });
          case 21:
            d = {
              _status: 'synced',
              _changed: ''
            };
            sqlBool = function sqlBool(value) {
              if (value === true) {
                return 1;
              } else if (value === false) {
                return 0;
              }
              return value;
            };
            _context25.t4 = expect;
            _context25.next = 26;
            return adapter.unsafeQueryRaw(query);
          case 26:
            _context25.t5 = _context25.sent;
            (0, _context25.t4)(_context25.t5).toEqual([(0, _extends2["default"])({
              id: 't1'
            }, d, {
              str: '',
              strN: null,
              num: 0,
              numN: null,
              bool: 0,
              boolN: null
            }), (0, _extends2["default"])({
              id: 't2'
            }, d, {
              str: 'ab',
              strN: null,
              num: 0,
              numN: null,
              bool: 0,
              boolN: null
            }), (0, _extends2["default"])({
              id: 't3'
            }, d, {
              str: 'hy',
              strN: 'true',
              num: 3.141592137,
              numN: null,
              bool: 0,
              boolN: 0
            }), (0, _extends2["default"])({
              id: 't4'
            }, d, {
              str: '',
              strN: null,
              num: 1623666158603,
              numN: null,
              bool: 0,
              boolN: null
            })].concat((0, _toConsumableArray2["default"])(expectedSanitizations.map(function (values, i) {
              return {
                id: "x".concat(i),
                _status: 'synced',
                _changed: '',
                str: values.string[0],
                strN: values.string[1],
                num: values.number[0],
                numN: values.number[1],
                bool: sqlBool(values["boolean"][0]),
                boolN: sqlBool(values["boolean"][1])
              };
            }))));
            _context25.t6 = expect;
            _context25.next = 31;
            return adapter.query((0, _helpers.taskQuery)());
          case 31:
            _context25.t7 = _context25.sent;
            (0, _context25.t6)(_context25.t7).toEqual([(0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'hello',
              _status: 'synced'
            })]);
            _context25.next = 35;
            return (0, _expectToRejectWithMessage["default"])(loadFromSync({
              changes: {
                tasks: {
                  deleted: ['t1', 't2']
                }
              }
            }), 'expected deleted field to be empty');
          case 35:
            _context25.next = 37;
            return (0, _expectToRejectWithMessage["default"])(loadFromSync({
              changes: {
                tasks: {
                  wat: []
                }
              }
            }), 'bad changeset field');
          case 37:
          case "end":
            return _context25.stop();
        }
      }, _callee25);
    }));
    return function (_x28, _x29, _x30, _x31) {
      return _ref24.apply(this, arguments);
    };
  }());
  it("can return residual JSON from sync JSON", /*#__PURE__*/function () {
    var _ref27 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee27(adapter, AdapterClass, extraAdapterOptions, platform) {
      var check;
      return _regenerator["default"].wrap(function _callee27$(_context27) {
        while (1) switch (_context27.prev = _context27.next) {
          case 0:
            if (AdapterClass.name === 'SQLiteAdapter' && adapter.underlyingAdapter._dispatcherType === 'jsi' && platform !== 'windows') {
              _context27.next = 4;
              break;
            }
            _context27.next = 3;
            return (0, _expectToRejectWithMessage["default"])(adapter.unsafeLoadFromSync(0), 'unsafeLoadFromSync unavailable');
          case 3:
            return _context27.abrupt("return");
          case 4:
            check = /*#__PURE__*/function () {
              var _ref28 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee26(obj) {
                var id, result;
                return _regenerator["default"].wrap(function _callee26$(_context26) {
                  while (1) switch (_context26.prev = _context26.next) {
                    case 0:
                      id = Math.round(Math.random() * 1000 * 1000 * 1000);
                      _context26.next = 3;
                      return adapter.provideSyncJson(id, JSON.stringify((0, _extends2["default"])({
                        changes: {}
                      }, obj)));
                    case 3:
                      _context26.next = 5;
                      return adapter.unsafeLoadFromSync(id);
                    case 5:
                      result = _context26.sent;
                      expect(result).toEqual((0, _extends2["default"])({}, obj));
                    case 7:
                    case "end":
                      return _context26.stop();
                  }
                }, _callee26);
              }));
              return function check(_x37) {
                return _ref28.apply(this, arguments);
              };
            }();
            _context27.next = 7;
            return check({});
          case 7:
            _context27.next = 9;
            return check({
              foo: 'bar',
              num: 0,
              num1: 1,
              "float": 3.14,
              nul: null,
              yes: true,
              no: false
            });
          case 9:
            _context27.next = 11;
            return check({
              timestamp: 1623666158603
            });
          case 11:
            _context27.next = 13;
            return check({
              messages: ['foo', 'bar', 'baz']
            });
          case 13:
            _context27.next = 15;
            return check({
              foo: {
                bar: [1, 2, 3],
                baz: 'blah'
              }
            });
          case 15:
            _context27.next = 17;
            return check({
              naughty: 'foo{\nbar\0'
            });
          case 17:
            _context27.next = 19;
            return check({
              _naughty: {
                '_naughty\n{\0': 'yes'
              }
            });
          case 19:
          case "end":
            return _context27.stop();
        }
      }, _callee27);
    }));
    return function (_x33, _x34, _x35, _x36) {
      return _ref27.apply(this, arguments);
    };
  }());
  it("destroys provided jsons after being used", /*#__PURE__*/function () {
    var _ref29 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee28(adapter, AdapterClass, extraAdapterOptions, platform) {
      return _regenerator["default"].wrap(function _callee28$(_context28) {
        while (1) switch (_context28.prev = _context28.next) {
          case 0:
            if (AdapterClass.name === 'SQLiteAdapter' && adapter.underlyingAdapter._dispatcherType === 'jsi' && platform !== 'windows') {
              _context28.next = 4;
              break;
            }
            _context28.next = 3;
            return (0, _expectToRejectWithMessage["default"])(adapter.provideSyncJson(0, '{}'), 'provideSyncJson unavailable');
          case 3:
            return _context28.abrupt("return");
          case 4:
            _context28.next = 6;
            return adapter.provideSyncJson(2137, JSON.stringify({
              changes: {
                tasks: {
                  created: [{
                    id: 't1'
                  }]
                }
              }
            }));
          case 6:
            _context28.next = 8;
            return adapter.unsafeLoadFromSync(2137);
          case 8:
            _context28.t0 = expect;
            _context28.next = 11;
            return adapter.unsafeQueryRaw((0, _helpers.taskQuery)());
          case 11:
            _context28.t1 = _context28.sent;
            (0, _context28.t0)(_context28.t1).toHaveLength(1);
            _context28.next = 15;
            return (0, _expectToRejectWithMessage["default"])(adapter.unsafeLoadFromSync(2137), 'Sync json 2137 does not exist');
          case 15:
          case "end":
            return _context28.stop();
        }
      }, _callee28);
    }));
    return function (_x38, _x39, _x40, _x41) {
      return _ref29.apply(this, arguments);
    };
  }());
  it('can unsafely reset database', /*#__PURE__*/function () {
    var _ref30 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee29(adapter) {
      return _regenerator["default"].wrap(function _callee29$(_context29) {
        while (1) switch (_context29.prev = _context29.next) {
          case 0:
            _context29.next = 2;
            return adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'bar',
              order: 1
            })]]);
          case 2:
            _context29.next = 4;
            return adapter.unsafeResetDatabase();
          case 4:
            _context29.t0 = expect;
            _context29.next = 7;
            return adapter.count((0, _helpers.taskQuery)());
          case 7:
            _context29.t1 = _context29.sent;
            _context29.next = 10;
            return (0, _context29.t0)(_context29.t1).toBe(0);
          case 10:
            _context29.next = 12;
            return adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't2',
              text1: 'baz',
              order: 2
            })]]);
          case 12:
            _context29.t2 = expect;
            _context29.next = 15;
            return adapter.count((0, _helpers.taskQuery)());
          case 15:
            _context29.t3 = _context29.sent;
            (0, _context29.t2)(_context29.t3).toBe(1);
          case 17:
          case "end":
            return _context29.stop();
        }
      }, _callee29);
    }));
    return function (_x42) {
      return _ref30.apply(this, arguments);
    };
  }());
  it('queues actions correctly', /*#__PURE__*/function () {
    var _ref31 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee30(adapter) {
      var queryable, find1Promise, find2Promise, queryPromise, find2Promise2, batchPromise, queryPromise2;
      return _regenerator["default"].wrap(function _callee30$(_context30) {
        while (1) switch (_context30.prev = _context30.next) {
          case 0:
            queryable = function _queryable(promise) {
              var isSettled = false;
              var result = promise.then(function (value) {
                isSettled = true;
                return value;
              }, function (e) {
                isSettled = true;
                throw e;
              });
              result.isSettled = function () {
                return isSettled;
              };
              return result;
            };
            adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'foo',
              order: 1
            })]]);
            find1Promise = queryable(adapter.find('tasks', 't1'));
            find2Promise = queryable(adapter.find('tasks', 't2'));
            adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't2',
              text1: 'bar',
              order: 2
            })]]);
            queryPromise = queryable(adapter.query((0, _helpers.taskQuery)()));
            find2Promise2 = queryable(adapter.find('tasks', 't2'));
            _context30.next = 9;
            return find2Promise2;
          case 9:
            expect(find1Promise.isSettled()).toBe(true);
            expect(find2Promise.isSettled()).toBe(true);
            expect(queryPromise.isSettled()).toBe(true);
            expect(find2Promise2.isSettled()).toBe(true);
            _context30.t0 = expect;
            _context30.next = 16;
            return find1Promise;
          case 16:
            _context30.t1 = _context30.sent;
            (0, _context30.t0)(_context30.t1).toBe('t1');
            _context30.t2 = expect;
            _context30.next = 21;
            return find2Promise;
          case 21:
            _context30.t3 = _context30.sent;
            (0, _context30.t2)(_context30.t3).toBe(null);
            _context30.t4 = expect;
            _context30.next = 26;
            return queryPromise;
          case 26:
            _context30.t5 = _context30.sent;
            (0, _context30.t4)(_context30.t5).toEqual(['t1', 't2']);
            _context30.t6 = expect;
            _context30.next = 31;
            return find2Promise2;
          case 31:
            _context30.t7 = _context30.sent;
            (0, _context30.t6)(_context30.t7).toBe('t2');
            // unsafeResetDatabase is the only action in loki that's necessarily asynchronous even in sync mode
            batchPromise = queryable(adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't3',
              text1: 'bar',
              order: 2
            })]]));
            adapter.unsafeResetDatabase();
            adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'bar',
              order: 2
            })]]);
            queryPromise2 = adapter.query((0, _helpers.taskQuery)());
            _context30.t8 = expect;
            _context30.next = 40;
            return queryPromise2;
          case 40:
            _context30.t9 = _context30.sent;
            (0, _context30.t8)(_context30.t9).toEqual(['t1']);
            expect(batchPromise.isSettled()).toBe(true);
          case 43:
          case "end":
            return _context30.stop();
        }
      }, _callee30);
    }));
    return function (_x43) {
      return _ref31.apply(this, arguments);
    };
  }());
  it('fails on bad queries, creates, updates, deletes', /*#__PURE__*/function () {
    var _ref32 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee31(adapter) {
      var badQuery, record1;
      return _regenerator["default"].wrap(function _callee31$(_context31) {
        while (1) switch (_context31.prev = _context31.next) {
          case 0:
            badQuery = new _Query["default"]({
              modelClass: BadModel
            }, []).serialize();
            _context31.next = 3;
            return expect(adapter.query(badQuery)).rejects.toBeInstanceOf(Error);
          case 3:
            _context31.next = 5;
            return expect(adapter.count(badQuery)).rejects.toBeInstanceOf(Error);
          case 5:
            record1 = new BadModel({
              table: 'nonexisting'
            }, {
              id: 't1'
            });
            _context31.next = 8;
            return expect(adapter.batch([['create', record1]])).rejects.toBeInstanceOf(Error);
          case 8:
            _context31.next = 10;
            return expect(adapter.batch(['create', record1])).rejects.toBeInstanceOf(Error);
          case 10:
          case "end":
            return _context31.stop();
        }
      }, _callee31);
    }));
    return function (_x44) {
      return _ref32.apply(this, arguments);
    };
  }());
  it("can unsafely execute raw commands", /*#__PURE__*/function () {
    var _ref33 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee32(adapter, AdapterClass) {
      var record;
      return _regenerator["default"].wrap(function _callee32$(_context32) {
        while (1) switch (_context32.prev = _context32.next) {
          case 0:
            if (!(AdapterClass.name === 'SQLiteAdapter')) {
              _context32.next = 5;
              break;
            }
            _context32.next = 3;
            return adapter.unsafeExecute({
              sqls: [['insert into tasks (id, text1) values (?, ?)', ['rec1', 'bar']]]
            });
          case 3:
            _context32.next = 7;
            break;
          case 5:
            _context32.next = 7;
            return adapter.unsafeExecute({
              loki: function loki(_loki) {
                _loki.getCollection('tasks').insert([{
                  id: 'rec1',
                  text1: 'bar'
                }]);
              }
            });
          case 7:
            _context32.next = 9;
            return adapter.find('tasks', 'rec1');
          case 9:
            record = _context32.sent;
            expect(record).toMatchObject({
              id: 'rec1',
              text1: 'bar'
            });
          case 11:
          case "end":
            return _context32.stop();
        }
      }, _callee32);
    }));
    return function (_x45, _x46) {
      return _ref33.apply(this, arguments);
    };
  }());
  it('supports LocalStorage', /*#__PURE__*/function () {
    var _ref34 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee33(adapter) {
      return _regenerator["default"].wrap(function _callee33$(_context33) {
        while (1) switch (_context33.prev = _context33.next) {
          case 0:
            _context33.t0 = expect;
            _context33.next = 3;
            return adapter.getLocal('nonexisting');
          case 3:
            _context33.t1 = _context33.sent;
            (0, _context33.t0)(_context33.t1).toBeNull();
            _context33.next = 7;
            return adapter.setLocal('test1', 'val1');
          case 7:
            _context33.t2 = expect;
            _context33.next = 10;
            return adapter.getLocal('test1');
          case 10:
            _context33.t3 = _context33.sent;
            (0, _context33.t2)(_context33.t3).toBe('val1');
            _context33.next = 14;
            return adapter.setLocal('test1', 'val2');
          case 14:
            _context33.t4 = expect;
            _context33.next = 17;
            return adapter.getLocal('test1');
          case 17:
            _context33.t5 = _context33.sent;
            (0, _context33.t4)(_context33.t5).toBe('val2');
            _context33.next = 21;
            return adapter.removeLocal('test1');
          case 21:
            _context33.t6 = expect;
            _context33.next = 24;
            return adapter.getLocal('test1');
          case 24:
            _context33.t7 = _context33.sent;
            (0, _context33.t6)(_context33.t7).toBeNull();
            _context33.next = 28;
            return adapter.setLocal('test1', 'val3');
          case 28:
            _context33.t8 = expect;
            _context33.next = 31;
            return adapter.getLocal('test1');
          case 31:
            _context33.t9 = _context33.sent;
            (0, _context33.t8)(_context33.t9).toBe('val3');
            _context33.next = 35;
            return adapter.setLocal('order', '3');
          case 35:
            _context33.t10 = expect;
            _context33.next = 38;
            return adapter.getLocal('order');
          case 38:
            _context33.t11 = _context33.sent;
            (0, _context33.t10)(_context33.t11).toBe('3');
            _context33.next = 42;
            return adapter.removeLocal('nonexisting');
          case 42:
          case "end":
            return _context33.stop();
        }
      }, _callee33);
    }));
    return function (_x47) {
      return _ref34.apply(this, arguments);
    };
  }());
  it('only supports strings as LocalStorage values', /*#__PURE__*/function () {
    var _ref35 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee34(adapter) {
      var expectError;
      return _regenerator["default"].wrap(function _callee34$(_context34) {
        while (1) switch (_context34.prev = _context34.next) {
          case 0:
            expectError = function expectError(value) {
              return (0, _expectToRejectWithMessage["default"])(adapter.setLocal('test', value), 'must be a string');
            };
            _context34.next = 3;
            return expectError(0);
          case 3:
            _context34.next = 5;
            return expectError(3.14);
          case 5:
            _context34.next = 7;
            return expectError(true);
          case 7:
            _context34.next = 9;
            return expectError(null);
          case 9:
            _context34.next = 11;
            return expectError(NaN);
          case 11:
            _context34.next = 13;
            return expectError([]);
          case 13:
            _context34.next = 15;
            return expectError({});
          case 15:
          case "end":
            return _context34.stop();
        }
      }, _callee34);
    }));
    return function (_x48) {
      return _ref35.apply(this, arguments);
    };
  }());
  it('supports naughty strings in LocalStorage', /*#__PURE__*/function () {
    var _ref36 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee35(adapter, AdapterClass, extraAdapterOptions, platform) {
      var _iterator, _step, key;
      return _regenerator["default"].wrap(function _callee35$(_context35) {
        while (1) switch (_context35.prev = _context35.next) {
          case 0:
            // eslint-disable-next-line no-restricted-syntax
            _iterator = _createForOfIteratorHelper(_naughtyStrings["default"]);
            _context35.prev = 1;
            _iterator.s();
          case 3:
            if ((_step = _iterator.n()).done) {
              _context35.next = 24;
              break;
            }
            key = _step.value;
            if (!(AdapterClass.name === 'SQLiteAdapter' && !extraAdapterOptions.jsi && (key === _naughtyStrings.bigEndianByteOrderMark && ['android', 'ios'].includes(platform) || key === _naughtyStrings.littleEndianByteOrderMark && platform === 'android'))) {
              _context35.next = 15;
              break;
            }
            _context35.next = 8;
            return adapter.setLocal(key, key);
          case 8:
            _context35.t0 = expect;
            _context35.next = 11;
            return adapter.getLocal(key);
          case 11:
            _context35.t1 = _context35.sent;
            (0, _context35.t0)(_context35.t1).not.toBe(key);
            _context35.next = 22;
            break;
          case 15:
            _context35.next = 17;
            return adapter.setLocal(key, key);
          case 17:
            _context35.t2 = expect;
            _context35.next = 20;
            return adapter.getLocal(key);
          case 20:
            _context35.t3 = _context35.sent;
            (0, _context35.t2)(_context35.t3).toBe(key);
          case 22:
            _context35.next = 3;
            break;
          case 24:
            _context35.next = 29;
            break;
          case 26:
            _context35.prev = 26;
            _context35.t4 = _context35["catch"](1);
            _iterator.e(_context35.t4);
          case 29:
            _context35.prev = 29;
            _iterator.f();
            return _context35.finish(29);
          case 32:
          case "end":
            return _context35.stop();
        }
      }, _callee35, null, [[1, 26, 29, 32]]);
    }));
    return function (_x49, _x50, _x51, _x52) {
      return _ref36.apply(this, arguments);
    };
  }());
  it('does not fail on (weirdly named) table named that are SQLite keywords', /*#__PURE__*/function () {
    var _ref37 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee37(adapter) {
      return _regenerator["default"].wrap(function _callee37$(_context37) {
        while (1) switch (_context37.prev = _context37.next) {
          case 0:
            _context37.next = 2;
            return Promise.all(['where', 'values', 'set', 'drop', 'update'].map(/*#__PURE__*/function () {
              var _ref38 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee36(tableName) {
                return _regenerator["default"].wrap(function _callee36$(_context36) {
                  while (1) switch (_context36.prev = _context36.next) {
                    case 0:
                      _context36.next = 2;
                      return adapter.batch([['create', tableName, {
                        id: 'i1'
                      }]]);
                    case 2:
                      _context36.next = 4;
                      return adapter.batch([['update', tableName, {
                        id: 'i1'
                      }]]);
                    case 4:
                      _context36.next = 6;
                      return adapter.batch([['markAsDeleted', tableName, 'i1']]);
                    case 6:
                      _context36.next = 8;
                      return adapter.batch([['create', tableName, {
                        id: 'i2'
                      }]]);
                    case 8:
                      _context36.next = 10;
                      return adapter.find(tableName, 'i2');
                    case 10:
                      _context36.next = 12;
                      return adapter.query((0, _helpers.modelQuery)({
                        table: tableName
                      }));
                    case 12:
                      _context36.next = 14;
                      return adapter.count((0, _helpers.modelQuery)({
                        table: tableName
                      }));
                    case 14:
                      _context36.next = 16;
                      return adapter.getDeletedRecords(tableName);
                    case 16:
                      _context36.next = 18;
                      return adapter.destroyDeletedRecords(tableName, ['i1']);
                    case 18:
                      _context36.next = 20;
                      return adapter.batch([['destroyPermanently', tableName, 'i2']]);
                    case 20:
                      _context36.next = 22;
                      return adapter.getLocal(tableName);
                    case 22:
                      _context36.next = 24;
                      return adapter.setLocal(tableName, tableName);
                    case 24:
                      _context36.next = 26;
                      return adapter.removeLocal(tableName);
                    case 26:
                    case "end":
                      return _context36.stop();
                  }
                }, _callee36);
              }));
              return function (_x54) {
                return _ref38.apply(this, arguments);
              };
            }()));
          case 2:
          case "end":
            return _context37.stop();
        }
      }, _callee37);
    }));
    return function (_x53) {
      return _ref37.apply(this, arguments);
    };
  }());
  it('fails quickly on non-existing table names', /*#__PURE__*/function () {
    var _ref39 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee38(adapter) {
      var table, msg;
      return _regenerator["default"].wrap(function _callee38$(_context38) {
        while (1) switch (_context38.prev = _context38.next) {
          case 0:
            table = 'does-not-exist';
            msg = /table name '.*' does not exist/;
            _context38.next = 4;
            return (0, _expectToRejectWithMessage["default"])(adapter.find(table, 'i'), msg);
          case 4:
            _context38.next = 6;
            return (0, _expectToRejectWithMessage["default"])(adapter.query((0, _helpers.modelQuery)({
              table: table
            })), msg);
          case 6:
            _context38.next = 8;
            return (0, _expectToRejectWithMessage["default"])(adapter.count((0, _helpers.modelQuery)({
              table: table
            })), msg);
          case 8:
            _context38.next = 10;
            return (0, _expectToRejectWithMessage["default"])(adapter.batch([['create', table, {
              id: 'i1'
            }]]), msg);
          case 10:
            _context38.next = 12;
            return (0, _expectToRejectWithMessage["default"])(adapter.batch([['update', table, {
              id: 'i1'
            }]]), msg);
          case 12:
            _context38.next = 14;
            return (0, _expectToRejectWithMessage["default"])(adapter.batch([['markAsDeleted', table, 'i1']]), msg);
          case 14:
            _context38.next = 16;
            return (0, _expectToRejectWithMessage["default"])(adapter.batch([['destroyPermanently', table, 'i2']]), msg);
          case 16:
            _context38.next = 18;
            return (0, _expectToRejectWithMessage["default"])(adapter.getDeletedRecords(table), msg);
          case 18:
            _context38.next = 20;
            return (0, _expectToRejectWithMessage["default"])(adapter.destroyDeletedRecords(table, []), msg);
          case 20:
          case "end":
            return _context38.stop();
        }
      }, _callee38);
    }));
    return function (_x55) {
      return _ref39.apply(this, arguments);
    };
  }());
  it('migrates database between versions', /*#__PURE__*/function () {
    var _ref40 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee39(_adapter, AdapterClass, extraAdapterOptions) {
      var taskColumnsV3, projectColumnsV3, testSchemaV3, adapter, taskColumnsV5, projectColumnsV5, tagAssignmentSchema, testSchemaV5, migrationsV5, checkTaskColumn, p1, t1, tt1;
      return _regenerator["default"].wrap(function _callee39$(_context39) {
        while (1) switch (_context39.prev = _context39.next) {
          case 0:
            // launch app in one version
            taskColumnsV3 = [{
              name: 'num1',
              type: 'number'
            }];
            projectColumnsV3 = [{
              name: 'text1',
              type: 'string'
            }];
            testSchemaV3 = (0, _Schema.appSchema)({
              version: 3,
              tables: [(0, _Schema.tableSchema)({
                name: 'tasks',
                columns: taskColumnsV3
              }), (0, _Schema.tableSchema)({
                name: 'projects',
                columns: projectColumnsV3
              })]
            });
            adapter = new _compat["default"](new AdapterClass((0, _extends2["default"])({
              schema: testSchemaV3,
              migrations: (0, _migrations.schemaMigrations)({
                migrations: [{
                  toVersion: 3,
                  steps: []
                }]
              })
            }, extraAdapterOptions))); // add data
            _context39.next = 6;
            return adapter.batch([['create', 'tasks', {
              id: 't1',
              num1: 10
            }], ['create', 'tasks', {
              id: 't2',
              num1: 20
            }]]);
          case 6:
            _context39.next = 8;
            return expect(adapter.batch([['create', 'tag_assignments', {
              id: 'tt1',
              text1: 'hello'
            }]])).rejects.toBeInstanceOf(Error);
          case 8:
            // migrate to new version
            taskColumnsV5 = [{
              name: 'test_string',
              type: 'string'
            }, {
              name: 'test_string_optional',
              type: 'string',
              isOptional: true
            }, {
              name: 'test_number',
              type: 'number'
            }, {
              name: 'test_number_optional',
              type: 'number',
              isOptional: true
            }, {
              name: 'test_boolean',
              type: 'boolean'
            }, {
              name: 'test_boolean_optional',
              type: 'boolean',
              isOptional: true
            }];
            projectColumnsV5 = [{
              name: 'text2',
              type: 'string',
              isIndexed: true
            }];
            tagAssignmentSchema = {
              name: 'tag_assignments',
              columns: [{
                name: 'text1',
                type: 'string'
              }]
            };
            testSchemaV5 = (0, _Schema.appSchema)({
              version: 5,
              tables: [(0, _Schema.tableSchema)({
                name: 'tasks',
                columns: [].concat(taskColumnsV3, taskColumnsV5)
              }), (0, _Schema.tableSchema)({
                name: 'projects',
                columns: [].concat(projectColumnsV3, projectColumnsV5)
              }), (0, _Schema.tableSchema)(tagAssignmentSchema)]
            });
            migrationsV5 = (0, _migrations.schemaMigrations)({
              migrations: [{
                toVersion: 5,
                steps: [(0, _migrations.addColumns)({
                  table: 'tasks',
                  columns: taskColumnsV5
                })]
              }, {
                toVersion: 4,
                steps: [(0, _migrations.createTable)(tagAssignmentSchema), (0, _migrations.addColumns)({
                  table: 'projects',
                  columns: projectColumnsV5
                })]
              }, {
                toVersion: 3,
                steps: [(0, _migrations.createTable)({
                  name: 'will_not_be_created',
                  columns: [{
                    name: 'num1',
                    type: 'number'
                  }]
                })]
              }]
            });
            _context39.next = 15;
            return adapter.testClone({
              schema: testSchemaV5,
              migrations: migrationsV5
            });
          case 15:
            adapter = _context39.sent;
            _context39.t0 = expect;
            _context39.next = 19;
            return adapter.count(new _Query["default"]({
              modelClass: _helpers.MockTask
            }, []));
          case 19:
            _context39.t1 = _context39.sent;
            (0, _context39.t0)(_context39.t1).toBe(2);
            // check if new columns were populated with appropriate default values
            checkTaskColumn = function checkTaskColumn(columnName, expectedValue) {
              return new _Query["default"]({
                modelClass: _helpers.MockTask
              }, [Q.where(columnName, expectedValue)]).serialize();
            };
            _context39.t2 = expect;
            _context39.next = 25;
            return adapter.count(checkTaskColumn('test_string', ''));
          case 25:
            _context39.t3 = _context39.sent;
            (0, _context39.t2)(_context39.t3).toBe(2);
            _context39.t4 = expect;
            _context39.next = 30;
            return adapter.count(checkTaskColumn('test_string_optional', null));
          case 30:
            _context39.t5 = _context39.sent;
            (0, _context39.t4)(_context39.t5).toBe(2);
            _context39.t6 = expect;
            _context39.next = 35;
            return adapter.count(checkTaskColumn('test_number', 0));
          case 35:
            _context39.t7 = _context39.sent;
            (0, _context39.t6)(_context39.t7).toBe(2);
            _context39.t8 = expect;
            _context39.next = 40;
            return adapter.count(checkTaskColumn('test_number_optional', null));
          case 40:
            _context39.t9 = _context39.sent;
            (0, _context39.t8)(_context39.t9).toBe(2);
            _context39.t10 = expect;
            _context39.next = 45;
            return adapter.count(checkTaskColumn('test_boolean', false));
          case 45:
            _context39.t11 = _context39.sent;
            (0, _context39.t10)(_context39.t11).toBe(2);
            _context39.t12 = expect;
            _context39.next = 50;
            return adapter.count(checkTaskColumn('test_boolean_optional', null));
          case 50:
            _context39.t13 = _context39.sent;
            (0, _context39.t12)(_context39.t13).toBe(2);
            _context39.next = 54;
            return adapter.batch([['create', 'tag_assignments', {
              id: 'tt2',
              text1: 'hello'
            }], ['create', 'projects', {
              id: 'p1',
              text1: 'hey',
              text2: 'foo'
            }], ['create', 'tasks', {
              id: 't3',
              test_string: 'hey',
              test_number: 2,
              test_boolean_optional: true
            }]]);
          case 54:
            _context39.next = 56;
            return expect(adapter.batch([['create', 'will_not_be_created', {
              id: 'w1',
              text1: 'hello'
            }]])).rejects.toBeInstanceOf(Error);
          case 56:
            _context39.next = 58;
            return adapter.testClone();
          case 58:
            adapter = _context39.sent;
            _context39.next = 61;
            return adapter.find('projects', 'p1');
          case 61:
            p1 = _context39.sent;
            expect(p1.text2).toBe('foo');
            _context39.next = 65;
            return adapter.find('tasks', 't3');
          case 65:
            t1 = _context39.sent;
            expect(t1.test_string).toBe('hey');
            expect(t1.test_number).toBe(2);
            expect(t1.test_boolean).toBe(false);
            _context39.next = 71;
            return adapter.find('tag_assignments', 'tt2');
          case 71:
            tt1 = _context39.sent;
            expect(tt1.text1).toBe('hello');
          case 73:
          case "end":
            return _context39.stop();
        }
      }, _callee39);
    }));
    return function (_x56, _x57, _x58) {
      return _ref40.apply(this, arguments);
    };
  }());
  it("can perform empty migrations (regression test)", /*#__PURE__*/function () {
    var _ref41 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee40(_adapter, AdapterClass, extraAdapterOptions) {
      var adapter;
      return _regenerator["default"].wrap(function _callee40$(_context40) {
        while (1) switch (_context40.prev = _context40.next) {
          case 0:
            adapter = new _compat["default"](new AdapterClass((0, _extends2["default"])({
              schema: (0, _extends2["default"])({}, _helpers.testSchema, {
                version: 1
              }),
              migrations: (0, _migrations.schemaMigrations)({
                migrations: []
              })
            }, extraAdapterOptions)));
            _context40.next = 3;
            return adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({
              id: 't1',
              text1: 'foo'
            })]]);
          case 3:
            _context40.t0 = expect;
            _context40.next = 6;
            return adapter.count((0, _helpers.taskQuery)());
          case 6:
            _context40.t1 = _context40.sent;
            (0, _context40.t0)(_context40.t1).toBe(1);
            _context40.next = 10;
            return adapter.testClone({
              schema: (0, _extends2["default"])({}, _helpers.testSchema, {
                version: 2
              }),
              migrations: (0, _migrations.schemaMigrations)({
                migrations: [{
                  toVersion: 2,
                  steps: []
                }]
              })
            });
          case 10:
            adapter = _context40.sent;
            _context40.t2 = expect;
            _context40.next = 14;
            return adapter.count((0, _helpers.taskQuery)());
          case 14:
            _context40.t3 = _context40.sent;
            (0, _context40.t2)(_context40.t3).toBe(1);
            _context40.t4 = expect;
            _context40.next = 19;
            return adapter.find('tasks', 't1');
          case 19:
            _context40.t5 = _context40.sent.text1;
            (0, _context40.t4)(_context40.t5).toBe('foo');
          case 21:
          case "end":
            return _context40.stop();
        }
      }, _callee40);
    }));
    return function (_x59, _x60, _x61) {
      return _ref41.apply(this, arguments);
    };
  }());
  it("resets database when it's newer than app schema", /*#__PURE__*/function () {
    var _ref42 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee41(_adapter, AdapterClass, extraAdapterOptions) {
      var adapter;
      return _regenerator["default"].wrap(function _callee41$(_context41) {
        while (1) switch (_context41.prev = _context41.next) {
          case 0:
            // launch newer version of the app
            adapter = new _compat["default"](new AdapterClass((0, _extends2["default"])({
              schema: (0, _extends2["default"])({}, _helpers.testSchema, {
                version: 3
              }),
              migrations: (0, _migrations.schemaMigrations)({
                migrations: [{
                  toVersion: 3,
                  steps: []
                }]
              })
            }, extraAdapterOptions)));
            _context41.next = 3;
            return adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({})]]);
          case 3:
            _context41.t0 = expect;
            _context41.next = 6;
            return adapter.count((0, _helpers.taskQuery)());
          case 6:
            _context41.t1 = _context41.sent;
            (0, _context41.t0)(_context41.t1).toBe(1);
            _context41.next = 10;
            return adapter.testClone({
              schema: (0, _extends2["default"])({}, _helpers.testSchema, {
                version: 1
              }),
              migrations: (0, _migrations.schemaMigrations)({
                migrations: []
              })
            });
          case 10:
            adapter = _context41.sent;
            _context41.t2 = expect;
            _context41.next = 14;
            return adapter.count((0, _helpers.taskQuery)());
          case 14:
            _context41.t3 = _context41.sent;
            (0, _context41.t2)(_context41.t3).toBe(0);
            _context41.next = 18;
            return adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({})]]);
          case 18:
            _context41.t4 = expect;
            _context41.next = 21;
            return adapter.count((0, _helpers.taskQuery)());
          case 21:
            _context41.t5 = _context41.sent;
            (0, _context41.t4)(_context41.t5).toBe(1);
          case 23:
          case "end":
            return _context41.stop();
        }
      }, _callee41);
    }));
    return function (_x62, _x63, _x64) {
      return _ref42.apply(this, arguments);
    };
  }());
  it('resets database when there are no available migrations', /*#__PURE__*/function () {
    var _ref43 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee42(_adapter, AdapterClass, extraAdapterOptions) {
      var adapter;
      return _regenerator["default"].wrap(function _callee42$(_context42) {
        while (1) switch (_context42.prev = _context42.next) {
          case 0:
            // launch older version of the app
            adapter = new _compat["default"](new AdapterClass((0, _extends2["default"])({
              schema: (0, _extends2["default"])({}, _helpers.testSchema, {
                version: 1
              }),
              migrations: (0, _migrations.schemaMigrations)({
                migrations: []
              })
            }, extraAdapterOptions)));
            _context42.next = 3;
            return adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({})]]);
          case 3:
            _context42.t0 = expect;
            _context42.next = 6;
            return adapter.count((0, _helpers.taskQuery)());
          case 6:
            _context42.t1 = _context42.sent;
            (0, _context42.t0)(_context42.t1).toBe(1);
            _context42.next = 10;
            return adapter.testClone({
              schema: (0, _extends2["default"])({}, _helpers.testSchema, {
                version: 3
              }),
              migrations: (0, _migrations.schemaMigrations)({
                migrations: [{
                  toVersion: 3,
                  steps: []
                }]
              })
            });
          case 10:
            adapter = _context42.sent;
            _context42.t2 = expect;
            _context42.next = 14;
            return adapter.count((0, _helpers.taskQuery)());
          case 14:
            _context42.t3 = _context42.sent;
            (0, _context42.t2)(_context42.t3).toBe(0);
            _context42.next = 18;
            return adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({})]]);
          case 18:
            _context42.t4 = expect;
            _context42.next = 21;
            return adapter.count((0, _helpers.taskQuery)());
          case 21:
            _context42.t5 = _context42.sent;
            (0, _context42.t4)(_context42.t5).toBe(1);
          case 23:
          case "end":
            return _context42.stop();
        }
      }, _callee42);
    }));
    return function (_x65, _x66, _x67) {
      return _ref43.apply(this, arguments);
    };
  }());
  it('errors when migration fails', /*#__PURE__*/function () {
    var _ref44 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee43(_adapter, AdapterClass, extraAdapterOptions) {
      var adapter, adapterPromise;
      return _regenerator["default"].wrap(function _callee43$(_context43) {
        while (1) switch (_context43.prev = _context43.next) {
          case 0:
            // launch older version of the app
            adapter = new _compat["default"](new AdapterClass((0, _extends2["default"])({
              schema: (0, _extends2["default"])({}, _helpers.testSchema, {
                version: 1
              }),
              migrations: (0, _migrations.schemaMigrations)({
                migrations: []
              })
            }, extraAdapterOptions)));
            _context43.next = 3;
            return adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({})]]);
          case 3:
            _context43.t0 = expect;
            _context43.next = 6;
            return adapter.count((0, _helpers.taskQuery)());
          case 6:
            _context43.t1 = _context43.sent;
            (0, _context43.t0)(_context43.t1).toBe(1);
            // launch newer version of the app with a migration that will fail
            adapterPromise = adapter.testClone({
              schema: (0, _extends2["default"])({}, _helpers.testSchema, {
                version: 2
              }),
              migrations: (0, _migrations.schemaMigrations)({
                migrations: [{
                  toVersion: 2,
                  steps: [
                  // with SQLite, trying to create a duplicate table will fail, but Loki will just ignore it
                  // so let's insert something that WILL fail
                  AdapterClass.name === 'LokiJSAdapter' ? {
                    type: 'bad_type'
                  } : (0, _migrations.createTable)({
                    name: 'tasks',
                    columns: []
                  })]
                }]
              })
            }); // TODO: Make the SQLite, LokiJS adapter behavior consistent
            if (!(AdapterClass.name === 'LokiJSAdapter')) {
              _context43.next = 19;
              break;
            }
            _context43.next = 12;
            return adapterPromise;
          case 12:
            adapter = _context43.sent;
            _context43.next = 15;
            return expect(adapter.count((0, _helpers.taskQuery)())).rejects.toBeInstanceOf(Error);
          case 15:
            _context43.next = 17;
            return expect(adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({})]])).rejects.toBeInstanceOf(Error);
          case 17:
            _context43.next = 21;
            break;
          case 19:
            _context43.next = 21;
            return expect(adapterPromise).rejects.toBeInstanceOf(Error);
          case 21:
          case "end":
            return _context43.stop();
        }
      }, _callee43);
    }));
    return function (_x68, _x69, _x70) {
      return _ref44.apply(this, arguments);
    };
  }());
  it('can actually save and read from file system', /*#__PURE__*/function () {
    var _ref45 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee44(_adapter, AdapterClass, extraAdapterOptions, platform) {
      var fileName, adapter, adapter2, adapter3;
      return _regenerator["default"].wrap(function _callee44$(_context44) {
        while (1) switch (_context44.prev = _context44.next) {
          case 0:
            if (!(AdapterClass.name === 'LokiJSAdapter')) {
              _context44.next = 2;
              break;
            }
            return _context44.abrupt("return");
          case 2:
            fileName = platform === 'node' ? ".tmp/testDatabase-".concat(Math.random(), ".db") : "testDatabase-".concat(Math.random(), ".db");
            adapter = new _compat["default"](new AdapterClass((0, _extends2["default"])({}, extraAdapterOptions, {
              dbName: fileName,
              schema: (0, _extends2["default"])({}, _helpers.testSchema, {
                version: 1
              })
            })));
            expect(adapter.dbName).toBe(fileName);

            // sanity check
            _context44.t0 = expect;
            _context44.next = 8;
            return adapter.count((0, _helpers.taskQuery)());
          case 8:
            _context44.t1 = _context44.sent;
            (0, _context44.t0)(_context44.t1).toBe(0);
            _context44.next = 12;
            return adapter.batch([['create', 'tasks', (0, _helpers.mockTaskRaw)({})]]);
          case 12:
            _context44.t2 = expect;
            _context44.next = 15;
            return adapter.count((0, _helpers.taskQuery)());
          case 15:
            _context44.t3 = _context44.sent;
            (0, _context44.t2)(_context44.t3).toBe(1);
            // open second db
            adapter2 = new _compat["default"](new AdapterClass((0, _extends2["default"])({}, extraAdapterOptions, {
              dbName: fileName,
              schema: (0, _extends2["default"])({}, _helpers.testSchema, {
                version: 1
              })
            })));
            _context44.t4 = expect;
            _context44.next = 21;
            return adapter2.count((0, _helpers.taskQuery)());
          case 21:
            _context44.t5 = _context44.sent;
            (0, _context44.t4)(_context44.t5).toBe(1);
            _context44.next = 25;
            return adapter2.unsafeResetDatabase();
          case 25:
            _context44.t6 = expect;
            _context44.next = 28;
            return adapter2.count((0, _helpers.taskQuery)());
          case 28:
            _context44.t7 = _context44.sent;
            (0, _context44.t6)(_context44.t7).toBe(0);
            // open third db
            adapter3 = new _compat["default"](new AdapterClass((0, _extends2["default"])({}, extraAdapterOptions, {
              dbName: fileName,
              schema: (0, _extends2["default"])({}, _helpers.testSchema, {
                version: 1
              })
            })));
            _context44.t8 = expect;
            _context44.next = 34;
            return adapter3.count((0, _helpers.taskQuery)());
          case 34:
            _context44.t9 = _context44.sent;
            (0, _context44.t8)(_context44.t9).toBe(0);
          case 36:
          case "end":
            return _context44.stop();
        }
      }, _callee44);
    }));
    return function (_x71, _x72, _x73, _x74) {
      return _ref45.apply(this, arguments);
    };
  }());
  _databaseTests.matchTests.forEach(function (testCase) {
    return it("[shared match test] ".concat(testCase.name), /*#__PURE__*/function () {
      var _ref46 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee45(adapter, AdapterClass) {
        var perform, shouldSkip;
        return _regenerator["default"].wrap(function _callee45$(_context45) {
          while (1) switch (_context45.prev = _context45.next) {
            case 0:
              perform = function perform() {
                return (0, _helpers.performMatchTest)(adapter, testCase);
              };
              shouldSkip = AdapterClass.name === 'LokiJSAdapter' && testCase.skipLoki || AdapterClass.name === 'SQLiteAdapter' && testCase.skipSqlite;
              if (!shouldSkip) {
                _context45.next = 7;
                break;
              }
              _context45.next = 5;
              return expect(perform()).rejects.toBeInstanceOf(Error);
            case 5:
              _context45.next = 9;
              break;
            case 7:
              _context45.next = 9;
              return perform();
            case 9:
            case "end":
              return _context45.stop();
          }
        }, _callee45);
      }));
      return function (_x75, _x76) {
        return _ref46.apply(this, arguments);
      };
    }());
  });
  _databaseTests.joinTests.forEach(function (testCase) {
    return it("[shared join test] ".concat(testCase.name), /*#__PURE__*/function () {
      var _ref47 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee46(adapter, AdapterClass) {
        var perform, shouldSkip;
        return _regenerator["default"].wrap(function _callee46$(_context46) {
          while (1) switch (_context46.prev = _context46.next) {
            case 0:
              perform = function perform() {
                return (0, _helpers.performJoinTest)(adapter, testCase);
              };
              shouldSkip = AdapterClass.name === 'LokiJSAdapter' && testCase.skipLoki || AdapterClass.name === 'SQLiteAdapter' && testCase.skipSqlite;
              if (!shouldSkip) {
                _context46.next = 7;
                break;
              }
              _context46.next = 5;
              return expect(perform()).rejects.toBeInstanceOf(Error);
            case 5:
              _context46.next = 9;
              break;
            case 7:
              _context46.next = 9;
              return perform();
            case 9:
            case "end":
              return _context46.stop();
          }
        }, _callee46);
      }));
      return function (_x77, _x78) {
        return _ref47.apply(this, arguments);
      };
    }());
  });
  it('[shared match test] can match strings from big-list-of-naughty-strings', /*#__PURE__*/function () {
    var _ref48 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee47(adapter, AdapterClass, extraAdapterOptions, platform) {
      var _iterator2, _step2, testCase, naughtyString;
      return _regenerator["default"].wrap(function _callee47$(_context47) {
        while (1) switch (_context47.prev = _context47.next) {
          case 0:
            // eslint-disable-next-line no-restricted-syntax
            _iterator2 = _createForOfIteratorHelper(_databaseTests.naughtyMatchTests);
            _context47.prev = 1;
            _iterator2.s();
          case 3:
            if ((_step2 = _iterator2.n()).done) {
              _context47.next = 14;
              break;
            }
            testCase = _step2.value;
            // console.log(testCase.name)
            // KNOWN ISSUE: non-JSI adapter implementation gets confused by this (it's a BOM mark)
            naughtyString = testCase.matching[0].text1;
            if (!(AdapterClass.name === 'SQLiteAdapter' && !extraAdapterOptions.jsi && (naughtyString === _naughtyStrings.bigEndianByteOrderMark && ['android', 'ios'].includes(platform) || naughtyString === _naughtyStrings.littleEndianByteOrderMark && platform === 'android'))) {
              _context47.next = 10;
              break;
            }
            // eslint-disable-next-line no-console
            console.warn('skip check for a BOM naughty string - known failing test');
            _context47.next = 12;
            break;
          case 10:
            _context47.next = 12;
            return (0, _helpers.performMatchTest)(adapter, testCase);
          case 12:
            _context47.next = 3;
            break;
          case 14:
            _context47.next = 19;
            break;
          case 16:
            _context47.prev = 16;
            _context47.t0 = _context47["catch"](1);
            _iterator2.e(_context47.t0);
          case 19:
            _context47.prev = 19;
            _iterator2.f();
            return _context47.finish(19);
          case 22:
          case "end":
            return _context47.stop();
        }
      }, _callee47, null, [[1, 16, 19, 22]]);
    }));
    return function (_x79, _x80, _x81, _x82) {
      return _ref48.apply(this, arguments);
    };
  }());
  it('can store and retrieve large numbers (regression test)', /*#__PURE__*/function () {
    var _ref49 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee48(_adapter) {
      var adapter, number, record;
      return _regenerator["default"].wrap(function _callee48$(_context48) {
        while (1) switch (_context48.prev = _context48.next) {
          case 0:
            // NOTE: matcher test didn't catch it because both insert and query has the same bug
            adapter = _adapter;
            number = 1590485104033;
            _context48.next = 4;
            return adapter.batch([['create', 'tasks', {
              id: 'm1',
              num1: number
            }]]);
          case 4:
            _context48.next = 6;
            return adapter.testClone();
          case 6:
            adapter = _context48.sent;
            _context48.next = 9;
            return adapter.find('tasks', 'm1');
          case 9:
            record = _context48.sent;
            expect(record.num1).toBe(number);
          case 11:
          case "end":
            return _context48.stop();
        }
      }, _callee48);
    }));
    return function (_x83) {
      return _ref49.apply(this, arguments);
    };
  }());
  it('can store and retrieve naughty strings exactly', /*#__PURE__*/function () {
    var _ref50 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee49(_adapter, AdapterClass, extraAdapterOptions, platform) {
      var adapter, indexedNaughtyStrings, allRecords;
      return _regenerator["default"].wrap(function _callee49$(_context49) {
        while (1) switch (_context49.prev = _context49.next) {
          case 0:
            adapter = _adapter;
            indexedNaughtyStrings = _naughtyStrings["default"].map(function (string, i) {
              return ["id".concat(i), string];
            });
            _context49.next = 4;
            return adapter.batch(indexedNaughtyStrings.map(function (_ref51) {
              var _ref52 = (0, _slicedToArray2["default"])(_ref51, 2),
                id = _ref52[0],
                string = _ref52[1];
              return ['create', 'tasks', {
                id: id,
                text1: string
              }];
            }));
          case 4:
            _context49.next = 6;
            return adapter.testClone();
          case 6:
            adapter = _context49.sent;
            _context49.next = 9;
            return adapter.query((0, _helpers.taskQuery)());
          case 9:
            allRecords = _context49.sent;
            indexedNaughtyStrings.forEach(function (_ref53) {
              var _ref54 = (0, _slicedToArray2["default"])(_ref53, 2),
                id = _ref54[0],
                string = _ref54[1];
              var record = allRecords.find(function (model) {
                return model.id === id;
              });
              // console.log(string, record)
              // KNOWN ISSUE: non-JSI adapter implementation gets confused by this (it's a BOM mark)
              if (AdapterClass.name === 'SQLiteAdapter' && !extraAdapterOptions.jsi && (string === _naughtyStrings.bigEndianByteOrderMark && ['android', 'ios'].includes(platform) || string === _naughtyStrings.littleEndianByteOrderMark && platform === 'android')) {
                expect(record.text1).not.toBe(string); // if this fails, it means the issue's been fixed
              } else {
                expect(!!record).toBe(true);
                expect(record.text1).toBe(string);
              }
            });
          case 11:
          case "end":
            return _context49.stop();
        }
      }, _callee49);
    }));
    return function (_x84, _x85, _x86, _x87) {
      return _ref50.apply(this, arguments);
    };
  }());
  it('can retrieve dbName', /*#__PURE__*/function () {
    var _ref56 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee50(adapter, _, _ref55) {
      var dbName;
      return _regenerator["default"].wrap(function _callee50$(_context50) {
        while (1) switch (_context50.prev = _context50.next) {
          case 0:
            dbName = _ref55.dbName;
            expect(adapter.dbName).toBe(dbName);
          case 2:
          case "end":
            return _context50.stop();
        }
      }, _callee50);
    }));
    return function (_x88, _x89, _x90) {
      return _ref56.apply(this, arguments);
    };
  }());
  return commonTests;
};