"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _index = _interopRequireDefault(require("./index"));
var _encodeQuery = _interopRequireDefault(require("../encodeQuery"));
var _Query = _interopRequireDefault(require("../../../../Query"));
var _Model3 = _interopRequireDefault(require("../../../../Model"));
var Q = _interopRequireWildcard(require("../../../../QueryDescription"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
// TODO: Standardize these mocks (same as in sqlite encodeQuery, query test)
var MockTask = /*#__PURE__*/function (_Model) {
  function MockTask() {
    return _Model.apply(this, arguments) || this;
  }
  (0, _inheritsLoose2["default"])(MockTask, _Model);
  return MockTask;
}(_Model3["default"]);
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
var MockProject = /*#__PURE__*/function (_Model2) {
  function MockProject() {
    return _Model2.apply(this, arguments) || this;
  }
  (0, _inheritsLoose2["default"])(MockProject, _Model2);
  return MockProject;
}(_Model3["default"]);
MockProject.table = 'projects';
MockProject.associations = {
  teams: {
    type: 'belongs_to',
    key: 'team_id'
  }
};
var mockCollection = Object.freeze({
  modelClass: MockTask,
  db: {
    get: function get(table) {
      return table === 'projects' ? {
        modelClass: MockProject
      } : {};
    }
  }
});
var testQuery = function testQuery(query, performer) {
  return (0, _index["default"])((0, _encodeQuery["default"])(query.serialize()), performer);
};
describe('performJoins', function () {
  it("returns simple queries as is", function () {
    var query = new _Query["default"](mockCollection, [Q.where('col', 'hello')]);
    var performer = jest.fn();
    expect(testQuery(query, performer)).toEqual({
      $and: [{
        col: {
          $eq: 'hello'
        }
      }, {
        _status: {
          $ne: 'deleted'
        }
      }]
    });
    expect(performer).toHaveBeenCalledTimes(0);
  });
  var makePerformer = function makePerformer() {
    return jest.fn(function (_ref) {
      var table = _ref.table;
      if (table === 'projects') {
        return [{
          id: 'p1'
        }, {
          id: 'p2'
        }, {
          id: 'p3'
        }];
      } else if (table === 'tag_assignments') {
        return [{
          task_id: 't1'
        }, {
          task_id: 't2'
        }];
      } else if (table === 'teams') {
        return [{
          id: 't1'
        }, {
          id: 't2'
        }];
      }
      return [];
    });
  };
  it("performs JOIN queries", function () {
    var query = new _Query["default"](mockCollection, [Q.on('projects', 'team_id', 'abcdef'), Q.where('left_column', 'right_value'), Q.on('tag_assignments', 'tag_id', Q.oneOf(['a', 'b', 'c'])), Q.on('projects', 'is_active', true)]);
    var performer = makePerformer();
    expect(testQuery(query, performer)).toEqual({
      $and: [{
        project_id: {
          $in: ['p1', 'p2', 'p3']
        }
      }, {
        left_column: {
          $eq: 'right_value'
        }
      }, {
        id: {
          $in: ['t1', 't2']
        }
      }, {
        project_id: {
          $in: ['p1', 'p2', 'p3']
        }
      }, {
        _status: {
          $ne: 'deleted'
        }
      }]
    });
    expect(performer).toHaveBeenCalledTimes(3);
    expect(performer).toHaveBeenCalledWith({
      table: 'projects',
      query: {
        $and: [{
          team_id: {
            $eq: 'abcdef'
          }
        }, {
          _status: {
            $ne: 'deleted'
          }
        }]
      },
      mapKey: 'id',
      joinKey: 'project_id'
    });
    expect(performer).toHaveBeenLastCalledWith({
      table: 'projects',
      query: {
        $and: [{
          is_active: {
            $aeq: true
          }
        }, {
          _status: {
            $ne: 'deleted'
          }
        }]
      },
      mapKey: 'id',
      joinKey: 'project_id'
    });
    expect(performer).toHaveBeenCalledWith({
      table: 'tag_assignments',
      query: {
        $and: [{
          tag_id: {
            $in: ['a', 'b', 'c']
          }
        }, {
          _status: {
            $ne: 'deleted'
          }
        }]
      },
      mapKey: 'task_id',
      joinKey: 'id'
    });
  });
  it("performs on()s nested inside AND/ORs", function () {
    var query = new _Query["default"](mockCollection, [Q.experimentalJoinTables(['projects', 'tag_assignments']), Q.or(Q.where('is_followed', true), Q.on('projects', 'is_followed', true), Q.and(Q.on('tag_assignments', 'foo', 'bar')))]);
    var performer = makePerformer();
    expect(testQuery(query, performer)).toEqual({
      $and: [{
        $or: [{
          is_followed: {
            $aeq: true
          }
        }, {
          project_id: {
            $in: ['p1', 'p2', 'p3']
          }
        }, {
          id: {
            $in: ['t1', 't2']
          }
        }]
      }, {
        _status: {
          $ne: 'deleted'
        }
      }]
    });
    expect(performer).toHaveBeenCalledTimes(2);
    expect(performer).toHaveBeenCalledWith({
      table: 'projects',
      query: {
        $and: [{
          is_followed: {
            $aeq: true
          }
        }, {
          _status: {
            $ne: 'deleted'
          }
        }]
      },
      mapKey: 'id',
      joinKey: 'project_id'
    });
    expect(performer).toHaveBeenCalledWith({
      table: 'tag_assignments',
      query: {
        $and: [{
          foo: {
            $eq: 'bar'
          }
        }, {
          _status: {
            $ne: 'deleted'
          }
        }]
      },
      mapKey: 'task_id',
      joinKey: 'id'
    });
  });
  it("performs Q.on nested inside Q.on", function () {
    var query = new _Query["default"](mockCollection, [Q.experimentalJoinTables(['projects']), Q.experimentalNestedJoin('projects', 'teams'), Q.on('projects', Q.on('teams', 'foo', 'bar'))]);
    var performer = makePerformer();
    expect(testQuery(query, performer)).toEqual({
      $and: [{
        project_id: {
          $in: ['p1', 'p2', 'p3']
        }
      }, {
        _status: {
          $ne: 'deleted'
        }
      }]
    });
    expect(performer).toHaveBeenCalledTimes(2);
    expect(performer).toHaveBeenCalledWith({
      table: 'teams',
      query: {
        $and: [{
          foo: {
            $eq: 'bar'
          }
        }, {
          _status: {
            $ne: 'deleted'
          }
        }]
      },
      mapKey: 'id',
      joinKey: 'team_id'
    });
    expect(performer).toHaveBeenCalledWith({
      table: 'projects',
      query: {
        $and: [{
          team_id: {
            $in: ['t1', 't2']
          }
        }, {
          _status: {
            $ne: 'deleted'
          }
        }]
      },
      mapKey: 'id',
      joinKey: 'project_id'
    });
  });
});