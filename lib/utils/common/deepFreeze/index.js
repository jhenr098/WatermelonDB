"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = deepFreeze;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _invariant = _interopRequireDefault(require("../invariant"));
// Deep-freezes an object, but DOES NOT handle cycles
function deepFreeze(object) {
  (0, _invariant["default"])(object && (0, _typeof2["default"])(object) === 'object', 'Invalid attempt to deepFreeze not-an-Object');
  Object.getOwnPropertyNames(object).forEach(function (name) {
    var value = object[name];
    if (value && (0, _typeof2["default"])(value) === 'object') {
      deepFreeze(value);
    }
  });
  return Object.freeze(object);
}