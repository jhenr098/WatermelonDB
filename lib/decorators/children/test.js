"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));
var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));
var _Schema = require("../../Schema");
var Q = _interopRequireWildcard(require("../../QueryDescription"));
var _Model3 = _interopRequireDefault(require("../../Model"));
var _Database = _interopRequireDefault(require("../../Database"));
var _ = require("..");
var _common = require("../../utils/common");
var _index = _interopRequireDefault(require("./index"));
var _dec, _class, _descriptor, _MockParent, _dec2, _class2, _descriptor2, _MockChild;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var MockParent = (_dec = (0, _index["default"])('mock_child'), _class = (_MockParent = /*#__PURE__*/function (_Model) {
  function MockParent() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Model.call.apply(_Model, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this, "children", _descriptor, _this);
    return _this;
  }
  (0, _inheritsLoose2["default"])(MockParent, _Model);
  return MockParent;
}(_Model3["default"]), _MockParent.table = 'mock_parent', _MockParent.associations = {
  mock_child: {
    type: 'has_many',
    foreignKey: 'parent_id'
  }
}, _MockParent), _descriptor = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "children", [_dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class);
var MockChild = (_dec2 = (0, _.field)('parent_id'), _class2 = (_MockChild = /*#__PURE__*/function (_Model2) {
  function MockChild() {
    var _this2;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    _this2 = _Model2.call.apply(_Model2, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this2, "parentId", _descriptor2, _this2);
    return _this2;
  }
  (0, _inheritsLoose2["default"])(MockChild, _Model2);
  return MockChild;
}(_Model3["default"]), _MockChild.table = 'mock_child', _MockChild.associations = {
  mock_parent: {
    type: 'belongs_to',
    key: 'parent_id'
  }
}, _MockChild), _descriptor2 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "parentId", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class2);
var makeDatabase = function makeDatabase() {
  return new _Database["default"]({
    adapter: {
      schema: (0, _Schema.appSchema)({
        version: 1,
        tables: [(0, _Schema.tableSchema)({
          name: 'mock_parent',
          columns: []
        }), (0, _Schema.tableSchema)({
          name: 'mock_child',
          columns: [{
            name: 'parent_id',
            type: 'string'
          }]
        })]
      })
    },
    modelClasses: [MockParent, MockChild]
  });
};
describe('decorators/children', function () {
  it('fetches children of a model', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var database, parentMock, expectedQuery;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          database = makeDatabase();
          database.adapter.batch = jest.fn();
          _context.next = 4;
          return database.write(function () {
            return database.collections.get('mock_parent').create();
          });
        case 4:
          parentMock = _context.sent;
          expectedQuery = database.collections.get('mock_child').query(Q.where('parent_id', parentMock.id));
          expect(parentMock.children).toEqual(expectedQuery);
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  it('works on arbitrary objects with asModel', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _dec3, _class3, _descriptor3;
    var database, parent, ParentProxy, parentProxy;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          database = makeDatabase();
          database.adapter.batch = jest.fn();
          _context2.next = 4;
          return database.write(function () {
            return database.collections.get('mock_parent').create();
          });
        case 4:
          parent = _context2.sent;
          ParentProxy = (_dec3 = (0, _index["default"])('mock_child'), _class3 = function ParentProxy() {
            this.asModel = parent;
            (0, _initializerDefineProperty2["default"])(this, "children", _descriptor3, this);
          }, _descriptor3 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "children", [_dec3], {
            configurable: true,
            enumerable: true,
            writable: true,
            initializer: null
          }), _class3);
          parentProxy = new ParentProxy();
          expect(parentProxy.children).toEqual(parent.children);
        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  it('throws error if set is attempted', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var database, parent, spy;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          database = makeDatabase();
          database.adapter.batch = jest.fn();
          _context3.next = 4;
          return database.write(function () {
            return database.collections.get('mock_parent').create();
          });
        case 4:
          parent = _context3.sent;
          spy = jest.spyOn(_common.logger, 'error').mockImplementation(function () {});
          parent.children = [];
          expect(spy).toHaveBeenCalledTimes(1);
          spy.mockRestore();
        case 9:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
  it('caches created Query', function () {
    var database = makeDatabase();
    var parent = new MockParent(database.collections.get('mock_parent'), {
      id: 'parent'
    });
    var query1 = parent.children;
    var query2 = parent.children;
    expect(query1).toBe(query2);
  });
});