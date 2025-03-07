"use strict";

exports.__esModule = true;
exports["default"] = processChangeSet;
// WARN: Mutates arguments
function processChangeSet(changeSet, matcher, mutableMatchingRecords) {
  var shouldEmit = false;
  changeSet.forEach(function (change) {
    var record = change.record,
      type = change.type;
    var index = mutableMatchingRecords.indexOf(record);
    var currentlyMatching = index > -1;
    if (type === 'destroyed') {
      if (currentlyMatching) {
        // Remove if record was deleted
        mutableMatchingRecords.splice(index, 1);
        shouldEmit = true;
      }
      return;
    }
    var matches = matcher(record._raw);
    if (currentlyMatching && !matches) {
      // Remove if doesn't match anymore
      mutableMatchingRecords.splice(index, 1);
      shouldEmit = true;
    } else if (matches && !currentlyMatching) {
      // Add if should be included but isn't
      mutableMatchingRecords.push(record);
      shouldEmit = true;
    }
  });
  return shouldEmit;
}