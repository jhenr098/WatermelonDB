"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = getSyncChanges;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _fp = require("../../../utils/fp");
var _index = require("../../index");
var _stepsForMigration = require("../stepsForMigration");
var _common = require("../../../utils/common");
function getSyncChanges(migrations, fromVersion, toVersion) {
  var steps = (0, _stepsForMigration.stepsForMigration)({
    migrations: migrations,
    fromVersion: fromVersion,
    toVersion: toVersion
  });
  (0, _common.invariant)(steps, 'Necessary range of migrations for sync is not available');
  (0, _common.invariant)(toVersion === migrations.maxVersion, 'getSyncChanges toVersion should be equal to maxVersion of migrations');
  if (fromVersion === toVersion) {
    return null;
  }
  steps.forEach(function (step) {
    (0, _common.invariant)(['create_table', 'add_columns', 'sql'].includes(step.type), "Unknown migration step type ".concat(step.type, ". Can not perform migration sync. This most likely means your migrations are defined incorrectly. It could also be a WatermelonDB bug."));
  });

  // $FlowFixMe
  var createTableSteps = steps.filter(function (step) {
    return step.type === 'create_table';
  });
  var createdTables = createTableSteps.map(function (step) {
    return step.schema.name;
  });

  // $FlowFixMe
  var addColumnSteps = steps.filter(function (step) {
    return step.type === 'add_columns';
  });
  var allAddedColumns = addColumnSteps.filter(function (step) {
    return !createdTables.includes(step.table);
  }).map(function (_ref) {
    var table = _ref.table,
      columns = _ref.columns;
    return columns.map(function (_ref2) {
      var name = _ref2.name;
      return {
        table: table,
        name: name
      };
    });
  });
  var columnsByTable = (0, _fp.pipe)(_fp.unnest, (0, _fp.groupBy)(function (_ref3) {
    var table = _ref3.table;
    return table;
  }), _fp.toPairs)(allAddedColumns);
  var addedColumns = columnsByTable.map(function (_ref4) {
    var _ref5 = (0, _slicedToArray2["default"])(_ref4, 2),
      table = _ref5[0],
      columnDefs = _ref5[1];
    return {
      table: (0, _index.tableName)(table),
      columns: (0, _fp.unique)(columnDefs.map(function (_ref6) {
        var name = _ref6.name;
        return name;
      }))
    };
  });
  return {
    from: fromVersion,
    tables: (0, _fp.unique)(createdTables),
    columns: addedColumns
  };
}