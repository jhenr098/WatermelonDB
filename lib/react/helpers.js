"use strict";

exports.__esModule = true;
exports._setCreateFactory = _setCreateFactory;
exports.createFactory = createFactory;
var _react = require("react");
var _createFactory = function _createFactory(Component) {
  // eslint-disable-next-line react/function-component-definition, react/display-name
  return function (props) {
    return /*#__PURE__*/(0, _react.createElement)(Component, props);
  };
};

// undocumented binding for NT perf hack
function _setCreateFactory(newCreateFactory) {
  _createFactory = newCreateFactory;
}
function createFactory(Component) {
  return _createFactory(Component);
}