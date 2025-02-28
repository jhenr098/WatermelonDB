"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.testSchema = exports.taskQuery = exports.projectQuery = exports.performMatchTest = exports.performJoinTest = exports.modelQuery = exports.mockTaskRaw = exports.mockTagAssignmentRaw = exports.mockProjectRaw = exports.expectSortedEqual = exports.MockTeam = exports.MockTask = exports.MockTagAssignment = exports.MockSyncTestRecord = exports.MockProject = exports.MockOrganization = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _rambdax = require("rambdax");
var _fp = require("../../utils/fp");
var _Model7 = _interopRequireDefault(require("../../Model"));
var _Query = _interopRequireDefault(require("../../Query"));
var _Schema = require("../../Schema");
var _RawRecord = require("../../RawRecord");
var MockTask = exports.MockTask = /*#__PURE__*/function (_Model) {
  function MockTask() {
    return _Model.apply(this, arguments) || this;
  }
  (0, _inheritsLoose2["default"])(MockTask, _Model);
  return MockTask;
}(_Model7["default"]);
MockTask.table = 'tasks';
MockTask.associations = {
  projects: {
    type: 'belongs_to',
    key: 'project_id'
  },
  tag_assignments: {
    type: 'has_many',
    foreignKey: 'task_id'
  }
};
var MockProject = exports.MockProject = /*#__PURE__*/function (_Model2) {
  function MockProject() {
    return _Model2.apply(this, arguments) || this;
  }
  (0, _inheritsLoose2["default"])(MockProject, _Model2);
  return MockProject;
}(_Model7["default"]);
MockProject.table = 'projects';
MockProject.associations = {
  tasks: {
    type: 'has_many',
    foreignKey: 'project_id'
  },
  teams: {
    type: 'belongs_to',
    key: 'team_id'
  }
};
var MockTeam = exports.MockTeam = /*#__PURE__*/function (_Model3) {
  function MockTeam() {
    return _Model3.apply(this, arguments) || this;
  }
  (0, _inheritsLoose2["default"])(MockTeam, _Model3);
  return MockTeam;
}(_Model7["default"]);
MockTeam.table = 'teams';
MockTeam.associations = {
  projects: {
    type: 'has_many',
    foreignKey: 'team_id'
  },
  organizations: {
    type: 'belongs_to',
    key: 'organization_id'
  }
};
var MockOrganization = exports.MockOrganization = /*#__PURE__*/function (_Model4) {
  function MockOrganization() {
    return _Model4.apply(this, arguments) || this;
  }
  (0, _inheritsLoose2["default"])(MockOrganization, _Model4);
  return MockOrganization;
}(_Model7["default"]);
MockOrganization.table = 'organizations';
MockOrganization.associations = {};
var MockTagAssignment = exports.MockTagAssignment = /*#__PURE__*/function (_Model5) {
  function MockTagAssignment() {
    return _Model5.apply(this, arguments) || this;
  }
  (0, _inheritsLoose2["default"])(MockTagAssignment, _Model5);
  return MockTagAssignment;
}(_Model7["default"]);
MockTagAssignment.table = 'tag_assignments';
MockTagAssignment.associations = {
  tasks: {
    type: 'belongs_to',
    key: 'task_id'
  }
};
var MockSyncTestRecord = exports.MockSyncTestRecord = /*#__PURE__*/function (_Model6) {
  function MockSyncTestRecord() {
    return _Model6.apply(this, arguments) || this;
  }
  (0, _inheritsLoose2["default"])(MockSyncTestRecord, _Model6);
  return MockSyncTestRecord;
}(_Model7["default"]);
MockSyncTestRecord.table = 'sync_tests';
var testSchema = exports.testSchema = (0, _Schema.appSchema)({
  version: 1,
  tables: [(0, _Schema.tableSchema)({
    name: 'tasks',
    columns: [{
      name: 'project_id',
      type: 'string'
    }, {
      name: 'num1',
      type: 'number'
    }, {
      name: 'num2',
      type: 'number'
    }, {
      name: 'num3',
      type: 'number'
    }, {
      name: 'float1',
      type: 'number'
    },
    // TODO: Remove me?
    {
      name: 'float2',
      type: 'number'
    }, {
      name: 'text1',
      type: 'string'
    }, {
      name: 'text2',
      type: 'string'
    }, {
      name: 'bool1',
      type: 'boolean'
    }, {
      name: 'bool2',
      type: 'boolean'
    }, {
      name: 'order',
      type: 'number'
    }, {
      name: 'from',
      type: 'string'
    }]
  }), (0, _Schema.tableSchema)({
    name: 'projects',
    columns: [{
      name: 'team_id',
      type: 'string'
    }, {
      name: 'num1',
      type: 'number'
    }, {
      name: 'num2',
      type: 'number'
    }, {
      name: 'text1',
      type: 'string'
    }, {
      name: 'text2',
      type: 'string'
    }, {
      name: 'text3',
      type: 'string'
    }, {
      name: 'bool1',
      type: 'boolean'
    }]
  }), (0, _Schema.tableSchema)({
    name: 'teams',
    columns: [{
      name: 'organization_id',
      type: 'string'
    }, {
      name: 'num1',
      type: 'number'
    }, {
      name: 'num2',
      type: 'number'
    }, {
      name: 'text1',
      type: 'string'
    }, {
      name: 'bool1',
      type: 'boolean'
    }]
  }), (0, _Schema.tableSchema)({
    name: 'organizations',
    columns: [{
      name: 'num1',
      type: 'number'
    }, {
      name: 'text1',
      type: 'string'
    }, {
      name: 'bool1',
      type: 'boolean'
    }]
  }), (0, _Schema.tableSchema)({
    name: 'tag_assignments',
    columns: [{
      name: 'task_id',
      type: 'string'
    }, {
      name: 'num1',
      type: 'number'
    }, {
      name: 'num2',
      type: 'number'
    }, {
      name: 'text1',
      type: 'string'
    }]
  }),
  // weird names that are SQLite keywords
  (0, _Schema.tableSchema)({
    name: 'where',
    columns: []
  }), (0, _Schema.tableSchema)({
    name: 'values',
    columns: []
  }), (0, _Schema.tableSchema)({
    name: 'set',
    columns: []
  }), (0, _Schema.tableSchema)({
    name: 'drop',
    columns: []
  }), (0, _Schema.tableSchema)({
    name: 'update',
    columns: []
  }), (0, _Schema.tableSchema)({
    name: 'sync_tests',
    columns: [{
      name: 'str',
      type: 'string'
    }, {
      name: 'strN',
      type: 'string',
      isOptional: true
    }, {
      name: 'num',
      type: 'number'
    }, {
      name: 'numN',
      type: 'number',
      isOptional: true
    }, {
      name: 'bool',
      type: 'boolean'
    }, {
      name: 'boolN',
      type: 'boolean',
      isOptional: true
    }]
  })]
});
var mockCollections = {
  tasks: MockTask,
  projects: MockProject,
  teams: MockTeam,
  tag_assignments: MockTagAssignment,
  sync_tests: MockSyncTestRecord
};
var modelQuery = exports.modelQuery = function modelQuery(modelClass) {
  var mockCollection = {
    modelClass: modelClass,
    db: {
      get: function get(table) {
        return {
          modelClass: mockCollections[table]
        };
      }
    }
  };
  for (var _len = arguments.length, conditions = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    conditions[_key - 1] = arguments[_key];
  }
  return new _Query["default"](mockCollection, conditions);
};
var taskQuery = exports.taskQuery = function taskQuery() {
  for (var _len2 = arguments.length, conditions = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    conditions[_key2] = arguments[_key2];
  }
  return modelQuery.apply(void 0, [MockTask].concat(conditions)).serialize();
};
var projectQuery = exports.projectQuery = function projectQuery() {
  for (var _len3 = arguments.length, conditions = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    conditions[_key3] = arguments[_key3];
  }
  return modelQuery.apply(void 0, [MockProject].concat(conditions)).serialize();
};
var mockTaskRaw = exports.mockTaskRaw = function mockTaskRaw(raw) {
  return (0, _RawRecord.sanitizedRaw)(raw, testSchema.tables.tasks);
};
var mockProjectRaw = exports.mockProjectRaw = function mockProjectRaw(raw) {
  return (0, _RawRecord.sanitizedRaw)(raw, testSchema.tables.projects);
};
var mockTagAssignmentRaw = exports.mockTagAssignmentRaw = function mockTagAssignmentRaw(raw) {
  return (0, _RawRecord.sanitizedRaw)(raw, testSchema.tables.tag_assignments);
};
var insertAll = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(adapter, table, records) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", adapter.batch(records.map(function (raw) {
            // TODO: Are we sure we want to test this by inserting non-sanitized records?
            // On one hand, this _shouldn't_ happen, on the other, through error or malice
            // (changing DB directly, outside of Wmelon), it _might_ happen
            return ['create', table, (0, _extends2["default"])({
              _status: ''
            }, raw)];
          })));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function insertAll(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var sort = (0, _rambdax.sortBy)(_rambdax.identity);
var getExpectedResults = (0, _rambdax.pipe)((0, _rambdax.pluck)('id'), sort);
var expectSortedEqual = exports.expectSortedEqual = function expectSortedEqual(actual, expected) {
  expect(sort(actual)).toEqual(sort(expected));
};
var performMatchTest = exports.performMatchTest = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(adapter, testCase) {
    var matching, nonMatching, conditions, query, results, expectedResults, ids, count;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          matching = testCase.matching, nonMatching = testCase.nonMatching, conditions = testCase.query; // NOTE: shuffle so that order test does not depend on insertion order
          _context2.next = 3;
          return insertAll(adapter, 'tasks', (0, _rambdax.shuffle)(matching));
        case 3:
          _context2.next = 5;
          return insertAll(adapter, 'tasks', (0, _rambdax.shuffle)(nonMatching));
        case 5:
          query = taskQuery.apply(void 0, (0, _toConsumableArray2["default"])(conditions)); // test if query fetch is correct
          if (testCase.skipQuery) {
            _context2.next = 17;
            break;
          }
          _context2.next = 9;
          return adapter.query(query);
        case 9:
          results = _context2.sent;
          expectedResults = getExpectedResults(matching);
          expect(sort(results)).toEqual(expectedResults);
          if (testCase.checkOrder) {
            expect(results).toEqual((0, _rambdax.pluck)('id', matching));
          }

          // test if ID fetch is correct
          _context2.next = 15;
          return adapter.queryIds(query);
        case 15:
          ids = _context2.sent;
          expect(sort(ids)).toEqual(expectedResults);
        case 17:
          if (testCase.skipCount) {
            _context2.next = 22;
            break;
          }
          _context2.next = 20;
          return adapter.count(query);
        case 20:
          count = _context2.sent;
          expect(count).toBe(matching.length);
        case 22:
          _context2.next = 24;
          return adapter.batch([].concat((0, _toConsumableArray2["default"])(matching), (0, _toConsumableArray2["default"])(nonMatching)).map(function (_ref3) {
            var id = _ref3.id;
            return ['destroyPermanently', 'tasks', id];
          }));
        case 24:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function performMatchTest(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();
var performJoinTest = exports.performJoinTest = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(adapter, testCase) {
    var pairs;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          pairs = (0, _fp.toPairs)(testCase.extraRecords);
          _context3.next = 3;
          return (0, _fp.allPromises)(function (_ref5) {
            var _ref6 = (0, _slicedToArray2["default"])(_ref5, 2),
              table = _ref6[0],
              records = _ref6[1];
            return insertAll(adapter, table, records);
          }, pairs);
        case 3:
          _context3.next = 5;
          return performMatchTest(adapter, testCase);
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function performJoinTest(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();