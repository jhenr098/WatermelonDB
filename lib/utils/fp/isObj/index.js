"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = isObj;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
function isObj(maybeObject) {
  return maybeObject !== null && (0, _typeof2["default"])(maybeObject) === 'object' && !Array.isArray(maybeObject);
}