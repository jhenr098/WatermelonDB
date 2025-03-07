"use strict";

exports.__esModule = true;
exports["default"] = toPairs;
// inspired by ramda and rambda
/* eslint-disable */

function toPairs(obj) {
  var pairs = [];
  if (obj) {
    var keys = Object.keys(obj);
    for (var i = 0, len = keys.length; i < len; i++) {
      var prop = keys[i];
      var value = obj[prop];
      if (prop in obj) {
        pairs[i] = [prop, value];
      }
    }
  }
  return pairs;
}