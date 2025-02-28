"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _index = _interopRequireDefault(require("./index"));
var _testModels = require("../../__tests__/testModels");
var _Model3 = _interopRequireDefault(require("../../Model"));
describe('CollectionMap', function () {
  it('can initialize and get models', function () {
    var _mockDatabase = (0, _testModels.mockDatabase)(),
      db = _mockDatabase.db;
    var map = new _index["default"](db, [_testModels.MockProject, _testModels.MockTask]);
    expect(map.get('mock_projects').modelClass).toBe(_testModels.MockProject);
    expect(map.get('mock_projects').table).toBe('mock_projects');
    expect(map.get('mock_tasks').modelClass).toBe(_testModels.MockTask);
    expect(map.get('mock_tasks').table).toBe('mock_tasks');
  });
  it("returns null for collections that don't exist", function () {
    var _mockDatabase2 = (0, _testModels.mockDatabase)(),
      db = _mockDatabase2.db;
    var map = new _index["default"](db, [_testModels.MockProject, _testModels.MockTask]);
    expect(map.get('mock_comments')).toBe(null);
    expect(map.get('does_not_exist')).toBe(null);
  });
  it("returns null for naughty table names", function () {
    var _mockDatabase3 = (0, _testModels.mockDatabase)(),
      db = _mockDatabase3.db;
    var map = new _index["default"](db, [_testModels.MockProject, _testModels.MockTask]);
    expect(map.get(null)).toBe(null);
    expect(map.get(0)).toBe(null);
    expect(map.get(1)).toBe(null);
    expect(map.get('__proto__')).toBe(null);
    expect(map.get('hasOwnProperty')).toBe(null);
  });
  it("collection map is immutable", function () {
    var _mockDatabase4 = (0, _testModels.mockDatabase)(),
      db = _mockDatabase4.db;
    var map = new _index["default"](db, [_testModels.MockProject, _testModels.MockTask]);
    expect(function () {
      map.map.foo = 'hey';
    }).toThrow();
  });
  it("alerts the user of invalid model classes", function () {
    var _mockDatabase5 = (0, _testModels.mockDatabase)(),
      db = _mockDatabase5.db;
    var ModelWithMissingTable = /*#__PURE__*/function (_Model) {
      function ModelWithMissingTable() {
        return _Model.apply(this, arguments) || this;
      }
      (0, _inheritsLoose2["default"])(ModelWithMissingTable, _Model);
      return ModelWithMissingTable;
    }(_Model3["default"]);
    expect(function () {
      return new _index["default"](db, [ModelWithMissingTable]);
    }).toThrow(/Model class ModelWithMissingTable passed to Database constructor is missing "static table = 'table_name'"/);
    var ModelWithUnrecognizedTableName = /*#__PURE__*/function (_Model2) {
      function ModelWithUnrecognizedTableName() {
        return _Model2.apply(this, arguments) || this;
      }
      (0, _inheritsLoose2["default"])(ModelWithUnrecognizedTableName, _Model2);
      return ModelWithUnrecognizedTableName;
    }(_Model3["default"]);
    ModelWithUnrecognizedTableName.table = 'not_known_by_db';
    expect(function () {
      return new _index["default"](db, [ModelWithUnrecognizedTableName]);
    }).toThrow('Model class ModelWithUnrecognizedTableName has static table defined that is missing in schema known by this database');
  });
});