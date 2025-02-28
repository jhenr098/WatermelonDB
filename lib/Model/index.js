"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.associations = associations;
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _rx = require("../utils/rx");
var _logger = _interopRequireDefault(require("../utils/common/logger"));
var _invariant = _interopRequireDefault(require("../utils/common/invariant"));
var _ensureSync = _interopRequireDefault(require("../utils/common/ensureSync"));
var _fromPairs = _interopRequireDefault(require("../utils/fp/fromPairs"));
var _noop = _interopRequireDefault(require("../utils/fp/noop"));
var _Schema = require("../Schema");
var _RawRecord = require("../RawRecord");
var _helpers = require("../sync/helpers");
var _helpers2 = require("./helpers");
/**
 * Sync status of this record:
 *
 * - `synced` - up to date as of last sync
 * - `created` - locally created, not yet pushed
 * - `updated` - locally updated, not yet pushed
 * - `deleted` - locally marked as deleted, not yet pushed
 * - `disposable` - read-only, memory-only, not part of sync, MUST NOT appear in a persisted record
 */
// TODO: Refactor associations API and ideally get rid of this in favor of plain arrays/objects
function associations() {
  for (var _len = arguments.length, associationList = new Array(_len), _key = 0; _key < _len; _key++) {
    associationList[_key] = arguments[_key];
  }
  return (0, _fromPairs["default"])(associationList);
}
var Model = exports["default"] = /*#__PURE__*/function () {
  // *** Implementation details ***

  // Don't use this directly! Use `collection.create()`
  function Model(collection, raw) {
    this._isEditing = false;
    this._preparedState = null;
    this.__changes = null;
    this._subscribers = [];
    this.collection = collection;
    this._raw = raw;
  }
  var _proto = Model.prototype;
  _proto._getChanges = function _getChanges() {
    if (!this.__changes) {
      // initializing lazily - it has non-trivial perf impact on very large collections
      this.__changes = new _rx.BehaviorSubject(this);
    }
    return this.__changes;
  }

  /**
   * Record's ID
   */;
  /**
   * Modifies the record.
   * Pass a function to set attributes of the new record.
   *
   * Updates `updateAt` field (if available)
   *
   * Note: This method must be called within a Writer {@link Database#write}.
   *
   * * @example
   * ```js
   * someTask.create(task => {
   *   task.name = 'New name'
   * })
   */
  _proto.update =
  /*#__PURE__*/
  function () {
    var _update = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var recordUpdater,
        record,
        _args = arguments;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            recordUpdater = _args.length > 0 && _args[0] !== undefined ? _args[0] : _noop["default"];
            this.__ensureInWriter("Model.update()");
            record = this.prepareUpdate(recordUpdater);
            _context.next = 5;
            return this.db.batch(this);
          case 5:
            return _context.abrupt("return", record);
          case 6:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function update() {
      return _update.apply(this, arguments);
    }
    return update;
  }()
  /**
   * Prepares record to be updated
   *
   * Use this to batch-execute multiple changes at once.
   * Note: Prepared changes must be executed by **synchronously** passing them to `database.batch()`
   * @see {Model#update}
   * @see {Database#batch}
   */
  ;
  _proto.prepareUpdate = function prepareUpdate() {
    var _this = this;
    var recordUpdater = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _noop["default"];
    (0, _invariant["default"])(!this._preparedState, "Cannot update a record with pending changes (".concat(this.__debugName, ")"));
    this.__ensureNotDisposable("Model.prepareUpdate()");
    this._isEditing = true;

    // Touch updatedAt (if available)
    if ('updatedAt' in this) {
      this._setRaw((0, _Schema.columnName)('updated_at'), Date.now());
    }

    // Perform updates
    (0, _ensureSync["default"])(recordUpdater(this));
    this._isEditing = false;
    this._preparedState = 'update';

    // TODO: `process.nextTick` doesn't work on React Native
    // We could polyfill with setImmediate, but it doesn't have the same effect — test and enseure
    // it would actually work for this purpose
    // TODO: Also add to other prepared changes
    if (process.env.NODE_ENV !== 'production' && typeof process !== 'undefined' && process && process.nextTick) {
      process.nextTick(function () {
        (0, _invariant["default"])(_this._preparedState !== 'update', "record.prepareUpdate was called on ".concat(_this.__debugName, " but wasn't sent to batch() synchronously -- this is bad!"));
      });
    }
    this.__logVerbose('prepareUpdate');
    return this;
  }

  /**
   * Marks this record as deleted (it will be deleted permanently after sync)
   *
   * Note: This method must be called within a Writer {@link Database#write}.
   */;
  _proto.markAsDeleted =
  /*#__PURE__*/
  function () {
    var _markAsDeleted = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            this.__ensureInWriter("Model.markAsDeleted()");
            this.__ensureNotDisposable("Model.markAsDeleted()");
            _context2.next = 4;
            return this.db.batch(this.prepareMarkAsDeleted());
          case 4:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));
    function markAsDeleted() {
      return _markAsDeleted.apply(this, arguments);
    }
    return markAsDeleted;
  }()
  /**
   * Prepares record to be marked as deleted
   *
   * Use this to batch-execute multiple changes at once.
   * Note: Prepared changes must be executed by **synchronously** passing them to `database.batch()`
   * @see {Model#markAsDeleted}
   * @see {Database#batch}
   */
  ;
  _proto.prepareMarkAsDeleted = function prepareMarkAsDeleted() {
    (0, _invariant["default"])(!this._preparedState, "Cannot mark a record with pending changes as deleted (".concat(this.__debugName, ")"));
    this.__ensureNotDisposable("Model.prepareMarkAsDeleted()");
    this._raw._status = 'deleted';
    this._preparedState = 'markAsDeleted';
    this.__logVerbose('prepareMarkAsDeleted');
    return this;
  }

  /**
   * Permanently deletes this record from the database
   *
   * Note: Do not use this when using Sync, as deletion will not be synced.
   *
   * Note: This method must be called within a Writer {@link Database#write}.
   */;
  _proto.destroyPermanently =
  /*#__PURE__*/
  function () {
    var _destroyPermanently = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            this.__ensureInWriter("Model.destroyPermanently()");
            this.__ensureNotDisposable("Model.destroyPermanently()");
            _context3.next = 4;
            return this.db.batch(this.prepareDestroyPermanently());
          case 4:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this);
    }));
    function destroyPermanently() {
      return _destroyPermanently.apply(this, arguments);
    }
    return destroyPermanently;
  }()
  /**
   * Prepares record to be permanently destroyed
   *
   * Note: Do not use this when using Sync, as deletion will not be synced.
   *
   * Use this to batch-execute multiple changes at once.
   * Note: Prepared changes must be executed by **synchronously** passing them to `database.batch()`
   * @see {Model#destroyPermanently}
   * @see {Database#batch}
   */
  ;
  _proto.prepareDestroyPermanently = function prepareDestroyPermanently() {
    (0, _invariant["default"])(!this._preparedState, "Cannot destroy permanently record with pending changes (".concat(this.__debugName, ")"));
    this.__ensureNotDisposable("Model.prepareDestroyPermanently()");
    this._raw._status = 'deleted';
    this._preparedState = 'destroyPermanently';
    this.__logVerbose('prepareDestroyPermanently');
    return this;
  }

  /**
   * Marks this records and its descendants as deleted (they will be deleted permenently after sync)
   *
   * Descendants are determined by taking Model's `has_many` (children) associations, and then their
   * children associations recursively.
   *
   * Note: This method must be called within a Writer {@link Database#write}.
   */;
  _proto.experimentalMarkAsDeleted =
  /*#__PURE__*/
  function () {
    var _experimentalMarkAsDeleted = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var records;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            this.__ensureInWriter("Model.experimentalMarkAsDeleted()");
            this.__ensureNotDisposable("Model.experimentalMarkAsDeleted()");
            _context4.next = 4;
            return (0, _helpers2.fetchDescendants)(this);
          case 4:
            records = _context4.sent;
            records.forEach(function (model) {
              return model.prepareMarkAsDeleted();
            });
            records.push(this.prepareMarkAsDeleted());
            _context4.next = 9;
            return this.db.batch(records);
          case 9:
          case "end":
            return _context4.stop();
        }
      }, _callee4, this);
    }));
    function experimentalMarkAsDeleted() {
      return _experimentalMarkAsDeleted.apply(this, arguments);
    }
    return experimentalMarkAsDeleted;
  }()
  /**
   * Permanently deletes this record and its descendants from the database
   *
   * Descendants are determined by taking Model's `has_many` (children) associations, and then their
   * children associations recursively.
   *
   * Note: Do not use this when using Sync, as deletion will not be synced.
   *
   * Note: This method must be called within a Writer {@link Database#write}.
   */
  ;
  _proto.experimentalDestroyPermanently =
  /*#__PURE__*/
  function () {
    var _experimentalDestroyPermanently = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var records;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            this.__ensureInWriter("Model.experimentalDestroyPermanently()");
            this.__ensureNotDisposable("Model.experimentalDestroyPermanently()");
            _context5.next = 4;
            return (0, _helpers2.fetchDescendants)(this);
          case 4:
            records = _context5.sent;
            records.forEach(function (model) {
              return model.prepareDestroyPermanently();
            });
            records.push(this.prepareDestroyPermanently());
            _context5.next = 9;
            return this.db.batch(records);
          case 9:
          case "end":
            return _context5.stop();
        }
      }, _callee5, this);
    }));
    function experimentalDestroyPermanently() {
      return _experimentalDestroyPermanently.apply(this, arguments);
    }
    return experimentalDestroyPermanently;
  }() // *** Observing changes ***
  /**
   * Returns an `Rx.Observable` that emits a signal immediately upon subscription and then every time
   * this record changes.
   *
   * Signals contain this record as its value for convenience.
   *
   * Emits `complete` signal if this record is deleted (marked as deleted or permanently destroyed)
   */
  ;
  _proto.observe = function observe() {
    (0, _invariant["default"])(this._preparedState !== 'create', "Cannot observe uncommitted record (".concat(this.__debugName, ")"));
    return this._getChanges();
  }

  /**
   * Collection associated with this Model
   */;
  // TODO: protect batch,callWriter,... from being used outside a @reader/@writer
  /**
   * Convenience method that should ONLY be used by Model's `@writer`-decorated methods
   *
   * @see {Database#batch}
   */
  _proto.batch = function batch() {
    for (var _len2 = arguments.length, records = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      records[_key2] = arguments[_key2];
    }
    return this.db.batch(records);
  }

  /**
   * Convenience method that should ONLY be used by Model's `@writer`-decorated methods
   *
   * @see {WriterInterface#callWriter}
   */;
  _proto.callWriter = function callWriter(action) {
    return this.db._workQueue.subAction(action);
  }

  /**
   * Convenience method that should ONLY be used by Model's `@writer`/`@reader`-decorated methods
   *
   * @see {ReaderInterface#callReader}
   */;
  _proto.callReader = function callReader(action) {
    return this.db._workQueue.subAction(action);
  };
  Model._prepareCreate = function _prepareCreate(collection, recordBuilder) {
    var record = new this(collection,
    // sanitizedRaw sets id
    (0, _RawRecord.sanitizedRaw)((0, _helpers2.createTimestampsFor)(this.prototype), collection.schema));
    record._preparedState = 'create';
    record._isEditing = true;
    (0, _ensureSync["default"])(recordBuilder(record));
    record._isEditing = false;
    record.__logVerbose('prepareCreate');
    return record;
  };
  Model._prepareCreateFromDirtyRaw = function _prepareCreateFromDirtyRaw(collection, dirtyRaw) {
    var record = new this(collection, (0, _RawRecord.sanitizedRaw)(dirtyRaw, collection.schema));
    record._preparedState = 'create';
    record.__logVerbose('prepareCreateFromDirtyRaw');
    return record;
  };
  Model._disposableFromDirtyRaw = function _disposableFromDirtyRaw(collection, dirtyRaw) {
    var record = new this(collection, (0, _RawRecord.sanitizedRaw)(dirtyRaw, collection.schema));
    record._raw._status = 'disposable';
    record.__logVerbose('disposableFromDirtyRaw');
    return record;
  };
  /**
   * Notifies `subscriber` on every change (update/delete) of this record
   *
   * Notification contains a flag that indicates whether the change is due to deletion
   * (Currently, subscribers are called after `changes` emissions, but this behavior might change)
   */
  _proto.experimentalSubscribe = function experimentalSubscribe(subscriber, debugInfo) {
    var _this2 = this;
    var entry = [subscriber, debugInfo];
    this._subscribers.push(entry);
    return function () {
      var idx = _this2._subscribers.indexOf(entry);
      idx !== -1 && _this2._subscribers.splice(idx, 1);
    };
  };
  _proto._notifyChanged = function _notifyChanged() {
    this._getChanges().next(this);
    this._subscribers.forEach(function (_ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 1),
        subscriber = _ref2[0];
      subscriber(false);
    });
  };
  _proto._notifyDestroyed = function _notifyDestroyed() {
    this._getChanges().complete();
    this._subscribers.forEach(function (_ref3) {
      var _ref4 = (0, _slicedToArray2["default"])(_ref3, 1),
        subscriber = _ref4[0];
      subscriber(true);
    });
  }

  // TODO: Make this official API
  ;
  _proto._getRaw = function _getRaw(rawFieldName) {
    return this._raw[rawFieldName];
  }

  // TODO: Make this official API
  ;
  _proto._setRaw = function _setRaw(rawFieldName, rawValue) {
    this.__ensureCanSetRaw();
    var valueBefore = this._raw[rawFieldName];
    (0, _RawRecord.setRawSanitized)(this._raw, rawFieldName, rawValue, this.collection.schema.columns[rawFieldName]);
    if (valueBefore !== this._raw[rawFieldName] && this._preparedState !== 'create') {
      (0, _helpers.setRawColumnChange)(this._raw, rawFieldName);
    }
  }

  // Please don't use this unless you really understand how Watermelon Sync works, and thought long and
  // hard about risks of inconsistency after sync
  // TODO: Make this official API
  ;
  _proto._dangerouslySetRawWithoutMarkingColumnChange = function _dangerouslySetRawWithoutMarkingColumnChange(rawFieldName, rawValue) {
    this.__ensureCanSetRaw();
    (0, _RawRecord.setRawSanitized)(this._raw, rawFieldName, rawValue, this.collection.schema.columns[rawFieldName]);
  };
  _proto.__ensureCanSetRaw = function __ensureCanSetRaw() {
    this.__ensureNotDisposable("Model._setRaw()");
    (0, _invariant["default"])(this._isEditing, "Not allowed to change record ".concat(this.__debugName, " outside of create/update()"));
    (0, _invariant["default"])(!this._getChanges().isStopped && this._raw._status !== 'deleted', "Not allowed to change deleted record ".concat(this.__debugName));
  };
  _proto.__ensureNotDisposable = function __ensureNotDisposable(debugName) {
    (0, _invariant["default"])(this._raw._status !== 'disposable', "".concat(debugName, " cannot be called on a disposable record ").concat(this.__debugName));
  };
  _proto.__ensureInWriter = function __ensureInWriter(debugName) {
    this.db._ensureInWriter("".concat(debugName, " (").concat(this.__debugName, ")"));
  };
  _proto.__logVerbose = function __logVerbose(debugName) {
    if (this.db.experimentalIsVerbose) {
      _logger["default"].debug("".concat(debugName, ": ").concat(this.__debugName));
    }
  };
  return (0, _createClass2["default"])(Model, [{
    key: "id",
    get: function get() {
      return this._raw.id;
    }

    /**
     * Record's sync status
     *
     * @see SyncStatus
     */
  }, {
    key: "syncStatus",
    get: function get() {
      return this._raw._status;
    }
  }, {
    key: "collections",
    get:
    // TODO: Deprecate
    /**
     * Collections of other Models in the same database as this record.
     *
     * @deprecated
     */
    function get() {
      return this.database.collections;
    }

    // TODO: Deprecate
  }, {
    key: "database",
    get: function get() {
      return this.collection.database;
    }

    /**
     * `Database` this record is associated with
     */
  }, {
    key: "db",
    get: function get() {
      return this.collection.database;
    }
  }, {
    key: "asModel",
    get: function get() {
      return this;
    }

    /**
     * Table name of this record
     */
  }, {
    key: "table",
    get: function get() {
      return this.constructor.table;
    }
  }, {
    key: "__debugName",
    get: function get() {
      return "".concat(this.table, "#").concat(this.id);
    }
  }]);
}();
/**
 * This must be set in Model subclasses to the name of associated database table
 */
/**
 * This can be set in Model subclasses to define (parent/child) relationships between different
 * Models.
 *
 * See docs for more details.
 */
Model.associations = {};
// Used by withObservables to differentiate between object types
Model._wmelonTag = 'model';