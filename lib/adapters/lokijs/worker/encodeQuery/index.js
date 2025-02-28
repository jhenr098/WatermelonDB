"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = encodeQuery;
var _invariant = _interopRequireDefault(require("../../../../utils/common/invariant"));
var _likeToRegexp = _interopRequireDefault(require("../../../../utils/fp/likeToRegexp"));
/* eslint-disable no-use-before-define */
// don't import whole `utils` to keep worker size small
var weakNotNull = {
  $not: {
    $aeq: null
  }
};
var encodeComparison = function encodeComparison(comparison, value) {
  // TODO: It's probably possible to improve performance of those operators by making them
  // binary-search compatible (i.e. don't use $and, $not)
  // TODO: We might be able to use $jgt, $jbetween, etc. — but ensure the semantics are right
  // and it won't break indexing

  var operator = comparison.operator;
  if (comparison.right.column) {
    // Encode for column comparisons
    switch (operator) {
      case 'eq':
        return {
          $$aeq: value
        };
      case 'notEq':
        return {
          $not: {
            $$aeq: value
          }
        };
      case 'gt':
        return {
          $$gt: value
        };
      case 'gte':
        return {
          $$gte: value
        };
      case 'weakGt':
        return {
          $$gt: value
        };
      case 'lt':
        return {
          $and: [{
            $$lt: value
          }, weakNotNull]
        };
      case 'lte':
        return {
          $and: [{
            $$lte: value
          }, weakNotNull]
        };
      default:
        throw new Error("Illegal operator ".concat(operator, " for column comparisons"));
    }
  } else {
    switch (operator) {
      case 'eq':
        return {
          $aeq: value
        };
      case 'notEq':
        return {
          $not: {
            $aeq: value
          }
        };
      case 'gt':
        return {
          $gt: value
        };
      case 'gte':
        return {
          $gte: value
        };
      case 'weakGt':
        return {
          $gt: value
        };
      // Note: yup, this is correct (for non-column comparisons)
      case 'lt':
        return {
          $and: [{
            $lt: value
          }, weakNotNull]
        };
      case 'lte':
        return {
          $and: [{
            $lte: value
          }, weakNotNull]
        };
      case 'oneOf':
        return {
          $in: value
        };
      case 'notIn':
        return {
          $and: [{
            $nin: value
          }, weakNotNull]
        };
      case 'between':
        return {
          $between: value
        };
      case 'like':
        return {
          $regex: (0, _likeToRegexp["default"])(value)
        };
      case 'notLike':
        return {
          $and: [{
            $not: {
              $eq: null
            }
          }, {
            $not: {
              $regex: (0, _likeToRegexp["default"])(value)
            }
          }]
        };
      case 'includes':
        return {
          $containsString: value
        };
      default:
        throw new Error("Unknown operator ".concat(operator));
    }
  }
};
var columnCompRequiresColumnNotNull = {
  gt: true,
  gte: true,
  lt: true,
  lte: true
};
var encodeWhereDescription = function encodeWhereDescription(_ref) {
  var _ref6;
  var left = _ref.left,
    comparison = _ref.comparison;
  var operator = comparison.operator,
    right = comparison.right;
  var col = left;
  // $FlowFixMe - NOTE: order of ||s is important here, since .value can be falsy, but .column and .values are either truthy or are undefined
  var comparisonRight = right.column || right.values || right.value;
  if (typeof right.value === 'string') {
    // we can do fast path as we know that eq and aeq do the same thing for strings
    if (operator === 'eq') {
      var _ref2;
      return _ref2 = {}, _ref2[col] = {
        $eq: comparisonRight
      }, _ref2;
    } else if (operator === 'notEq') {
      var _ref3;
      return _ref3 = {}, _ref3[col] = {
        $ne: comparisonRight
      }, _ref3;
    }
  }
  var colName = right.column;
  var encodedComparison = encodeComparison(comparison, comparisonRight);
  if (colName && columnCompRequiresColumnNotNull[operator]) {
    var _ref4, _ref5;
    return {
      $and: [(_ref4 = {}, _ref4[col] = encodedComparison, _ref4), (_ref5 = {}, _ref5[colName] = weakNotNull, _ref5)]
    };
  }
  return _ref6 = {}, _ref6[col] = encodedComparison, _ref6;
};
var encodeCondition = function encodeCondition(associations) {
  return function (clause) {
    switch (clause.type) {
      case 'and':
        return encodeAnd(associations, clause);
      case 'or':
        return encodeOr(associations, clause);
      case 'where':
        return encodeWhereDescription(clause);
      case 'on':
        return encodeJoin(associations, clause);
      case 'loki':
        return clause.expr;
      default:
        throw new Error("Unknown clause ".concat(clause.type));
    }
  };
};
var encodeConditions = function encodeConditions(associations, conditions) {
  return conditions.map(encodeCondition(associations));
};
var encodeAndOr = function encodeAndOr(op) {
  return function (associations, clause) {
    var _ref7;
    var conditions = encodeConditions(associations, clause.conditions);
    // flatten
    return conditions.length === 1 ? conditions[0] : (_ref7 = {}, _ref7[op] = conditions, _ref7);
  };
};
var encodeAnd = encodeAndOr('$and');
var encodeOr = encodeAndOr('$or');

// Note: empty query returns `undefined` because
// Loki's Collection.count() works but count({}) doesn't
var concatRawQueries = function concatRawQueries(queries) {
  switch (queries.length) {
    case 0:
      return undefined;
    case 1:
      return queries[0];
    default:
      return {
        $and: queries
      };
  }
};
var encodeRootConditions = function encodeRootConditions(associations, conditions) {
  return concatRawQueries(encodeConditions(associations, conditions));
};
var encodeJoin = function encodeJoin(associations, on) {
  var table = on.table,
    conditions = on.conditions;
  var association = associations.find(function (_ref8) {
    var to = _ref8.to;
    return table === to;
  });
  (0, _invariant["default"])(association, 'To nest Q.on inside Q.and/Q.or you must explicitly declare Q.experimentalJoinTables at the beginning of the query');
  var info = association.info;
  return {
    $join: {
      table: table,
      query: encodeRootConditions(associations, conditions),
      mapKey: info.type === 'belongs_to' ? 'id' : info.foreignKey,
      joinKey: info.type === 'belongs_to' ? info.key : 'id'
    }
  };
};
function encodeQuery(query) {
  var table = query.table,
    _query$description = query.description,
    where = _query$description.where,
    joinTables = _query$description.joinTables,
    sql = _query$description.sql,
    associations = query.associations;
  (0, _invariant["default"])(!sql, '[Loki] Q.unsafeSqlQuery are not supported with LokiJSAdapter');
  return {
    table: table,
    query: encodeRootConditions(associations, where),
    hasJoins: !!joinTables.length
  };
}