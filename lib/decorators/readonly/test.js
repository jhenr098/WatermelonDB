"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));
var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));
var _Model3 = _interopRequireDefault(require("../../Model"));
var _ = require("..");
var _Schema = require("../../Schema");
var _index = _interopRequireDefault(require("./index"));
var schema = (0, _Schema.tableSchema)({
  name: 'mock',
  columns: [{
    name: 'test',
    type: 'string'
  }]
});
describe('decorators/utils/readonly', function () {
  it('throws on attempt to call a setter of @readonly field', function () {
    var _dec, _class, _descriptor;
    var Mock = (_dec = (0, _.field)('test'), _class = /*#__PURE__*/function (_Model) {
      function Mock() {
        var _this;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        _this = _Model.call.apply(_Model, [this].concat(args)) || this;
        (0, _initializerDefineProperty2["default"])(_this, "test", _descriptor, _this);
        return _this;
      }
      (0, _inheritsLoose2["default"])(Mock, _Model);
      return Mock;
    }(_Model3["default"]), _descriptor = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "test", [_index["default"], _dec], {
      configurable: true,
      enumerable: true,
      writable: true,
      initializer: null
    }), _class);
    var object = new Mock({
      schema: schema
    }, {});
    object.test;
    expect(function () {
      object.test = 'foo';
    }).toThrow();
  });
  it('throws on attempt to set a new value to @readonly field', function () {
    var _class2, _descriptor2;
    var Mock = (_class2 = /*#__PURE__*/function (_Model2) {
      function Mock() {
        var _this2;
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        _this2 = _Model2.call.apply(_Model2, [this].concat(args)) || this;
        (0, _initializerDefineProperty2["default"])(_this2, "test", _descriptor2, _this2);
        return _this2;
      }
      (0, _inheritsLoose2["default"])(Mock, _Model2);
      return Mock;
    }(_Model3["default"]), _descriptor2 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "test", [_index["default"]], {
      configurable: true,
      enumerable: true,
      writable: true,
      initializer: function initializer() {
        return 'blah';
      }
    }), _class2);
    var object = new Mock({
      schema: schema
    }, {});
    object.test;
    expect(function () {
      object.test = 'foo';
    }).toThrow();
  });
});