"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _testModels = require("../../__tests__/testModels");
var _Relation = _interopRequireDefault(require("../../Relation"));
describe('decorators/immutableRelation', function () {
  it('creates immutable Relation object', function () {
    var _mockDatabase = (0, _testModels.mockDatabase)(),
      comments = _mockDatabase.comments;
    var primary = new _testModels.MockComment(comments, {
      task_id: 's1'
    });
    var relation = primary.task;
    expect(relation).toEqual(new _Relation["default"](primary, 'mock_tasks', 'task_id', {
      isImmutable: true
    }));
  });
});