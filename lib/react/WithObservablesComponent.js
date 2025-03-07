"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _react = require("react");
var _identicalArrays = _interopRequireDefault(require("../utils/fp/identicalArrays"));
var _withObservables = _interopRequireDefault(require("./withObservables"));
var _compose = _interopRequireDefault(require("./compose"));
var _withHooks = _interopRequireDefault(require("./withHooks"));
var WithObservables = function WithObservables(props) {
  var children = props.children;
  return children(props);
};
var enhance = (0, _compose["default"])((0, _withHooks["default"])(function (_ref) {
  var resetOn = _ref.resetOn,
    observables = _ref.observables;
  var triggeringProps = (0, _react.useRef)(resetOn);
  if (!(0, _identicalArrays["default"])(triggeringProps.current, resetOn)) {
    triggeringProps.current = resetOn;
  }
  if (process.env.NODE_ENV !== 'production') {
    var keys = Object.keys(observables);
    if (keys.includes('resetOn') || keys.includes('observables') || keys.includes('children') || keys.includes('__triggeringProps')) {
      throw new Error("Do not use reserved keys in WithObservables's observables props");
    }
  }
  return {
    __triggeringProps: triggeringProps.current
  };
}), (0, _withObservables["default"])(['__triggeringProps'], function (_ref2) {
  var observables = _ref2.observables;
  return observables;
}));
var _default = exports["default"] = enhance(WithObservables);