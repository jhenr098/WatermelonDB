"use strict";

exports.__esModule = true;
exports["default"] = splitEvery;
function splitEvery(n, list) {
  var splitted = [];
  var position = 0;
  var length = list.length;
  while (position < length) {
    splitted.push(list.slice(position, position += n));
  }
  return splitted;
}