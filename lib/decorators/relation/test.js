"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));
var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));
var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));
var _testModels = require("../../__tests__/testModels");
var _index = _interopRequireDefault(require("./index"));
var _Relation = _interopRequireDefault(require("../../Relation"));
describe('decorators/relation', function () {
  it('creates Relation object', function () {
    var _mockDatabase = (0, _testModels.mockDatabase)(),
      tasks = _mockDatabase.tasks;
    var primary = new _testModels.MockTask(tasks, {
      project_id: 's1'
    });
    expect(primary.project).toEqual(new _Relation["default"](primary, 'mock_projects', 'project_id', {
      isImmutable: false
    }));
  });
  it('works on arbitrary objects with asModel', function () {
    var _dec, _class, _descriptor;
    var _mockDatabase2 = (0, _testModels.mockDatabase)(),
      tasks = _mockDatabase2.tasks;
    var primary = new _testModels.MockTask(tasks, {
      project_id: 's1'
    });
    var PrimaryProxy = (_dec = (0, _index["default"])('mock_projects', 'project_id'), _class = function PrimaryProxy() {
      this.asModel = primary;
      (0, _initializerDefineProperty2["default"])(this, "project", _descriptor, this);
    }, _descriptor = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "project", [_dec], {
      configurable: true,
      enumerable: true,
      writable: true,
      initializer: null
    }), _class);
    var primaryProxy = new PrimaryProxy();
    expect(primaryProxy.project).toEqual(primary.project);
  });
  it('disallows to set relation directly', function () {
    var _mockDatabase3 = (0, _testModels.mockDatabase)(),
      tasks = _mockDatabase3.tasks;
    var primary = new _testModels.MockTask(tasks, {
      project_id: 's1'
    });
    expect(function () {
      primary.project = 'blah';
    }).toThrow();
  });
  it('caches Relation object', function () {
    var _mockDatabase4 = (0, _testModels.mockDatabase)(),
      tasks = _mockDatabase4.tasks;
    var primary = new _testModels.MockTask(tasks, {
      project_id: 's1'
    });
    var relation1 = primary.project;
    var relation2 = primary.project;
    expect(relation1).toBe(relation2);
  });
});