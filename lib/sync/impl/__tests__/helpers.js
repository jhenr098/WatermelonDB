"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.sorted = exports.prepareCreateFromRaw = exports.makeLocalChanges = exports.makeDatabase = exports.makeChangeSet = exports.getRaw = exports.expectSyncedAndMatches = exports.expectDoesNotExist = exports.emptyPull = exports.emptyLocalChanges = exports.emptyChangeSet = exports.countAll = exports.allIds = exports.allDeletedRecords = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _rambdax = require("rambdax");
var _fp = require("../../../utils/fp");
var _testModels = require("../../../__tests__/testModels");
var _RawRecord = require("../../../RawRecord");
var makeDatabase = exports.makeDatabase = function makeDatabase() {
  return (0, _testModels.mockDatabase)();
};
var countAll = exports.countAll = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(collections) {
    var counts;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _fp.allPromises)(function (collection) {
            return collection.query().fetchCount();
          }, collections);
        case 2:
          counts = _context.sent;
          return _context.abrupt("return", counts.reduce(function (a, b) {
            return a + b;
          }, 0));
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function countAll(_x) {
    return _ref.apply(this, arguments);
  };
}();
var allIds = exports.allIds = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(collections) {
    var ids;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return (0, _fp.allPromises)(/*#__PURE__*/function () {
            var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(collection) {
              var records;
              return _regenerator["default"].wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return collection.query().fetch();
                  case 2:
                    records = _context2.sent;
                    return _context2.abrupt("return", records.map(function (record) {
                      return record.id;
                    }));
                  case 4:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2);
            }));
            return function (_x3) {
              return _ref3.apply(this, arguments);
            };
          }(), collections);
        case 2:
          ids = _context3.sent;
          return _context3.abrupt("return", ids.flatMap(function (x) {
            return x;
          }));
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function allIds(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var allDeletedRecords = exports.allDeletedRecords = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(collections) {
    var deletedRecords;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return (0, _fp.allPromises)(function (collection) {
            return collection.database.adapter.getDeletedRecords(collection.table);
          }, collections);
        case 2:
          deletedRecords = _context4.sent;
          return _context4.abrupt("return", deletedRecords.flatMap(function (records) {
            return records;
          }));
        case 4:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function allDeletedRecords(_x4) {
    return _ref4.apply(this, arguments);
  };
}();
var prepareCreateFromRaw = exports.prepareCreateFromRaw = function prepareCreateFromRaw(collection, dirtyRaw) {
  return collection.prepareCreate(function (record) {
    record._raw = (0, _RawRecord.sanitizedRaw)((0, _extends2["default"])({
      _status: 'synced'
    }, dirtyRaw), record.collection.schema);
  });
};
var getRaw = exports.getRaw = function getRaw(collection, id) {
  return collection.find(id).then(function (record) {
    return record._raw;
  }, function () {
    return null;
  });
};
var expectSyncedAndMatches = exports.expectSyncedAndMatches = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(collection, id, match) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.t0 = expect;
          _context5.next = 3;
          return getRaw(collection, id);
        case 3:
          _context5.t1 = _context5.sent;
          return _context5.abrupt("return", (0, _context5.t0)(_context5.t1).toMatchObject((0, _extends2["default"])({
            _status: 'synced',
            _changed: '',
            id: id
          }, match)));
        case 5:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function expectSyncedAndMatches(_x5, _x6, _x7) {
    return _ref5.apply(this, arguments);
  };
}();
var expectDoesNotExist = exports.expectDoesNotExist = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(collection, id) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.t0 = expect;
          _context6.next = 3;
          return getRaw(collection, id);
        case 3:
          _context6.t1 = _context6.sent;
          return _context6.abrupt("return", (0, _context6.t0)(_context6.t1).toBe(null));
        case 5:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function expectDoesNotExist(_x8, _x9) {
    return _ref6.apply(this, arguments);
  };
}();
var emptyChangeSet = exports.emptyChangeSet = Object.freeze({
  mock_projects: {
    created: [],
    updated: [],
    deleted: []
  },
  mock_project_sections: {
    created: [],
    updated: [],
    deleted: []
  },
  mock_tasks: {
    created: [],
    updated: [],
    deleted: []
  },
  mock_comments: {
    created: [],
    updated: [],
    deleted: []
  }
});
var emptyLocalChanges = exports.emptyLocalChanges = Object.freeze({
  changes: emptyChangeSet,
  affectedRecords: []
});
var makeChangeSet = exports.makeChangeSet = function makeChangeSet(set) {
  return (0, _rambdax.change)(emptyChangeSet, '', set);
};
var sorted = exports.sorted = function sorted(models) {
  var copy = models.slice();
  copy.sort(function (a, b) {
    if (a.id < b.id) {
      return -1;
    } else if (a.id > b.id) {
      return 1;
    }
    return 0;
  });
  return copy;
};
var makeLocalChanges = exports.makeLocalChanges = function makeLocalChanges(database) {
  return database.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    var projects, tasks, comments, created, timestamps, records;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          projects = database.get('mock_projects');
          tasks = database.get('mock_tasks');
          comments = database.get('mock_comments'); // create records
          created = function created(obj) {
            return (0, _extends2["default"])({
              _status: 'created'
            }, obj);
          };
          timestamps = {
            created_at: 1000,
            updated_at: 2000
          };
          records = {
            pSynced: prepareCreateFromRaw(projects, {
              id: 'pSynced'
            }),
            pCreated1: prepareCreateFromRaw(projects, created({
              id: 'pCreated1'
            })),
            pCreated2: prepareCreateFromRaw(projects, created({
              id: 'pCreated2'
            })),
            pUpdated: prepareCreateFromRaw(projects, {
              id: 'pUpdated'
            }),
            pDeleted: prepareCreateFromRaw(projects, {
              id: 'pDeleted'
            }),
            tSynced: prepareCreateFromRaw(tasks, {
              id: 'tSynced'
            }),
            tCreated: prepareCreateFromRaw(tasks, created({
              id: 'tCreated'
            })),
            tUpdated: prepareCreateFromRaw(tasks, {
              id: 'tUpdated',
              name: 'orig',
              description: 'orig',
              project_id: 'orig'
            }),
            tDeleted: prepareCreateFromRaw(tasks, {
              id: 'tDeleted'
            }),
            cSynced: prepareCreateFromRaw(comments, (0, _extends2["default"])({
              id: 'cSynced'
            }, timestamps)),
            cCreated: prepareCreateFromRaw(comments, created((0, _extends2["default"])({
              id: 'cCreated'
            }, timestamps))),
            cUpdated: prepareCreateFromRaw(comments, (0, _extends2["default"])({
              id: 'cUpdated'
            }, timestamps)),
            cDeleted: prepareCreateFromRaw(comments, (0, _extends2["default"])({
              id: 'cDeleted'
            }, timestamps)),
            cDestroyed: prepareCreateFromRaw(comments, {
              id: 'cDestroyed'
            })
          };
          _context7.next = 8;
          return database.batch.apply(database, (0, _toConsumableArray2["default"])(Object.values(records)));
        case 8:
          _context7.next = 10;
          return records.pUpdated.update(function (p) {
            p.name = 'local';
          });
        case 10:
          _context7.next = 12;
          return records.tUpdated.update(function (p) {
            p.name = 'local';
            p.position = 100;
          });
        case 12:
          _context7.next = 14;
          return records.cUpdated.update(function (c) {
            c.body = 'local';
          });
        case 14:
          _context7.next = 16;
          return records.tDeleted.update(function (t) {
            t.name = 'local';
          });
        case 16:
          _context7.next = 18;
          return records.pDeleted.markAsDeleted();
        case 18:
          _context7.next = 20;
          return records.tDeleted.markAsDeleted();
        case 20:
          _context7.next = 22;
          return records.cDeleted.markAsDeleted();
        case 22:
          _context7.next = 24;
          return records.cDestroyed.destroyPermanently();
        case 24:
          return _context7.abrupt("return", records);
        case 25:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  })));
};
var emptyPull = exports.emptyPull = function emptyPull() {
  var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1500;
  return /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8() {
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          return _context8.abrupt("return", {
            changes: emptyChangeSet,
            timestamp: timestamp
          });
        case 1:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
};