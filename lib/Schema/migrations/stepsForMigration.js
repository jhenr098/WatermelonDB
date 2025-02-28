"use strict";

exports.__esModule = true;
exports.stepsForMigration = stepsForMigration;
var _fp = require("../../utils/fp");
function stepsForMigration(_ref) {
  var schemaMigrations = _ref.migrations,
    fromVersion = _ref.fromVersion,
    toVersion = _ref.toVersion;
  var sortedMigrations = schemaMigrations.sortedMigrations,
    minVersion = schemaMigrations.minVersion,
    maxVersion = schemaMigrations.maxVersion;

  // see if migrations in this range are available
  if (fromVersion < minVersion || toVersion > maxVersion) {
    return null;
  }

  // return steps
  var matchingMigrations = sortedMigrations.filter(function (_ref2) {
    var version = _ref2.toVersion;
    return version > fromVersion && version <= toVersion;
  });
  var allSteps = (0, _fp.unnest)(matchingMigrations.map(function (migration) {
    return migration.steps;
  }));
  return allSteps;
}