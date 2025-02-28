"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = diagnoseSyncConsistency;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _forEachAsync = _interopRequireDefault(require("../../utils/fp/forEachAsync"));
var _sync = require("../../sync");
var _RawRecord = require("../../RawRecord");
var _impl = require("../../sync/impl");
var _helpers = require("../../sync/impl/helpers");
var _censorRaw = _interopRequireDefault(require("../censorRaw"));
var _excluded = ["_status", "_changed"];
/* eslint-disable no-continue */
var yieldLog = function yieldLog() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 0);
  });
};
var recordsToMap = function recordsToMap(records) {
  var map = new Map();
  records.forEach(function (record) {
    if (map.has(record.id)) {
      throw new Error("\u274C Array of records has a duplicate ID ".concat(record.id));
    }
    map.set(record.id, record);
  });
  return map;
};
var renderRecord = function renderRecord(record) {
  // eslint-disable-next-line no-unused-vars
  var _status = record._status,
    _changed = record._changed,
    rest = (0, _objectWithoutProperties2["default"])(record, _excluded);
  return JSON.stringify((0, _censorRaw["default"])(rest), null, '  ');
};

// Indicates uncertainty whether local and remote states are fully synced - requires a retry
var InconsistentSyncError = /*#__PURE__*/function (_Error) {
  function InconsistentSyncError() {
    return _Error.apply(this, arguments) || this;
  }
  (0, _inheritsLoose2["default"])(InconsistentSyncError, _Error);
  return InconsistentSyncError;
}(/*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));
function diagnoseSyncConsistencyImpl(_x, _x2) {
  return _diagnoseSyncConsistencyImpl.apply(this, arguments);
}
function _diagnoseSyncConsistencyImpl() {
  _diagnoseSyncConsistencyImpl = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(_ref, log) {
    var db, synchronize, pullChanges, _ref$isInconsistentRe, isInconsistentRecordAllowed, _ref$isExcessLocalRec, isExcessLocalRecordAllowed, _ref$isMissingLocalRe, isMissingLocalRecordAllowed, totalCorruptionCount;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          db = _ref.db, synchronize = _ref.synchronize, pullChanges = _ref.pullChanges, _ref$isInconsistentRe = _ref.isInconsistentRecordAllowed, isInconsistentRecordAllowed = _ref$isInconsistentRe === void 0 ? /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt("return", false);
                case 1:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          })) : _ref$isInconsistentRe, _ref$isExcessLocalRec = _ref.isExcessLocalRecordAllowed, isExcessLocalRecordAllowed = _ref$isExcessLocalRec === void 0 ? /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
            return _regenerator["default"].wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  return _context2.abrupt("return", false);
                case 1:
                case "end":
                  return _context2.stop();
              }
            }, _callee2);
          })) : _ref$isExcessLocalRec, _ref$isMissingLocalRe = _ref.isMissingLocalRecordAllowed, isMissingLocalRecordAllowed = _ref$isMissingLocalRe === void 0 ? /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
            return _regenerator["default"].wrap(function _callee3$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  return _context3.abrupt("return", false);
                case 1:
                case "end":
                  return _context3.stop();
              }
            }, _callee3);
          })) : _ref$isMissingLocalRe;
          log('# Sync consistency diagnostics');
          log();
          totalCorruptionCount = 0; // synchronize first, to ensure we're at consistent state
          // (twice to deal with just-resolved conflicts or data just pushed)
          log('Syncing once...');
          _context8.next = 7;
          return synchronize();
        case 7:
          log('Syncing twice...');
          _context8.next = 10;
          return synchronize();
        case 10:
          log('Synced.');

          // disallow further local changes
          _context8.next = 13;
          return db.read(/*#__PURE__*/function () {
            var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(reader) {
              var schema, allUserData, lastPulledAt, recentChanges, recentChangeCount, collections;
              return _regenerator["default"].wrap(function _callee7$(_context7) {
                while (1) switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return reader.callReader(function () {
                      return (0, _sync.hasUnsyncedChanges)({
                        database: db
                      });
                    });
                  case 2:
                    if (!_context7.sent) {
                      _context7.next = 5;
                      break;
                    }
                    log('❌ Sync consistency diagnostics failed because there are unsynced local changes - please try again.');
                    throw new InconsistentSyncError('unsynced local changes');
                  case 5:
                    log();

                    // fetch ALL data
                    log('Fetching all data. This may take a while (same as initial login), please be patient...');
                    schema = db.schema;
                    _context7.next = 10;
                    return pullChanges({
                      lastPulledAt: null,
                      schemaVersion: schema.version,
                      migration: null
                    });
                  case 10:
                    allUserData = _context7.sent;
                    log("Fetched all ".concat((0, _helpers.changeSetCount)(allUserData), " records"));

                    // Ensure that all data is consistent with current data - if so,
                    // an incremental sync will be empty
                    // NOTE: Fetching all data takes enough time that there's a great risk
                    // that many test will fail here. It would be easier to fetch all data
                    // first and then do a quick incremental sync, but that doesn't give us
                    // a guarantee of consistency
                    log("Ensuring no new remote changes...");
                    _context7.next = 15;
                    return (0, _impl.getLastPulledAt)(db);
                  case 15:
                    lastPulledAt = _context7.sent;
                    _context7.next = 18;
                    return pullChanges({
                      lastPulledAt: lastPulledAt,
                      schemaVersion: schema.version,
                      migration: null
                    });
                  case 18:
                    recentChanges = _context7.sent;
                    recentChangeCount = (0, _helpers.changeSetCount)(recentChanges);
                    if (!(recentChangeCount > 0)) {
                      _context7.next = 24;
                      break;
                    }
                    log("\u274C Sync consistency diagnostics failed because there were changes on the server between initial synchronization and now. Please try again.");
                    log();
                    throw new InconsistentSyncError('there were changes on the server between initial synchronization and now');
                  case 24:
                    log();

                    // Compare all the data
                    collections = Object.keys(db.collections.map);
                    _context7.next = 28;
                    return (0, _forEachAsync["default"])(collections, /*#__PURE__*/function () {
                      var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(table) {
                        var tableCorruptionCount, records, _allUserData$table, created, updated, deleted, remoteRecords, localMap, tableSchema, remoteMap, inconsistentRecords, excessRecords, missingRecords, columnsToCheck;
                        return _regenerator["default"].wrap(function _callee6$(_context6) {
                          while (1) switch (_context6.prev = _context6.next) {
                            case 0:
                              log("## Consistency of `".concat(table, "`"));
                              log();
                              _context6.next = 4;
                              return yieldLog();
                            case 4:
                              tableCorruptionCount = 0;
                              _context6.next = 7;
                              return db.collections
                              // $FlowFixMe
                              .get(table).query().fetch();
                            case 7:
                              records = _context6.sent;
                              // $FlowFixMe
                              _allUserData$table = allUserData[table], created = _allUserData$table.created, updated = _allUserData$table.updated, deleted = _allUserData$table.deleted;
                              if (deleted.length) {
                                log("\u2753 Warning: ".concat(deleted.length, " deleted ").concat(table, " found in full (login) sync -- should not be necessary:"));
                                log(deleted.join(','));
                              }
                              remoteRecords = created.concat(updated);
                              log("Found ".concat(records.length, " `").concat(table, "` locally, ").concat(remoteRecords.length, " remotely"));

                              // Transform records into hash maps for efficient lookup
                              localMap = recordsToMap(records.map(function (r) {
                                return r._raw;
                              })); // $FlowFixMe
                              tableSchema = schema.tables[table];
                              remoteMap = recordsToMap(remoteRecords.map(function (r) {
                                return (0, _RawRecord.sanitizedRaw)(r, tableSchema);
                              }));
                              _context6.next = 17;
                              return yieldLog();
                            case 17:
                              inconsistentRecords = [];
                              excessRecords = [];
                              missingRecords = [];
                              _context6.next = 22;
                              return (0, _forEachAsync["default"])(Array.from(remoteMap.entries()), /*#__PURE__*/function () {
                                var _ref8 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref7) {
                                  var _ref9, id, remote, local;
                                  return _regenerator["default"].wrap(function _callee4$(_context4) {
                                    while (1) switch (_context4.prev = _context4.next) {
                                      case 0:
                                        _ref9 = (0, _slicedToArray2["default"])(_ref7, 2), id = _ref9[0], remote = _ref9[1];
                                        local = localMap.get(id);
                                        if (local) {
                                          _context4.next = 16;
                                          break;
                                        }
                                        _context4.next = 5;
                                        return isMissingLocalRecordAllowed({
                                          tableName: table,
                                          remote: remote
                                        });
                                      case 5:
                                        if (!_context4.sent) {
                                          _context4.next = 9;
                                          break;
                                        }
                                        missingRecords.push(id);
                                        _context4.next = 16;
                                        break;
                                      case 9:
                                        log();
                                        log("\u274C MISSING: Record `".concat(table, ".").concat(id, "` is present on server, but missing in local db"));
                                        log();
                                        log('```');
                                        log("REMOTE: ".concat(renderRecord(remote)));
                                        log('```');
                                        tableCorruptionCount += 1;
                                      case 16:
                                      case "end":
                                        return _context4.stop();
                                    }
                                  }, _callee4);
                                }));
                                return function (_x6) {
                                  return _ref8.apply(this, arguments);
                                };
                              }());
                            case 22:
                              _context6.next = 24;
                              return yieldLog();
                            case 24:
                              columnsToCheck = tableSchema.columnArray.map(function (column) {
                                return column.name;
                              });
                              _context6.next = 27;
                              return (0, _forEachAsync["default"])(Array.from(localMap.entries()), /*#__PURE__*/function () {
                                var _ref11 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref10) {
                                  var _ref12, id, record, local, remote, recordIsConsistent, inconsistentColumns;
                                  return _regenerator["default"].wrap(function _callee5$(_context5) {
                                    while (1) switch (_context5.prev = _context5.next) {
                                      case 0:
                                        _ref12 = (0, _slicedToArray2["default"])(_ref10, 2), id = _ref12[0], record = _ref12[1];
                                        local = record;
                                        remote = remoteMap.get(id); // console.log(id, local, remote)
                                        if (remote) {
                                          _context5.next = 19;
                                          break;
                                        }
                                        _context5.next = 6;
                                        return isExcessLocalRecordAllowed({
                                          tableName: table,
                                          local: local
                                        });
                                      case 6:
                                        if (!_context5.sent) {
                                          _context5.next = 10;
                                          break;
                                        }
                                        excessRecords.push(id);
                                        _context5.next = 17;
                                        break;
                                      case 10:
                                        log();
                                        log("\u274C EXCESS: Record `".concat(table, ".").concat(id, "` is present in local db, but not on server"));
                                        log();
                                        log('```');
                                        log("LOCAL: ".concat(renderRecord(local)));
                                        log('```');
                                        tableCorruptionCount += 1;
                                      case 17:
                                        _context5.next = 38;
                                        break;
                                      case 19:
                                        recordIsConsistent = local.id === remote.id && local._status === 'synced' && local._changed === '' && columnsToCheck.every(function (column) {
                                          return local[column] === remote[column];
                                        });
                                        if (recordIsConsistent) {
                                          _context5.next = 38;
                                          break;
                                        }
                                        inconsistentColumns = columnsToCheck.filter(function (column) {
                                          return local[column] !== remote[column];
                                        });
                                        _context5.next = 24;
                                        return isInconsistentRecordAllowed({
                                          tableName: table,
                                          local: local,
                                          remote: remote,
                                          inconsistentColumns: inconsistentColumns
                                        });
                                      case 24:
                                        if (!_context5.sent) {
                                          _context5.next = 28;
                                          break;
                                        }
                                        inconsistentRecords.push(id);
                                        _context5.next = 38;
                                        break;
                                      case 28:
                                        tableCorruptionCount += 1;
                                        log();
                                        log("\u274C INCONSISTENCY: Record `".concat(table, ".").concat(id, "` differs between server and local db"));
                                        log();
                                        log('```');
                                        log("LOCAL: ".concat(renderRecord(local)));
                                        log("REMOTE: ".concat(renderRecord(remote)));
                                        log("DIFFERENCE:");
                                        inconsistentColumns.forEach(function (column) {
                                          log("- ".concat(column, " | local: ").concat(JSON.stringify(local[column]), " | remote: ").concat(JSON.stringify(remote[column])));
                                        });
                                        log('```');
                                      case 38:
                                      case "end":
                                        return _context5.stop();
                                    }
                                  }, _callee5);
                                }));
                                return function (_x7) {
                                  return _ref11.apply(this, arguments);
                                };
                              }());
                            case 27:
                              log();
                              if (inconsistentRecords.length) {
                                log("\u2753 Config allowed ".concat(inconsistentRecords.length, " inconsistent `").concat(table, "`"));
                                // log(inconsistentRecords.join(','))
                              }
                              if (excessRecords.length) {
                                log("\u2753 Config allowed ".concat(excessRecords.length, " excess local `").concat(table, "`"));
                                // log(excessRecords.join(','))
                              }
                              if (missingRecords.length) {
                                log("\u2753 Config allowed ".concat(missingRecords.length, " locally missing `").concat(table, "`"));
                                // log(missingRecords.join(','))
                              }
                              if (!tableCorruptionCount) {
                                log("No corruption found in this table");
                              }
                              totalCorruptionCount += tableCorruptionCount;
                              log();
                              _context6.next = 36;
                              return yieldLog();
                            case 36:
                            case "end":
                              return _context6.stop();
                          }
                        }, _callee6);
                      }));
                      return function (_x5) {
                        return _ref6.apply(this, arguments);
                      };
                    }());
                  case 28:
                    log('## Conclusion');
                    log();
                    if (totalCorruptionCount) {
                      log("\u274C ".concat(totalCorruptionCount, " issues found"));
                    } else {
                      log("\u2705 No corruption found in this database!");
                    }
                  case 31:
                  case "end":
                    return _context7.stop();
                }
              }, _callee7);
            }));
            return function (_x4) {
              return _ref5.apply(this, arguments);
            };
          }());
        case 13:
          return _context8.abrupt("return", totalCorruptionCount);
        case 14:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return _diagnoseSyncConsistencyImpl.apply(this, arguments);
}
function diagnoseSyncConsistency(_x3) {
  return _diagnoseSyncConsistency.apply(this, arguments);
}
function _diagnoseSyncConsistency() {
  _diagnoseSyncConsistency = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(options) {
    var startTime, logText, log, allowedAttempts, issueCount;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          startTime = Date.now();
          logText = '';
          log = function log() {
            var _options$log;
            var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            logText = "".concat(logText, "\n").concat(text);
            (_options$log = options.log) === null || _options$log === void 0 ? void 0 : _options$log.call(options, text);
          }; // If we're not sure if we've synced properly (can't do it transactionally, we always have to check
          // if there are new changes), retry
          allowedAttempts = 5; // eslint-disable-next-line no-constant-condition
        case 4:
          if (!true) {
            _context9.next = 24;
            break;
          }
          allowedAttempts -= 1;
          _context9.prev = 6;
          _context9.next = 9;
          return diagnoseSyncConsistencyImpl(options, log);
        case 9:
          issueCount = _context9.sent;
          log();
          log("Done in ".concat((Date.now() - startTime) / 1000, " s."));
          return _context9.abrupt("return", {
            issueCount: issueCount,
            log: logText
          });
        case 15:
          _context9.prev = 15;
          _context9.t0 = _context9["catch"](6);
          if (!(_context9.t0 instanceof InconsistentSyncError && allowedAttempts >= 1)) {
            _context9.next = 21;
            break;
          }
          return _context9.abrupt("continue", 4);
        case 21:
          throw _context9.t0;
        case 22:
          _context9.next = 4;
          break;
        case 24:
          throw new Error('unreachable');
        case 25:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[6, 15]]);
  }));
  return _diagnoseSyncConsistency.apply(this, arguments);
}