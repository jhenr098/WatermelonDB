"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var allPromises = function allPromises(action, promises) {
  return Promise.all(promises.map(action));
};
var _default = exports["default"] = allPromises;