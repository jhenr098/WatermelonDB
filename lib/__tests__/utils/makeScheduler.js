"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = makeScheduler;
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _testing = require("rxjs/testing");
// eslint-disable-next-line
var WatermelonTestScheduler = /*#__PURE__*/function (_TestScheduler) {
  function WatermelonTestScheduler() {
    return _TestScheduler.apply(this, arguments) || this;
  }
  (0, _inheritsLoose2["default"])(WatermelonTestScheduler, _TestScheduler);
  var _proto = WatermelonTestScheduler.prototype;
  _proto.cold = function cold(marbles, values, error) {
    return this.createColdObservable(marbles, values, error);
  };
  _proto.hot = function hot(marbles, values, error) {
    return this.createHotObservable(marbles, values, error);
  };
  return WatermelonTestScheduler;
}(_testing.TestScheduler);
function makeScheduler() {
  return new WatermelonTestScheduler(function (actual, expected) {
    expect(actual).toEqual(expected);
  });
}