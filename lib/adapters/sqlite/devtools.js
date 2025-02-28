"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _Query = _interopRequireDefault(require("../../Query"));
var _encodeQuery3 = _interopRequireDefault(require("./encodeQuery"));
// $FlowFixMe
_Query["default"].prototype._sql = function _sql() {
  var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var query = this;
  var _encodeQuery = (0, _encodeQuery3["default"])(query.serialize(), count),
    _encodeQuery2 = (0, _slicedToArray2["default"])(_encodeQuery, 1),
    sql = _encodeQuery2[0];
  return sql;
};