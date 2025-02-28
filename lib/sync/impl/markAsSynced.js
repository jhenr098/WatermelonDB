"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = markLocalChangesAsSynced;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _areRecordsEqual = _interopRequireDefault(require("../../utils/fp/areRecordsEqual"));
var _common = require("../../utils/common");
var _helpers = require("./helpers");
var recordsToMarkAsSynced = function recordsToMarkAsSynced(_ref, allRejectedIds) {
  var changes = _ref.changes,
    affectedRecords = _ref.affectedRecords;
  var syncedRecords = [];
  Object.keys(changes).forEach(function (table) {
    var _changes = changes[table],
      created = _changes.created,
      updated = _changes.updated;
    var raws = created.concat(updated);
    var rejectedIds = new Set(allRejectedIds[table]);
    raws.forEach(function (raw) {
      var id = raw.id;
      var record = affectedRecords.find(function (model) {
        return model.id === id && model.table === table;
      });
      if (!record) {
        (0, _common.logError)("[Sync] Looking for record ".concat(table, "#").concat(id, " to mark it as synced, but I can't find it. Will ignore it (it should get synced next time). This is probably a Watermelon bug \u2014 please file an issue!"));
        return;
      }
      if ((0, _areRecordsEqual["default"])(record._raw, raw) && !rejectedIds.has(id)) {
        syncedRecords.push(record);
      }
    });
  });
  return syncedRecords;
};
var destroyDeletedRecords = function destroyDeletedRecords(db, _ref2, allRejectedIds) {
  var changes = _ref2.changes;
  return Object.keys(changes).map(function (_tableName) {
    var tableName = _tableName;
    var rejectedIds = new Set(allRejectedIds[tableName]);
    var deleted = changes[tableName].deleted.filter(function (id) {
      return !rejectedIds.has(id);
    });
    return deleted.length ? db.adapter.destroyDeletedRecords(tableName, deleted) : Promise.resolve();
  });
};
function markLocalChangesAsSynced(db, syncedLocalChanges, rejectedIds) {
  return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return Promise.all([db.batch(recordsToMarkAsSynced(syncedLocalChanges, rejectedIds || {}).map(_helpers.prepareMarkAsSynced))].concat((0, _toConsumableArray2["default"])(destroyDeletedRecords(db, syncedLocalChanges, rejectedIds || {}))));
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })), 'sync-markLocalChangesAsSynced');
}