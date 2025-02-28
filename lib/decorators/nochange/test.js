"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));
var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));
var _utils = require("../../__tests__/utils");
var _Schema = require("../../Schema");
var _Database = _interopRequireDefault(require("../../Database"));
var _Model2 = _interopRequireDefault(require("../../Model"));
var _field = _interopRequireDefault(require("../field"));
var _index = _interopRequireDefault(require("./index"));
var _dec, _class, _descriptor, _MockModel;
var MockModel = (_dec = (0, _field["default"])('foo'), _class = (_MockModel = /*#__PURE__*/function (_Model) {
  function MockModel() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Model.call.apply(_Model, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this, "foo", _descriptor, _this);
    return _this;
  }
  (0, _inheritsLoose2["default"])(MockModel, _Model);
  return MockModel;
}(_Model2["default"]), _MockModel.table = 'mock', _MockModel), _descriptor = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "foo", [_index["default"], _dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class);
var makeDatabase = function makeDatabase() {
  return new _Database["default"]({
    adapter: {
      schema: (0, _Schema.appSchema)({
        version: 1,
        tables: [(0, _Schema.tableSchema)({
          name: 'mock',
          columns: [{
            name: 'foo',
            type: 'string',
            isOptional: true
          }]
        })]
      })
    },
    modelClasses: [MockModel]
  });
};
describe('decorators/nochange', function () {
  it('allows setting values in create()', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var database, model;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          database = makeDatabase();
          database.adapter.batch = jest.fn();
          _context.next = 4;
          return database.write(function () {
            return database.collections.get('mock').create(function (mock) {
              expect(mock.foo).toBe(null);
              mock.foo = 't1';
              expect(mock.foo).toBe('t1');
              mock.foo = 't2';
              expect(mock.foo).toBe('t2');
              mock.foo = null;
              expect(mock.foo).toBe(null);
              mock.foo = 't3';
            });
          });
        case 4:
          model = _context.sent;
          expect(model.foo).toBe('t3');
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  it('allows setting value in prepareCreate', function () {
    var database = makeDatabase();
    var model = database.collections.get('mock').prepareCreate(function (mock) {
      mock.foo = 't1';
      mock.foo = 't2';
    });
    expect(model.foo).toBe('t2');
  });
  it('throws error if change after create is attempted', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var database, model;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          database = makeDatabase();
          database.adapter.batch = jest.fn();
          _context2.next = 4;
          return database.write(function () {
            return database.collections.get('mock').create(function (mock) {
              mock.foo = 't1';
            });
          });
        case 4:
          model = _context2.sent;
          _context2.next = 7;
          return (0, _utils.expectToRejectWithMessage)(database.write(function () {
            return model.update(function (mock) {
              mock.foo = 't2';
            });
          }), 'set a new value');
        case 7:
          expect(model.foo).toBe('t1');
        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  it('fails if applied to incorrect fields', function () {
    expect(function () {
      var _class2, _descriptor2;
      return _class2 = function _class2() {
        (0, _initializerDefineProperty2["default"])(this, "simpleField", _descriptor2, this);
      }, _descriptor2 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "simpleField", [_index["default"]], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _class2;
    }).toThrow();
  });
});