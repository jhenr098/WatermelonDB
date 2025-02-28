"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
var _index = _interopRequireWildcard(require("./index"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
describe('randomId', function () {
  it('generates a random string', function () {
    var id1 = (0, _index["default"])();
    expect(id1.length).toBe(16);
    var id2 = (0, _index["default"])();
    expect(id2).not.toBe(id1);
  });
  it('always generates a valid id', function () {
    var alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 0; i < 250; i += 1) {
      var id = (0, _index["default"])();
      expect(id.length).toBe(16);
      expect(id.split('').every(function (_char) {
        return alphabet.includes(_char);
      })).toBe(true);
    }
  });
  it('allows to override the generator function', function () {
    var generator = function generator() {
      return new Date().getTime().toString().substr(1, 4);
    };
    (0, _index.setGenerator)(generator);
    expect((0, _index["default"])().length).toBe(4);
    var invalidGenerator = function invalidGenerator() {
      return 5;
    };
    expect(function () {
      return (0, _index.setGenerator)(invalidGenerator);
    }).toThrow();
  });
});