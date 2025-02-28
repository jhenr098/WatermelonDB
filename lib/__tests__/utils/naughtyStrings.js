"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.littleEndianByteOrderMark = exports["default"] = exports.bigEndianByteOrderMark = void 0;
var _bigListOfNaughtyStrings = _interopRequireDefault(require("big-list-of-naughty-strings"));
var naughtyStrings = _bigListOfNaughtyStrings["default"].slice();
var bigEndianByteOrderMark = exports.bigEndianByteOrderMark = String.fromCharCode('65279'); // 0xFEFF
var littleEndianByteOrderMark = exports.littleEndianByteOrderMark = String.fromCharCode('65534'); // 0xFFFE
var _default = exports["default"] = naughtyStrings;