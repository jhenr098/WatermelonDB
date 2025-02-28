"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var arrayDifference = function arrayDifference(previousList, nextList) {
  var previous = new Set(previousList);
  var next = new Set(nextList);
  var added = [];
  var removed = [];
  var item;
  for (var i = 0, len = previousList.length; i < len; i++) {
    item = previousList[i];
    if (!next.has(item)) {
      removed.push(item);
    }
  }
  for (var _i2 = 0, _len2 = nextList.length; _i2 < _len2; _i2++) {
    item = nextList[_i2];
    if (!previous.has(item)) {
      added.push(item);
    }
  }
  return {
    added: added,
    removed: removed
  };
};
var _default = exports["default"] = arrayDifference;