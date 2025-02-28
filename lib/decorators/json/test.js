"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));
var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));
var _Model4 = _interopRequireDefault(require("../../Model"));
var _Schema = require("../../Schema");
var _index = _interopRequireDefault(require("./index"));
var _field = _interopRequireDefault(require("../field"));
var _dec, _class, _descriptor, _MockModel, _dec2, _class2, _descriptor2, _MockModel2, _dec3, _dec4, _dec5, _class3, _descriptor3, _descriptor4, _descriptor5, _MockModel3;
var schema = (0, _Schema.tableSchema)({
  name: 'mock',
  columns: [{
    name: 'extras',
    type: 'string',
    isOptional: true
  }]
});
var schema2 = (0, _Schema.tableSchema)({
  name: 'mock',
  columns: [{
    name: 'kind',
    type: 'string'
  }, {
    name: 'extras',
    type: 'string',
    isOptional: true
  }]
});
var mockSanitizer = function mockSanitizer(storedValue) {
  return storedValue && Array.isArray(storedValue.elements) ? {
    elements: storedValue.elements
  } : {
    elements: []
  };
};
var mockSanitizer2 = function mockSanitizer2(storedValue, model) {
  return model.kind === 'A' ? {
    dataA: storedValue.dataA
  } : {
    dataB: storedValue.dataB
  };
};
var MockModel = (_dec = (0, _index["default"])('extras', mockSanitizer), _class = (_MockModel = /*#__PURE__*/function (_Model) {
  function MockModel() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Model.call.apply(_Model, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this, "extras", _descriptor, _this);
    return _this;
  }
  (0, _inheritsLoose2["default"])(MockModel, _Model);
  return MockModel;
}(_Model4["default"]), _MockModel.table = 'mock', _MockModel), _descriptor = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "extras", [_dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class);
var MockModel2 = (_dec2 = (0, _index["default"])('extras', function () {
  return null;
}), _class2 = (_MockModel2 = /*#__PURE__*/function (_Model2) {
  function MockModel2() {
    var _this2;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    _this2 = _Model2.call.apply(_Model2, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this2, "extras", _descriptor2, _this2);
    return _this2;
  }
  (0, _inheritsLoose2["default"])(MockModel2, _Model2);
  return MockModel2;
}(_Model4["default"]), _MockModel2.table = 'mock', _MockModel2), _descriptor2 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "extras", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class2);
var MockModel3 = (_dec3 = (0, _field["default"])('kind'), _dec4 = (0, _index["default"])('extras', mockSanitizer2), _dec5 = (0, _index["default"])('extras', mockSanitizer2, {
  memo: true
}), _class3 = (_MockModel3 = /*#__PURE__*/function (_Model3) {
  function MockModel3() {
    var _this3;
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    _this3 = _Model3.call.apply(_Model3, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this3, "kind", _descriptor3, _this3);
    (0, _initializerDefineProperty2["default"])(_this3, "extras", _descriptor4, _this3);
    (0, _initializerDefineProperty2["default"])(_this3, "extrasMemoized", _descriptor5, _this3);
    return _this3;
  }
  (0, _inheritsLoose2["default"])(MockModel3, _Model3);
  return MockModel3;
}(_Model4["default"]), _MockModel3.table = 'mock', _MockModel3), _descriptor3 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "kind", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "extras", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "extrasMemoized", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class3);
describe('decorators/json', function () {
  it('deserializes value from JSON', function () {
    var model = new MockModel({
      schema: schema
    }, {
      extras: '{"elements":[10,false,"foo",{"foo":"bar"}]}'
    });
    expect(model.extras).toEqual({
      elements: [10, false, 'foo', {
        foo: 'bar'
      }]
    });
    var model2 = new MockModel({
      schema: schema
    }, {
      extras: '-Infinity'
    });
    expect(model2.extras).toEqual({
      elements: []
    });
    var model3 = new MockModel({
      schema: schema
    }, {
      extras: null
    });
    expect(model3.extras).toEqual({
      elements: []
    });
    var model4 = new MockModel2({
      schema: schema
    }, {
      extras: {
        data: [1, 2, 3, 4]
      }
    });
    expect(model4.extras).toEqual(null);
    var model5 = new MockModel3({
      schema2: schema2
    }, {
      kind: 'A',
      extras: '{ "dataA": [1, 2, 3, 4] }'
    });
    expect(model5.extras).toEqual({
      dataA: [1, 2, 3, 4]
    });
    var model6 = new MockModel3({
      schema2: schema2
    }, {
      kind: 'B',
      extras: '{ "dataB": [1, 2, 3, 4] }'
    });
    expect(model6.extras).toEqual({
      dataB: [1, 2, 3, 4]
    });
  });
  it('serializes value to JSON', function () {
    var model = new MockModel({
      schema: schema
    }, {});
    model._isEditing = true;
    model.extras = {
      elements: [true, 3.14, {
        bar: 'baz'
      }],
      otherValue: true
    };
    expect(model._getRaw('extras')).toBe('{"elements":[true,3.14,{"bar":"baz"}]}');
    model.extras = null;
    expect(model._getRaw('extras')).toBe('{"elements":[]}');
    var model2 = new MockModel2({
      schema: schema
    }, {});
    model2._isEditing = true;
    model2.extras = {
      data: [1, 2, 3, 4]
    };
    expect(model2._getRaw('extras')).toBe(null);
  });
  it("can memoize deserialized values", function () {
    var model = new MockModel3({
      schema2: schema2
    }, {
      kind: 'B',
      extras: '{ "dataB": [1, 2, 3, 4] }'
    });
    var extras = model.extrasMemoized;
    expect(extras).toEqual(model.extras);
    expect(extras).not.toBe(model.extras);
    expect(extras).toBe(model.extrasMemoized);
  });
  // FIXME: missing test?
  // eslint-disable-next-line jest/no-commented-out-tests
  // it('fails if applied to incorrect fields', () => {
  //   expect(
  //     () =>
  //       class {
  //         @json
  //         noName
  //       },
  //   ).toThrow('column name')
  // })
});