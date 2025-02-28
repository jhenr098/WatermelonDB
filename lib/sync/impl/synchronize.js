"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = synchronize;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _common = require("../../utils/common");
var _index = require("./index");
var _helpers = require("./helpers");
var _excluded = ["changes"];
function synchronize(_x) {
  return _synchronize.apply(this, arguments);
}
function _synchronize() {
  _synchronize = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref) {
    var database, pullChanges, onWillApplyRemoteChanges, onDidPullChanges, pushChanges, _ref$sendCreatedAsUpd, sendCreatedAsUpdated, migrationsEnabledAtVersion, log, conflictResolver, _unsafeBatchPerCollection, unsafeTurbo, resetCount, lastPulledAt, _yield$getMigrationIn, schemaVersion, migration, shouldSaveSchemaVersion, pullResult, newLastPulledAt, remoteChangeCount, localChanges, pushResult;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          database = _ref.database, pullChanges = _ref.pullChanges, onWillApplyRemoteChanges = _ref.onWillApplyRemoteChanges, onDidPullChanges = _ref.onDidPullChanges, pushChanges = _ref.pushChanges, _ref$sendCreatedAsUpd = _ref.sendCreatedAsUpdated, sendCreatedAsUpdated = _ref$sendCreatedAsUpd === void 0 ? false : _ref$sendCreatedAsUpd, migrationsEnabledAtVersion = _ref.migrationsEnabledAtVersion, log = _ref.log, conflictResolver = _ref.conflictResolver, _unsafeBatchPerCollection = _ref._unsafeBatchPerCollection, unsafeTurbo = _ref.unsafeTurbo;
          resetCount = database._resetCount;
          log && (log.startedAt = new Date());
          log && (log.phase = 'starting');

          // TODO: Wrap the three computionally intensive phases in `requestIdleCallback`

          // pull phase
          _context2.next = 6;
          return (0, _index.getLastPulledAt)(database);
        case 6:
          lastPulledAt = _context2.sent;
          log && (log.lastPulledAt = lastPulledAt);
          _context2.next = 10;
          return (0, _index.getMigrationInfo)(database, log, lastPulledAt, migrationsEnabledAtVersion);
        case 10:
          _yield$getMigrationIn = _context2.sent;
          schemaVersion = _yield$getMigrationIn.schemaVersion;
          migration = _yield$getMigrationIn.migration;
          shouldSaveSchemaVersion = _yield$getMigrationIn.shouldSaveSchemaVersion;
          log && (log.phase = 'ready to pull');

          // $FlowFixMe
          _context2.next = 17;
          return pullChanges({
            lastPulledAt: lastPulledAt,
            schemaVersion: schemaVersion,
            migration: migration
          });
        case 17:
          pullResult = _context2.sent;
          log && (log.phase = 'pulled');
          newLastPulledAt = pullResult.timestamp;
          remoteChangeCount = pullResult.changes ? (0, _helpers.changeSetCount)(pullResult.changes) : NaN;
          if (!onWillApplyRemoteChanges) {
            _context2.next = 24;
            break;
          }
          _context2.next = 24;
          return onWillApplyRemoteChanges({
            remoteChangeCount: remoteChangeCount
          });
        case 24:
          _context2.next = 26;
          return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
            var syncJsonId, resultRest, remoteChanges, _resultRest;
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  (0, _helpers.ensureSameDatabase)(database, resetCount);
                  _context.t0 = _common.invariant;
                  _context.t1 = lastPulledAt;
                  _context.next = 5;
                  return (0, _index.getLastPulledAt)(database);
                case 5:
                  _context.t2 = _context.sent;
                  _context.t3 = _context.t1 === _context.t2;
                  (0, _context.t0)(_context.t3, '[Sync] Concurrent synchronization is not allowed. More than one synchronize() call was running at the same time, and the later one was aborted before committing results to local database.');
                  if (!unsafeTurbo) {
                    _context.next = 21;
                    break;
                  }
                  (0, _common.invariant)(!_unsafeBatchPerCollection, 'unsafeTurbo must not be used with _unsafeBatchPerCollection');
                  (0, _common.invariant)('syncJson' in pullResult || 'syncJsonId' in pullResult, 'missing syncJson/syncJsonId');
                  (0, _common.invariant)(lastPulledAt === null, 'unsafeTurbo can only be used as the first sync');
                  syncJsonId = pullResult.syncJsonId || Math.floor(Math.random() * 1000000000);
                  if (!pullResult.syncJson) {
                    _context.next = 16;
                    break;
                  }
                  _context.next = 16;
                  return database.adapter.provideSyncJson(syncJsonId, pullResult.syncJson);
                case 16:
                  _context.next = 18;
                  return database.adapter.unsafeLoadFromSync(syncJsonId);
                case 18:
                  resultRest = _context.sent;
                  newLastPulledAt = resultRest.timestamp;
                  onDidPullChanges && onDidPullChanges(resultRest);
                case 21:
                  log && (log.newLastPulledAt = newLastPulledAt);
                  (0, _common.invariant)(typeof newLastPulledAt === 'number' && newLastPulledAt > 0, "pullChanges() returned invalid timestamp ".concat(newLastPulledAt, ". timestamp must be a non-zero number"));
                  if (unsafeTurbo) {
                    _context.next = 29;
                    break;
                  }
                  // $FlowFixMe
                  remoteChanges = pullResult.changes, _resultRest = (0, _objectWithoutProperties2["default"])(pullResult, _excluded);
                  log && (log.remoteChangeCount = remoteChangeCount);
                  // $FlowFixMe
                  _context.next = 28;
                  return (0, _index.applyRemoteChanges)(remoteChanges, {
                    db: database,
                    strategy: pullResult.experimentalStrategy,
                    sendCreatedAsUpdated: sendCreatedAsUpdated,
                    log: log,
                    conflictResolver: conflictResolver,
                    _unsafeBatchPerCollection: _unsafeBatchPerCollection
                  });
                case 28:
                  onDidPullChanges && onDidPullChanges(_resultRest);
                case 29:
                  log && (log.phase = 'applied remote changes');
                  _context.next = 32;
                  return (0, _index.setLastPulledAt)(database, newLastPulledAt);
                case 32:
                  if (!shouldSaveSchemaVersion) {
                    _context.next = 35;
                    break;
                  }
                  _context.next = 35;
                  return (0, _index.setLastPulledSchemaVersion)(database, schemaVersion);
                case 35:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          })), 'sync-synchronize-apply');
        case 26:
          if (!pushChanges) {
            _context2.next = 50;
            break;
          }
          log && (log.phase = 'ready to fetch local changes');
          _context2.next = 30;
          return (0, _index.fetchLocalChanges)(database);
        case 30:
          localChanges = _context2.sent;
          log && (log.localChangeCount = (0, _helpers.changeSetCount)(localChanges.changes));
          log && (log.phase = 'fetched local changes');
          (0, _helpers.ensureSameDatabase)(database, resetCount);
          if ((0, _helpers.isChangeSetEmpty)(localChanges.changes)) {
            _context2.next = 48;
            break;
          }
          log && (log.phase = 'ready to push');
          _context2.next = 38;
          return pushChanges({
            changes: localChanges.changes,
            lastPulledAt: newLastPulledAt
          });
        case 38:
          _context2.t0 = _context2.sent;
          if (_context2.t0) {
            _context2.next = 41;
            break;
          }
          _context2.t0 = {};
        case 41:
          pushResult = _context2.t0;
          log && (log.phase = 'pushed');
          log && (log.rejectedIds = pushResult.experimentalRejectedIds);
          (0, _helpers.ensureSameDatabase)(database, resetCount);
          _context2.next = 47;
          return (0, _index.markLocalChangesAsSynced)(database, localChanges, pushResult.experimentalRejectedIds);
        case 47:
          log && (log.phase = 'marked local changes as synced');
        case 48:
          _context2.next = 51;
          break;
        case 50:
          log && (log.phase = 'pushChanges not defined');
        case 51:
          log && (log.finishedAt = new Date());
          log && (log.phase = 'done');
        case 53:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _synchronize.apply(this, arguments);
}