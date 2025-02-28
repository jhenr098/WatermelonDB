"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
exports.__esModule = true;
exports.createTimestampsFor = void 0;
exports.fetchDescendants = fetchDescendants;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _fp = require("../utils/fp");
var Q = _interopRequireWildcard(require("../QueryDescription"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var createTimestampsFor = exports.createTimestampsFor = function createTimestampsFor(model) {
  var date = Date.now();
  var timestamps = {};
  if ('createdAt' in model) {
    timestamps.created_at = date;
  }
  if ('updatedAt' in model) {
    timestamps.updated_at = date;
  }
  return timestamps;
};
function getChildrenQueries(model) {
  var associationsList = Object.entries(model.constructor.associations);
  var hasManyAssociations = associationsList.filter(function (_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
      value = _ref2[1];
    return value.type === 'has_many';
  });
  var childrenQueries = hasManyAssociations.map(function (_ref3) {
    var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
      key = _ref4[0],
      value = _ref4[1];
    var childCollection = model.collections.get(key);
    return childCollection.query(Q.where(value.foreignKey, model.id));
  });
  return childrenQueries;
}
function fetchDescendantsInner(_x) {
  return _fetchDescendantsInner.apply(this, arguments);
}
function _fetchDescendantsInner() {
  _fetchDescendantsInner = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(model) {
    var childPromise, childrenQueries, results;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          childPromise = /*#__PURE__*/function () {
            var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(query) {
              var children, grandchildren;
              return _regenerator["default"].wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return query.fetch();
                  case 2:
                    children = _context.sent;
                    _context.next = 5;
                    return (0, _fp.allPromises)(fetchDescendantsInner, children);
                  case 5:
                    grandchildren = _context.sent;
                    return _context.abrupt("return", (0, _fp.unnest)(grandchildren).concat(children));
                  case 7:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function childPromise(_x3) {
              return _ref5.apply(this, arguments);
            };
          }();
          childrenQueries = getChildrenQueries(model);
          _context2.next = 4;
          return (0, _fp.allPromises)(childPromise, childrenQueries);
        case 4:
          results = _context2.sent;
          return _context2.abrupt("return", (0, _fp.unnest)(results));
        case 6:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _fetchDescendantsInner.apply(this, arguments);
}
function fetchDescendants(_x2) {
  return _fetchDescendants.apply(this, arguments);
}
function _fetchDescendants() {
  _fetchDescendants = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(model) {
    var descendants;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return fetchDescendantsInner(model);
        case 2:
          descendants = _context3.sent;
          return _context3.abrupt("return", Array.from(new Set(descendants)));
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _fetchDescendants.apply(this, arguments);
}