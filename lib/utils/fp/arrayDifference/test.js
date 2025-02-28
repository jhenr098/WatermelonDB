"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = _interopRequireDefault(require("./index"));
describe('arrayDifference', function () {
  it('checks for differences between arrays', function () {
    expect((0, _index["default"])([], [])).toEqual({
      added: [],
      removed: []
    });
    expect((0, _index["default"])([null], [null])).toEqual({
      added: [],
      removed: []
    });
    expect((0, _index["default"])([null], [])).toEqual({
      added: [],
      removed: [null]
    });
    expect((0, _index["default"])([], [null])).toEqual({
      added: [null],
      removed: []
    });
    expect((0, _index["default"])([true], [false])).toEqual({
      added: [false],
      removed: [true]
    });
  });
  it('checks for differences between arrays of ints', function () {
    expect((0, _index["default"])([1], [])).toEqual({
      added: [],
      removed: [1]
    });
    expect((0, _index["default"])([1, 2], [])).toEqual({
      added: [],
      removed: [1, 2]
    });
    expect((0, _index["default"])([], [1])).toEqual({
      added: [1],
      removed: []
    });
    expect((0, _index["default"])([], [1, 2])).toEqual({
      added: [1, 2],
      removed: []
    });
    expect((0, _index["default"])([1, 2], [2, 3])).toEqual({
      added: [3],
      removed: [1]
    });
    expect((0, _index["default"])([1, 2, 3], [1, 2, 3])).toEqual({
      added: [],
      removed: []
    });
    expect((0, _index["default"])([1, 2, 3], [4, 5, 6])).toEqual({
      added: [4, 5, 6],
      removed: [1, 2, 3]
    });
  });
  it('checks for differences between arrays of strings', function () {
    expect((0, _index["default"])([''], [''])).toEqual({
      added: [],
      removed: []
    });
    expect((0, _index["default"])([''], [])).toEqual({
      added: [],
      removed: ['']
    });
    expect((0, _index["default"])([], [''])).toEqual({
      added: [''],
      removed: []
    });
    expect((0, _index["default"])(['string'], [])).toEqual({
      added: [],
      removed: ['string']
    });
    expect((0, _index["default"])([], ['string'])).toEqual({
      added: ['string'],
      removed: []
    });
  });
  it('checks for differences between arrays of objects', function () {
    expect((0, _index["default"])([{}], [{}])).toEqual({
      added: [{}],
      removed: [{}]
    });
    expect((0, _index["default"])([{}], [])).toEqual({
      added: [],
      removed: [{}]
    });
    expect((0, _index["default"])([], [{}])).toEqual({
      added: [{}],
      removed: []
    });
    expect((0, _index["default"])([{
      name: 'Kornel',
      isNasty: true
    }], [{
      name: 'Kornel',
      isNasty: true
    }])).toEqual({
      added: [{
        name: 'Kornel',
        isNasty: true
      }],
      removed: [{
        name: 'Kornel',
        isNasty: true
      }]
    });
    expect((0, _index["default"])([{
      name: 'Kornel',
      isNasty: true
    }], [{
      name: 'Kornel',
      isNasty: false
    }])).toEqual({
      added: [{
        name: 'Kornel',
        isNasty: false
      }],
      removed: [{
        name: 'Kornel',
        isNasty: true
      }]
    });
    expect((0, _index["default"])([{
      name: 'Kornel',
      isNasty: true
    }], [])).toEqual({
      added: [],
      removed: [{
        name: 'Kornel',
        isNasty: true
      }]
    });
    expect((0, _index["default"])([], [{
      name: 'Kornel',
      isNasty: false
    }])).toEqual({
      added: [{
        name: 'Kornel',
        isNasty: false
      }],
      removed: []
    });
    expect((0, _index["default"])([{
      name: 'Kornel',
      isNasty: true
    }], [{
      name: 'Kornel',
      isNasty: false
    }])).toEqual({
      added: [{
        name: 'Kornel',
        isNasty: false
      }],
      removed: [{
        name: 'Kornel',
        isNasty: true
      }]
    });
  });
});