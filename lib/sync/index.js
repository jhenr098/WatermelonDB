"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.hasUnsyncedChanges = hasUnsyncedChanges;
exports.synchronize = synchronize;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
// TODO: JSDoc'ify this
/**
 * Synchronizes database with a remote server
 *
 * See docs for more details
 */
function synchronize(_x) {
  return _synchronize.apply(this, arguments);
}
/**
 * Returns `true` if database has any unsynced changes.
 *
 * Use this to check if you can safely log out (delete the database)
 */
function _synchronize() {
  _synchronize = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(args) {
    var synchronizeImpl;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          synchronizeImpl = require('./impl/synchronize')["default"];
          _context.next = 4;
          return synchronizeImpl(args);
        case 4:
          _context.next = 10;
          break;
        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          args.log && (args.log.error = _context.t0);
          throw _context.t0;
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 6]]);
  }));
  return _synchronize.apply(this, arguments);
}
function hasUnsyncedChanges(_ref) {
  var database = _ref.database;
  return require('./impl').hasUnsyncedChanges(database);
}