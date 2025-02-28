"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _react = _interopRequireDefault(require("react"));
var TestRenderer = _interopRequireWildcard(require("react-test-renderer"));
var _reactHooks = require("@testing-library/react-hooks");
var _useDatabase = _interopRequireDefault(require("./useDatabase"));
var _DatabaseProvider = _interopRequireDefault(require("./DatabaseProvider"));
var _Database = _interopRequireDefault(require("../Database"));
var _testModels = require("../__tests__/testModels");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
// Note: this uses two testing libraries; react-test-renderer and @testing-library/react-hooks.
// This is probably overkill for such a simple hook but I will leave these here in case more
// hooks are added in the future.

describe('useDatabase hook', function () {
  var database;
  beforeAll(function () {
    database = (0, _testModels.mockDatabase)().db;
  });
  test('should use database', function () {
    var wrapper = function wrapper(_ref) {
      var children = _ref.children;
      return /*#__PURE__*/_react["default"].createElement(_DatabaseProvider["default"], {
        database: database
      }, children);
    };
    var _renderHook = (0, _reactHooks.renderHook)(function () {
        return (0, _useDatabase["default"])();
      }, {
        wrapper: wrapper
      }),
      result = _renderHook.result;
    expect(result.current).toBeInstanceOf(_Database["default"]);
  });
  test('should throw without Provider', function () {
    var Component = function Component() {
      (0, _useDatabase["default"])();
    };
    expect(function () {
      TestRenderer.create(/*#__PURE__*/_react["default"].createElement(Component, null));
    }).toThrow(/Could not find database context, please make sure the component is wrapped in the <DatabaseProvider>/i);
  });
});