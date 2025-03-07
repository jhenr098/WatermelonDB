"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = cloneMessage;
exports.shallowCloneDeepObjects = shallowCloneDeepObjects;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
// shallow-clones objects (without checking their contents), but copies arrays
function shallowCloneDeepObjects(value) {
  if (Array.isArray(value)) {
    var returned = new Array(value.length);
    for (var i = 0, len = value.length; i < len; i += 1) {
      returned[i] = shallowCloneDeepObjects(value[i]);
    }
    return returned;
  } else if (value && (0, _typeof2["default"])(value) === 'object') {
    return Object.assign({}, value);
  }
  return value;
}
function cloneMessage(data) {
  // TODO: Even better, it would be great if we had zero-copy architecture (COW RawRecords?) and we didn't have to clone
  var method = data.cloneMethod;
  if (method === 'shallowCloneDeepObjects') {
    var clonedData = data;
    clonedData.payload = shallowCloneDeepObjects(clonedData.payload);
    return clonedData;
  } else if (method === 'immutable') {
    // we get a pinky promise that the payload is immutable so we don't need to copy
    return data;
  }
  throw new Error('Unknown data.clone method for cloneMessage');
}