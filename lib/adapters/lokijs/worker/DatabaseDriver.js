"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
exports.setExperimentalAllowsFatalError = setExperimentalAllowsFatalError;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _logger = _interopRequireDefault(require("../../../utils/common/logger"));
var _invariant = _interopRequireDefault(require("../../../utils/common/invariant"));
var _RawRecord = require("../../../RawRecord");
var _lokiExtensions = require("./lokiExtensions");
var _executeQuery = require("./executeQuery");
// don't import the whole utils/ here!
var SCHEMA_VERSION_KEY = '_loki_schema_version';
var experimentalAllowsFatalError = false;
function setExperimentalAllowsFatalError() {
  experimentalAllowsFatalError = true;
}
var DatabaseDriver = exports["default"] = /*#__PURE__*/function () {
  function DatabaseDriver(options) {
    this.cachedRecords = new Map();
    // (experimental) if true, DatabaseDriver is in a broken state and should not be used anymore
    this._isBroken = false;
    var schema = options.schema,
      migrations = options.migrations;
    this.options = options;
    this.schema = schema;
    this.migrations = migrations;
  }
  var _proto = DatabaseDriver.prototype;
  _proto.setUp = /*#__PURE__*/function () {
    var _setUp = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this._openDatabase();
          case 2:
            _context.next = 4;
            return this._migrateIfNeeded();
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function setUp() {
      return _setUp.apply(this, arguments);
    }
    return setUp;
  }();
  _proto.isCached = function isCached(table, id) {
    var cachedSet = this.cachedRecords.get(table);
    return cachedSet ? cachedSet.has(id) : false;
  };
  _proto.markAsCached = function markAsCached(table, id) {
    var cachedSet = this.cachedRecords.get(table);
    if (cachedSet) {
      cachedSet.add(id);
    } else {
      this.cachedRecords.set(table, new Set([id]));
    }
  };
  _proto.removeFromCache = function removeFromCache(table, id) {
    var cachedSet = this.cachedRecords.get(table);
    if (cachedSet) {
      cachedSet["delete"](id);
    }
  };
  _proto.clearCachedRecords = function clearCachedRecords() {
    this.cachedRecords = new Map();
  };
  _proto.getCache = function getCache(table) {
    var cache = this.cachedRecords.get(table);
    if (cache) {
      return cache;
    }
    var newCache = new Set([]);
    this.cachedRecords.set(table, newCache);
    return newCache;
  };
  _proto.find = function find(table, id) {
    if (this.isCached(table, id)) {
      return id;
    }
    var raw = this.loki.getCollection(table).by('id', id);
    if (!raw) {
      return null;
    }
    this.markAsCached(table, id);
    return (0, _RawRecord.sanitizedRaw)(raw, this.schema.tables[table]);
  };
  _proto.query = function query(_query) {
    var records = (0, _executeQuery.executeQuery)(_query, this.loki);
    return this._compactQueryResults(records, _query.table);
  };
  _proto.queryIds = function queryIds(query) {
    return (0, _executeQuery.executeQuery)(query, this.loki).map(function (record) {
      return record.id;
    });
  };
  _proto.unsafeQueryRaw = function unsafeQueryRaw(query) {
    return (0, _executeQuery.executeQuery)(query, this.loki);
  };
  _proto.count = function count(query) {
    return (0, _executeQuery.executeCount)(query, this.loki);
  };
  _proto.batch = function batch(operations) {
    var _this = this;
    // NOTE: Mutations to LokiJS db are *not* transactional!
    // This is terrible and lame for a database, but there's just no simple and good solution to this
    // Loki transactions rely on making a full copy of the data, and reverting to it if something breaks.
    // This is just unbearable for production-sized databases (too much memory required)
    // It could be done with some sort of advanced journaling/CoW structure scheme, but that would
    // be very complicated (in itself a source of bugs), and possibly quite expensive cpu-wise
    //
    // So instead, we assume that writes MUST succeed. If they don't, we put DatabaseDriver in a "broken"
    // state, refuse to persist or further mutate the DB, and notify the app (and user) about it.
    //
    // It can be assumed that Loki-level mutations that fail are WatermelonDB bugs that must be fixed
    this._assertNotBroken();
    try {
      var recordsToCreate = {};
      operations.forEach(function (operation) {
        var _operation = (0, _slicedToArray2["default"])(operation, 3),
          type = _operation[0],
          table = _operation[1],
          raw = _operation[2];
        switch (type) {
          case 'create':
            if (!recordsToCreate[table]) {
              recordsToCreate[table] = [];
            }
            recordsToCreate[table].push(raw);
            break;
          default:
            break;
        }
      });

      // We're doing a second pass, because batch insert is much faster in Loki
      Object.entries(recordsToCreate).forEach(function (args) {
        var _args2 = (0, _slicedToArray2["default"])(args, 2),
          table = _args2[0],
          raws = _args2[1];
        var shouldRebuildIndexAfterInsert = raws.length >= 1000; // only profitable for large inserts
        _this.loki.getCollection(table).insert(raws, shouldRebuildIndexAfterInsert);
        var cache = _this.getCache(table);
        raws.forEach(function (raw) {
          cache.add(raw.id);
        });
      });
      operations.forEach(function (operation) {
        var _operation2 = (0, _slicedToArray2["default"])(operation, 3),
          type = _operation2[0],
          table = _operation2[1],
          rawOrId = _operation2[2];
        var collection = _this.loki.getCollection(table);
        switch (type) {
          case 'update':
            // Loki identifies records using internal $loki ID so we must find the saved record first
            var lokiId = collection.by('id', rawOrId.id).$loki;
            var raw = rawOrId;
            raw.$loki = lokiId;
            collection.update(raw);
            break;
          case 'markAsDeleted':
            var id = rawOrId;
            var record = collection.by('id', id);
            if (record) {
              record._status = 'deleted';
              collection.update(record);
              _this.removeFromCache(table, id);
            }
            break;
          case 'destroyPermanently':
            var _id = rawOrId;
            var _record = collection.by('id', _id);
            _record && collection.remove(_record);
            _this.removeFromCache(table, _id);
            break;
          default:
            break;
        }
      });
    } catch (error) {
      this._fatalError(error);
    }
  };
  _proto.getDeletedRecords = function getDeletedRecords(table) {
    return this.loki.getCollection(table).find({
      _status: {
        $eq: 'deleted'
      }
    }).map(function (record) {
      return record.id;
    });
  };
  _proto.unsafeExecute = function unsafeExecute(operations) {
    if (process.env.NODE_ENV !== 'production') {
      (0, _invariant["default"])(operations && (0, _typeof2["default"])(operations) === 'object' && Object.keys(operations).length === 1 && typeof operations.loki === 'function', 'unsafeExecute expects an { loki: loki => { ... } } object');
    }
    var lokiBlock = operations.loki;
    lokiBlock(this.loki);
  };
  _proto.unsafeResetDatabase = /*#__PURE__*/function () {
    var _unsafeResetDatabase = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _lokiExtensions.deleteDatabase)(this.loki);
          case 2:
            this.cachedRecords.clear();
            _logger["default"].log('[Loki] Database is now reset');
            _context2.next = 6;
            return this._openDatabase();
          case 6:
            this._setUpSchema();
          case 7:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));
    function unsafeResetDatabase() {
      return _unsafeResetDatabase.apply(this, arguments);
    }
    return unsafeResetDatabase;
  }() // *** LocalStorage ***
  ;
  _proto.getLocal = function getLocal(key) {
    var record = this._findLocal(key);
    return record ? record.value : null;
  };
  _proto.setLocal = function setLocal(key, value) {
    this._assertNotBroken();
    try {
      var record = this._findLocal(key);
      if (record) {
        record.value = value;
        this._localStorage.update(record);
      } else {
        var newRecord = {
          key: key,
          value: value
        };
        this._localStorage.insert(newRecord);
      }
    } catch (error) {
      this._fatalError(error);
    }
  };
  _proto.removeLocal = function removeLocal(key) {
    this._assertNotBroken();
    try {
      var record = this._findLocal(key);
      if (record) {
        this._localStorage.remove(record);
      }
    } catch (error) {
      this._fatalError(error);
    }
  }

  // *** Internals ***
  ;
  _proto._openDatabase =
  /*#__PURE__*/
  function () {
    var _openDatabase2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _logger["default"].log('[Loki] Initializing IndexedDB');
            _context3.next = 3;
            return (0, _lokiExtensions.newLoki)(this.options);
          case 3:
            this.loki = _context3.sent;
            _logger["default"].log('[Loki] Database loaded');
          case 5:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this);
    }));
    function _openDatabase() {
      return _openDatabase2.apply(this, arguments);
    }
    return _openDatabase;
  }();
  _proto._setUpSchema = function _setUpSchema() {
    var _this2 = this;
    _logger["default"].log('[Loki] Setting up schema');

    // Add collections
    var tables = Object.values(this.schema.tables);
    tables.forEach(function (tableSchema) {
      _this2._addCollection(tableSchema);
    });
    this.loki.addCollection('local_storage', {
      unique: ['key'],
      indices: [],
      disableMeta: true
    });

    // Set database version
    this._databaseVersion = this.schema.version;
    _logger["default"].log('[Loki] Database collections set up');
  };
  _proto._addCollection = function _addCollection(tableSchema) {
    var name = tableSchema.name,
      columnArray = tableSchema.columnArray;
    var indexedColumns = columnArray.reduce(function (indexes, column) {
      return column.isIndexed ? indexes.concat([column.name]) : indexes;
    }, []);
    this.loki.addCollection(name, {
      unique: ['id'],
      indices: ['_status'].concat((0, _toConsumableArray2["default"])(indexedColumns)),
      disableMeta: true
    });
  };
  _proto._migrateIfNeeded = /*#__PURE__*/function () {
    var _migrateIfNeeded2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var dbVersion, schemaVersion, migrationSteps;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            dbVersion = this._databaseVersion;
            schemaVersion = this.schema.version;
            if (!(dbVersion === schemaVersion)) {
              _context4.next = 5;
              break;
            }
            _context4.next = 35;
            break;
          case 5:
            if (!(dbVersion === 0)) {
              _context4.next = 11;
              break;
            }
            _logger["default"].log('[Loki] Empty database, setting up');
            _context4.next = 9;
            return this.unsafeResetDatabase();
          case 9:
            _context4.next = 35;
            break;
          case 11:
            if (!(dbVersion > 0 && dbVersion < schemaVersion)) {
              _context4.next = 32;
              break;
            }
            _logger["default"].log('[Loki] Database has old schema version. Migration is required.');
            migrationSteps = this._getMigrationSteps(dbVersion);
            if (!migrationSteps) {
              _context4.next = 27;
              break;
            }
            _logger["default"].log("[Loki] Migrating from version ".concat(dbVersion, " to ").concat(this.schema.version, "..."));
            _context4.prev = 16;
            _context4.next = 19;
            return this._migrate(migrationSteps);
          case 19:
            _context4.next = 25;
            break;
          case 21:
            _context4.prev = 21;
            _context4.t0 = _context4["catch"](16);
            _logger["default"].error('[Loki] Migration failed', _context4.t0);
            throw _context4.t0;
          case 25:
            _context4.next = 30;
            break;
          case 27:
            _logger["default"].warn('[Loki] Migrations not available for this version range, resetting database instead');
            _context4.next = 30;
            return this.unsafeResetDatabase();
          case 30:
            _context4.next = 35;
            break;
          case 32:
            _logger["default"].warn("[Loki] Database has newer version ".concat(dbVersion, " than app schema ").concat(schemaVersion, ". Resetting database."));
            _context4.next = 35;
            return this.unsafeResetDatabase();
          case 35:
          case "end":
            return _context4.stop();
        }
      }, _callee4, this, [[16, 21]]);
    }));
    function _migrateIfNeeded() {
      return _migrateIfNeeded2.apply(this, arguments);
    }
    return _migrateIfNeeded;
  }();
  _proto._getMigrationSteps = function _getMigrationSteps(fromVersion) {
    // TODO: Remove this after migrations are shipped
    var migrations = this.migrations;
    if (!migrations) {
      return null;
    }
    var _require = require('../../../Schema/migrations/stepsForMigration'),
      stepsForMigration = _require.stepsForMigration;
    return stepsForMigration({
      migrations: migrations,
      fromVersion: fromVersion,
      toVersion: this.schema.version
    });
  };
  _proto._migrate = /*#__PURE__*/function () {
    var _migrate2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(steps) {
      var _this3 = this;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            steps.forEach(function (step) {
              if (step.type === 'create_table') {
                _this3._executeCreateTableMigration(step);
              } else if (step.type === 'add_columns') {
                _this3._executeAddColumnsMigration(step);
              } else if (step.type === 'sql') {
                // ignore
              } else {
                throw new Error("Unsupported migration step ".concat(step.type));
              }
            });

            // Set database version
            this._databaseVersion = this.schema.version;
            _logger["default"].log("[Loki] Migration successful");
          case 3:
          case "end":
            return _context5.stop();
        }
      }, _callee5, this);
    }));
    function _migrate(_x) {
      return _migrate2.apply(this, arguments);
    }
    return _migrate;
  }();
  _proto._executeCreateTableMigration = function _executeCreateTableMigration(_ref) {
    var schema = _ref.schema;
    this._addCollection(schema);
  };
  _proto._executeAddColumnsMigration = function _executeAddColumnsMigration(_ref2) {
    var table = _ref2.table,
      columns = _ref2.columns;
    var collection = this.loki.getCollection(table);

    // update ALL records in the collection, adding new fields
    collection.findAndUpdate({}, function (record) {
      columns.forEach(function (column) {
        (0, _RawRecord.setRawSanitized)(record, column.name, null, column);
      });
    });

    // add indexes, if needed
    columns.forEach(function (column) {
      if (column.isIndexed) {
        collection.ensureIndex(column.name);
      }
    });
  }

  // Maps records to their IDs if the record is already cached on JS side
  ;
  _proto._compactQueryResults = function _compactQueryResults(records, table) {
    var _this4 = this;
    var cache = this.getCache(table);
    return records.map(function (raw) {
      var id = raw.id;
      if (cache.has(id)) {
        return id;
      }
      cache.add(id);
      return (0, _RawRecord.sanitizedRaw)(raw, _this4.schema.tables[table]);
    });
  };
  _proto._findLocal = function _findLocal(key) {
    var localStorage = this._localStorage;
    return localStorage && localStorage.by('key', key);
  };
  _proto._assertNotBroken = function _assertNotBroken() {
    if (this._isBroken) {
      throw new Error('DatabaseDriver is in a broken state, bailing...');
    }
  }

  // (experimental)
  // TODO: Setup, migrations, delete database should also break driver
  ;
  _proto._fatalError = function _fatalError(error) {
    if (!experimentalAllowsFatalError) {
      _logger["default"].warn('DatabaseDriver is broken, but experimentalAllowsFatalError has not been enabled to do anything about it...');
      throw error;
    }
    // Stop further mutations
    this._isBroken = true;

    // Disable Loki autosave
    (0, _lokiExtensions.lokiFatalError)(this.loki);

    // Notify handler
    _logger["default"].error('DatabaseDriver is broken. App must be reloaded before continuing.');
    var handler = this.options._onFatalError;
    handler && handler(error);

    // Rethrow error
    throw error;
  };
  return (0, _createClass2["default"])(DatabaseDriver, [{
    key: "_databaseVersion",
    get: function get() {
      var databaseVersionRaw = this.getLocal(SCHEMA_VERSION_KEY) || '';
      return parseInt(databaseVersionRaw, 10) || 0;
    },
    set: function set(version) {
      this.setLocal(SCHEMA_VERSION_KEY, "".concat(version));
    }
  }, {
    key: "_localStorage",
    get: function get() {
      return this.loki.getCollection('local_storage');
    }
  }]);
}();