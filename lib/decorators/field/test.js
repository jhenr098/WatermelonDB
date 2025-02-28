"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));
var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));
var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));
var _testModels = require("../../__tests__/testModels");
var _index = _interopRequireDefault(require("./index"));
describe('decorators/field', function () {
  it('delegates accesses to _getRaw/_setRaw', function () {
    var _mockDatabase = (0, _testModels.mockDatabase)(),
      tasks = _mockDatabase.tasks;
    var model = new _testModels.MockTask(tasks, {});
    model._getRaw = jest.fn();
    model._setRaw = jest.fn();
    model.projectId;
    model.projectId = 'xx';
    model.projectId;
    model.projectId = 'bar';
    expect(model._getRaw).toHaveBeenCalledTimes(2);
    expect(model._getRaw).toHaveBeenCalledWith('project_id');
    expect(model._setRaw).toHaveBeenCalledTimes(2);
    expect(model._setRaw).toHaveBeenCalledWith('project_id', 'xx');
    expect(model._setRaw).toHaveBeenLastCalledWith('project_id', 'bar');
  });
  it('works with arbitrary objects with asModel', function () {
    var _dec, _class, _descriptor;
    var _mockDatabase2 = (0, _testModels.mockDatabase)(),
      tasks = _mockDatabase2.tasks;
    var model = new _testModels.MockTask(tasks, {});
    var ModelProxy = (_dec = (0, _index["default"])('name'), _class = function ModelProxy() {
      this.asModel = model;
      (0, _initializerDefineProperty2["default"])(this, "name", _descriptor, this);
    }, _descriptor = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "name", [_dec], {
      configurable: true,
      enumerable: true,
      writable: true,
      initializer: null
    }), _class);
    model._isEditing = true;
    model.name = 'a';
    var proxy = new ModelProxy();
    expect(proxy.name).toBe('a');
    proxy.name = 'b';
    expect(model.name).toBe('b');
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
    expect(function () {
      var _dec2, _class3, _descriptor3;
      return _dec2 = (0, _index["default"])(), _class3 = function _class3() {
        (0, _initializerDefineProperty2["default"])(this, "noName", _descriptor3, this);
      }, _descriptor3 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "noName", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _class3;
    }).toThrow('column name');
    expect(function () {
      var _dec3, _class4, _descriptor4;
      return _dec3 = (0, _index["default"])('field_with_default_value'), _class4 = function _class4() {
        (0, _initializerDefineProperty2["default"])(this, "fieldWithDefaultValue", _descriptor4, this);
      }, _descriptor4 = (0, _applyDecoratedDescriptor2["default"])(_class4.prototype, "fieldWithDefaultValue", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 'hey';
        }
      }), _class4;
    }).toThrow('properties with a default value');
    expect(function () {
      var _dec4, _class5;
      return _dec4 = (0, _index["default"])('getter'), _class5 = /*#__PURE__*/function () {
        function _class5() {}
        return (0, _createClass2["default"])(_class5, [{
          key: "someGetter",
          get: function get() {
            return 'hey';
          }
        }]);
      }(), (0, _applyDecoratedDescriptor2["default"])(_class5.prototype, "someGetter", [_dec4], Object.getOwnPropertyDescriptor(_class5.prototype, "someGetter"), _class5.prototype), _class5;
    }).toThrow('simple properties');
    expect(function () {
      var _dec5, _class6;
      return _dec5 = (0, _index["default"])('method'), _class6 = /*#__PURE__*/function () {
        function _class6() {}
        var _proto = _class6.prototype;
        _proto.method = function method() {};
        return _class6;
      }(), (0, _applyDecoratedDescriptor2["default"])(_class6.prototype, "method", [_dec5], Object.getOwnPropertyDescriptor(_class6.prototype, "method"), _class6.prototype), _class6;
    }).toThrow('simple properties');
  });
});