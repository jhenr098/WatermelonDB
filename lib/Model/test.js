"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));
var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));
var _operators = require("rxjs/operators");
var _testModels = require("../__tests__/testModels");
var _utils = require("../__tests__/utils");
var _Database = _interopRequireDefault(require("../Database"));
var _Schema = require("../Schema");
var _decorators = require("../decorators");
var _fp = require("../utils/fp");
var _sortBy = _interopRequireDefault(require("../utils/fp/sortBy"));
var _RawRecord = require("../RawRecord");
var _index = _interopRequireDefault(require("./index"));
var _helpers = require("./helpers");
var _dec, _dec2, _class, _descriptor, _descriptor2, _MockModel, _dec3, _class2, _descriptor3, _MockModelCreated, _dec4, _class3, _descriptor4, _MockModelUpdated, _dec5, _dec6, _class4, _descriptor5, _descriptor6, _MockModelCreatedUpdated;
/* eslint no-multi-spaces: 0 */
var mockSchema = (0, _Schema.appSchema)({
  version: 1,
  tables: [(0, _Schema.tableSchema)({
    name: 'mock',
    columns: [{
      name: 'name',
      type: 'string'
    }, {
      name: 'otherfield',
      type: 'string'
    }, {
      name: 'col3',
      type: 'string'
    }, {
      name: 'col4',
      type: 'string',
      isOptional: true
    }, {
      name: 'number',
      type: 'number'
    }]
  }), (0, _Schema.tableSchema)({
    name: 'mock_created',
    columns: [{
      name: 'created_at',
      type: 'number'
    }]
  }), (0, _Schema.tableSchema)({
    name: 'mock_updated',
    columns: [{
      name: 'updated_at',
      type: 'number'
    }]
  }), (0, _Schema.tableSchema)({
    name: 'mock_created_updated',
    columns: [{
      name: 'created_at',
      type: 'number'
    }, {
      name: 'updated_at',
      type: 'number'
    }]
  })]
});
var MockModel = (_dec = (0, _decorators.field)('name'), _dec2 = (0, _decorators.field)('otherfield'), _class = (_MockModel = /*#__PURE__*/function (_Model) {
  function MockModel() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Model.call.apply(_Model, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this, "name", _descriptor, _this);
    (0, _initializerDefineProperty2["default"])(_this, "otherfield", _descriptor2, _this);
    return _this;
  }
  (0, _inheritsLoose2["default"])(MockModel, _Model);
  return MockModel;
}(_index["default"]), _MockModel.table = 'mock', _MockModel), _descriptor = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "name", [_dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "otherfield", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class);
var MockModelCreated = (_dec3 = (0, _decorators.date)('created_at'), _class2 = (_MockModelCreated = /*#__PURE__*/function (_Model2) {
  function MockModelCreated() {
    var _this2;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    _this2 = _Model2.call.apply(_Model2, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this2, "createdAt", _descriptor3, _this2);
    return _this2;
  }
  (0, _inheritsLoose2["default"])(MockModelCreated, _Model2);
  return MockModelCreated;
}(_index["default"]), _MockModelCreated.table = 'mock_created', _MockModelCreated), _descriptor3 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "createdAt", [_decorators.readonly, _dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class2);
var MockModelUpdated = (_dec4 = (0, _decorators.date)('updated_at'), _class3 = (_MockModelUpdated = /*#__PURE__*/function (_Model3) {
  function MockModelUpdated() {
    var _this3;
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    _this3 = _Model3.call.apply(_Model3, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this3, "updatedAt", _descriptor4, _this3);
    return _this3;
  }
  (0, _inheritsLoose2["default"])(MockModelUpdated, _Model3);
  return MockModelUpdated;
}(_index["default"]), _MockModelUpdated.table = 'mock_updated', _MockModelUpdated), _descriptor4 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "updatedAt", [_decorators.readonly, _dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class3);
var MockModelCreatedUpdated = (_dec5 = (0, _decorators.date)('created_at'), _dec6 = (0, _decorators.date)('updated_at'), _class4 = (_MockModelCreatedUpdated = /*#__PURE__*/function (_Model4) {
  function MockModelCreatedUpdated() {
    var _this4;
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    _this4 = _Model4.call.apply(_Model4, [this].concat(args)) || this;
    (0, _initializerDefineProperty2["default"])(_this4, "createdAt", _descriptor5, _this4);
    (0, _initializerDefineProperty2["default"])(_this4, "updatedAt", _descriptor6, _this4);
    return _this4;
  }
  (0, _inheritsLoose2["default"])(MockModelCreatedUpdated, _Model4);
  return MockModelCreatedUpdated;
}(_index["default"]), _MockModelCreatedUpdated.table = 'mock_created_updated', _MockModelCreatedUpdated), _descriptor5 = (0, _applyDecoratedDescriptor2["default"])(_class4.prototype, "createdAt", [_decorators.readonly, _dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = (0, _applyDecoratedDescriptor2["default"])(_class4.prototype, "updatedAt", [_decorators.readonly, _dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class4);
var makeDatabase = function makeDatabase() {
  return new _Database["default"]({
    adapter: {
      schema: mockSchema
    },
    modelClasses: [MockModel, MockModelCreated, MockModelUpdated, MockModelCreatedUpdated]
  });
};
describe('Model', function () {
  it("exposes database", function () {
    var database = makeDatabase();
    var model = new MockModel(database.get('mock'), {});
    expect(model.database).toBe(database);
    expect(model.db).toBe(database);
  });
  it('exposes collections', function () {
    var database = makeDatabase();
    var model = new MockModel(database.get('mock'), {});
    expect(model.collections).toBe(database.collections);
    expect(model.collections.get('mock_created').modelClass).toBe(MockModelCreated);
  });
  it("has wmelon tag", function () {
    var model = new MockModel({}, {});
    expect(model.constructor._wmelonTag).toBe('model');
  });
});
describe('CRUD', function () {
  it('_prepareCreate: can instantiate new records', function () {
    var database = makeDatabase();
    var collection = database.get('mock');
    var m1 = MockModel._prepareCreate(collection, function (record) {
      expect(record._isEditing).toBe(true);
      record.name = 'Some name';
    });
    expect(m1.collection).toBe(collection);
    expect(m1._isEditing).toBe(false);
    expect(m1._preparedState).toBe('create');
    expect(m1.id.length).toBe(16);
    expect(m1.createdAt).toBe(undefined);
    expect(m1.updatedAt).toBe(undefined);
    expect(m1.name).toBe('Some name');
    expect(m1._raw).toEqual({
      id: m1.id,
      _status: 'created',
      _changed: '',
      name: 'Some name',
      otherfield: '',
      col3: '',
      col4: null,
      number: 0
    });
  });
  it('_prepareCreateFromDirtyRaw: can instantiate new records', function () {
    var database = makeDatabase();
    var collection = database.get('mock');
    var m1 = MockModel._prepareCreateFromDirtyRaw(collection, {
      name: 'Some name'
    });
    expect(m1.collection).toBe(collection);
    expect(m1._isEditing).toBe(false);
    expect(m1._preparedState).toBe('create');
    expect(m1.id.length).toBe(16);
    expect(m1.createdAt).toBe(undefined);
    expect(m1.updatedAt).toBe(undefined);
    expect(m1.name).toBe('Some name');
    expect(m1._raw).toEqual({
      id: m1.id,
      _status: 'created',
      _changed: '',
      name: 'Some name',
      otherfield: '',
      col3: '',
      col4: null,
      number: 0
    });

    // can take the entire raw record without changing if it's valid
    var raw = Object.freeze({
      id: 'abcde67890123456',
      _status: 'synced',
      _changed: '',
      name: 'Hey',
      otherfield: 'foo',
      col3: '',
      col4: null,
      number: 100
    });
    var m2 = MockModel._prepareCreateFromDirtyRaw(collection, raw);
    expect(m2._raw).toEqual(raw);
    expect(m2._raw).not.toBe(raw);
  });
  it('can update a record', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var db;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          db = makeDatabase();
          _context2.next = 3;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
            var spyBatchDB, collection, m1, spyOnPrepareUpdate, observer, update;
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  db.adapter.batch = jest.fn();
                  spyBatchDB = jest.spyOn(db, 'batch');
                  collection = db.get('mock');
                  _context.next = 5;
                  return collection.create(function (record) {
                    record.name = 'Original name';
                  });
                case 5:
                  m1 = _context.sent;
                  spyOnPrepareUpdate = jest.spyOn(m1, 'prepareUpdate');
                  observer = jest.fn();
                  m1.observe().subscribe(observer);
                  expect(m1._isEditing).toBe(false);
                  _context.next = 12;
                  return m1.update(function (record) {
                    expect(m1._isEditing).toBe(true);
                    record.name = 'New name';
                  });
                case 12:
                  update = _context.sent;
                  expect(spyBatchDB).toHaveBeenCalledWith(m1);
                  expect(spyOnPrepareUpdate).toHaveBeenCalledTimes(1);
                  expect(observer).toHaveBeenCalledTimes(2);
                  expect(update).toBe(m1);
                  expect(m1.name).toBe('New name');
                  expect(m1.updatedAt).toBe(undefined);
                  expect(m1._isEditing).toBe(false);
                  expect(m1._preparedState).toBe(null);
                case 21:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          })));
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
  it('can prepare an update', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var db, collection, m1, observer, preparedUpdate;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          collection = db.get('mock');
          _context3.next = 5;
          return db.write(function () {
            return collection.create(function (record) {
              record.name = 'Original name';
            });
          });
        case 5:
          m1 = _context3.sent;
          expect(db.adapter.batch).toHaveBeenCalledTimes(1);
          observer = jest.fn();
          m1.observe().subscribe(observer);
          preparedUpdate = m1.prepareUpdate(function (record) {
            expect(m1._isEditing).toBe(true);
            record.name = 'New name';
          });
          expect(preparedUpdate).toBe(m1);
          expect(m1.name).toBe('New name');
          expect(m1.updatedAt).toBe(undefined);
          expect(m1._isEditing).toBe(false);
          expect(m1._preparedState).toBe('update');
          expect(db.adapter.batch).toHaveBeenCalledTimes(1);
          expect(observer).toHaveBeenCalledTimes(1);
          _context3.next = 19;
          return db.write(function () {
            return db.batch(preparedUpdate);
          });
        case 19:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
  it('can destroy a record permanently', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var db, spyBatchDB, m1, spyOnPrepareDestroyPermanently, nextObserver, completionObserver;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          spyBatchDB = jest.spyOn(db, 'batch');
          _context4.next = 5;
          return db.write(function () {
            return db.get('mock').create();
          });
        case 5:
          m1 = _context4.sent;
          expect(spyBatchDB).toHaveBeenCalledWith(m1);
          spyOnPrepareDestroyPermanently = jest.spyOn(m1, 'prepareDestroyPermanently');
          nextObserver = jest.fn();
          completionObserver = jest.fn();
          m1.observe().subscribe(nextObserver, null, completionObserver);
          _context4.next = 13;
          return db.write(function () {
            return m1.destroyPermanently();
          });
        case 13:
          expect(spyOnPrepareDestroyPermanently).toHaveBeenCalledTimes(1);
          expect(nextObserver).toHaveBeenCalledTimes(1);
          expect(completionObserver).toHaveBeenCalledTimes(1);
          expect(m1._isEditing).toBe(false);
          expect(m1._preparedState).toBe(null);
          expect(m1.syncStatus).toBe('deleted');
        case 19:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
  it('can destroy a record and its children permanently', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var _mockDatabase, db, projects, tasks, comments;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _mockDatabase = (0, _testModels.mockDatabase)(), db = _mockDatabase.db, projects = _mockDatabase.projects, tasks = _mockDatabase.tasks, comments = _mockDatabase.comments;
          _context6.next = 3;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
            var project, task, comment, spyBatchDB, spyOnPrepareDestroyPermanentlyProject, spyOnPrepareDestroyPermanentlyTask, spyOnPrepareDestroyPermanentlyComment;
            return _regenerator["default"].wrap(function _callee5$(_context5) {
              while (1) switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return projects.create(function (mock) {
                    mock.name = 'foo';
                  });
                case 2:
                  project = _context5.sent;
                  _context5.next = 5;
                  return tasks.create(function (mock) {
                    mock.project.set(project);
                  });
                case 5:
                  task = _context5.sent;
                  _context5.next = 8;
                  return comments.create(function (mock) {
                    mock.task.set(task);
                  });
                case 8:
                  comment = _context5.sent;
                  db.adapter.batch = jest.fn();
                  spyBatchDB = jest.spyOn(db, 'batch');
                  spyOnPrepareDestroyPermanentlyProject = jest.spyOn(project, 'prepareDestroyPermanently');
                  spyOnPrepareDestroyPermanentlyTask = jest.spyOn(task, 'prepareDestroyPermanently');
                  spyOnPrepareDestroyPermanentlyComment = jest.spyOn(comment, 'prepareDestroyPermanently');
                  _context5.next = 16;
                  return project.experimentalDestroyPermanently();
                case 16:
                  expect(spyOnPrepareDestroyPermanentlyProject).toHaveBeenCalledTimes(1);
                  expect(spyOnPrepareDestroyPermanentlyTask).toHaveBeenCalledTimes(1);
                  expect(spyOnPrepareDestroyPermanentlyComment).toHaveBeenCalledTimes(1);
                  expect(spyBatchDB).toHaveBeenCalledWith([comment, task, project]);
                case 20:
                case "end":
                  return _context5.stop();
              }
            }, _callee5);
          })));
        case 3:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  })));
  it('can mark a record as deleted', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    var db, spyBatchDB, m1, spyOnMarkAsDeleted, nextObserver, completionObserver;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          spyBatchDB = jest.spyOn(db, 'batch');
          _context7.next = 5;
          return db.write(function () {
            return db.get('mock').create();
          });
        case 5:
          m1 = _context7.sent;
          expect(spyBatchDB).toHaveBeenCalledWith(m1);
          spyOnMarkAsDeleted = jest.spyOn(m1, 'prepareMarkAsDeleted');
          nextObserver = jest.fn();
          completionObserver = jest.fn();
          m1.observe().subscribe(nextObserver, null, completionObserver);
          _context7.next = 13;
          return db.write(function () {
            return m1.markAsDeleted();
          });
        case 13:
          expect(spyOnMarkAsDeleted).toHaveBeenCalledTimes(1);
          expect(nextObserver).toHaveBeenCalledTimes(1);
          expect(completionObserver).toHaveBeenCalledTimes(1);
          expect(m1._isEditing).toBe(false);
          expect(m1._preparedState).toBe(null);
          expect(m1.syncStatus).toBe('deleted');
        case 19:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  })));
  it('can mark as deleted record and its children permanently', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    var _mockDatabase2, db, projects, tasks, comments;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _mockDatabase2 = (0, _testModels.mockDatabase)(), db = _mockDatabase2.db, projects = _mockDatabase2.projects, tasks = _mockDatabase2.tasks, comments = _mockDatabase2.comments;
          _context9.next = 3;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8() {
            var project, task, comment, spyBatchDB, spyOnPrepareMarkAsDeletedProject, spyOnPrepareMarkAsDeletedTask, spyOnPrepareMarkAsDeletedComment;
            return _regenerator["default"].wrap(function _callee8$(_context8) {
              while (1) switch (_context8.prev = _context8.next) {
                case 0:
                  _context8.next = 2;
                  return projects.create(function (mock) {
                    mock.name = 'foo';
                  });
                case 2:
                  project = _context8.sent;
                  _context8.next = 5;
                  return tasks.create(function (mock) {
                    mock.project.set(project);
                  });
                case 5:
                  task = _context8.sent;
                  _context8.next = 8;
                  return comments.create(function (mock) {
                    mock.task.set(task);
                  });
                case 8:
                  comment = _context8.sent;
                  db.adapter.batch = jest.fn();
                  spyBatchDB = jest.spyOn(db, 'batch');
                  spyOnPrepareMarkAsDeletedProject = jest.spyOn(project, 'prepareMarkAsDeleted');
                  spyOnPrepareMarkAsDeletedTask = jest.spyOn(task, 'prepareMarkAsDeleted');
                  spyOnPrepareMarkAsDeletedComment = jest.spyOn(comment, 'prepareMarkAsDeleted');
                  _context8.next = 16;
                  return project.experimentalMarkAsDeleted();
                case 16:
                  expect(spyOnPrepareMarkAsDeletedProject).toHaveBeenCalledTimes(1);
                  expect(spyOnPrepareMarkAsDeletedTask).toHaveBeenCalledTimes(1);
                  expect(spyOnPrepareMarkAsDeletedComment).toHaveBeenCalledTimes(1);
                  expect(spyBatchDB).toHaveBeenCalledWith([comment, task, project]);
                case 20:
                case "end":
                  return _context8.stop();
              }
            }, _callee8);
          })));
        case 3:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  })));
});
describe('Safety features', function () {
  it('throws if batch is not called synchronously with prepareUpdate', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10() {
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  })));
  it('disallows field changes outside of create/update', function () {
    var db = makeDatabase();
    var model = new MockModel(db.get('mock'), {});
    expect(function () {
      model.name = 'new';
    }).toThrow();
    expect(function () {
      model.otherfield = 'new';
    }).toThrow();
    expect(function () {
      model._setRaw('name', 'new');
    }).toThrow();
    expect(function () {
      model._dangerouslySetRawWithoutMarkingColumnChange('name', 'new');
    }).toThrow();
  });
  it('disallows changes to just-deleted records', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee12() {
    var db;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          _context12.next = 4;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee11() {
            var m1;
            return _regenerator["default"].wrap(function _callee11$(_context11) {
              while (1) switch (_context11.prev = _context11.next) {
                case 0:
                  _context11.next = 2;
                  return db.get('mock').create();
                case 2:
                  m1 = _context11.sent;
                  _context11.next = 5;
                  return m1.destroyPermanently();
                case 5:
                  _context11.next = 7;
                  return (0, _utils.expectToRejectWithMessage)(m1.update(function () {
                    m1.name = 'new';
                  }), 'Not allowed to change deleted record');
                case 7:
                case "end":
                  return _context11.stop();
              }
            }, _callee11);
          })));
        case 4:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  })));
  it('disallows changes to previously-deleted records', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee14() {
    var db;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          db = makeDatabase();
          _context14.next = 3;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee13() {
            var m1;
            return _regenerator["default"].wrap(function _callee13$(_context13) {
              while (1) switch (_context13.prev = _context13.next) {
                case 0:
                  m1 = new MockModel(db.get('mock'), {
                    _status: 'deleted'
                  });
                  _context13.next = 3;
                  return (0, _utils.expectToRejectWithMessage)(m1.update(function () {
                    m1.name = 'new';
                  }), 'Not allowed to change deleted record');
                case 3:
                case "end":
                  return _context13.stop();
              }
            }, _callee13);
          })));
        case 3:
        case "end":
          return _context14.stop();
      }
    }, _callee14);
  })));
  it('diallows direct manipulation of id', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee16() {
    var db;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          _context16.next = 4;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee15() {
            var model;
            return _regenerator["default"].wrap(function _callee15$(_context15) {
              while (1) switch (_context15.prev = _context15.next) {
                case 0:
                  _context15.next = 2;
                  return db.get('mock').create();
                case 2:
                  model = _context15.sent;
                  _context15.next = 5;
                  return (0, _utils.expectToRejectWithMessage)(model.update(function () {
                    model.id = 'newId';
                  }), 'Cannot set property id');
                case 5:
                case "end":
                  return _context15.stop();
              }
            }, _callee15);
          })));
        case 4:
        case "end":
          return _context16.stop();
      }
    }, _callee16);
  })));
  it('disallows operations on uncommited records', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee18() {
    var db;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          _context18.next = 4;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee17() {
            var model;
            return _regenerator["default"].wrap(function _callee17$(_context17) {
              while (1) switch (_context17.prev = _context17.next) {
                case 0:
                  model = MockModel._prepareCreate(db.get('mock'), function () {});
                  expect(model._preparedState).toBe('create');
                  _context17.next = 4;
                  return (0, _utils.expectToRejectWithMessage)(model.update(function () {}), 'with pending changes');
                case 4:
                  _context17.next = 6;
                  return (0, _utils.expectToRejectWithMessage)(model.markAsDeleted(), 'with pending changes');
                case 6:
                  _context17.next = 8;
                  return (0, _utils.expectToRejectWithMessage)(model.destroyPermanently(), 'with pending changes');
                case 8:
                  expect(function () {
                    return model.observe();
                  }).toThrow('uncommitted');
                  _context17.next = 11;
                  return db.batch(model);
                case 11:
                case "end":
                  return _context17.stop();
              }
            }, _callee17);
          })));
        case 4:
        case "end":
          return _context18.stop();
      }
    }, _callee18);
  })));
  it('disallows changes on records with pending updates', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee20() {
    var db;
    return _regenerator["default"].wrap(function _callee20$(_context20) {
      while (1) switch (_context20.prev = _context20.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          _context20.next = 4;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee19() {
            var model;
            return _regenerator["default"].wrap(function _callee19$(_context19) {
              while (1) switch (_context19.prev = _context19.next) {
                case 0:
                  model = new MockModel(db.get('mock'), {});
                  model.prepareUpdate();
                  expect(function () {
                    model.prepareUpdate();
                  }).toThrow('with pending changes');
                  _context19.next = 5;
                  return (0, _utils.expectToRejectWithMessage)(model.update(function () {}), 'with pending changes');
                case 5:
                  _context19.next = 7;
                  return db.batch(model);
                case 7:
                case "end":
                  return _context19.stop();
              }
            }, _callee19);
          })));
        case 4:
        case "end":
          return _context20.stop();
      }
    }, _callee20);
  })));
  it('disallows writes outside of an writer', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee22() {
    var db, model, expectError;
    return _regenerator["default"].wrap(function _callee22$(_context22) {
      while (1) switch (_context22.prev = _context22.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          _context22.next = 4;
          return db.write(function () {
            return db.get('mock').create();
          });
        case 4:
          model = _context22.sent;
          expectError = function expectError(promise) {
            return (0, _utils.expectToRejectWithMessage)(promise, 'can only be called from inside of a Writer');
          };
          _context22.next = 8;
          return expectError(model.update(_fp.noop));
        case 8:
          _context22.next = 10;
          return expectError(model.markAsDeleted());
        case 10:
          _context22.next = 12;
          return expectError(model.destroyPermanently());
        case 12:
          _context22.next = 14;
          return expectError(model.experimentalMarkAsDeleted());
        case 14:
          _context22.next = 16;
          return expectError(model.experimentalDestroyPermanently());
        case 16:
          _context22.next = 18;
          return expectError(db.read(function () {
            return model.update(_fp.noop);
          }));
        case 18:
          _context22.next = 20;
          return expectError(db.read(function () {
            return model.markAsDeleted();
          }));
        case 20:
          _context22.next = 22;
          return expectError(db.read(function () {
            return model.destroyPermanently();
          }));
        case 22:
          _context22.next = 24;
          return expectError(db.read(function () {
            return model.experimentalMarkAsDeleted();
          }));
        case 24:
          _context22.next = 26;
          return expectError(db.read(function () {
            return model.experimentalDestroyPermanently();
          }));
        case 26:
          _context22.next = 28;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee21() {
            return _regenerator["default"].wrap(function _callee21$(_context21) {
              while (1) switch (_context21.prev = _context21.next) {
                case 0:
                  _context21.next = 2;
                  return model.update(_fp.noop);
                case 2:
                  _context21.next = 4;
                  return model.markAsDeleted();
                case 4:
                  _context21.next = 6;
                  return model.destroyPermanently();
                case 6:
                  _context21.next = 8;
                  return model.experimentalMarkAsDeleted();
                case 8:
                  _context21.next = 10;
                  return model.experimentalDestroyPermanently();
                case 10:
                case "end":
                  return _context21.stop();
              }
            }, _callee21);
          })));
        case 28:
        case "end":
          return _context22.stop();
      }
    }, _callee22);
  })));
});
describe('Automatic created_at/updated_at', function () {
  it('_prepareCreate: sets created_at on create if model defines it', function () {
    var db = makeDatabase();
    var m1 = MockModelCreated._prepareCreate(db.get('mock_created'), _fp.noop);
    expect(m1.createdAt).toBeInstanceOf(Date);
    expect(+m1.createdAt).toBeGreaterThan(1500000000000);
    expect(m1.updatedAt).toBe(undefined);
  });
  it('_prepareCreate: sets created_at, updated_at on create if model defines it', function () {
    var db = makeDatabase();
    var m1 = MockModelCreatedUpdated._prepareCreate(db.get('mock_created_updated'), _fp.noop);
    expect(m1.createdAt).toBeInstanceOf(Date);
    expect(+m1.createdAt).toBe(+m1.updatedAt);
  });
  it('touches updated_at on update if model defines it', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee24() {
    var db;
    return _regenerator["default"].wrap(function _callee24$(_context24) {
      while (1) switch (_context24.prev = _context24.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          _context24.next = 4;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee23() {
            var m1, updatedAt;
            return _regenerator["default"].wrap(function _callee23$(_context23) {
              while (1) switch (_context23.prev = _context23.next) {
                case 0:
                  _context23.next = 2;
                  return db.get('mock_updated').create(function (record) {
                    record._raw.updated_at -= 100;
                  });
                case 2:
                  m1 = _context23.sent;
                  updatedAt = +m1.updatedAt;
                  _context23.next = 6;
                  return m1.update();
                case 6:
                  expect(+m1.updatedAt).toBeGreaterThan(updatedAt);
                case 7:
                case "end":
                  return _context23.stop();
              }
            }, _callee23);
          })));
        case 4:
        case "end":
          return _context24.stop();
      }
    }, _callee24);
  })));
});
describe('RawRecord manipulation', function () {
  it('allows raw access via _getRaw', function () {
    var model = new MockModel(null, {
      col1: 'val1',
      col2: false,
      col3: null
    });
    expect(model._getRaw('col1')).toBe('val1');
    expect(model._getRaw('col2')).toBe(false);
    expect(model._getRaw('col3')).toBe(null);
    model._raw.col1 = 'val2';
    expect(model._getRaw('col1')).toBe('val2');
  });
  it('allows raw writes via _setRaw', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee25() {
    var db, model;
    return _regenerator["default"].wrap(function _callee25$(_context25) {
      while (1) switch (_context25.prev = _context25.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          model = new MockModel(db.get('mock'), (0, _RawRecord.sanitizedRaw)({
            name: 'val1'
          }, mockSchema.tables.mock));
          _context25.next = 5;
          return db.write(function () {
            return model.update(function () {
              model._setRaw('name', 'val2');
              model._setRaw('otherfield', 'val3');
            });
          });
        case 5:
          expect(model._raw.name).toBe('val2');
          expect(model._raw.otherfield).toBe('val3');
        case 7:
        case "end":
          return _context25.stop();
      }
    }, _callee25);
  })));
  it('allows raw writes via _dangerouslySetRawWithoutMarkingColumnChange', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee26() {
    var db, model;
    return _regenerator["default"].wrap(function _callee26$(_context26) {
      while (1) switch (_context26.prev = _context26.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          model = new MockModel(db.get('mock'), (0, _RawRecord.sanitizedRaw)({
            name: 'val1'
          }, mockSchema.tables.mock));
          _context26.next = 5;
          return db.write(function () {
            return model.update(function () {
              model._dangerouslySetRawWithoutMarkingColumnChange('name', 'val2');
              model._dangerouslySetRawWithoutMarkingColumnChange('otherfield', 'val3');
            });
          });
        case 5:
          expect(model._raw.name).toBe('val2');
          expect(model._raw.otherfield).toBe('val3');
        case 7:
        case "end":
          return _context26.stop();
      }
    }, _callee26);
  })));
});
describe('Sync status fields', function () {
  it('adds to changes on _setRaw', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee28() {
    var db;
    return _regenerator["default"].wrap(function _callee28$(_context28) {
      while (1) switch (_context28.prev = _context28.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          _context28.next = 4;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee27() {
            var model, model2;
            return _regenerator["default"].wrap(function _callee27$(_context27) {
              while (1) switch (_context27.prev = _context27.next) {
                case 0:
                  _context27.next = 2;
                  return db.get('mock').create(function (newModel) {
                    newModel._setRaw('name', 'val1');
                    newModel._setRaw('otherfield', 'val2');
                  });
                case 2:
                  model = _context27.sent;
                  expect(model._raw._status).toBe('created');
                  expect(model._raw._changed).toBe('');

                  // update created record
                  _context27.next = 7;
                  return model.update(function () {
                    model._setRaw('col3', 'val3');
                    model._setRaw('col3', 'val4');
                    model._setRaw('col4', 'val5');
                    model._setRaw('col3', 'val6');
                  });
                case 7:
                  expect(model._raw._status).toBe('created');
                  expect(model._raw._changed).toBe('col3,col4');

                  // update synced record
                  model2 = new MockModel(db.get('mock'), (0, _RawRecord.sanitizedRaw)({
                    id: 'xx',
                    _status: 'synced'
                  }, mockSchema.tables.mock));
                  _context27.next = 12;
                  return model2.update(function () {
                    model2._setRaw('name', 'val1');
                  });
                case 12:
                  expect(model2._raw._status).toBe('updated');
                  expect(model2._raw._changed).toBe('name');

                  // update updated record
                  _context27.next = 16;
                  return model2.update(function () {
                    model2._setRaw('otherfield', 'hello');
                  });
                case 16:
                  expect(model2._raw._status).toBe('updated');
                  expect(model2._raw._changed).toBe('name,otherfield');
                case 18:
                case "end":
                  return _context27.stop();
              }
            }, _callee27);
          })));
        case 4:
        case "end":
          return _context28.stop();
      }
    }, _callee28);
  })));
  it('does not add to _changed if sanitized value is equal to current value', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee30() {
    var db;
    return _regenerator["default"].wrap(function _callee30$(_context30) {
      while (1) switch (_context30.prev = _context30.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          _context30.next = 4;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee29() {
            var model;
            return _regenerator["default"].wrap(function _callee29$(_context29) {
              while (1) switch (_context29.prev = _context29.next) {
                case 0:
                  model = new MockModel(db.get('mock'), (0, _RawRecord.sanitizedRaw)({
                    col3: '',
                    number: 0
                  }, mockSchema.tables.mock));
                  _context29.next = 3;
                  return model.update(function () {
                    model._raw.id = 'xxx';
                    model._raw._status = 'updated';
                    model._setRaw('name', null); // ensure we're comparing sanitized values
                    model._setRaw('otherfield', '');
                    model._setRaw('col3', 'foo');
                    model._setRaw('col4', undefined);
                    model._setRaw('number', NaN);
                    expect(model._raw._changed).toBe('col3');
                    model._setRaw('number', 10);
                  });
                case 3:
                  expect(model._raw).toEqual({
                    _status: 'updated',
                    _changed: 'col3,number',
                    id: 'xxx',
                    name: '',
                    otherfield: '',
                    col3: 'foo',
                    col4: null,
                    number: 10
                  });
                case 4:
                case "end":
                  return _context29.stop();
              }
            }, _callee29);
          })));
        case 4:
        case "end":
          return _context30.stop();
      }
    }, _callee30);
  })));
  it('does not change _changed fields when using _dangerouslySetRawWithoutMarkingColumnChange', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee32() {
    var db;
    return _regenerator["default"].wrap(function _callee32$(_context32) {
      while (1) switch (_context32.prev = _context32.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          _context32.next = 4;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee31() {
            var model;
            return _regenerator["default"].wrap(function _callee31$(_context31) {
              while (1) switch (_context31.prev = _context31.next) {
                case 0:
                  model = new MockModel(db.get('mock'), (0, _RawRecord.sanitizedRaw)({}, mockSchema.tables.mock));
                  _context31.next = 3;
                  return model.update(function () {
                    model._raw._status = 'updated';
                    model._dangerouslySetRawWithoutMarkingColumnChange('col3', 'foo');
                  });
                case 3:
                  expect(model._raw.col3).toBe('foo');
                  expect(model._raw._status).toBe('updated');
                  expect(model._raw._changed).toBe('');
                  _context31.next = 8;
                  return model.update(function () {
                    model._setRaw('otherfield', 'heh');
                    model._dangerouslySetRawWithoutMarkingColumnChange('number', 10);
                  });
                case 8:
                  expect(model._raw._changed).toBe('otherfield');
                case 9:
                case "end":
                  return _context31.stop();
              }
            }, _callee31);
          })));
        case 4:
        case "end":
          return _context32.stop();
      }
    }, _callee32);
  })));
  it('marks new records as status:created', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee34() {
    var db;
    return _regenerator["default"].wrap(function _callee34$(_context34) {
      while (1) switch (_context34.prev = _context34.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          _context34.next = 4;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee33() {
            var mock;
            return _regenerator["default"].wrap(function _callee33$(_context33) {
              while (1) switch (_context33.prev = _context33.next) {
                case 0:
                  _context33.next = 2;
                  return db.get('mock').create(function (record) {
                    record.name = 'Initial name';
                  });
                case 2:
                  mock = _context33.sent;
                  expect(mock._raw._status).toBe('created');
                  expect(mock._raw._changed).toBe('');
                  expect(mock.syncStatus).toBe('created');

                  // updating a status:created record DOES add to changed (as of v23)
                  _context33.next = 8;
                  return mock.update(function (record) {
                    record.name = 'New name';
                  });
                case 8:
                  expect(mock.syncStatus).toBe('created');
                  expect(mock._raw._changed).toBe('name');
                case 10:
                case "end":
                  return _context33.stop();
              }
            }, _callee33);
          })));
        case 4:
        case "end":
          return _context34.stop();
      }
    }, _callee34);
  })));
  it('marks updated records with changed fields', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee35() {
    var db, mock;
    return _regenerator["default"].wrap(function _callee35$(_context35) {
      while (1) switch (_context35.prev = _context35.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          mock = new MockModel(db.get('mock'), (0, _RawRecord.sanitizedRaw)({
            id: '',
            _status: 'synced',
            name: 'Initial name'
          }, mockSchema.tables.mock)); // update
          _context35.next = 5;
          return db.write(function () {
            return mock.update(function (record) {
              record.name = 'New name';
            });
          });
        case 5:
          expect(mock._raw._status).toBe('updated');
          expect(mock._raw._changed).toBe('name');

          // change another field
          _context35.next = 9;
          return db.write(function () {
            return mock.update(function (record) {
              record.otherfield = 'New value';
            });
          });
        case 9:
          expect(mock._raw._status).toBe('updated');
          expect(mock._raw._changed).toBe('name,otherfield');

          // no duplicated change fields
          _context35.next = 13;
          return db.write(function () {
            return mock.update(function (record) {
              record.name = 'New name 2';
            });
          });
        case 13:
          expect(mock._raw._changed).toBe('name,otherfield');
        case 14:
        case "end":
          return _context35.stop();
      }
    }, _callee35);
  })));
  it('marks update_at as updated when auto-touched', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee36() {
    var db, m1;
    return _regenerator["default"].wrap(function _callee36$(_context36) {
      while (1) switch (_context36.prev = _context36.next) {
        case 0:
          db = makeDatabase();
          db.adapter.batch = jest.fn();
          m1 = new MockModelUpdated(db.get('mock_updated'), {});
          _context36.next = 5;
          return db.write(function () {
            return m1.update();
          });
        case 5:
          expect(m1._raw._status).toBe('updated');
          expect(m1._raw._changed).toBe('updated_at');
        case 7:
        case "end":
          return _context36.stop();
      }
    }, _callee36);
  })));
});
describe('Disposable Models', function () {
  it("can create a disposable record", function () {
    var db = makeDatabase();
    var record = MockModel._disposableFromDirtyRaw(db.get('mock'), {
      id: 'm1',
      name: 'foo',
      otherfield: 123,
      number: 3.14
    });
    expect(record.database).toBe(db);
    expect(record._raw).toEqual({
      id: 'm1',
      _status: 'disposable',
      _changed: '',
      name: 'foo',
      otherfield: '',
      col3: '',
      col4: null,
      number: 3.14
    });
    expect(record.id).toBe('m1');
    expect(record.syncStatus).toBe('disposable');
    expect(record.name).toBe('foo');
    expect(record.otherfield).toBe('');
    expect(record._getRaw('name')).toBe('foo');
    expect(record._getRaw('number')).toBe(3.14);
  });
  it("cannot modify a disposable record", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee37() {
    var db, record, expectError;
    return _regenerator["default"].wrap(function _callee37$(_context37) {
      while (1) switch (_context37.prev = _context37.next) {
        case 0:
          db = makeDatabase();
          record = MockModel._disposableFromDirtyRaw(db.get('mock'), {
            id: 'm1',
            name: 'foo'
          });
          expectError = function expectError(writeAction) {
            return (0, _utils.expectToRejectWithMessage)(db.write(writeAction), 'cannot be called on a disposable record');
          };
          _context37.next = 5;
          return expectError(function () {
            return record.prepareUpdate(_fp.noop);
          });
        case 5:
          _context37.next = 7;
          return expectError(function () {
            return record.prepareMarkAsDeleted();
          });
        case 7:
          _context37.next = 9;
          return expectError(function () {
            return record.prepareDestroyPermanently();
          });
        case 9:
          _context37.next = 11;
          return expectError(function () {
            return record._setRaw('', '');
          });
        case 11:
          _context37.next = 13;
          return expectError(function () {
            return record._dangerouslySetRawWithoutMarkingColumnChange('', '');
          });
        case 13:
          _context37.next = 15;
          return expectError(function () {
            return record.update(_fp.noop);
          });
        case 15:
          _context37.next = 17;
          return expectError(function () {
            return record.markAsDeleted();
          });
        case 17:
          _context37.next = 19;
          return expectError(function () {
            return record.experimentalMarkAsDeleted();
          });
        case 19:
          _context37.next = 21;
          return expectError(function () {
            return record.experimentalDestroyPermanently();
          });
        case 21:
        case "end":
          return _context37.stop();
      }
    }, _callee37);
  })));
});
describe('Model observation', function () {
  it('notifies Rx observers of changes and deletion', function () {
    var model = new MockModel(null, {});
    var scheduler = (0, _utils.makeScheduler)();
    var changes__ = '--a---a----a-a---b';
    var a________ = '---x|';
    var b________ = '--------x|';
    var c________ = 'x|';
    var aExpected = '---m--m----m-m---|';
    var bExpected = '--------m--m-m---|';
    var cExpected = 'm-m---m----m-m---|';
    scheduler.hot(changes__).subscribe(function (event) {
      event === 'a' ? model._notifyChanged() : model._notifyDestroyed();
    });
    var a$ = scheduler.hot(a________).pipe((0, _operators.mergeMap)(function () {
      return model.observe();
    }));
    var b$ = scheduler.hot(b________).pipe((0, _operators.mergeMap)(function () {
      return model.observe();
    }));
    var c$ = scheduler.hot(c________).pipe((0, _operators.mergeMap)(function () {
      return model.observe();
    }));
    scheduler.expectObservable(a$).toBe(aExpected, {
      m: model
    });
    scheduler.expectObservable(b$).toBe(bExpected, {
      m: model
    });
    scheduler.expectObservable(c$).toBe(cExpected, {
      m: model
    });
    scheduler.flush();
  });
  it('notifies subscribers of changes and deletion', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee39() {
    var _mockDatabase3, tasks, db;
    return _regenerator["default"].wrap(function _callee39$(_context39) {
      while (1) switch (_context39.prev = _context39.next) {
        case 0:
          _mockDatabase3 = (0, _testModels.mockDatabase)(), tasks = _mockDatabase3.tasks, db = _mockDatabase3.db;
          _context39.next = 3;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee38() {
            var task, observer1, unsubscribe1, observer2, unsubscribe2, observer3, unsubscribe3;
            return _regenerator["default"].wrap(function _callee38$(_context38) {
              while (1) switch (_context38.prev = _context38.next) {
                case 0:
                  _context38.next = 2;
                  return tasks.create();
                case 2:
                  task = _context38.sent;
                  observer1 = jest.fn();
                  unsubscribe1 = task.experimentalSubscribe(observer1);
                  expect(observer1).toHaveBeenCalledTimes(0);
                  _context38.next = 8;
                  return task.update();
                case 8:
                  expect(observer1).toHaveBeenCalledTimes(1);
                  expect(observer1).toHaveBeenLastCalledWith(false);
                  observer2 = jest.fn();
                  unsubscribe2 = task.experimentalSubscribe(observer2);
                  expect(observer2).toHaveBeenCalledTimes(0);
                  unsubscribe1();
                  observer3 = jest.fn();
                  unsubscribe3 = task.experimentalSubscribe(observer3);
                  _context38.next = 18;
                  return task.update();
                case 18:
                  expect(observer2).toHaveBeenCalledTimes(1);
                  expect(observer3).toHaveBeenCalledTimes(1);
                  unsubscribe2();
                  _context38.next = 23;
                  return task.update();
                case 23:
                  expect(observer3).toHaveBeenCalledTimes(2);
                  expect(observer3).toHaveBeenLastCalledWith(false);
                  _context38.next = 27;
                  return task.markAsDeleted();
                case 27:
                  expect(observer3).toHaveBeenCalledTimes(3);
                  expect(observer3).toHaveBeenLastCalledWith(true);
                  unsubscribe3();
                  unsubscribe3();
                  expect(observer1).toHaveBeenCalledTimes(1);
                  expect(observer2).toHaveBeenCalledTimes(1);
                  expect(observer3).toHaveBeenCalledTimes(3);
                case 34:
                case "end":
                  return _context38.stop();
              }
            }, _callee38);
          })));
        case 3:
        case "end":
          return _context39.stop();
      }
    }, _callee39);
  })));
  it('unsubscribe can safely be called more than once', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee40() {
    var _mockDatabase4, tasks, db, task, observer1, unsubscribe1, unsubscribe2;
    return _regenerator["default"].wrap(function _callee40$(_context40) {
      while (1) switch (_context40.prev = _context40.next) {
        case 0:
          _mockDatabase4 = (0, _testModels.mockDatabase)(), tasks = _mockDatabase4.tasks, db = _mockDatabase4.db;
          _context40.next = 3;
          return db.write(function () {
            return tasks.create();
          });
        case 3:
          task = _context40.sent;
          observer1 = jest.fn();
          unsubscribe1 = task.experimentalSubscribe(observer1);
          expect(observer1).toHaveBeenCalledTimes(0);
          unsubscribe2 = task.experimentalSubscribe(function () {});
          unsubscribe2();
          unsubscribe2();
          _context40.next = 12;
          return db.write(function () {
            return task.update();
          });
        case 12:
          expect(observer1).toHaveBeenCalledTimes(1);
          unsubscribe1();
        case 14:
        case "end":
          return _context40.stop();
      }
    }, _callee40);
  })));
  it("can subscribe with the same subscriber multiple times", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee41() {
    var _mockDatabase5, db, tasks, task, trigger, subscriber, unsubscribe1, unsubscribe2;
    return _regenerator["default"].wrap(function _callee41$(_context41) {
      while (1) switch (_context41.prev = _context41.next) {
        case 0:
          _mockDatabase5 = (0, _testModels.mockDatabase)(), db = _mockDatabase5.db, tasks = _mockDatabase5.tasks;
          _context41.next = 3;
          return db.write(function () {
            return tasks.create();
          });
        case 3:
          task = _context41.sent;
          trigger = function trigger() {
            return db.write(function () {
              return task.update();
            });
          };
          subscriber = jest.fn();
          unsubscribe1 = task.experimentalSubscribe(subscriber);
          expect(subscriber).toHaveBeenCalledTimes(0);
          _context41.next = 10;
          return trigger();
        case 10:
          expect(subscriber).toHaveBeenCalledTimes(1);
          unsubscribe2 = task.experimentalSubscribe(subscriber);
          expect(subscriber).toHaveBeenCalledTimes(1);
          _context41.next = 15;
          return trigger();
        case 15:
          expect(subscriber).toHaveBeenCalledTimes(3);
          unsubscribe2();
          unsubscribe2(); // noop
          _context41.next = 20;
          return trigger();
        case 20:
          expect(subscriber).toHaveBeenCalledTimes(4);
          unsubscribe1();
          _context41.next = 24;
          return trigger();
        case 24:
          expect(subscriber).toHaveBeenCalledTimes(4);
        case 25:
        case "end":
          return _context41.stop();
      }
    }, _callee41);
  })));
});
describe('model helpers', function () {
  it('checks if fetchDescendants retrieves all the children', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee43() {
    var _mockDatabase6, projects, sections, tasks, comments, db;
    return _regenerator["default"].wrap(function _callee43$(_context43) {
      while (1) switch (_context43.prev = _context43.next) {
        case 0:
          _mockDatabase6 = (0, _testModels.mockDatabase)(), projects = _mockDatabase6.projects, sections = _mockDatabase6.projectSections, tasks = _mockDatabase6.tasks, comments = _mockDatabase6.comments, db = _mockDatabase6.db;
          _context43.next = 3;
          return db.write(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee42() {
            var prepare, sort, p1, p1_descendants, p2, p2_descendants;
            return _regenerator["default"].wrap(function _callee42$(_context42) {
              while (1) switch (_context42.prev = _context42.next) {
                case 0:
                  prepare = function prepare(collection, raw) {
                    return collection.prepareCreateFromDirtyRaw(raw);
                  };
                  sort = function sort(list) {
                    return (0, _sortBy["default"])(function (record) {
                      return record.id;
                    }, list);
                  };
                  p1 = prepare(projects, {
                    id: 'p1'
                  });
                  p1_descendants = [prepare(tasks, {
                    id: 't1',
                    project_id: 'p1'
                  }), prepare(comments, {
                    id: 'c1',
                    task_id: 't1'
                  }), prepare(comments, {
                    id: 'c2',
                    task_id: 't1'
                  }), prepare(tasks, {
                    id: 't2',
                    project_id: 'p1'
                  }), prepare(comments, {
                    id: 'c3',
                    task_id: 't2'
                  })];
                  p2 = prepare(projects, {
                    id: 'p2'
                  });
                  p2_descendants = [prepare(tasks, {
                    id: 't3',
                    project_id: 'p2'
                  }), prepare(comments, {
                    id: 'c4',
                    task_id: 't3'
                  }), prepare(sections, {
                    id: 's1',
                    project_id: 'p2'
                  }), prepare(tasks, {
                    id: 't4',
                    project_id: 'p2',
                    project_section_id: 's1'
                  }), prepare(tasks, {
                    id: 't5',
                    project_id: 'p2',
                    project_section_id: 's1'
                  }), prepare(tasks, {
                    id: 't6',
                    project_id: 'p2',
                    project_section_id: 's1'
                  }), prepare(comments, {
                    id: 'c5',
                    task_id: 't6'
                  }), prepare(sections, {
                    id: 's2',
                    project_id: 'p2'
                  })];
                  _context42.next = 8;
                  return db.batch.apply(db, [p1].concat(p1_descendants, [p2], p2_descendants));
                case 8:
                  _context42.t0 = expect;
                  _context42.t1 = sort;
                  _context42.next = 12;
                  return (0, _helpers.fetchDescendants)(p1);
                case 12:
                  _context42.t2 = _context42.sent;
                  _context42.t3 = (0, _context42.t1)(_context42.t2);
                  (0, _context42.t0)(_context42.t3).toEqual(sort(p1_descendants));
                  _context42.t4 = expect;
                  _context42.t5 = sort;
                  _context42.next = 19;
                  return (0, _helpers.fetchDescendants)(p2);
                case 19:
                  _context42.t6 = _context42.sent;
                  _context42.t7 = (0, _context42.t5)(_context42.t6).length;
                  (0, _context42.t4)(_context42.t7).toEqual(sort(p2_descendants).length);
                  _context42.t8 = expect;
                  _context42.t9 = sort;
                  _context42.next = 26;
                  return (0, _helpers.fetchDescendants)(p2);
                case 26:
                  _context42.t10 = _context42.sent;
                  _context42.t11 = (0, _context42.t9)(_context42.t10);
                  (0, _context42.t8)(_context42.t11).toEqual(sort(p2_descendants));
                case 29:
                case "end":
                  return _context42.stop();
              }
            }, _callee42);
          })));
        case 3:
        case "end":
          return _context43.stop();
      }
    }, _callee43);
  })));
});