"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = exports.Provider = exports.DatabaseConsumer = void 0;
var _react = _interopRequireDefault(require("react"));
var DatabaseContext = /*#__PURE__*/_react["default"].createContext(undefined);
var Provider = exports.Provider = DatabaseContext.Provider,
  Consumer = exports.DatabaseConsumer = DatabaseContext.Consumer;
var _default = exports["default"] = DatabaseContext;