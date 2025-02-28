"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));
/* eslint-disable no-console */
var formatMessages = function formatMessages(messages) {
  var _messages = (0, _toArray2["default"])(messages),
    first = _messages[0],
    other = _messages.slice(1);
  return [typeof first === 'string' ? "[\uD83C\uDF49] ".concat(first) : first].concat((0, _toConsumableArray2["default"])(other));
};
var Logger = /*#__PURE__*/function () {
  function Logger() {
    this.silent = false;
  }
  var _proto = Logger.prototype;
  _proto.debug = function debug() {
    var _console;
    for (var _len = arguments.length, messages = new Array(_len), _key = 0; _key < _len; _key++) {
      messages[_key] = arguments[_key];
    }
    !this.silent && (_console = console).debug.apply(_console, (0, _toConsumableArray2["default"])(formatMessages(messages)));
  };
  _proto.log = function log() {
    var _console2;
    for (var _len2 = arguments.length, messages = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      messages[_key2] = arguments[_key2];
    }
    !this.silent && (_console2 = console).log.apply(_console2, (0, _toConsumableArray2["default"])(formatMessages(messages)));
  };
  _proto.warn = function warn() {
    var _console3;
    for (var _len3 = arguments.length, messages = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      messages[_key3] = arguments[_key3];
    }
    !this.silent && (_console3 = console).warn.apply(_console3, (0, _toConsumableArray2["default"])(formatMessages(messages)));
  };
  _proto.error = function error() {
    var _console4;
    for (var _len4 = arguments.length, messages = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      messages[_key4] = arguments[_key4];
    }
    !this.silent && (_console4 = console).error.apply(_console4, (0, _toConsumableArray2["default"])(formatMessages(messages)));
  };
  _proto.silence = function silence() {
    this.silent = true;
  };
  return Logger;
}();
var _default = exports["default"] = new Logger();