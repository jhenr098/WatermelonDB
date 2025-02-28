"use strict";

var _helpers = require("../helpers");
var _helpers2 = require("./helpers");
describe('resolveConflict', function () {
  it('can resolve per-column conflicts', function () {
    expect((0, _helpers.resolveConflict)({
      col1: 'a',
      col2: true,
      col3: 10,
      _status: 'updated',
      _changed: 'col2'
    }, {
      col1: 'b',
      col2: false,
      col3: 10
    })).toEqual({
      _status: 'updated',
      _changed: 'col2',
      col1: 'b',
      col2: true,
      col3: 10
    });
    expect((0, _helpers.resolveConflict)({
      col1: 'a',
      col2: true,
      col3: 20,
      _status: 'updated',
      _changed: 'col2,col3'
    }, {
      col1: 'b',
      col2: false,
      col3: 10
    })).toEqual({
      _status: 'updated',
      _changed: 'col2,col3',
      col1: 'b',
      col2: true,
      col3: 20
    });
  });
  it('ignores missing remote columns', function () {
    expect((0, _helpers.resolveConflict)({
      col1: 'a',
      col2: true,
      col3: 20,
      _status: 'updated',
      _changed: 'col2'
    }, {
      col2: false
    })).toEqual({
      _status: 'updated',
      _changed: 'col2',
      col1: 'a',
      col2: true,
      col3: 20
    });
  });
});
describe('isChangeSetEmpty', function () {
  it('empty changeset is empty', function () {
    expect((0, _helpers.isChangeSetEmpty)(_helpers2.emptyChangeSet)).toBe(true);
    expect((0, _helpers.isChangeSetEmpty)({})).toBe(true);
  });
  it('just one change is enough to dirty the changeset', function () {
    expect((0, _helpers.isChangeSetEmpty)((0, _helpers2.makeChangeSet)({
      mock_projects: {
        created: [{
          id: 'foo'
        }]
      }
    }))).toBe(false);
    expect((0, _helpers.isChangeSetEmpty)((0, _helpers2.makeChangeSet)({
      mock_tasks: {
        updated: [{
          id: 'foo'
        }]
      }
    }))).toBe(false);
    expect((0, _helpers.isChangeSetEmpty)((0, _helpers2.makeChangeSet)({
      mock_comments: {
        deleted: ['foo']
      }
    }))).toBe(false);
  });
});
describe('requiresUpdate', function () {
  it("know how to skip unnecessary updates", function () {
    var _makeDatabase = (0, _helpers2.makeDatabase)(),
      tasks = _makeDatabase.tasks;
    var check = function check(local, remote) {
      return (0, _helpers.requiresUpdate)(tasks, (0, _helpers2.prepareCreateFromRaw)(tasks, local)._raw, remote);
    };
    expect(check({
      id: 't1',
      name: 'foo'
    }, {
      id: 't1',
      name: 'foo'
    })).toBe(false);
    expect(check({
      id: 't1',
      name: 'foo'
    }, {
      id: 't1',
      name: 'foo',
      description: null,
      position: 0
    })).toBe(false);
    expect(check({
      id: 't1',
      name: 'foo'
    }, {
      id: 't1'
    })).toBe(true);
    expect(check({
      id: 't1',
      name: 'foo'
    }, {
      id: 't2',
      name: 'foo'
    })).toBe(true);
    expect(check({
      id: 't1',
      name: 'foo'
    }, {
      id: 't1',
      name: 'bar'
    })).toBe(true);
    expect(check({
      _status: 'updated',
      id: 't1',
      name: 'foo'
    }, {
      id: 't1',
      name: 'foo'
    })).toBe(true);
  });
});