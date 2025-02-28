"use strict";

exports.__esModule = true;
exports["default"] = void 0;
function pipe() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }
  var fnsLen = fns.length;
  return function () {
    var result;
    if (fnsLen) {
      result = fns[0].apply(fns, arguments);
      for (var i = 1; i < fnsLen; i++) {
        result = fns[i](result);
      }
    }
    return result;
  };
}
var _default = exports["default"] = pipe;