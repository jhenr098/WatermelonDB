"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _helpers = require("../__tests__/helpers");
var _commonTests = _interopRequireDefault(require("../__tests__/commonTests"));
var _index = _interopRequireDefault(require("./index"));
var _compat = _interopRequireDefault(require("../compat"));
// require('fake-indexeddb/auto')

describe('LokiJSAdapter (Synchronous / Memory persistence)', function () {
  (0, _commonTests["default"])().forEach(function (testCase) {
    var _testCase = (0, _slicedToArray2["default"])(testCase, 2),
      name = _testCase[0],
      test = _testCase[1];

    // eslint-disable-next-line jest/valid-title
    it(name, /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var dbName, adapter;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            dbName = "test".concat(Math.random());
            adapter = new _index["default"]({
              dbName: dbName,
              schema: _helpers.testSchema,
              useWebWorker: false,
              useIncrementalIndexedDB: false
            });
            _context.next = 4;
            return test(new _compat["default"](adapter), _index["default"], {
              useWebWorker: false,
              useIncrementalIndexedDB: false,
              dbName: dbName
            });
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })));
  });
});

// TODO: Run tests with:
// - mocked/polyfilled web worker
// - legacy indexeddb adapter (fake-indexeddb polyfill)
// - modern indexeddb adapter