"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _Database = _interopRequireDefault(require("../Database"));
var _DatabaseContext = require("./DatabaseContext");
/**
 * Database provider to create the database context
 * to allow child components to consume the database without prop drilling
 */
function DatabaseProvider(_ref) {
  var children = _ref.children,
    database = _ref.database;
  if (!(database instanceof _Database["default"])) {
    throw new Error('You must supply a valid database prop to the DatabaseProvider');
  }
  return /*#__PURE__*/_react["default"].createElement(_DatabaseContext.Provider, {
    value: database
  }, children);
}
var _default = exports["default"] = DatabaseProvider;