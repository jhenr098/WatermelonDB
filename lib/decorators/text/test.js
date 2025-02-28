"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));
var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));
var _Model2 = _interopRequireDefault(require("../../Model"));
var _Schema = require("../../Schema");
var _index = _interopRequireDefault(require("./index"));
var _dec, _dec2, _class, _descriptor, _descriptor2;
var schema = (0, _Schema.tableSchema)({
  name: 'mock',
  columns: [{
    name: 'string',
    type: 'string'
  }, {
    name: 'string2',
    type: 'string',
    isOptional: true
  }]
});
var MockModel = (_dec = (0, _index["default"])('string'), _dec2 = (0, _index["default"])('string2'), _class = /*#__PURE__*/function (_Model) {
  function MockModel() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Model.call.apply(_Model, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this, "string", _descriptor, _this);
    (0, _initializerDefineProperty2["default"])(_this, "string2", _descriptor2, _this);
    return _this;
  }
  (0, _inheritsLoose2["default"])(MockModel, _Model);
  return MockModel;
}(_Model2["default"]), _descriptor = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "string", [_dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "string2", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class);
describe('decorators/text', function () {
  it('trims strings when setting', function () {
    var model = new MockModel({
      schema: schema
    }, {});
    model._isEditing = true;
    model.string = '   val2  ';
    expect(model.string).toBe('val2');
  });
  it('converts non-strings to null', function () {
    var model = new MockModel({
      schema: schema
    }, {});
    model._isEditing = true;
    model.string = 10;
    expect(model.string).toBe('');
    model.string = false;
    expect(model.string).toBe('');
    model.string = null;
    expect(model.string).toBe('');
    model.string = undefined;
    expect(model.string).toBe('');
    model.string = '';
    expect(model.string).toBe('');
    // nullable
    model.string2 = false;
    expect(model.string2).toBe(null);
    model.string2 = null;
    expect(model.string2).toBe(null);
    model.string2 = undefined;
    expect(model.string2).toBe(null);
    model.string2 = '';
    expect(model.string2).toBe('');
  });
  it('fails if applied to incorrect fields', function () {
    expect(function () {
      var _class2, _descriptor3;
      return _class2 = function _class2() {
        (0, _initializerDefineProperty2["default"])(this, "noName", _descriptor3, this);
      }, _descriptor3 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "noName", [_index["default"]], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _class2;
    }).toThrow('column name');
  });
});