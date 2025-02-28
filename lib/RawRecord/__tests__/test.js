"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _rambdax = require("rambdax");
var _Schema = require("../../Schema");
var _index = require("../index");
var _helpers = require("./helpers");
var mockTaskSchema = (0, _Schema.tableSchema)({
  name: 'mock_tasks',
  columns: [{
    name: 'name',
    type: 'string'
  }, {
    name: 'responsible_id',
    type: 'string',
    isOptional: true
  }, {
    name: 'created_at',
    type: 'number'
  }, {
    name: 'ended_at',
    type: 'number',
    isOptional: true
  }, {
    name: 'project_position',
    type: 'number'
  }, {
    name: 'priority_position',
    type: 'number',
    isOptional: true
  }, {
    name: 'is_abandonned',
    type: 'boolean'
  }, {
    name: 'is_all_day',
    type: 'boolean',
    isOptional: true
  }]
});
describe('sanitizedRaw()', function () {
  it('can sanitize the whole raw', function () {
    var goodTask = {
      id: 'abcdef',
      _status: 'synced',
      _changed: '',
      name: 'My task',
      responsible_id: 'abcdef',
      created_at: 1632612920392,
      ended_at: null,
      priority_position: null,
      project_position: 78.4,
      is_abandonned: false,
      is_all_day: false
    };
    expect((0, _index.sanitizedRaw)(goodTask, mockTaskSchema)).not.toBe(goodTask);
    expect((0, _index.sanitizedRaw)(goodTask, mockTaskSchema)).toEqual(goodTask);
    var goodTask2 = {
      id: 'abcdef2',
      _status: 'updated',
      _changed: 'foo,bar',
      name: 'My task 2',
      responsible_id: null,
      created_at: 1432612920392,
      ended_at: 1232612920392,
      priority_position: 12.4,
      project_position: -20.1,
      is_abandonned: true,
      is_all_day: null
    };
    expect((0, _index.sanitizedRaw)(goodTask2, mockTaskSchema)).toEqual(goodTask2);
    var messyTask = {
      id: 'abcdef3',
      _status: 'created',
      _changed: null,
      last_modified: 1000 /* .1 */,
      // last_modified was removed
      name: '',
      created_at: 2018 /* .5 */,
      ended_at: 'NaN',
      project_position: null,
      $loki: 1024,
      new_field: 'wtf'
    };
    expect((0, _index.sanitizedRaw)(messyTask, mockTaskSchema)).toEqual({
      id: 'abcdef3',
      _status: 'created',
      _changed: '',
      name: '',
      responsible_id: null,
      created_at: 2018,
      ended_at: null,
      priority_position: null,
      project_position: 0,
      is_abandonned: false,
      is_all_day: null
    });
  });
  it("can create a valid raw from nothin'", function () {
    var newRaw = (0, _index.sanitizedRaw)({}, mockTaskSchema);
    expect((0, _rambdax.omit)(['id'], newRaw)).toEqual({
      _status: 'created',
      _changed: '',
      name: '',
      responsible_id: null,
      created_at: 0,
      ended_at: null,
      priority_position: null,
      project_position: 0,
      is_abandonned: false,
      is_all_day: null
    });
    expect((0, _typeof2["default"])(newRaw.id)).toBe('string');
    expect(newRaw.id).toHaveLength(16);
  });
  it('sanitizes id, _status, _changed', function () {
    var schema2 = (0, _Schema.tableSchema)({
      name: 'test2',
      columns: []
    });
    var validateId = function validateId(raw) {
      expect((0, _typeof2["default"])(raw.id)).toBe('string');
      expect(raw.id).toHaveLength(16);
    };

    // if ID is missing or malformed, treat this as a new object
    var raw1 = (0, _index.sanitizedRaw)({
      _status: 'updated',
      _changed: 'a,b'
    }, schema2);
    expect((0, _rambdax.omit)(['id'], raw1)).toEqual({
      _status: 'created',
      _changed: ''
    });
    validateId(raw1);
    var raw2 = (0, _index.sanitizedRaw)({
      id: null,
      _status: 'updated',
      _changed: 'a,b'
    }, schema2);
    expect((0, _rambdax.omit)(['id'], raw2)).toEqual({
      _status: 'created',
      _changed: ''
    });
    validateId(raw2);

    // otherwise, just sanitize other fields
    var raw3 = (0, _index.sanitizedRaw)({
      id: 'i1',
      _status: '',
      _changed: 'a,b'
    }, schema2);
    expect(raw3).toEqual({
      id: 'i1',
      _status: 'created',
      _changed: 'a,b'
    });
    var raw4 = (0, _index.sanitizedRaw)({
      id: 'i2',
      _status: 'deleted',
      _changed: true
    }, schema2);
    expect(raw4).toEqual({
      id: 'i2',
      _status: 'deleted',
      _changed: ''
    });
  });
  it('is safe against __proto__ tricks', /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var expected, json, protoJson, protoObj;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          // TODO: It's unclear to me if this is actually dangerous/exploitable...
          expected = {
            _status: 'created',
            _changed: '',
            name: '',
            responsible_id: 'abcdef',
            created_at: 0,
            ended_at: null,
            priority_position: null,
            project_position: 0,
            is_abandonned: false,
            is_all_day: null
          };
          json = JSON.parse("{\"__proto__\":{\"name\":\"pwned\"},\"responsible_id\":\"abcdef\"}");
          protoJson = (0, _index.sanitizedRaw)(json, mockTaskSchema);
          expect({}.name).toBe(undefined);
          expect(Object.prototype.hasOwnProperty.call(protoJson, '__proto__')).toBe(false);
          // eslint-disable-next-line no-proto
          expect(protoJson.__proto__.name).toBe(undefined);
          expect((0, _rambdax.omit)(['id'], protoJson)).toEqual(expected);
          protoObj = (0, _index.sanitizedRaw)(Object.assign({}, json), mockTaskSchema);
          expect({}.name).toBe(undefined);
          expect(Object.prototype.hasOwnProperty.call(protoObj, '__proto__')).toBe(false);
          // eslint-disable-next-line no-proto
          expect(protoObj.__proto__.name).toBe(undefined);
          expect((0, _rambdax.omit)(['id'], protoObj)).toEqual(expected);
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
});
describe('setRawSanitized()', function () {
  it('can set one value on a sanitized raw', function () {
    var raw = (0, _index.sanitizedRaw)({}, mockTaskSchema);

    // ?string
    expect(raw.responsible_id).toBe(null);
    (0, _index.setRawSanitized)(raw, 'responsible_id', 'abcdef', mockTaskSchema.columns.responsible_id);
    expect(raw.responsible_id).toBe('abcdef');
    (0, _index.setRawSanitized)(raw, 'responsible_id', false, mockTaskSchema.columns.responsible_id);
    expect(raw.responsible_id).toBe(null);

    // boolean
    expect(raw.is_abandonned).toBe(false);
    (0, _index.setRawSanitized)(raw, 'is_abandonned', true, mockTaskSchema.columns.is_abandonned);
    expect(raw.is_abandonned).toBe(true);
    (0, _index.setRawSanitized)(raw, 'is_abandonned', 0, mockTaskSchema.columns.is_abandonned);
    expect(raw.is_abandonned).toBe(false);
    (0, _index.setRawSanitized)(raw, 'is_abandonned', 1, mockTaskSchema.columns.is_abandonned);
    expect(raw.is_abandonned).toBe(true);
  });
  it('can sanitize every value correctly', function () {
    var test = function test(value, type) {
      var isOptional = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var raw = {};
      (0, _index.setRawSanitized)(raw, 'foo', value, {
        name: 'foo',
        type: type,
        isOptional: isOptional
      });
      return raw.foo;
    };
    _helpers.expectedSanitizations.forEach(function (_ref2) {
      var value = _ref2.value,
        string = _ref2.string,
        _boolean = _ref2["boolean"],
        number = _ref2.number;
      expect(test(value, 'string')).toBe(string[0]);
      expect(test(value, 'string', true)).toBe(string[1]);
      expect(test(value, 'boolean')).toBe(_boolean[0]);
      expect(test(value, 'boolean', true)).toBe(_boolean[1]);
      expect(test(value, 'number')).toBe(number[0]);
      expect(test(value, 'number', true)).toBe(number[1]);
    });
  });
});
describe('nullValue()', function () {
  it('can return null value for any column schema', function () {
    expect((0, _index.nullValue)({
      name: 'foo',
      type: 'string'
    })).toBe('');
    expect((0, _index.nullValue)({
      name: 'foo',
      type: 'string',
      isOptional: true
    })).toBe(null);
    expect((0, _index.nullValue)({
      name: 'foo',
      type: 'number'
    })).toBe(0);
    expect((0, _index.nullValue)({
      name: 'foo',
      type: 'number',
      isOptional: true
    })).toBe(null);
    expect((0, _index.nullValue)({
      name: 'foo',
      type: 'boolean'
    })).toBe(false);
    expect((0, _index.nullValue)({
      name: 'foo',
      type: 'boolean',
      isOptional: true
    })).toBe(null);
  });
});