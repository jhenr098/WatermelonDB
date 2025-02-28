"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
exports.__esModule = true;
exports["default"] = diagnoseDatabaseStructure;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _forEachAsync = _interopRequireDefault(require("../../utils/fp/forEachAsync"));
var _Schema = require("../../Schema");
var Q = _interopRequireWildcard(require("../../QueryDescription"));
var _censorRaw = _interopRequireDefault(require("../censorRaw"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
/* eslint-disable no-continue */
var pad = function pad(text, len) {
  var padding = Array(Math.max(0, len - text.length)).fill(' ').join('');
  return "".concat(text).concat(padding);
};
var yieldLog = function yieldLog() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 0);
  });
};
var getCollections = function getCollections(db) {
  return Object.entries(db.collections.map).map(function (_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
      table = _ref2[0],
      collection = _ref2[1];
    return {
      name: table,
      // $FlowFixMe
      parents: Object.entries(collection.modelClass.associations)
      // $FlowFixMe
      .filter(function (_ref3) {
        var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
          association = _ref4[1];
        return association.type === 'belongs_to';
      })
      // $FlowFixMe
      .map(function (_ref5) {
        var _ref6 = (0, _slicedToArray2["default"])(_ref5, 2),
          parentTable = _ref6[0],
          association = _ref6[1];
        return [parentTable, association.key];
      })
    };
  });
};
var logCollections = function logCollections(log, collections) {
  collections.forEach(function (_ref7) {
    var name = _ref7.name,
      parents = _ref7.parents;
    var parentsText = parents.length ? parents.map(function (_ref8) {
      var _ref9 = (0, _slicedToArray2["default"])(_ref8, 2),
        table = _ref9[0],
        key = _ref9[1];
      return pad("".concat(table, "(").concat(key, ")"), 27);
    }).join(', ') : '(root)';
    log("- ".concat(pad(name, 20), ": ").concat(parentsText));
  });
  log();
};
var isUniqueIndexValid = function isUniqueIndexValid(collection, key) {
  var index = collection.constraints.unique[key];
  if (!index) {
    return {
      skip: true
    };
  }
  var lokiMap = Object.entries(index.lokiMap);
  // >= and undefined checks are needed because items are not removed from unique index, just made undefined
  var lokiMapValid = lokiMap.length >= collection.data.length && lokiMap.every(function (_ref10) {
    var _ref11 = (0, _slicedToArray2["default"])(_ref10, 2),
      lokiId = _ref11[0],
      value = _ref11[1];
    return value === undefined || collection.get(lokiId)[key] === value;
  });
  var keyMap = Object.entries(index.keyMap);
  var keyMapValid = keyMap.length >= collection.data.length && keyMap.every(function (_ref12) {
    var _ref13 = (0, _slicedToArray2["default"])(_ref12, 2),
      value = _ref13[0],
      record = _ref13[1];
    return record === undefined ||
    // $FlowFixMe
    record[key] === value && collection.get(record.$loki) === record;
  });
  return {
    skip: false,
    lokiMapValid: lokiMapValid,
    keyMapValid: keyMapValid
  };
};
function verifyLokiIndices(_x, _x2) {
  return _verifyLokiIndices.apply(this, arguments);
}
function _verifyLokiIndices() {
  _verifyLokiIndices = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(db, log) {
    var issueCount, loki;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          log('## Verify LokiJS indices');
          issueCount = 0; // $FlowFixMe
          loki = db.adapter.underlyingAdapter._driver.loki;
          loki.collections.forEach(function (collection) {
            var name = collection.name,
              idIndex = collection.idIndex,
              data = collection.data,
              binaryIndices = collection.binaryIndices,
              uniqueNames = collection.uniqueNames;
            log("**Indices of `".concat(name, "`**"));
            log();

            // check idIndex
            if (idIndex) {
              if (idIndex.length === data.length && idIndex.every(function (lokiId, i) {
                return data[i].$loki === lokiId;
              })) {
                log('idIndex: ok');
              } else {
                log('❌ idIndex: corrupted!');
                issueCount += 1;
              }
            } else {
              log('idIndex: (skipping)');
            }

            // check binary indices
            var binKeys = Object.keys(binaryIndices);
            binKeys.forEach(function (binKey) {
              if (collection.checkIndex(binKey, {
                repair: true
              })) {
                log("".concat(binKey, " binary index: ok"));
              } else {
                log("\u274C ".concat(binKey, " binary index: corrupted! checking if repaired..."));
                issueCount += 1;
                if (collection.checkIndex(binKey)) {
                  log('repaired ok');
                } else {
                  log('❌❌ still broken after repair!');
                }
              }
            });

            // check unique indices
            if (name !== 'local_storage' && !(uniqueNames.length === 1 && uniqueNames[0] === 'id')) {
              log("\u274C expected to only have a single unique index for 'id', has: ".concat(uniqueNames.join(', ')));
              issueCount += 1;
            }
            uniqueNames.forEach(function (key) {
              var results = isUniqueIndexValid(collection, key);
              if (!results.skip) {
                if (results.lokiMapValid) {
                  log("".concat(key, " index loki map: ok"));
                } else {
                  log("\u274C ".concat(key, " index loki map: corrupted!"));
                  issueCount += 1;
                }
                if (results.keyMapValid) {
                  log("".concat(key, " index key map: ok"));
                } else {
                  log("\u274C ".concat(key, " index key map: corrupted!"));
                  issueCount += 1;
                }
              } else {
                log("".concat(key, " index: (skipping)"));
              }
            });
            log();
          });
          return _context6.abrupt("return", issueCount);
        case 5:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _verifyLokiIndices.apply(this, arguments);
}
function diagnoseDatabaseStructure(_ref14) {
  var db = _ref14.db,
    _ref14$log = _ref14.log,
    _log = _ref14$log === void 0 ? function () {} : _ref14$log,
    _ref14$shouldSkipPare = _ref14.shouldSkipParent,
    shouldSkipParent = _ref14$shouldSkipPare === void 0 ? function () {
      return false;
    } : _ref14$shouldSkipPare,
    _ref14$isOrphanAllowe = _ref14.isOrphanAllowed,
    isOrphanAllowed = _ref14$isOrphanAllowe === void 0 ? /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", false);
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })) : _ref14$isOrphanAllowe;
  return db.read(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var startTime, logText, log, totalIssueCount, collections;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          startTime = Date.now();
          logText = '';
          log = function log() {
            var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            logText = "".concat(logText, "\n").concat(text);
            _log(text);
          };
          totalIssueCount = 0;
          log('# Database structure diagnostics');
          log();
          if (!(db.adapter.underlyingAdapter.constructor.adapterType === 'loki')) {
            _context5.next = 11;
            break;
          }
          _context5.t0 = totalIssueCount;
          _context5.next = 10;
          return verifyLokiIndices(db, log);
        case 10:
          totalIssueCount = _context5.t0 += _context5.sent;
        case 11:
          log('## Collection parent-child relations');
          log();
          collections = getCollections(db); // log(JSON.stringify(collections, null, 2))
          log('```');
          logCollections(log, collections);
          log('```');
          _context5.next = 19;
          return yieldLog();
        case 19:
          _context5.next = 21;
          return (0, _forEachAsync["default"])(collections, /*#__PURE__*/function () {
            var _ref18 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref17) {
              var name, parents, records, collectionOrphanCount;
              return _regenerator["default"].wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    name = _ref17.name, parents = _ref17.parents;
                    log("## Structure of ".concat(name));
                    log();
                    if (parents.length) {
                      _context4.next = 7;
                      break;
                    }
                    log("(skipping - no parents)");
                    log();
                    return _context4.abrupt("return");
                  case 7:
                    _context4.next = 9;
                    return yieldLog();
                  case 9:
                    _context4.next = 11;
                    return db.collections
                    // $FlowFixMe
                    .get(name).query().fetch();
                  case 11:
                    records = _context4.sent;
                    log("Found ".concat(records.length, " `").concat(name, "`"));
                    _context4.next = 15;
                    return yieldLog();
                  case 15:
                    collectionOrphanCount = 0;
                    _context4.next = 18;
                    return (0, _forEachAsync["default"])(parents, /*#__PURE__*/function () {
                      var _ref20 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref19) {
                        var _ref21, parentName, key, expectedParentSet, expectedParents, parentsFound, allowedOprhans, foundParentSet, orphans;
                        return _regenerator["default"].wrap(function _callee3$(_context3) {
                          while (1) switch (_context3.prev = _context3.next) {
                            case 0:
                              _ref21 = (0, _slicedToArray2["default"])(_ref19, 2), parentName = _ref21[0], key = _ref21[1];
                              expectedParentSet = new Set([]);
                              records.forEach(function (record) {
                                var id = record._getRaw(key);
                                if (id !== null && !shouldSkipParent({
                                  tableName: name,
                                  parentTableName: parentName,
                                  relationKey: key,
                                  record: record._raw
                                })) {
                                  expectedParentSet.add(id);
                                }
                              });
                              expectedParents = (0, _toConsumableArray2["default"])(expectedParentSet);
                              _context3.next = 6;
                              return db.collections
                              // $FlowFixMe
                              .get(parentName)
                              // $FlowFixMe
                              .query(Q.where((0, _Schema.columnName)('id'), Q.oneOf(expectedParents))).fetch();
                            case 6:
                              parentsFound = _context3.sent;
                              log();
                              log("Found ".concat(parentsFound.length, " parent `").concat(parentName, "` (via `").concat(name, ".").concat(key, "`)"));
                              allowedOprhans = [];
                              if (!(parentsFound.length !== expectedParents.length)) {
                                _context3.next = 19;
                                break;
                              }
                              foundParentSet = new Set(parentsFound.map(function (record) {
                                return record.id;
                              }));
                              orphans = [];
                              _context3.next = 15;
                              return (0, _forEachAsync["default"])(records, /*#__PURE__*/function () {
                                var _ref22 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(record) {
                                  var parentId;
                                  return _regenerator["default"].wrap(function _callee2$(_context2) {
                                    while (1) switch (_context2.prev = _context2.next) {
                                      case 0:
                                        parentId = record._getRaw(key);
                                        if (!(parentId === null || foundParentSet.has(parentId) || shouldSkipParent({
                                          tableName: name,
                                          parentTableName: parentName,
                                          relationKey: key,
                                          record: record._raw
                                        }))) {
                                          _context2.next = 4;
                                          break;
                                        }
                                        _context2.next = 11;
                                        break;
                                      case 4:
                                        _context2.next = 6;
                                        return isOrphanAllowed({
                                          tableName: name,
                                          parentTableName: parentName,
                                          relationKey: key,
                                          record: record._raw
                                        });
                                      case 6:
                                        if (!_context2.sent) {
                                          _context2.next = 10;
                                          break;
                                        }
                                        allowedOprhans.push(record);
                                        _context2.next = 11;
                                        break;
                                      case 10:
                                        orphans.push(record);
                                      case 11:
                                      case "end":
                                        return _context2.stop();
                                    }
                                  }, _callee2);
                                }));
                                return function (_x5) {
                                  return _ref22.apply(this, arguments);
                                };
                              }());
                            case 15:
                              if (orphans.length) {
                                collectionOrphanCount += orphans.length;
                                log("\u274C Error! ".concat(expectedParents.length - parentsFound.length, " missing parent `").concat(parentName, "` across ").concat(orphans.length, " orphans:"));
                                orphans.forEach(function (orphan) {
                                  log();
                                  log("MISSING PARENT `".concat(parentName, ".").concat(orphan._getRaw(key), " (via ").concat(key, ")`:"));
                                  log();
                                  log('```');
                                  log("".concat(JSON.stringify((0, _censorRaw["default"])(orphan._raw), null, '  ')));
                                  log('```');
                                });
                              }
                              _context3.next = 18;
                              return yieldLog();
                            case 18:
                              if (allowedOprhans.length) {
                                log("\u2753 Config allowed ".concat(allowedOprhans.length, " orphans for this field"));
                                // log(allowedOprhans.join(','))
                              }
                            case 19:
                              _context3.next = 21;
                              return yieldLog();
                            case 21:
                            case "end":
                              return _context3.stop();
                          }
                        }, _callee3);
                      }));
                      return function (_x4) {
                        return _ref20.apply(this, arguments);
                      };
                    }());
                  case 18:
                    if (!collectionOrphanCount) {
                      // log(`No orphans found in ${name}`)
                    }
                    totalIssueCount += collectionOrphanCount;
                    log();
                  case 21:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4);
            }));
            return function (_x3) {
              return _ref18.apply(this, arguments);
            };
          }());
        case 21:
          log('## Conclusion');
          log();
          if (totalIssueCount) {
            log("\u274C ".concat(totalIssueCount, " issues found"));
          } else {
            log("\u2705 No issues found in this database!");
          }
          log();
          log("Done in ".concat((Date.now() - startTime) / 1000, " s."));
          return _context5.abrupt("return", {
            issueCount: totalIssueCount,
            log: logText
          });
        case 27:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  })));
}