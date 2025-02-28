"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));
var _testModels = require("../../__tests__/testModels");
var _index = require("./index");
var _class;
var MockTaskExtended = (_class = /*#__PURE__*/function (_MockTask) {
  function MockTaskExtended() {
    return _MockTask.apply(this, arguments) || this;
  }
  (0, _inheritsLoose2["default"])(MockTaskExtended, _MockTask);
  var _proto = MockTaskExtended.prototype;
  _proto.returnArgs = /*#__PURE__*/function () {
    var _returnArgs = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(a, b) {
      var _len,
        c,
        _key,
        _args = arguments;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            for (_len = _args.length, c = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
              c[_key - 2] = _args[_key];
            }
            return _context.abrupt("return", [this.name, a, b, c]);
          case 2:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function returnArgs(_x, _x2) {
      return _returnArgs.apply(this, arguments);
    }
    return returnArgs;
  }();
  _proto.nested = /*#__PURE__*/function () {
    var _nested = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var _this = this;
      var _len2,
        args,
        _key2,
        _args3 = arguments;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            for (_len2 = _args3.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = _args3[_key2];
            }
            this.callWriter(function () {
              return _this.returnArgs.apply(_this, ['sub'].concat(args));
            });
            this.callWriter(function () {
              return _this.db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) switch (_context2.prev = _context2.next) {
                    case 0:
                      return _context2.abrupt("return", 42);
                    case 1:
                    case "end":
                      return _context2.stop();
                  }
                }, _callee2);
              })));
            });
            return _context3.abrupt("return", this.callReader(function () {
              return _this.returnArgs.apply(_this, ['sub'].concat(args));
            }));
          case 4:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this);
    }));
    function nested() {
      return _nested.apply(this, arguments);
    }
    return nested;
  }();
  return MockTaskExtended;
}(_testModels.MockTask), (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "returnArgs", [_index.reader], Object.getOwnPropertyDescriptor(_class.prototype, "returnArgs"), _class.prototype), (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "nested", [_index.writer], Object.getOwnPropertyDescriptor(_class.prototype, "nested"), _class.prototype), _class);
describe('@writer', function () {
  it('calls db.writer() and passes arguments correctly', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var _mockDatabase, database, tasks, record, spy;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _mockDatabase = (0, _testModels.mockDatabase)(), database = _mockDatabase.database, tasks = _mockDatabase.tasks;
          record = new MockTaskExtended(tasks, {
            name: 'test'
          });
          spy = jest.spyOn(database, 'read');
          _context4.t0 = expect;
          _context4.next = 6;
          return record.returnArgs(1, 2, 3, 4);
        case 6:
          _context4.t1 = _context4.sent;
          (0, _context4.t0)(_context4.t1).toEqual(['test', 1, 2, [3, 4]]);
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy.mock.calls[0][0]).toBeInstanceOf(Function);
          expect(spy.mock.calls[0][1]).toBe('mock_tasks.returnArgs');
        case 11:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
  it('can call subactions using this.callReader/callWriter', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var _mockDatabase2, tasks, record;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _mockDatabase2 = (0, _testModels.mockDatabase)(), tasks = _mockDatabase2.tasks;
          record = new MockTaskExtended(tasks, {
            name: 'test'
          });
          _context5.t0 = expect;
          _context5.next = 5;
          return record.nested(1, 2, 3, 4);
        case 5:
          _context5.t1 = _context5.sent;
          (0, _context5.t0)(_context5.t1).toEqual(['test', 'sub', 1, [2, 3, 4]]);
        case 7:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  })));
  it('works with arbitrary classes', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    var _class2;
    var _mockDatabase3, database, spy, TestClass, test;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _mockDatabase3 = (0, _testModels.mockDatabase)(), database = _mockDatabase3.database;
          spy = jest.spyOn(database, 'read');
          TestClass = (_class2 = /*#__PURE__*/function () {
            function TestClass() {}
            var _proto2 = TestClass.prototype;
            _proto2.test = /*#__PURE__*/function () {
              var _test = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) switch (_context6.prev = _context6.next) {
                    case 0:
                      return _context6.abrupt("return", 42);
                    case 1:
                    case "end":
                      return _context6.stop();
                  }
                }, _callee6);
              }));
              function test() {
                return _test.apply(this, arguments);
              }
              return test;
            }();
            return TestClass;
          }(), (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "test", [_index.reader], Object.getOwnPropertyDescriptor(_class2.prototype, "test"), _class2.prototype), _class2);
          test = new TestClass();
          test.database = database;
          _context7.t0 = expect;
          _context7.next = 8;
          return test.test();
        case 8:
          _context7.t1 = _context7.sent;
          (0, _context7.t0)(_context7.t1).toEqual(42);
          expect(spy).toHaveBeenCalledTimes(1);
        case 11:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  })));
});