"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = debugPrintChanges;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _toPairs = _interopRequireDefault(require("../../utils/fp/toPairs"));
var _isRN = _interopRequireDefault(require("../../utils/common/isRN"));
/* eslint-disable no-console */
if (process.env.NODE_ENV === 'production') {
  throw new Error('debugPrintChanges() MUST NOT BE USED IN PRODUCTION!');
}
if (!_isRN["default"]) {
  console.log('%c debugPrintChanges() is enabled!', "font-size: 40px; background: red; color: white; font-weight: bold");
}
console.warn('WARNING: DO NOT commit import of @nozbe/watermelondb/sync/debugPrintChanges!');
function debugPrintChanges(changes, isPush) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  var pushPullColor = isPush ? 'red' : 'blue';
  if (_isRN["default"]) {
    console.log('========================================================================');
    console.log('##                                                                    ##');
    isPush && console.log('##                         PUSHING CHANGES                            ##');
    !isPush && console.log('##                             PULLING                                ##');
    console.log('##                                                                    ##');
    console.log('========================================================================');
  } else {
    console.log("%c --- ".concat(isPush ? 'PUSHING CHANGES' : 'PULLING', " --- "), "font-size: 40px; background: #eee; color: ".concat(pushPullColor, "; font-weight: bold"));
  }
  (0, _toPairs["default"])(changes).forEach(function (_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
      table = _ref2[0],
      tableChanges = _ref2[1];
    (0, _toPairs["default"])(tableChanges).forEach(function (_ref3) {
      var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
        changeType = _ref4[0],
        records = _ref4[1];
      if (records.length) {
        var typeToColor = {
          created: '#22cc33',
          updated: 'orange',
          deleted: 'red'
        };
        if (_isRN["default"]) {
          console.log("| ".concat(isPush ? 'pushing!' : 'PULL', " | ").concat(table, " | ").concat(changeType, " |"));
          console.log('________________________________________________________________________');
        } else {
          console.log("%c ".concat(isPush ? 'pushing!' : 'PULL', " %c ").concat(table, " %c ").concat(changeType, " "), "font-size: 20px; background: #eee; color: ".concat(pushPullColor, "; font-weight: bold"), 'font-size: 20px; background: black; color: white', "font-size: 20px; background: ".concat(typeToColor[changeType], "; color: white"));
        }
        console.table(records);
      }
    });
  });
  if (_isRN["default"]) {
    console.log('============================');
    console.log('##                        ##');
    console.log('##          DONE          ##');
    console.log('##                        ##');
    console.log('============================');
  } else {
    console.log('%c done ', "font-size: 20px; background: #eee; color: ".concat(pushPullColor, "; font-weight: bold"));
  }
}