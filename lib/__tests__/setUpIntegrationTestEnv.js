"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _watermelondb_expect = _interopRequireDefault(require("@nozbe/watermelondb_expect"));
global.Buffer = function FakeBuffer() {};
if (!global.process) {
  global.process = {};
}
if (!global.process.version) {
  // $FlowFixMe
  global.process.version = 'bla';
}
global.expect = _watermelondb_expect["default"];