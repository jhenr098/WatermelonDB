"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _excluded = ["results"];
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/first */

process.env.NODE_ENV = 'test';
// Mysteriously fixes React Native stacktrace symbolication ¯\_(ツ)_/¯
if (typeof global.self === 'undefined') {
  global.self = global;
}

// NOTE: Set to `true` to run src/__playground__/index.js
// WARN: DO NOT commit this change!
var openPlayground = false;
if (openPlayground) {
  // eslint-disable-next-line react/function-component-definition
  var PlaygroundPlaceholder = function PlaygroundPlaceholder() {
    return /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
      style: {
        paddingTop: 100
      }
    }, "Playground is running");
  };
  _reactNative.AppRegistry.registerComponent('watermelonTest', function () {
    return PlaygroundPlaceholder;
  });
  require('./__playground__');
} else {
  // eslint-disable-next-line react/function-component-definition
  var TestRoot = function TestRoot() {
    require('./__tests__/setUpIntegrationTestEnv');
    var _React$useState = _react["default"].useState('testing'),
      _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
      status = _React$useState2[0],
      setStatus = _React$useState2[1];
    var Tester = require('cavy/src/Tester')["default"];
    var TestHookStore = require('cavy/src/TestHookStore')["default"];
    var integrationTests = require('./__tests__/integrationTests')["default"];
    var _React$useRef = _react["default"].useRef(new TestHookStore()),
      testHookStore = _React$useRef.current;
    var sendReport = function sendReport(report) {
      // eslint-disable-next-line
      console.log('Done:');
      var results = report.results,
        rest = (0, _objectWithoutProperties2["default"])(report, _excluded);
      // eslint-disable-next-line
      console.log(rest);
      // eslint-disable-next-line
      results.forEach(function (result) {
        return console.log(result);
      });
      // FIXME: Add test runner on windows
      if (_reactNative.Platform.OS !== 'windows') {
        _reactNative.NativeModules.BridgeTestReporter.testsFinished(report);
      }
      setStatus(report.errorCount ? 'error' : 'done');
    };
    return /*#__PURE__*/_react["default"].createElement(Tester, {
      specs: integrationTests,
      store: testHookStore
      // start delay allows initial render to occur while running JSI (blocking) tests
      ,
      startDelay: 500,
      waitTime: 4000,
      sendReport: true,
      customReporter: sendReport
    }, /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
      testID: "WatermelonTesterContent"
    }, /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
      style: {
        paddingTop: 100
      }
    }, "Watermelon tester!"), /*#__PURE__*/_react["default"].createElement(_reactNative.Text, null, "Using hermes? ", global.HermesInternal ? 'YES' : 'NO'), status === 'testing' ? /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
      testID: "WatermelonTesterStatus",
      style: {
        fontSize: 30
      }
    }, "The tests are running. Please remain calm.") : null, status === 'done' ? /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
      testID: "WatermelonTesterStatus",
      style: {
        fontSize: 30,
        color: 'green'
      }
    }, "Done") : null, status === 'error' ? /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
      testID: "WatermelonTesterStatus",
      style: {
        fontSize: 30,
        color: 'red'
      }
    }, "Error") : null));
  };
  _reactNative.AppRegistry.registerComponent(
  // FIXME: Should be consistent; find RNW API to change module name or rename RNW project
  _reactNative.Platform.OS === 'windows' ? 'WatermelonTester' : 'watermelonTest', function () {
    return TestRoot;
  });
}