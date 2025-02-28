"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.executeCount = executeCount;
exports.executeQuery = executeQuery;
var _encodeQuery = _interopRequireDefault(require("./encodeQuery"));
var _performJoins = _interopRequireDefault(require("./performJoins"));
// Finds IDs of matching records on foreign table
function performJoin(join, loki) {
  var table = join.table,
    query = join.query;
  var collection = loki.getCollection(table).chain();
  var records = collection.find(query).data();
  return records;
}
function performQuery(query, loki) {
  // Step one: perform all inner queries (JOINs) to get the single table query
  var lokiQuery = (0, _encodeQuery["default"])(query);
  var mainQuery = (0, _performJoins["default"])(lokiQuery, function (join) {
    return performJoin(join, loki);
  });

  // Step two: fetch all records matching query
  var collection = loki.getCollection(query.table).chain();
  var resultset = collection.find(mainQuery);

  // Step three: sort, skip, take
  var _query$description = query.description,
    sortBy = _query$description.sortBy,
    take = _query$description.take,
    skip = _query$description.skip;
  if (sortBy.length) {
    resultset = resultset.compoundsort(sortBy.map(function (_ref) {
      var sortColumn = _ref.sortColumn,
        sortOrder = _ref.sortOrder;
      return [sortColumn, sortOrder === 'desc'];
    }));
  }
  if (skip) {
    resultset = resultset.offset(skip);
  }
  if (take) {
    resultset = resultset.limit(take);
  }
  return resultset;
}
function executeQuery(query, loki) {
  var lokiTransform = query.description.lokiTransform;
  var results = performQuery(query, loki).data();
  if (lokiTransform) {
    return lokiTransform(results, loki);
  }
  return results;
}
function executeCount(query, loki) {
  var lokiTransform = query.description.lokiTransform;
  var resultset = performQuery(query, loki);
  if (lokiTransform) {
    var records = lokiTransform(resultset.data(), loki);
    return records.length;
  }
  return resultset.count();
}