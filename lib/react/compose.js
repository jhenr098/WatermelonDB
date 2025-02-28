"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var compose = function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }
  return function (Component) {
    var enhance = funcs.reduce(function (a, b) {
      return function () {
        return a(b.apply(void 0, arguments));
      };
    }, function (arg) {
      return arg;
    });
    var EnhancedComponent = enhance(Component);
    EnhancedComponent.displayName = "".concat(Component.name, ".Enhanced");
    return EnhancedComponent;
  };
};
var _default = exports["default"] = compose;