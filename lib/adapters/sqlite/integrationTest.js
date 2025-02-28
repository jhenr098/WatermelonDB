"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _reactNative = require("react-native");
var _index = _interopRequireDefault(require("./index"));
var _helpers = require("../__tests__/helpers");
var _commonTests = _interopRequireDefault(require("../__tests__/commonTests"));
var _common = require("../../utils/common");
var _compat = _interopRequireDefault(require("../compat"));
var SQLiteAdapterTest = function SQLiteAdapterTest(spec) {
  var configurations = [_reactNative.Platform.OS !== 'windows' ? {
    name: 'SQLiteAdapter (async mode)',
    options: {},
    expectedDispatcherType: 'asynchronous'
  } : null, {
    name: 'SQLiteAdapter (JSI mode)',
    options: {
      jsi: true
    },
    expectedDispatcherType: 'jsi'
  }].filter(Boolean);
  configurations.forEach(function (_ref) {
    var configurationName = _ref.name,
      options = _ref.options,
      expectedDispatcherType = _ref.expectedDispatcherType;
    spec.describe(configurationName, function () {
      spec.it('configures adapter correctly', function () {
        var adapter = new _index["default"]((0, _extends2["default"])({
          schema: _helpers.testSchema
        }, options));
        expect(adapter._dispatcherType).toBe(expectedDispatcherType);
      });
      var testCases = (0, _commonTests["default"])();
      var onlyTestCases = testCases.filter(function (_ref2) {
        var _ref3 = (0, _slicedToArray2["default"])(_ref2, 3),
          isOnly = _ref3[2];
        return isOnly;
      });
      var testCasesToRun = onlyTestCases.length ? onlyTestCases : testCases;
      testCasesToRun.forEach(function (testCase) {
        var _testCase = (0, _slicedToArray2["default"])(testCase, 2),
          name = _testCase[0],
          test = _testCase[1];
        spec.it(name, /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
          var dbName, adapter;
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                dbName = "file:testdb".concat(Math.random(), "?mode=memory&cache=shared");
                adapter = new _index["default"]((0, _extends2["default"])({
                  schema: _helpers.testSchema,
                  dbName: dbName
                }, options));
                (0, _common.invariant)(adapter._dispatcherType === expectedDispatcherType, "Expected adapter to be ".concat(expectedDispatcherType));
                _context.next = 5;
                return test(new _compat["default"](adapter), _index["default"], (0, _extends2["default"])({
                  dbName: dbName
                }, options), _reactNative.Platform.OS);
              case 5:
              case "end":
                return _context.stop();
            }
          }, _callee);
        })));
      });
      if (onlyTestCases.length) {
        spec.it('BROKEN SETUP', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
          return _regenerator["default"].wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                throw new Error('Do not commit tests with it.only');
              case 1:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        })));
      }
    });
  });
};
var _default = exports["default"] = SQLiteAdapterTest;