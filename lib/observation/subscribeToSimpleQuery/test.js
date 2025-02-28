"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _testModels = require("../../__tests__/testModels");
var _Query = _interopRequireDefault(require("../../Query"));
var Q = _interopRequireWildcard(require("../../QueryDescription"));
var _index = _interopRequireDefault(require("./index"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var makeMock = function makeMock(db, name) {
  return db.write(function () {
    return db.get('mock_tasks').create(function (mock) {
      mock.name = name;
    });
  });
};
describe('subscribeToSimpleQuery', function () {
  it('observes changes correctly', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _mockDatabase, db, m1, m2, query, observer, unsubscribe, m3, m4;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _mockDatabase = (0, _testModels.mockDatabase)(), db = _mockDatabase.db; // insert a few models
          _context2.next = 3;
          return makeMock(db, 'bad_name');
        case 3:
          m1 = _context2.sent;
          _context2.next = 6;
          return makeMock(db, 'foo');
        case 6:
          m2 = _context2.sent;
          // start observing
          query = new _Query["default"](db.collections.get('mock_tasks'), [Q.where('name', 'foo')]);
          observer = jest.fn();
          unsubscribe = (0, _index["default"])(query, observer); // check initial matches
          _context2.next = 12;
          return new Promise(process.nextTick);
        case 12:
          // give time to propagate
          expect(observer).toHaveBeenCalledWith([m2]);

          // make some irrelevant changes (no emission)
          _context2.next = 15;
          return makeMock(db, 'irrelevant');
        case 15:
          m3 = _context2.sent;
          _context2.next = 18;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return m1.update(function (mock) {
                    mock.name = 'still_bad_name';
                  });
                case 2:
                  _context.next = 4;
                  return m1.destroyPermanently();
                case 4:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          })));
        case 18:
          _context2.next = 20;
          return makeMock(db, 'foo');
        case 20:
          m4 = _context2.sent;
          expect(observer).toHaveBeenCalledWith([m2, m4]);

          // change existing record to match
          _context2.next = 24;
          return db.write(function () {
            return m3.update(function (mock) {
              mock.name = 'foo';
            });
          });
        case 24:
          expect(observer).toHaveBeenCalledWith([m2, m4, m3]);

          // change existing record to no longer match
          _context2.next = 27;
          return db.write(function () {
            return m4.update(function (mock) {
              mock.name = 'nope';
            });
          });
        case 27:
          expect(observer).toHaveBeenCalledWith([m2, m3]);

          // change matching record in irrelevant ways (no emission)
          _context2.next = 30;
          return db.write(function () {
            return m3.update();
          });
        case 30:
          _context2.next = 32;
          return db.write(function () {
            return m2.destroyPermanently();
          });
        case 32:
          expect(observer).toHaveBeenCalledWith([m3]);

          // ensure no extra emissions
          unsubscribe();
          expect(observer).toHaveBeenCalledTimes(5);
        case 35:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
});