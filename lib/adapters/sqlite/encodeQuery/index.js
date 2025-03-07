"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
exports.__esModule = true;
exports["default"] = void 0;
var _common = require("../../../utils/common");
var Q = _interopRequireWildcard(require("../../../QueryDescription"));
var _encodeValue = _interopRequireDefault(require("../encodeValue"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
/* eslint-disable no-use-before-define */
function mapJoin(array, mapper, joiner) {
  // NOTE: DO NOT try to optimize this by concatenating strings together. In non-JIT JSC,
  // concatenating strings is extremely slow (5000ms vs 120ms on 65K sample)
  return array.map(mapper).join(joiner);
}
var encodeValues = function encodeValues(values) {
  return "(".concat(mapJoin(values, _encodeValue["default"], ', '), ")");
};
var getComparisonRight = function getComparisonRight(table, comparisonRight) {
  if (comparisonRight.values) {
    return encodeValues(comparisonRight.values);
  } else if (comparisonRight.column) {
    return "\"".concat(table, "\".\"").concat(comparisonRight.column, "\"");
  }
  return typeof comparisonRight.value !== 'undefined' ? (0, _encodeValue["default"])(comparisonRight.value) : 'null';
};

// Note: it's necessary to use `is` / `is not` for NULL comparisons to work correctly
// See: https://sqlite.org/lang_expr.html
var operators = {
  eq: 'is',
  notEq: 'is not',
  gt: '>',
  gte: '>=',
  weakGt: '>',
  // For non-column comparison case
  lt: '<',
  lte: '<=',
  oneOf: 'in',
  notIn: 'not in',
  between: 'between',
  like: 'like',
  notLike: 'not like'
};
var encodeComparison = function encodeComparison(table, comparison) {
  var operator = comparison.operator;
  if (operator === 'between') {
    var right = comparison.right;
    return right.values ? "between ".concat((0, _encodeValue["default"])(right.values[0]), " and ").concat((0, _encodeValue["default"])(right.values[1])) : '';
  }
  return "".concat(operators[operator], " ").concat(getComparisonRight(table, comparison.right));
};
var encodeWhere = function encodeWhere(table, associations) {
  return function (where) {
    switch (where.type) {
      case 'and':
        return "(".concat(encodeAndOr(associations, 'and', table, where.conditions), ")");
      case 'or':
        return "(".concat(encodeAndOr(associations, 'or', table, where.conditions), ")");
      case 'where':
        return encodeWhereCondition(associations, table, where.left, where.comparison);
      case 'on':
        if (process.env.NODE_ENV !== 'production') {
          (0, _common.invariant)(associations.some(function (_ref) {
            var to = _ref.to;
            return to === where.table;
          }), 'To nest Q.on inside Q.and/Q.or you must explicitly declare Q.experimentalJoinTables at the beginning of the query');
        }
        return "(".concat(encodeAndOr(associations, 'and', where.table, where.conditions), ")");
      case 'sql':
        return where.expr;
      default:
        throw new Error("Unknown clause ".concat(where.type));
    }
  };
};
var encodeWhereCondition = function encodeWhereCondition(associations, table, left, comparison) {
  var operator = comparison.operator;
  // if right operand is a value, we can use simple comparison
  // if a column, we must check for `not null > null`
  if (operator === 'weakGt' && comparison.right.column) {
    return encodeWhere(table, associations)(Q.or(
    // $FlowFixMe
    Q.where(left, Q.gt(Q.column(comparison.right.column))), Q.and(Q.where(left, Q.notEq(null)), Q.where(comparison.right.column, null))));
  } else if (operator === 'includes') {
    return "instr(\"".concat(table, "\".\"").concat(left, "\", ").concat(getComparisonRight(table, comparison.right), ")");
  }
  return "\"".concat(table, "\".\"").concat(left, "\" ").concat(encodeComparison(table, comparison));
};
var encodeAndOr = function encodeAndOr(associations, op, table, conditions) {
  if (conditions.length) {
    return mapJoin(conditions, encodeWhere(table, associations), " ".concat(op, " "));
  }
  return '';
};
var andJoiner = ' and ';
var encodeConditions = function encodeConditions(table, description, associations) {
  var clauses = mapJoin(description.where, encodeWhere(table, associations), andJoiner);
  return clauses.length ? " where ".concat(clauses) : '';
};

// If query contains `on()` conditions on tables with which the primary table has a has-many
// relation, then we need to add `distinct` on the query to ensure there are no duplicates
var encodeMethod = function encodeMethod(table, countMode, needsDistinct) {
  if (countMode) {
    return needsDistinct ? "select count(distinct \"".concat(table, "\".\"id\") as \"count\" from \"").concat(table, "\"") : "select count(*) as \"count\" from \"".concat(table, "\"");
  }
  return needsDistinct ? "select distinct \"".concat(table, "\".* from \"").concat(table, "\"") : "select \"".concat(table, "\".* from \"").concat(table, "\"");
};
var encodeAssociation = function encodeAssociation(description) {
  return function (_ref2) {
    var mainTable = _ref2.from,
      joinedTable = _ref2.to,
      association = _ref2.info;
    // TODO: We have a problem here. For all of eternity, WatermelonDB Q.ons were encoded using JOIN
    // However, this precludes many legitimate use cases for Q.ons once you start nesting them
    // (e.g. get tasks where X or has a tag assignment that Y -- if there is no tag assignment, this will
    // fail to join)
    // LEFT JOIN needs to be used to address this… BUT technically that's a breaking change. I never
    // considered a possiblity of making a query like `Q.on(relation_id, x != 'bla')`. Before this would
    // only match if there IS a relation, but with LEFT JOIN it would also match if record does not have
    // this relation. I don't know if there are legitimate use cases where this would change anything
    // so I need more time to think about whether this breaking change is OK to make or if we need to
    // do something more clever/add option/whatever.
    // so for now, i'm making an extreeeeemelyyyy bad hack to make sure that there's no breaking change
    // for existing code and code with nested Q.ons probably works (with caveats)
    var usesOldJoinStyle = description.where.some(function (clause) {
      return clause.type === 'on' && clause.table === joinedTable;
    });
    var joinKeyword = usesOldJoinStyle ? ' join ' : ' left join ';
    var joinBeginning = "".concat(joinKeyword, "\"").concat(joinedTable, "\" on \"").concat(joinedTable, "\".");
    return association.type === 'belongs_to' ? "".concat(joinBeginning, "\"id\" = \"").concat(mainTable, "\".\"").concat(association.key, "\"") : "".concat(joinBeginning, "\"").concat(association.foreignKey, "\" = \"").concat(mainTable, "\".\"id\"");
  };
};
var encodeJoin = function encodeJoin(description, associations) {
  return associations.length ? associations.map(encodeAssociation(description)).join('') : '';
};
var encodeOrderBy = function encodeOrderBy(table, sortBys) {
  if (sortBys.length === 0) {
    return '';
  }
  var orderBys = sortBys.map(function (sortBy) {
    return "\"".concat(table, "\".\"").concat(sortBy.sortColumn, "\" ").concat(sortBy.sortOrder);
  }).join(', ');
  return " order by ".concat(orderBys);
};
var encodeLimitOffset = function encodeLimitOffset(limit, offset) {
  if (!limit) {
    return '';
  }
  var optionalOffsetStmt = offset ? " offset ".concat(offset) : '';
  return " limit ".concat(limit).concat(optionalOffsetStmt);
};
var encodeQuery = function encodeQuery(query) {
  var countMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var table = query.table,
    description = query.description,
    associations = query.associations;

  // TODO: Test if encoding a `select x.id from x` query speeds up queryIds() calls
  if (description.sql) {
    var _description$sql = description.sql,
      _sql = _description$sql.sql,
      values = _description$sql.values;
    return [_sql, values];
  }
  var hasToManyJoins = associations.some(function (_ref3) {
    var info = _ref3.info;
    return info.type === 'has_many';
  });
  if (process.env.NODE_ENV !== 'production') {
    description.take && (0, _common.invariant)(!countMode, 'take/skip is not currently supported with counting. Please contribute to fix this!');
    (0, _common.invariant)(!description.lokiTransform, 'unsafeLokiTransform not supported with SQLite');
  }
  var sql = encodeMethod(table, countMode, hasToManyJoins) + encodeJoin(description, associations) + encodeConditions(table, description, associations) + encodeOrderBy(table, description.sortBy) + encodeLimitOffset(description.take, description.skip);
  return [sql, []];
};
var _default = exports["default"] = encodeQuery;