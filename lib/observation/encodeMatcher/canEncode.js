"use strict";

exports.__esModule = true;
exports["default"] = canEncodeMatcher;
exports.forbiddenError = void 0;
var forbiddenError = exports.forbiddenError = "Queries with joins, sortBy, take, skip, lokiTransform can't be encoded into a matcher";
function canEncodeMatcher(query) {
  var joinTables = query.joinTables,
    nestedJoinTables = query.nestedJoinTables,
    sortBy = query.sortBy,
    take = query.take,
    skip = query.skip,
    lokiTransform = query.lokiTransform,
    sql = query.sql;
  return !joinTables.length && !nestedJoinTables.length && !sortBy.length && !take && !skip && !lokiTransform && !sql;
}