"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _testModels = require("../../__tests__/testModels");
var _ = _interopRequireDefault(require("."));
var simpleMockDatabase = function simpleMockDatabase() {
  var storage = {};
  return {
    storage: storage,
    adapter: {
      getLocal: function getLocal(key) {
        return storage[key];
      },
      setLocal: function setLocal(key, value) {
        storage[key] = value;
      },
      removeLocal: function removeLocal(key) {
        delete storage[key];
      }
    }
  };
};
describe('LocalStorage', function () {
  it('implements CRUD operations and stores data as JSON', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var db, localStorage;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          db = simpleMockDatabase();
          localStorage = new _["default"](db); // non-existing get
          _context.t0 = expect;
          _context.next = 5;
          return localStorage.get('nonexisting');
        case 5:
          _context.t1 = _context.sent;
          (0, _context.t0)(_context.t1).toBe(undefined);
          _context.next = 9;
          return localStorage.set('test1', [1, 'foo', false]);
        case 9:
          expect(db.storage.test1).toBe('[1,"foo",false]');

          // get json
          _context.t2 = expect;
          _context.next = 13;
          return localStorage.get('test1');
        case 13:
          _context.t3 = _context.sent;
          (0, _context.t2)(_context.t3).toEqual([1, 'foo', false]);
          _context.next = 17;
          return localStorage.set('test1', {
            hey: null
          });
        case 17:
          expect(db.storage.test1).toBe('{"hey":null}');

          // remove
          _context.next = 20;
          return localStorage.remove('test1');
        case 20:
          expect(db.storage.test1).toBe(undefined);
        case 21:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  it("can store all JSON-safe values", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var _mockDatabase, db, localStorage, check;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _mockDatabase = (0, _testModels.mockDatabase)(), db = _mockDatabase.db;
          localStorage = new _["default"](db);
          check = /*#__PURE__*/function () {
            var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(value) {
              return _regenerator["default"].wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.t0 = expect;
                    _context2.next = 3;
                    return localStorage.get('tested_value');
                  case 3:
                    _context2.t1 = _context2.sent;
                    (0, _context2.t0)(_context2.t1).toBe(undefined);
                    _context2.next = 7;
                    return localStorage.set('tested_value', value);
                  case 7:
                    _context2.t2 = expect;
                    _context2.next = 10;
                    return localStorage.get('tested_value');
                  case 10:
                    _context2.t3 = _context2.sent;
                    (0, _context2.t2)(_context2.t3).toEqual(value);
                    _context2.next = 14;
                    return localStorage.remove('tested_value');
                  case 14:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2);
            }));
            return function check(_x) {
              return _ref3.apply(this, arguments);
            };
          }();
          _context3.next = 5;
          return check('');
        case 5:
          _context3.next = 7;
          return check('foo');
        case 7:
          _context3.next = 9;
          return check(0);
        case 9:
          _context3.next = 11;
          return check(3.14);
        case 11:
          _context3.next = 13;
          return check(null);
        case 13:
          _context3.next = 15;
          return check(true);
        case 15:
          _context3.next = 17;
          return check(false);
        case 17:
          _context3.next = 19;
          return check([]);
        case 19:
          _context3.next = 21;
          return check([-1, 0, 'foo', true, false, 3.14, null]);
        case 21:
          _context3.next = 23;
          return check({
            foo: 'bar',
            a: [1, {
              x: null
            }]
          });
        case 23:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
  it("oddball values are serialized as expected", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var _mockDatabase2, db, localStorage, check, date;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _mockDatabase2 = (0, _testModels.mockDatabase)(), db = _mockDatabase2.db;
          localStorage = new _["default"](db);
          check = /*#__PURE__*/function () {
            var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(valueStored, expected) {
              return _regenerator["default"].wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.t0 = expect;
                    _context4.next = 3;
                    return localStorage.get('tested_value');
                  case 3:
                    _context4.t1 = _context4.sent;
                    (0, _context4.t0)(_context4.t1).toBe(undefined);
                    _context4.next = 7;
                    return localStorage.set('tested_value', valueStored);
                  case 7:
                    _context4.t2 = expect;
                    _context4.next = 10;
                    return localStorage.get('tested_value');
                  case 10:
                    _context4.t3 = _context4.sent;
                    (0, _context4.t2)(_context4.t3).toEqual(expected);
                    _context4.next = 14;
                    return localStorage.remove('tested_value');
                  case 14:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4);
            }));
            return function check(_x2, _x3) {
              return _ref5.apply(this, arguments);
            };
          }();
          _context5.next = 5;
          return check(NaN, null);
        case 5:
          _context5.next = 7;
          return check(Infinity, null);
        case 7:
          date = new Date();
          _context5.next = 10;
          return check(date, date.toISOString());
        case 10:
          _context5.next = 12;
          return check({
            foo: undefined,
            bar: '',
            baz: null
          }, {
            bar: '',
            baz: null
          });
        case 12:
          _context5.next = 14;
          return check([undefined, {
            foo: function foo() {}
          }], [null, {}]);
        case 14:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  })));
  it('throws if getting/setting invalid values', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8() {
    var db, localStorage, checkGet, checkSet, cyclic;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          db = simpleMockDatabase();
          localStorage = new _["default"](db);
          checkGet = /*#__PURE__*/function () {
            var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(value) {
              return _regenerator["default"].wrap(function _callee6$(_context6) {
                while (1) switch (_context6.prev = _context6.next) {
                  case 0:
                    db.storage.tested_value = value;
                    _context6.next = 3;
                    return expect(localStorage.get('tested_value')).rejects.toBeInstanceOf(Error);
                  case 3:
                  case "end":
                    return _context6.stop();
                }
              }, _callee6);
            }));
            return function checkGet(_x4) {
              return _ref7.apply(this, arguments);
            };
          }();
          checkSet = /*#__PURE__*/function () {
            var _ref8 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(value) {
              return _regenerator["default"].wrap(function _callee7$(_context7) {
                while (1) switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return expect(localStorage.set('tested_value', value)).rejects.toBeInstanceOf(Error);
                  case 2:
                  case "end":
                    return _context7.stop();
                }
              }, _callee7);
            }));
            return function checkSet(_x5) {
              return _ref8.apply(this, arguments);
            };
          }();
          _context8.next = 6;
          return checkGet('1/asd[];d');
        case 6:
          _context8.next = 8;
          return checkGet({});
        case 8:
          _context8.next = 10;
          return checkSet(undefined);
        case 10:
          _context8.next = 12;
          return checkSet(function () {});
        case 12:
          cyclic = {};
          cyclic.child = {
            cyclic: cyclic
          };
          _context8.next = 16;
          return checkSet(cyclic);
        case 16:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  })));
});