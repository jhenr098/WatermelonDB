"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof3 = require("@babel/runtime/helpers/typeof");
exports.__esModule = true;
exports["default"] = applyRemoteChanges;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _fp = require("../../utils/fp");
var _splitEvery = _interopRequireDefault(require("../../utils/fp/splitEvery"));
var _allPromisesObj = _interopRequireDefault(require("../../utils/fp/allPromisesObj"));
var _Result = require("../../utils/fp/Result");
var _common = require("../../utils/common");
var Q = _interopRequireWildcard(require("../../QueryDescription"));
var _Schema = require("../../Schema");
var _helpers = require("./helpers");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof3(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
// NOTE: Creating JS models is expensive/memory-intensive, so we want to avoid it if possible
// In replacement sync, we can avoid it if record already exists and didn't change. Note that we're not
// using unsafeQueryRaw, because we DO want to reuse JS model if already in memory
// This is only safe to do within a single db.write block, because otherwise we risk that the record
// changed and we can no longer instantiate a JS model from an outdated raw record
var unsafeFetchAsRaws = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(query) {
    var db, result, raws;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          db = query.collection.db;
          _context.next = 3;
          return (0, _Result.toPromise)(function (callback) {
            return db.adapter.underlyingAdapter.query(query.serialize(), callback);
          });
        case 3:
          result = _context.sent;
          raws = query.collection._cache.rawRecordsFromQueryResult(result); // FIXME: The above actually causes RecordCache corruption, because we're not adding record to
          // RecordCache, but adapter notes that we did. Temporary quick fix below to undo the optimization.
          raws.forEach(function (raw) {
            query.collection._cache._modelForRaw(raw, false);
          });
          return _context.abrupt("return", raws);
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function unsafeFetchAsRaws(_x) {
    return _ref.apply(this, arguments);
  };
}();
var idsForChanges = function idsForChanges(_ref2) {
  var created = _ref2.created,
    updated = _ref2.updated,
    deleted = _ref2.deleted;
  var ids = [];
  created.forEach(function (record) {
    ids.push(record.id);
  });
  updated.forEach(function (record) {
    ids.push(record.id);
  });
  return ids.concat(deleted);
};
var fetchRecordsForChanges = function fetchRecordsForChanges(collection, changes) {
  var ids = idsForChanges(changes);
  if (ids.length) {
    return unsafeFetchAsRaws(collection.query(Q.where((0, _Schema.columnName)('id'), Q.oneOf(ids))));
  }
  return Promise.resolve([]);
};
function recordsToApplyRemoteChangesTo_incremental(_x2, _x3, _x4) {
  return _recordsToApplyRemoteChangesTo_incremental.apply(this, arguments);
}
function _recordsToApplyRemoteChangesTo_incremental() {
  _recordsToApplyRemoteChangesTo_incremental = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(collection, changes, context) {
    var db, table, deletedIds, deletedIdsSet, _yield$Promise$all, _yield$Promise$all2, rawRecords, locallyDeletedIds;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          db = context.db;
          table = collection.table;
          deletedIds = changes.deleted;
          deletedIdsSet = new Set(deletedIds);
          _context5.next = 6;
          return Promise.all([fetchRecordsForChanges(collection, changes), db.adapter.getDeletedRecords(table)]);
        case 6:
          _yield$Promise$all = _context5.sent;
          _yield$Promise$all2 = (0, _slicedToArray2["default"])(_yield$Promise$all, 2);
          rawRecords = _yield$Promise$all2[0];
          locallyDeletedIds = _yield$Promise$all2[1];
          return _context5.abrupt("return", (0, _extends2["default"])({}, changes, {
            recordsMap: new Map(rawRecords.map(function (raw) {
              return [raw.id, raw];
            })),
            locallyDeletedIds: locallyDeletedIds,
            recordsToDestroy: rawRecords.filter(function (raw) {
              return deletedIdsSet.has(raw.id);
            }).map(function (raw) {
              return (0, _helpers.recordFromRaw)(raw, collection);
            }),
            deletedRecordsToDestroy: locallyDeletedIds.filter(function (id) {
              return deletedIdsSet.has(id);
            })
          }));
        case 11:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _recordsToApplyRemoteChangesTo_incremental.apply(this, arguments);
}
function recordsToApplyRemoteChangesTo_replacement(_x5, _x6, _x7) {
  return _recordsToApplyRemoteChangesTo_replacement.apply(this, arguments);
}
function _recordsToApplyRemoteChangesTo_replacement() {
  _recordsToApplyRemoteChangesTo_replacement = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(collection, changes, context) {
    var _context$strategy$exp, _context$strategy$exp2;
    var db, table, queryForReplacement, created, updated, changesDeletedIds, deletedIdsSet, _yield$Promise$all3, _yield$Promise$all4, rawRecords, locallyDeletedIds, replacementRecords, recordsToKeep;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          db = context.db;
          table = collection.table;
          queryForReplacement = context.strategy && (0, _typeof2["default"])(context.strategy) === 'object' && context.strategy.experimentalQueryRecordsForReplacement ? (_context$strategy$exp = (_context$strategy$exp2 = context.strategy.experimentalQueryRecordsForReplacement)[table]) === null || _context$strategy$exp === void 0 ? void 0 : _context$strategy$exp.call(_context$strategy$exp2) : null;
          created = changes.created, updated = changes.updated, changesDeletedIds = changes.deleted;
          deletedIdsSet = new Set(changesDeletedIds);
          _context7.next = 7;
          return Promise.all([unsafeFetchAsRaws(collection.query(queryForReplacement ? [Q.or(Q.where((0, _Schema.columnName)('id'), Q.oneOf(idsForChanges(changes))), Q.and(queryForReplacement))] : [])), db.adapter.getDeletedRecords(table)]);
        case 7:
          _yield$Promise$all3 = _context7.sent;
          _yield$Promise$all4 = (0, _slicedToArray2["default"])(_yield$Promise$all3, 2);
          rawRecords = _yield$Promise$all4[0];
          locallyDeletedIds = _yield$Promise$all4[1];
          _context7.next = 13;
          return (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
            var clauses, modifiedQuery;
            return _regenerator["default"].wrap(function _callee6$(_context6) {
              while (1) switch (_context6.prev = _context6.next) {
                case 0:
                  if (!queryForReplacement) {
                    _context6.next = 9;
                    break;
                  }
                  clauses = queryForReplacement;
                  modifiedQuery = collection.query(clauses);
                  modifiedQuery.description = modifiedQuery._rawDescription;
                  _context6.t0 = Set;
                  _context6.next = 7;
                  return modifiedQuery.fetchIds();
                case 7:
                  _context6.t1 = _context6.sent;
                  return _context6.abrupt("return", new _context6.t0(_context6.t1));
                case 9:
                  return _context6.abrupt("return", null);
                case 10:
                case "end":
                  return _context6.stop();
              }
            }, _callee6);
          }))();
        case 13:
          replacementRecords = _context7.sent;
          recordsToKeep = new Set([].concat((0, _toConsumableArray2["default"])(created.map(function (record) {
            return record.id;
          })), (0, _toConsumableArray2["default"])(updated.map(function (record) {
            return record.id;
          }))));
          return _context7.abrupt("return", (0, _extends2["default"])({}, changes, {
            recordsMap: new Map(rawRecords.map(function (raw) {
              return [raw.id, raw];
            })),
            locallyDeletedIds: locallyDeletedIds,
            recordsToDestroy: rawRecords.filter(function (raw) {
              if (deletedIdsSet.has(raw.id)) {
                return true;
              }
              var subjectToReplacement = replacementRecords ? replacementRecords.has(raw.id) : true;
              return subjectToReplacement && !recordsToKeep.has(raw.id) && raw._status !== 'created';
            }).map(function (raw) {
              return (0, _helpers.recordFromRaw)(raw, collection);
            }),
            deletedRecordsToDestroy: locallyDeletedIds.filter(function (id) {
              if (deletedIdsSet.has(id)) {
                return true;
              }
              var subjectToReplacement = replacementRecords ? replacementRecords.has(id) : true;
              return subjectToReplacement && !recordsToKeep.has(id);
            })
          }));
        case 16:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _recordsToApplyRemoteChangesTo_replacement.apply(this, arguments);
}
var strategyForCollection = function strategyForCollection(collection, strategy) {
  if (!strategy) {
    return 'incremental';
  } else if (typeof strategy === 'string') {
    return strategy;
  }
  return strategy.override[collection.table] || strategy["default"];
};
function recordsToApplyRemoteChangesTo(_x8, _x9, _x10) {
  return _recordsToApplyRemoteChangesTo.apply(this, arguments);
}
function _recordsToApplyRemoteChangesTo() {
  _recordsToApplyRemoteChangesTo = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(collection, changes, context) {
    var strategy;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          strategy = strategyForCollection(collection, context.strategy);
          (0, _common.invariant)(['incremental', 'replacement'].includes(strategy), '[Sync] Invalid pull strategy');
          _context8.t0 = strategy;
          _context8.next = _context8.t0 === 'replacement' ? 5 : _context8.t0 === 'incremental' ? 6 : 6;
          break;
        case 5:
          return _context8.abrupt("return", recordsToApplyRemoteChangesTo_replacement(collection, changes, context));
        case 6:
          return _context8.abrupt("return", recordsToApplyRemoteChangesTo_incremental(collection, changes, context));
        case 7:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return _recordsToApplyRemoteChangesTo.apply(this, arguments);
}
var getAllRecordsToApply = function getAllRecordsToApply(remoteChanges, context) {
  var db = context.db;
  return (0, _allPromisesObj["default"])((0, _fp.pipe)((0, _fp.filterObj)(function (_changes, tableName) {
    var collection = db.get(tableName);
    if (!collection) {
      _common.logger.warn("You are trying to sync a collection named ".concat(tableName, ", but it does not exist. Will skip it (for forward-compatibility). If this is unexpected, perhaps you forgot to add it to your Database constructor's modelClasses property?"));
    }
    return !!collection;
  }), (0, _fp.mapObj)(function (changes, tableName) {
    return recordsToApplyRemoteChangesTo(db.get(tableName), changes, context);
  }))(remoteChanges));
};
function validateRemoteRaw(raw) {
  // TODO: I think other code is actually resilient enough to handle illegal _status and _changed
  // would be best to change that part to a warning - but tests are needed
  (0, _common.invariant)(raw && (0, _typeof2["default"])(raw) === 'object' && 'id' in raw && !('_status' in raw || '_changed' in raw), "[Sync] Invalid raw record supplied to Sync. Records must be objects, must have an 'id' field, and must NOT have a '_status' or '_changed' fields");
}
function prepareApplyRemoteChangesToCollection(recordsToApply, collection, context) {
  var db = context.db,
    sendCreatedAsUpdated = context.sendCreatedAsUpdated,
    log = context.log,
    conflictResolver = context.conflictResolver;
  var table = collection.table;
  var created = recordsToApply.created,
    updated = recordsToApply.updated,
    deleted = recordsToApply.recordsToDestroy,
    recordsMap = recordsToApply.recordsMap,
    locallyDeletedIds = recordsToApply.locallyDeletedIds;

  // if `sendCreatedAsUpdated`, server should send all non-deleted records as `updated`
  // log error if it doesn't — but disable standard created vs updated errors
  if (sendCreatedAsUpdated && created.length) {
    (0, _common.logError)("[Sync] 'sendCreatedAsUpdated' option is enabled, and yet server sends some records as 'created'");
  }
  var recordsToBatch = []; // mutating - perf critical

  // Insert and update records
  created.forEach(function (raw) {
    validateRemoteRaw(raw);
    var currentRecord = recordsMap.get(raw.id);
    if (currentRecord) {
      (0, _common.logError)("[Sync] Server wants client to create record ".concat(table, "#").concat(raw.id, ", but it already exists locally. This may suggest last sync partially executed, and then failed; or it could be a serious bug. Will update existing record instead."));
      recordsToBatch.push((0, _helpers.prepareUpdateFromRaw)(currentRecord, raw, collection, log, conflictResolver));
    } else if (locallyDeletedIds.includes(raw.id)) {
      (0, _common.logError)("[Sync] Server wants client to create record ".concat(table, "#").concat(raw.id, ", but it already exists locally and is marked as deleted. This may suggest last sync partially executed, and then failed; or it could be a serious bug. Will delete local record and recreate it instead."));
      // Note: we're not awaiting the async operation (but it will always complete before the batch)
      db.adapter.destroyDeletedRecords(table, [raw.id]);
      recordsToBatch.push((0, _helpers.prepareCreateFromRaw)(collection, raw));
    } else {
      recordsToBatch.push((0, _helpers.prepareCreateFromRaw)(collection, raw));
    }
  });
  updated.forEach(function (raw) {
    validateRemoteRaw(raw);
    var currentRecord = recordsMap.get(raw.id);
    if (currentRecord) {
      recordsToBatch.push((0, _helpers.prepareUpdateFromRaw)(currentRecord, raw, collection, log, conflictResolver));
    } else if (locallyDeletedIds.includes(raw.id)) {
      // Nothing to do, record was locally deleted, deletion will be pushed later
    } else {
      // Record doesn't exist (but should) — just create it
      !sendCreatedAsUpdated && (0, _common.logError)("[Sync] Server wants client to update record ".concat(table, "#").concat(raw.id, ", but it doesn't exist locally. This could be a serious bug. Will create record instead. If this was intentional, please check the flag sendCreatedAsUpdated in https://watermelondb.dev/docs/Sync/Frontend#additional-synchronize-flags"));
      recordsToBatch.push((0, _helpers.prepareCreateFromRaw)(collection, raw));
    }
  });
  deleted.forEach(function (record) {
    // $FlowFixMe
    recordsToBatch.push(record.prepareDestroyPermanently());
  });
  return recordsToBatch;
}
var destroyAllDeletedRecords = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(db, recordsToApply) {
    var promises;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          promises = (0, _fp.toPairs)(recordsToApply).map(function (_ref4) {
            var _ref5 = (0, _slicedToArray2["default"])(_ref4, 2),
              tableName = _ref5[0],
              deletedRecordsToDestroy = _ref5[1].deletedRecordsToDestroy;
            return deletedRecordsToDestroy.length ? db.adapter.destroyDeletedRecords(tableName, deletedRecordsToDestroy) : null;
          });
          _context2.next = 3;
          return Promise.all(promises);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function destroyAllDeletedRecords(_x11, _x12) {
    return _ref3.apply(this, arguments);
  };
}();
var applyAllRemoteChanges = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(recordsToApply, context) {
    var db, allRecords;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          db = context.db;
          allRecords = [];
          (0, _fp.toPairs)(recordsToApply).forEach(function (_ref7) {
            var _ref8 = (0, _slicedToArray2["default"])(_ref7, 2),
              tableName = _ref8[0],
              records = _ref8[1];
            prepareApplyRemoteChangesToCollection(records, db.get(tableName), context).forEach(function (record) {
              allRecords.push(record);
            });
          });
          // $FlowFixMe
          _context3.next = 5;
          return db.batch(allRecords);
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function applyAllRemoteChanges(_x13, _x14) {
    return _ref6.apply(this, arguments);
  };
}();

// See _unsafeBatchPerCollection - temporary fix
var unsafeApplyAllRemoteChangesByBatches = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(recordsToApply, context) {
    var db, promises;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          db = context.db;
          promises = [];
          (0, _fp.toPairs)(recordsToApply).forEach(function (_ref10) {
            var _ref11 = (0, _slicedToArray2["default"])(_ref10, 2),
              tableName = _ref11[0],
              records = _ref11[1];
            var preparedModels = prepareApplyRemoteChangesToCollection(records, db.get(tableName), context);
            (0, _splitEvery["default"])(5000, preparedModels).forEach(function (recordBatch) {
              promises.push(db.batch(recordBatch));
            });
          });
          _context4.next = 5;
          return Promise.all(promises);
        case 5:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function unsafeApplyAllRemoteChangesByBatches(_x15, _x16) {
    return _ref9.apply(this, arguments);
  };
}();
function applyRemoteChanges(_x17, _x18) {
  return _applyRemoteChanges.apply(this, arguments);
}
function _applyRemoteChanges() {
  _applyRemoteChanges = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(remoteChanges, context) {
    var db, _unsafeBatchPerCollection, recordsToApply;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          db = context.db, _unsafeBatchPerCollection = context._unsafeBatchPerCollection;
          _context9.next = 3;
          return getAllRecordsToApply(remoteChanges, context);
        case 3:
          recordsToApply = _context9.sent;
          _context9.next = 6;
          return Promise.all([destroyAllDeletedRecords(db, recordsToApply), _unsafeBatchPerCollection ? unsafeApplyAllRemoteChangesByBatches(recordsToApply, context) : applyAllRemoteChanges(recordsToApply, context)]);
        case 6:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return _applyRemoteChanges.apply(this, arguments);
}