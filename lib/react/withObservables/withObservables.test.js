"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var React = _interopRequireWildcard(require("react"));
var _index = _interopRequireDefault(require("./index"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
describe('withObservables', function () {
  it('should hoist non react statics', function () {
    var A = /*#__PURE__*/function (_React$PureComponent) {
      function A() {
        return _React$PureComponent.apply(this, arguments) || this;
      }
      (0, _inheritsLoose2["default"])(A, _React$PureComponent);
      var _proto = A.prototype;
      _proto.render = function render() {
        return null;
      };
      return A;
    }(React.PureComponent);
    A.nonReactProp = 'temp_string';
    var getObservables = function getObservables() {};
    var WrappedComponent = (0, _index["default"])([], getObservables)(A);
    expect(WrappedComponent.nonReactProp).toBe(A.nonReactProp);
  });
});