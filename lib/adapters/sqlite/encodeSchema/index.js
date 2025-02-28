"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.encodeCreateIndices = encodeCreateIndices;
exports.encodeDropIndices = encodeDropIndices;
exports.encodeSchema = exports.encodeMigrationSteps = void 0;
var _RawRecord = require("../../../RawRecord");
var _encodeValue = _interopRequireDefault(require("../encodeValue"));
var standardColumns = "\"id\" primary key, \"_changed\", \"_status\"";
var commonSchema = 'create table "local_storage" ("key" varchar(16) primary key not null, "value" text not null);' + 'create index "local_storage_key_index" on "local_storage" ("key");';
var encodeCreateTable = function encodeCreateTable(_ref) {
  var name = _ref.name,
    columns = _ref.columns;
  var columnsSQL = [standardColumns].concat(Object.keys(columns).map(function (column) {
    return "\"".concat(column, "\"");
  })).join(', ');
  return "create table \"".concat(name, "\" (").concat(columnsSQL, ");");
};
var encodeIndex = function encodeIndex(column, tableName) {
  return column.isIndexed ? "create index if not exists \"".concat(tableName, "_").concat(column.name, "\" on \"").concat(tableName, "\" (\"").concat(column.name, "\");") : '';
};
var encodeTableIndicies = function encodeTableIndicies(_ref2) {
  var tableName = _ref2.name,
    columns = _ref2.columns;
  return Object.values(columns)
  // $FlowFixMe
  .map(function (column) {
    return encodeIndex(column, tableName);
  }).concat(["create index if not exists \"".concat(tableName, "__status\" on \"").concat(tableName, "\" (\"_status\");")]).join('');
};
var identity = function identity(sql, _) {
  return sql;
};
var encodeTable = function encodeTable(table) {
  return (table.unsafeSql || identity)(encodeCreateTable(table) + encodeTableIndicies(table));
};
var encodeSchema = exports.encodeSchema = function encodeSchema(_ref3) {
  var tables = _ref3.tables,
    unsafeSql = _ref3.unsafeSql;
  var sql = Object.values(tables)
  // $FlowFixMe
  .map(encodeTable).join('');
  return (unsafeSql || identity)(commonSchema + sql, 'setup');
};
function encodeCreateIndices(_ref4) {
  var tables = _ref4.tables,
    unsafeSql = _ref4.unsafeSql;
  var sql = Object.values(tables)
  // $FlowFixMe
  .map(encodeTableIndicies).join('');
  return (unsafeSql || identity)(sql, 'create_indices');
}
function encodeDropIndices(_ref5) {
  var tables = _ref5.tables,
    unsafeSql = _ref5.unsafeSql;
  var sql = Object.values(tables)
  // $FlowFixMe
  .map(function (_ref6) {
    var tableName = _ref6.name,
      columns = _ref6.columns;
    return Object.values(columns)
    // $FlowFixMe
    .map(function (column) {
      return column.isIndexed ? "drop index if exists \"".concat(tableName, "_").concat(column.name, "\";") : '';
    }).concat(["drop index if exists \"".concat(tableName, "__status\";")]).join('');
  }).join('');
  return (unsafeSql || identity)(sql, 'drop_indices');
}
var encodeAddColumnsMigrationStep = function encodeAddColumnsMigrationStep(_ref7) {
  var table = _ref7.table,
    columns = _ref7.columns,
    unsafeSql = _ref7.unsafeSql;
  return columns.map(function (column) {
    var addColumn = "alter table \"".concat(table, "\" add \"").concat(column.name, "\";");
    var setDefaultValue = "update \"".concat(table, "\" set \"").concat(column.name, "\" = ").concat((0, _encodeValue["default"])((0, _RawRecord.nullValue)(column)), ";");
    var addIndex = encodeIndex(column, table);
    return (unsafeSql || identity)(addColumn + setDefaultValue + addIndex);
  }).join('');
};
var encodeMigrationSteps = exports.encodeMigrationSteps = function encodeMigrationSteps(steps) {
  return steps.map(function (step) {
    if (step.type === 'create_table') {
      return encodeTable(step.schema);
    } else if (step.type === 'add_columns') {
      return encodeAddColumnsMigrationStep(step);
    } else if (step.type === 'sql') {
      return step.sql;
    }
    throw new Error("Unsupported migration step ".concat(step.type));
  }).join('');
};