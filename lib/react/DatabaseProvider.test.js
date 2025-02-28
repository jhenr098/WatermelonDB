"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _react = _interopRequireDefault(require("react"));
var TestRenderer = _interopRequireWildcard(require("react-test-renderer"));
var _Database = _interopRequireDefault(require("../Database"));
var _testModels = require("../__tests__/testModels");
var _DatabaseProvider = _interopRequireDefault(require("./DatabaseProvider"));
var _DatabaseContext = require("./DatabaseContext");
var _withDatabase = _interopRequireDefault(require("./withDatabase"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
// Simple mock component
function MockComponent() {
  return /*#__PURE__*/_react["default"].createElement("span", null);
}
describe('DatabaseProvider', function () {
  var database;
  beforeAll(function () {
    database = (0, _testModels.mockDatabase)().db;
  });
  it('throws if no database or adapter supplied', function () {
    expect(function () {
      TestRenderer.create(/*#__PURE__*/_react["default"].createElement(_DatabaseProvider["default"], null, /*#__PURE__*/_react["default"].createElement("p", null)));
    }).toThrow(/You must supply a valid database/i);
    expect(function () {
      TestRenderer.create(/*#__PURE__*/_react["default"].createElement(_DatabaseProvider["default"], {
        database: {
          fake: 'db'
        }
      }, /*#__PURE__*/_react["default"].createElement("p", null)));
    }).toThrow(/You must supply a valid database/i);
  });
  it('passes database to consumer', function () {
    var instance = TestRenderer.create(/*#__PURE__*/_react["default"].createElement(_DatabaseProvider["default"], {
      database: database
    }, /*#__PURE__*/_react["default"].createElement(_DatabaseContext.DatabaseConsumer, null, function (db) {
      return /*#__PURE__*/_react["default"].createElement(MockComponent, {
        database: db
      });
    })));
    var component = instance.root.find(MockComponent);
    expect(component.props.database).toBeInstanceOf(_Database["default"]);
  });
  describe('withDatabase', function () {
    test('should pass the database from the context to the consumer', function () {
      var Child = (0, _withDatabase["default"])(MockComponent);
      var instance = TestRenderer.create(/*#__PURE__*/_react["default"].createElement(_DatabaseProvider["default"], {
        database: database
      }, /*#__PURE__*/_react["default"].createElement(Child, null)));
      var component = instance.root.find(MockComponent);
      expect(component.props.database).toBeInstanceOf(_Database["default"]);
    });
  });
});