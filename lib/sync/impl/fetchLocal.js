"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
exports.__esModule = true;
exports["default"] = fetchLocalChanges;
exports.hasUnsyncedChanges = hasUnsyncedChanges;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _fp = require("../../utils/fp");
var _allPromisesObj = _interopRequireDefault(require("../../utils/fp/allPromisesObj"));
var Q = _interopRequireWildcard(require("../../QueryDescription"));
var _Schema = require("../../Schema");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
// NOTE: Two separate queries are faster than notEq(synced) on LokiJS
var createdQuery = Q.where((0, _Schema.columnName)('_status'), 'created');
var updatedQuery = Q.where((0, _Schema.columnName)('_status'), 'updated');
function fetchLocalChangesForCollection(_x) {
  return _fetchLocalChangesForCollection.apply(this, arguments);
}
function _fetchLocalChangesForCollection() {
  _fetchLocalChangesForCollection = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(collection) {
    var _yield$Promise$all, _yield$Promise$all2, createdRecords, updatedRecords, deletedRecords, changeSet, changedRecords;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return Promise.all([collection.query(createdQuery).fetch(), collection.query(updatedQuery).fetch(), collection.database.adapter.getDeletedRecords(collection.table)]);
        case 2:
          _yield$Promise$all = _context4.sent;
          _yield$Promise$all2 = (0, _slicedToArray2["default"])(_yield$Promise$all, 3);
          createdRecords = _yield$Promise$all2[0];
          updatedRecords = _yield$Promise$all2[1];
          deletedRecords = _yield$Promise$all2[2];
          changeSet = {
            created: [],
            updated: [],
            deleted: deletedRecords
          }; // TODO: It would be best to omit _status, _changed fields, since they're not necessary for the server
          // but this complicates markLocalChangesAsDone, since we don't have the exact copy to compare if record changed
          // TODO: It would probably also be good to only send to server locally changed fields, not full records
          // perf-critical - using mutation
          createdRecords.forEach(function (record) {
            // $FlowFixMe
            changeSet.created.push(Object.assign({}, record._raw));
          });
          updatedRecords.forEach(function (record) {
            // $FlowFixMe
            changeSet.updated.push(Object.assign({}, record._raw));
          });
          changedRecords = createdRecords.concat(updatedRecords);
          return _context4.abrupt("return", [changeSet, changedRecords]);
        case 12:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _fetchLocalChangesForCollection.apply(this, arguments);
}
function fetchLocalChanges(db) {
  return db.read(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var changes;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _allPromisesObj["default"])((0, _fp.mapObj)(fetchLocalChangesForCollection, db.collections.map));
        case 2:
          changes = _context.sent;
          return _context.abrupt("return", {
            // $FlowFixMe
            changes: (0, _fp.mapObj)(function (_ref2) {
              var _ref3 = (0, _slicedToArray2["default"])(_ref2, 1),
                changeSet = _ref3[0];
              return changeSet;
            })(changes),
            affectedRecords: (0, _fp.unnest)((0, _fp.values)(changes).map(function (_ref4) {
              var _ref5 = (0, _slicedToArray2["default"])(_ref4, 2),
                records = _ref5[1];
              return records;
            }))
          });
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })), 'sync-fetchLocalChanges');
}
function hasUnsyncedChanges(db) {
  // action is necessary to ensure other code doesn't make changes under our nose
  return db.read(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var collections, hasUnsynced, unsyncedFlags;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          // $FlowFixMe
          collections = (0, _fp.values)(db.collections.map);
          hasUnsynced = /*#__PURE__*/function () {
            var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(collection) {
              var created, updated, deleted;
              return _regenerator["default"].wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return collection.query(createdQuery).fetchCount();
                  case 2:
                    created = _context2.sent;
                    _context2.next = 5;
                    return collection.query(updatedQuery).fetchCount();
                  case 5:
                    updated = _context2.sent;
                    _context2.next = 8;
                    return db.adapter.getDeletedRecords(collection.table);
                  case 8:
                    deleted = _context2.sent;
                    return _context2.abrupt("return", created + updated + deleted.length > 0);
                  case 10:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2);
            }));
            return function hasUnsynced(_x2) {
              return _ref7.apply(this, arguments);
            };
          }(); // $FlowFixMe
          _context3.next = 4;
          return (0, _fp.allPromises)(hasUnsynced, collections);
        case 4:
          unsyncedFlags = _context3.sent;
          return _context3.abrupt("return", unsyncedFlags.some(_fp.identity));
        case 6:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })), 'sync-hasUnsyncedChanges');
}