"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));
var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));
var _Model2 = _interopRequireDefault(require("../../Model"));
var _Schema = require("../../Schema");
var _index = _interopRequireDefault(require("./index"));
var _dec, _class, _descriptor, _MockModel;
var schema = (0, _Schema.tableSchema)({
  name: 'mock',
  columns: [{
    name: 'date',
    type: 'number',
    isOptional: true
  }]
});
var MockModel = (_dec = (0, _index["default"])('date'), _class = (_MockModel = /*#__PURE__*/function (_Model) {
  function MockModel() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Model.call.apply(_Model, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this, "date", _descriptor, _this);
    return _this;
  }
  (0, _inheritsLoose2["default"])(MockModel, _Model);
  return MockModel;
}(_Model2["default"]), _MockModel.table = 'mock', _MockModel), _descriptor = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "date", [_dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class);
describe('decorators/timestamp', function () {
  it('returns timestamps cast to Date', function () {
    var model = new MockModel({
      schema: schema
    }, {
      date: 1400000000000
    });
    expect(model.date).toBeInstanceOf(Date);
    expect(+model.date).toBe(1400000000000);
  });
  it('returns null if raw field is null', function () {
    var model = new MockModel({
      schema: schema
    }, {
      date: null
    });
    expect(model.date).toBe(null);
  });
  it('sets timestamps cast from dates', function () {
    var model = new MockModel({
      schema: schema
    }, {});
    model._isEditing = true;
    model.date = Date.now();
    expect(model._getRaw('date')).toBeGreaterThan(1500000000000);
  });
  it('sets null if passed', function () {
    var model = new MockModel({
      schema: schema
    }, {});
    model._isEditing = true;
    model.date = null;
    expect(model._getRaw('date')).toBe(null);
  });
  it('returns 1970 date, not null if timestamp=0', function () {
    var model = new MockModel({
      schema: schema
    }, {
      date: 0
    });
    expect(model.date).toBeInstanceOf(Date);
    expect(+model.date).toBe(0);
  });
  it('sets 1970 date, not null if timestamp', function () {
    var model = new MockModel({
      schema: schema
    }, {});
    model._isEditing = true;
    model.date = new Date(0);
    expect(model._getRaw('date')).toBe(0);
    expect(+model.date).toBe(0);
  });
  it('fails if applied to incorrect fields', function () {
    expect(function () {
      var _class2, _descriptor2;
      return _class2 = function _class2() {
        (0, _initializerDefineProperty2["default"])(this, "noName", _descriptor2, this);
      }, _descriptor2 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "noName", [_index["default"]], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _class2;
    }).toThrow('column name');
  });
  it('returns a instance of date if cached', function () {
    var model = new MockModel({
      schema: schema
    }, {
      date: 0
    });
    expect(model.date).toBeInstanceOf(Date);
    model._isEditing = true;
    model.date = '2011-10-05T14:48:00.000Z';
    expect(model.date).toBeInstanceOf(Date);
  });
});