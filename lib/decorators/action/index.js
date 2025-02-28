"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.reader = reader;
exports.writer = writer;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
// Wraps function calls in `database.write(() => { ... })`. See docs for more details
// You can use this on Model subclass methods (or methods of any object that has a `database` property)
function writer(target, key, descriptor) {
  var actionName = "".concat(target.table || target.constructor.name, ".").concat(key);
  return (0, _extends2["default"])({}, descriptor, {
    value: function value() {
      var _this = this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      // $FlowFixMe
      return this.database.write(function () {
        return descriptor.value.apply(_this, args);
      }, actionName);
    }
  });
}

// Wraps function calls in `database.read(() => { ... })`. See docs for more details
// You can use this on Model subclass methods (or methods of any object that has a `database` property)
function reader(target, key, descriptor) {
  var actionName = "".concat(target.table || target.constructor.name, ".").concat(key);
  return (0, _extends2["default"])({}, descriptor, {
    value: function value() {
      var _this2 = this;
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      // $FlowFixMe
      return this.database.read(function () {
        return descriptor.value.apply(_this2, args);
      }, actionName);
    }
  });
}