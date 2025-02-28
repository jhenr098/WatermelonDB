"use strict";

var _index = require("./index");
describe('shallowCloneDeepObjects', function () {
  it('shallow clones deep objects', function () {
    var obj = {
      foo: 'bar'
    };
    var deep = ['foo', ['bar', [obj]]];
    var cloned = (0, _index.shallowCloneDeepObjects)(deep);
    expect(cloned).toEqual(deep);
    expect(cloned).not.toBe(deep);
    expect(cloned[1][1][0]).toEqual(obj);
    expect(cloned[1][1][0]).not.toBe(obj);
    obj.bar = 'baz';
    expect(cloned[1][1][0]).toEqual({
      foo: 'bar'
    });
  });
});