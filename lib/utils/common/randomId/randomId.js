"use strict";

exports.__esModule = true;
exports["default"] = void 0;
/* eslint-disable no-bitwise */
var alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var randomNumbers = new Uint8Array(256);
var cur = 9999999;
function cryptoRandomId() {
  var id = '';
  var len = 0;
  var v = 0;
  while (len < 16) {
    if (cur < 256) {
      v = randomNumbers[cur] >> 2;
      cur++;
      if (v < 62) {
        id += alphabet[v];
        len++;
      }
    } else {
      globalThis.crypto.getRandomValues(randomNumbers);
      cur = 0;
    }
  }
  return id;
}
var isCryptoAvailable = globalThis.crypto && globalThis.crypto.getRandomValues;
var randomId = isCryptoAvailable ? cryptoRandomId : require('./fallback')["default"];
var _default = exports["default"] = randomId;