"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _common = require("../../utils/common");
var _Result = require("../../utils/fp/Result");
var _fp = require("../../utils/fp");
var _common2 = require("../common");
var _encodeQuery3 = _interopRequireDefault(require("./encodeQuery"));
var _makeDispatcher = require("./makeDispatcher");
/* eslint-disable global-require */
if (process.env.NODE_ENV !== 'production') {
  require('./devtools');
}
var IGNORE_CACHE = 0;
var SQLiteAdapter = exports["default"] = /*#__PURE__*/function () {
  function SQLiteAdapter(options) {
    var _this = this;
    this._tag = (0, _common.connectionTag)();
    // console.log(`---> Initializing new adapter (${this._tag})`)
    var dbName = options.dbName,
      schema = options.schema,
      migrations = options.migrations,
      migrationEvents = options.migrationEvents,
      _options$usesExclusiv = options.usesExclusiveLocking,
      usesExclusiveLocking = _options$usesExclusiv === void 0 ? false : _options$usesExclusiv,
      _options$experimental = options.experimentalUnsafeNativeReuse,
      experimentalUnsafeNativeReuse = _options$experimental === void 0 ? false : _options$experimental;
    this.schema = schema;
    this.migrations = migrations;
    this._migrationEvents = migrationEvents;
    this.dbName = this._getName(dbName);
    this._dispatcherType = (0, _makeDispatcher.getDispatcherType)(options);
    // Hacky-ish way to create an object with NativeModule-like shape, but that can dispatch method
    // calls to async, synch NativeModule, or JSI implementation w/ type safety in rest of the impl
    this._dispatcher = (0, _makeDispatcher.makeDispatcher)(this._dispatcherType, this._tag, this.dbName, {
      usesExclusiveLocking: usesExclusiveLocking,
      experimentalUnsafeNativeReuse: experimentalUnsafeNativeReuse
    });
    if (process.env.NODE_ENV !== 'production') {
      (0, _common2.validateAdapter)(this);
    }
    this._initPromise = (0, _Result.toPromise)(function (callback) {
      _this._init(function (result) {
        callback(result);
        (0, _common2.devSetupCallback)(result, options.onSetUpError);
      });
    });
  }
  var _proto = SQLiteAdapter.prototype;
  // eslint-disable-next-line no-use-before-define
  _proto.testClone =
  /*#__PURE__*/
  function () {
    var _testClone = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var options,
        clone,
        _args = arguments;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
            // $FlowFixMe
            clone = new SQLiteAdapter((0, _extends2["default"])({
              dbName: this.dbName,
              schema: this.schema,
              jsi: this._dispatcherType === 'jsi'
            }, this.migrations ? {
              migrations: this.migrations
            } : {}, options));
            (0, _common.invariant)(clone._dispatcherType === this._dispatcherType, 'testCloned adapter has bad dispatcher type');
            _context.next = 5;
            return clone._initPromise;
          case 5:
            return _context.abrupt("return", clone);
          case 6:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function testClone() {
      return _testClone.apply(this, arguments);
    }
    return testClone;
  }();
  _proto._getName = function _getName(name) {
    if (process.env.NODE_ENV === 'test') {
      return name || "file:testdb".concat(this._tag, "?mode=memory&cache=shared");
    }
    return name || 'watermelon';
  };
  _proto._init = function _init(callback) {
    var _this2 = this;
    // Try to initialize the database with just the schema number. If it matches the database,
    // we're good. If not, we try again, this time sending the compiled schema or a migration set
    // This is to speed up the launch (less to do and pass through bridge), and avoid repeating
    // migration logic inside native code
    this._dispatcher.call('initialize', [this.dbName, this.schema.version], function (result) {
      if (result.error) {
        callback(result);
        return;
      }
      var status = result.value;
      if (status.code === 'schema_needed') {
        _this2._setUpWithSchema(callback);
      } else if (status.code === 'migrations_needed') {
        _this2._setUpWithMigrations(status.databaseVersion, callback);
      } else if (status.code !== 'ok') {
        callback({
          error: new Error('Invalid database initialization status')
        });
      } else {
        callback({
          value: undefined
        });
      }
    });
  };
  _proto._setUpWithMigrations = function _setUpWithMigrations(databaseVersion, callback) {
    var _this3 = this;
    _common.logger.log('[SQLite] Database needs migrations');
    (0, _common.invariant)(databaseVersion > 0, 'Invalid database schema version');
    var migrationSteps = this._migrationSteps(databaseVersion);
    if (migrationSteps) {
      _common.logger.log("[SQLite] Migrating from version ".concat(databaseVersion, " to ").concat(this.schema.version, "..."));
      if (this._migrationEvents && this._migrationEvents.onStart) {
        this._migrationEvents.onStart();
      }
      this._dispatcher.call('setUpWithMigrations', [this.dbName, require('./encodeSchema').encodeMigrationSteps(migrationSteps), databaseVersion, this.schema.version], function (result) {
        if (result.error) {
          _common.logger.error('[SQLite] Migration failed', result.error);
          if (_this3._migrationEvents && _this3._migrationEvents.onError) {
            _this3._migrationEvents.onError(result.error);
          }
        } else {
          _common.logger.log('[SQLite] Migration successful');
          if (_this3._migrationEvents && _this3._migrationEvents.onSuccess) {
            _this3._migrationEvents.onSuccess();
          }
        }
        callback(result);
      });
    } else {
      _common.logger.warn('[SQLite] Migrations not available for this version range, resetting database instead');
      this._setUpWithSchema(callback);
    }
  };
  _proto._setUpWithSchema = function _setUpWithSchema(callback) {
    _common.logger.log("[SQLite] Setting up database with schema version ".concat(this.schema.version));
    this._dispatcher.call('setUpWithSchema', [this.dbName, this._encodedSchema(), this.schema.version], function (result) {
      if (!result.error) {
        _common.logger.log("[SQLite] Schema set up successfully");
      }
      callback(result);
    });
  };
  _proto.find = function find(table, id, callback) {
    var _this4 = this;
    (0, _common2.validateTable)(table, this.schema);
    this._dispatcher.call('find', [table, id], function (result) {
      return callback((0, _Result.mapValue)(function (rawRecord) {
        return (0, _common2.sanitizeFindResult)(rawRecord, _this4.schema.tables[table]);
      }, result));
    });
  };
  _proto.query = function query(_query, callback) {
    var _this5 = this;
    (0, _common2.validateTable)(_query.table, this.schema);
    var table = _query.table;
    var _encodeQuery = (0, _encodeQuery3["default"])(_query),
      _encodeQuery2 = (0, _slicedToArray2["default"])(_encodeQuery, 2),
      sql = _encodeQuery2[0],
      args = _encodeQuery2[1];
    this._dispatcher.call('query', [table, sql, args], function (result) {
      return callback((0, _Result.mapValue)(function (rawRecords) {
        return (0, _common2.sanitizeQueryResult)(rawRecords, _this5.schema.tables[table]);
      }, result));
    });
  };
  _proto.queryIds = function queryIds(query, callback) {
    (0, _common2.validateTable)(query.table, this.schema);
    this._dispatcher.call('queryIds',
    // $FlowFixMe
    (0, _encodeQuery3["default"])(query), callback);
  };
  _proto.unsafeQueryRaw = function unsafeQueryRaw(query, callback) {
    (0, _common2.validateTable)(query.table, this.schema);
    this._dispatcher.call('unsafeQueryRaw',
    // $FlowFixMe
    (0, _encodeQuery3["default"])(query), callback);
  };
  _proto.count = function count(query, callback) {
    (0, _common2.validateTable)(query.table, this.schema);
    this._dispatcher.call('count',
    // $FlowFixMe
    (0, _encodeQuery3["default"])(query, true), callback);
  };
  _proto.batch = function batch(operations, callback) {
    this._dispatcher.call('batch', [require('./encodeBatch')["default"](operations, this.schema)], callback);
  };
  _proto.getDeletedRecords = function getDeletedRecords(table, callback) {
    (0, _common2.validateTable)(table, this.schema);
    this._dispatcher.call('queryIds', ["select id from \"".concat(table, "\" where _status='deleted'"), []], callback);
  };
  _proto.destroyDeletedRecords = function destroyDeletedRecords(table, recordIds, callback) {
    (0, _common2.validateTable)(table, this.schema);
    var operation = [0, null, "delete from \"".concat(table, "\" where \"id\" == ?"), recordIds.map(function (id) {
      return [id];
    })];
    this._dispatcher.call('batch', [[operation]], callback);
  };
  _proto.unsafeLoadFromSync = function unsafeLoadFromSync(jsonId, callback) {
    if (this._dispatcherType !== 'jsi') {
      callback({
        error: new Error('unsafeLoadFromSync unavailable. Use JSI mode to enable.')
      });
      return;
    }
    var _require = require('./encodeSchema'),
      encodeDropIndices = _require.encodeDropIndices,
      encodeCreateIndices = _require.encodeCreateIndices;
    var schema = this.schema;
    this._dispatcher.call('unsafeLoadFromSync', [jsonId, schema, encodeDropIndices(schema), encodeCreateIndices(schema)], function (result) {
      return callback((0, _Result.mapValue)(
      // { key: JSON.stringify(value) } -> { key: value }
      function (residualValues) {
        return (0, _fp.mapObj)(function (values) {
          return JSON.parse(values);
        }, residualValues);
      }, result));
    });
  };
  _proto.provideSyncJson = function provideSyncJson(id, syncPullResultJson, callback) {
    if (this._dispatcherType !== 'jsi') {
      callback({
        error: new Error('provideSyncJson unavailable. Use JSI mode to enable.')
      });
      return;
    }
    this._dispatcher.call('provideSyncJson', [id, syncPullResultJson], callback);
  };
  _proto.unsafeResetDatabase = function unsafeResetDatabase(callback) {
    this._dispatcher.call('unsafeResetDatabase', [this._encodedSchema(), this.schema.version], function (result) {
      if (result.value) {
        _common.logger.log('[SQLite] Database is now reset');
      }
      callback(result);
    });
  };
  _proto.unsafeExecute = function unsafeExecute(operations, callback) {
    if (process.env.NODE_ENV !== 'production') {
      (0, _common.invariant)(operations && (0, _typeof2["default"])(operations) === 'object' && Object.keys(operations).length === 1 && (Array.isArray(operations.sqls) || typeof operations.sqlString === 'string'), "unsafeExecute expects an { sqls: [ [sql, [args..]], ... ] } or { sqlString: 'foo; bar' } object");
    }
    if (operations.sqls) {
      var queries = operations.sqls;
      var batchOperations = queries.map(function (_ref) {
        var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          sql = _ref2[0],
          args = _ref2[1];
        return [IGNORE_CACHE, null, sql, [args]];
      });
      this._dispatcher.call('batch', [batchOperations], callback);
    } else if (operations.sqlString) {
      this._dispatcher.call('unsafeExecuteMultiple', [operations.sqlString], callback);
    }
  };
  _proto.getLocal = function getLocal(key, callback) {
    this._dispatcher.call('getLocal', [key], callback);
  };
  _proto.setLocal = function setLocal(key, value, callback) {
    (0, _common.invariant)(typeof value === 'string', 'adapter.setLocal() value must be a string');
    var operation = [IGNORE_CACHE, null, "insert or replace into \"local_storage\" (\"key\", \"value\") values (?, ?)", [[key, value]]];
    this._dispatcher.call('batch', [[operation]], callback);
  };
  _proto.removeLocal = function removeLocal(key, callback) {
    var operation = [IGNORE_CACHE, null, "delete from \"local_storage\" where \"key\" == ?", [[key]]];
    this._dispatcher.call('batch', [[operation]], callback);
  };
  _proto._encodedSchema = function _encodedSchema() {
    return require('./encodeSchema').encodeSchema(this.schema);
  };
  _proto._migrationSteps = function _migrationSteps(fromVersion) {
    var _require2 = require('../../Schema/migrations/stepsForMigration'),
      stepsForMigration = _require2.stepsForMigration;
    var migrations = this.migrations;
    // TODO: Remove this after migrations are shipped
    if (!migrations) {
      return null;
    }
    return stepsForMigration({
      migrations: migrations,
      fromVersion: fromVersion,
      toVersion: this.schema.version
    });
  };
  return (0, _createClass2["default"])(SQLiteAdapter, [{
    key: "initializingPromise",
    get: function get() {
      return this._initPromise;
    }
  }]);
}();
SQLiteAdapter.adapterType = 'sqlite';