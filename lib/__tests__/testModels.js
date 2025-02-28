"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.testSchema = exports.modelClasses = exports.mockDatabase = exports.MockTask = exports.MockProjectSection = exports.MockProject = exports.MockComment = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));
var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));
var _Schema = require("../Schema");
var _decorators = require("../decorators");
var _Model5 = _interopRequireDefault(require("../Model"));
var _Database = _interopRequireDefault(require("../Database"));
var _lokijs = _interopRequireDefault(require("../adapters/lokijs"));
var _dec, _class, _descriptor, _MockProject, _dec2, _class2, _descriptor2, _MockProjectSection, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class3, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _MockTask, _dec10, _dec11, _dec12, _dec13, _class4, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _MockComment;
var testSchema = exports.testSchema = (0, _Schema.appSchema)({
  version: 1,
  tables: [(0, _Schema.tableSchema)({
    name: 'mock_projects',
    columns: [{
      name: 'name',
      type: 'string'
    }]
  }), (0, _Schema.tableSchema)({
    name: 'mock_project_sections',
    columns: [{
      name: 'project_id',
      type: 'string'
    }]
  }), (0, _Schema.tableSchema)({
    name: 'mock_tasks',
    columns: [{
      name: 'name',
      type: 'string'
    }, {
      name: 'position',
      type: 'number'
    }, {
      name: 'is_completed',
      type: 'boolean'
    }, {
      name: 'description',
      type: 'string',
      isOptional: true
    }, {
      name: 'project_id',
      type: 'string'
    }, {
      name: 'project_section_id',
      type: 'string',
      isOptional: true
    }]
  }), (0, _Schema.tableSchema)({
    name: 'mock_comments',
    columns: [{
      name: 'task_id',
      type: 'string'
    }, {
      name: 'body',
      type: 'string'
    }, {
      name: 'created_at',
      type: 'number'
    }, {
      name: 'updated_at',
      type: 'number'
    }]
  })]
});
var MockProject = exports.MockProject = (_dec = (0, _decorators.field)('name'), _class = (_MockProject = /*#__PURE__*/function (_Model) {
  function MockProject() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Model.call.apply(_Model, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this, "name", _descriptor, _this);
    return _this;
  }
  (0, _inheritsLoose2["default"])(MockProject, _Model);
  return MockProject;
}(_Model5["default"]), _MockProject.table = 'mock_projects', _MockProject.associations = {
  mock_tasks: {
    type: 'has_many',
    foreignKey: 'project_id'
  },
  mock_project_sections: {
    type: 'has_many',
    foreignKey: 'project_id'
  }
}, _MockProject), _descriptor = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "name", [_dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class);
var MockProjectSection = exports.MockProjectSection = (_dec2 = (0, _decorators.field)('project_id'), _class2 = (_MockProjectSection = /*#__PURE__*/function (_Model2) {
  function MockProjectSection() {
    var _this2;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    _this2 = _Model2.call.apply(_Model2, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this2, "projectId", _descriptor2, _this2);
    return _this2;
  }
  (0, _inheritsLoose2["default"])(MockProjectSection, _Model2);
  return MockProjectSection;
}(_Model5["default"]), _MockProjectSection.table = 'mock_project_sections', _MockProjectSection.associations = {
  mock_projects: {
    type: 'belongs_to',
    key: 'project_id'
  },
  mock_tasks: {
    type: 'has_many',
    foreignKey: 'project_section_id'
  }
}, _MockProjectSection), _descriptor2 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "projectId", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class2);
var MockTask = exports.MockTask = (_dec3 = (0, _decorators.field)('name'), _dec4 = (0, _decorators.field)('position'), _dec5 = (0, _decorators.field)('is_completed'), _dec6 = (0, _decorators.field)('description'), _dec7 = (0, _decorators.field)('project_id'), _dec8 = (0, _decorators.relation)('mock_projects', 'project_id'), _dec9 = (0, _decorators.relation)('mock_project_sections', 'project_section_id'), _class3 = (_MockTask = /*#__PURE__*/function (_Model3) {
  function MockTask() {
    var _this3;
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    _this3 = _Model3.call.apply(_Model3, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this3, "name", _descriptor3, _this3);
    (0, _initializerDefineProperty2["default"])(_this3, "position", _descriptor4, _this3);
    (0, _initializerDefineProperty2["default"])(_this3, "isCompleted", _descriptor5, _this3);
    (0, _initializerDefineProperty2["default"])(_this3, "description", _descriptor6, _this3);
    (0, _initializerDefineProperty2["default"])(_this3, "projectId", _descriptor7, _this3);
    (0, _initializerDefineProperty2["default"])(_this3, "project", _descriptor8, _this3);
    (0, _initializerDefineProperty2["default"])(_this3, "projectSection", _descriptor9, _this3);
    return _this3;
  }
  (0, _inheritsLoose2["default"])(MockTask, _Model3);
  return MockTask;
}(_Model5["default"]), _MockTask.table = 'mock_tasks', _MockTask.associations = {
  mock_projects: {
    type: 'belongs_to',
    key: 'project_id'
  },
  mock_project_sections: {
    type: 'belongs_to',
    key: 'project_section_id'
  },
  mock_comments: {
    type: 'has_many',
    foreignKey: 'task_id'
  }
}, _MockTask), _descriptor3 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "name", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "position", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "isCompleted", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "description", [_dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "projectId", [_dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "project", [_dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "projectSection", [_dec9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class3);
var MockComment = exports.MockComment = (_dec10 = (0, _decorators.immutableRelation)('mock_tasks', 'task_id'), _dec11 = (0, _decorators.text)('body'), _dec12 = (0, _decorators.date)('created_at'), _dec13 = (0, _decorators.date)('updated_at'), _class4 = (_MockComment = /*#__PURE__*/function (_Model4) {
  function MockComment() {
    var _this4;
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    _this4 = _Model4.call.apply(_Model4, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this4, "task", _descriptor10, _this4);
    (0, _initializerDefineProperty2["default"])(_this4, "body", _descriptor11, _this4);
    (0, _initializerDefineProperty2["default"])(_this4, "createdAt", _descriptor12, _this4);
    (0, _initializerDefineProperty2["default"])(_this4, "updatedAt", _descriptor13, _this4);
    return _this4;
  }
  (0, _inheritsLoose2["default"])(MockComment, _Model4);
  return MockComment;
}(_Model5["default"]), _MockComment.table = 'mock_comments', _MockComment.associations = {
  mock_tasks: {
    type: 'belongs_to',
    key: 'task_id'
  }
}, _MockComment), _descriptor10 = (0, _applyDecoratedDescriptor2["default"])(_class4.prototype, "task", [_dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor11 = (0, _applyDecoratedDescriptor2["default"])(_class4.prototype, "body", [_dec11], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor12 = (0, _applyDecoratedDescriptor2["default"])(_class4.prototype, "createdAt", [_decorators.readonly, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor13 = (0, _applyDecoratedDescriptor2["default"])(_class4.prototype, "updatedAt", [_decorators.readonly, _dec13], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class4);
var modelClasses = exports.modelClasses = [MockProject, MockProjectSection, MockTask, MockComment];
var mockDatabase = exports.mockDatabase = function mockDatabase() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$schema = _ref.schema,
    schema = _ref$schema === void 0 ? testSchema : _ref$schema,
    _ref$migrations = _ref.migrations,
    migrations = _ref$migrations === void 0 ? undefined : _ref$migrations;
  var adapter = new _lokijs["default"]({
    dbName: 'test',
    schema: schema,
    migrations: migrations,
    useWebWorker: false,
    useIncrementalIndexedDB: false
  });
  var database = new _Database["default"]({
    adapter: adapter,
    schema: schema,
    modelClasses: modelClasses
  });
  return {
    database: database,
    db: database,
    adapter: adapter,
    projects: database.get('mock_projects'),
    projectSections: database.get('mock_project_sections'),
    tasks: database.get('mock_tasks'),
    comments: database.get('mock_comments'),
    cloneDatabase: function () {
      var _cloneDatabase = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var clonedSchema,
          _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              clonedSchema = _args.length > 0 && _args[0] !== undefined ? _args[0] : schema;
              _context.t0 = _Database["default"];
              _context.next = 4;
              return database.adapter.underlyingAdapter.testClone({
                schema: clonedSchema
              });
            case 4:
              _context.t1 = _context.sent;
              _context.t2 = clonedSchema;
              _context.t3 = modelClasses;
              _context.t4 = {
                adapter: _context.t1,
                schema: _context.t2,
                modelClasses: _context.t3
              };
              return _context.abrupt("return", new _context.t0(_context.t4));
            case 9:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function cloneDatabase() {
        return _cloneDatabase.apply(this, arguments);
      }
      return cloneDatabase;
    }()
  };
};