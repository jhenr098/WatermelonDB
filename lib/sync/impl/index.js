"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
exports.__esModule = true;
exports.fetchLocalChanges = exports.applyRemoteChanges = void 0;
exports.getLastPulledAt = getLastPulledAt;
exports.getLastPulledSchemaVersion = getLastPulledSchemaVersion;
exports.getMigrationInfo = getMigrationInfo;
exports.markLocalChangesAsSynced = exports.hasUnsyncedChanges = void 0;
exports.setLastPulledAt = setLastPulledAt;
exports.setLastPulledSchemaVersion = setLastPulledSchemaVersion;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _common = require("../../utils/common");
var _getSyncChanges = _interopRequireDefault(require("../../Schema/migrations/getSyncChanges"));
var _applyRemote = _interopRequireDefault(require("./applyRemote"));
exports.applyRemoteChanges = _applyRemote["default"];
var _fetchLocal = _interopRequireWildcard(require("./fetchLocal"));
exports.fetchLocalChanges = _fetchLocal["default"];
exports.hasUnsyncedChanges = _fetchLocal.hasUnsyncedChanges;
var _markAsSynced = _interopRequireDefault(require("./markAsSynced"));
exports.markLocalChangesAsSynced = _markAsSynced["default"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var lastPulledAtKey = '__watermelon_last_pulled_at';
var lastPulledSchemaVersionKey = '__watermelon_last_pulled_schema_version';
function getLastPulledAt(_x) {
  return _getLastPulledAt.apply(this, arguments);
}
function _getLastPulledAt() {
  _getLastPulledAt = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(database) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.t1 = parseInt;
          _context.next = 3;
          return database.adapter.getLocal(lastPulledAtKey);
        case 3:
          _context.t2 = _context.sent;
          _context.t0 = (0, _context.t1)(_context.t2, 10);
          if (_context.t0) {
            _context.next = 7;
            break;
          }
          _context.t0 = null;
        case 7:
          return _context.abrupt("return", _context.t0);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getLastPulledAt.apply(this, arguments);
}
function setLastPulledAt(_x2, _x3) {
  return _setLastPulledAt.apply(this, arguments);
}
function _setLastPulledAt() {
  _setLastPulledAt = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(database, timestamp) {
    var previousTimestamp;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return getLastPulledAt(database);
        case 2:
          _context2.t0 = _context2.sent;
          if (_context2.t0) {
            _context2.next = 5;
            break;
          }
          _context2.t0 = 0;
        case 5:
          previousTimestamp = _context2.t0;
          if (timestamp < previousTimestamp) {
            (0, _common.logError)("[Sync] Pull has finished and received server time ".concat(timestamp, " \u2014 but previous pulled-at time was greater - ").concat(previousTimestamp, ". This is most likely server bug."));
          }
          _context2.next = 9;
          return database.adapter.setLocal(lastPulledAtKey, "".concat(timestamp));
        case 9:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _setLastPulledAt.apply(this, arguments);
}
function getLastPulledSchemaVersion(_x4) {
  return _getLastPulledSchemaVersion.apply(this, arguments);
}
function _getLastPulledSchemaVersion() {
  _getLastPulledSchemaVersion = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(database) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.t1 = parseInt;
          _context3.next = 3;
          return database.adapter.getLocal(lastPulledSchemaVersionKey);
        case 3:
          _context3.t2 = _context3.sent;
          _context3.t0 = (0, _context3.t1)(_context3.t2, 10);
          if (_context3.t0) {
            _context3.next = 7;
            break;
          }
          _context3.t0 = null;
        case 7:
          return _context3.abrupt("return", _context3.t0);
        case 8:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _getLastPulledSchemaVersion.apply(this, arguments);
}
function setLastPulledSchemaVersion(_x5, _x6) {
  return _setLastPulledSchemaVersion.apply(this, arguments);
}
function _setLastPulledSchemaVersion() {
  _setLastPulledSchemaVersion = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(database, version) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return database.adapter.setLocal(lastPulledSchemaVersionKey, "".concat(version));
        case 2:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _setLastPulledSchemaVersion.apply(this, arguments);
}
function getMigrationInfo(_x7, _x8, _x9, _x10) {
  return _getMigrationInfo.apply(this, arguments);
}
function _getMigrationInfo() {
  _getMigrationInfo = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(database, log, lastPulledAt, migrationsEnabledAtVersion) {
    var isFirstSync, schemaVersion, lastPulledSchemaVersion, areMigrationsEnabled, migrations, migrateFrom, shouldMigrate, migration;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          isFirstSync = !lastPulledAt;
          schemaVersion = database.schema.version;
          _context5.next = 4;
          return getLastPulledSchemaVersion(database);
        case 4:
          lastPulledSchemaVersion = _context5.sent;
          log && (log.lastPulledSchemaVersion = lastPulledSchemaVersion);
          areMigrationsEnabled = !!migrationsEnabledAtVersion;
          migrations = database.adapter.migrations;
          if (lastPulledSchemaVersion && isFirstSync) {
            (0, _common.logError)('[Sync] lastPulledSchemaVersion is set, but this is the first sync. This most likely means that the backend does not return a correct timestamp');
          }
          if (areMigrationsEnabled) {
            (0, _common.invariant)(typeof migrationsEnabledAtVersion === 'number' && migrationsEnabledAtVersion >= 1, '[Sync] Invalid migrationsEnabledAtVersion');
            (0, _common.invariant)(migrationsEnabledAtVersion <= schemaVersion, '[Sync] migrationsEnabledAtVersion must not be greater than current schema version');
            (0, _common.invariant)(migrations, '[Sync] Migration syncs cannot be enabled on a database that does not support migrations');
            (0, _common.invariant)(migrationsEnabledAtVersion >= migrations.minVersion, "[Sync] migrationsEnabledAtVersion is too low - not possible to migrate from schema version ".concat(migrationsEnabledAtVersion));
            lastPulledSchemaVersion && (0, _common.invariant)(lastPulledSchemaVersion <= schemaVersion, "[Sync] Last synced schema version (".concat(lastPulledSchemaVersion, ") is greater than current schema version (").concat(schemaVersion, "). This indicates programmer error"));
          }
          migrateFrom = lastPulledSchemaVersion || migrationsEnabledAtVersion || 0;
          shouldMigrate = areMigrationsEnabled && migrateFrom < schemaVersion && !isFirstSync;
          migration = migrations && shouldMigrate ? (0, _getSyncChanges["default"])(migrations, migrateFrom, schemaVersion) : null;
          log && (log.migration = migration);
          if (migration) {
            _common.logger.log("[Sync] Performing migration sync from ".concat(migrateFrom, " to ").concat(schemaVersion));
            if (!lastPulledSchemaVersion) {
              _common.logger.warn("[Sync] Using fallback initial schema version. The migration sync might not contain all necessary migrations");
            }
          }
          return _context5.abrupt("return", {
            schemaVersion: schemaVersion,
            migration: migration,
            shouldSaveSchemaVersion: shouldMigrate || isFirstSync
          });
        case 16:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _getMigrationInfo.apply(this, arguments);
}