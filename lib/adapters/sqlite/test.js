"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _fs = _interopRequireDefault(require("fs"));
var _helpers = require("../__tests__/helpers");
var _commonTests = _interopRequireDefault(require("../__tests__/commonTests"));
var _index = _interopRequireDefault(require("./index"));
var _compat = _interopRequireDefault(require("../compat"));
function removeIfExists(file, dbName) {
  if (file && _fs["default"].existsSync(dbName)) {
    _fs["default"].unlinkSync(dbName);
  }
}
describe.each([
// ['SQLiteAdapterNode', 'Asynchronous', 'File'],
['SQLiteAdapterNode', 'Asynchronous', 'Memory']])('%s (%s/%s)', function (adapterSubclass, fileString) {
  (0, _commonTests["default"])().forEach(function (testCase) {
    var _testCase = (0, _slicedToArray2["default"])(testCase, 2),
      name = _testCase[0],
      test = _testCase[1];
    if (name.match(/from file system/) && process.platform === 'win32') {
      // eslint-disable-next-line no-console
      console.error("FIXME: Broken test on Windows! ".concat(name));
      return;
    }

    // eslint-disable-next-line jest/valid-title
    it(name, /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var file, dbName, extraAdapterOptions, adapter;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            file = fileString.toLowerCase() === 'file'; // NOTE: one test uses .tmp/xx path, but we have to create it first
            if (!_fs["default"].existsSync('.tmp')) {
              _fs["default"].mkdirSync('.tmp');
            }
            dbName = "".concat(process.cwd(), "/test").concat(Math.random(), ".db").concat(file ? '' : '?mode=memory&cache=shared');
            extraAdapterOptions = {
              dbName: dbName,
              adapterSubclass: adapterSubclass
            };
            adapter = new _index["default"]({
              dbName: dbName,
              schema: _helpers.testSchema
            });
            _context.prev = 5;
            _context.next = 8;
            return adapter.initializingPromise;
          case 8:
            _context.next = 10;
            return test(new _compat["default"](adapter), _index["default"], extraAdapterOptions, 'node');
          case 10:
            _context.prev = 10;
            removeIfExists(file, dbName);
            return _context.finish(10);
          case 13:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[5,, 10, 13]]);
    })));
  });
});