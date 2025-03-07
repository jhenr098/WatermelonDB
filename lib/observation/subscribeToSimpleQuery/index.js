"use strict";

exports.__esModule = true;
exports["default"] = subscribeToSimpleQuery;
var _common = require("../../utils/common");
function subscribeToSimpleQuery(query, subscriber) {
  var alwaysEmit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var matcher = null;
  var unsubscribed = false;
  var unsubscribe = null;

  // eslint-disable-next-line prefer-arrow-callback
  query.collection._fetchQuery(query, function observeQueryInitialEmission(result) {
    if (unsubscribed) {
      return;
    }
    if (result.error) {
      (0, _common.logError)(result.error.toString());
      return;
    }
    var initialRecords = result.value;

    // Send initial matching records
    var matchingRecords = initialRecords;
    var emitCopy = function emitCopy() {
      return !unsubscribed && subscriber(matchingRecords.slice(0));
    };
    emitCopy();

    // Check if emitCopy haven't completed source observable to avoid memory leaks
    if (unsubscribed) {
      return;
    }

    // Observe changes to the collection
    var debugInfo = {
      name: 'subscribeToSimpleQuery',
      query: query,
      subscriber: subscriber
    };
    // eslint-disable-next-line prefer-arrow-callback
    unsubscribe = query.collection.experimentalSubscribe(function observeQueryCollectionChanged(changeSet) {
      if (!matcher) {
        matcher = require('../encodeMatcher')["default"](query.description);
      }
      // $FlowFixMe
      var shouldEmit = require('./processChangeSet')["default"](changeSet, matcher, matchingRecords);
      if (shouldEmit || alwaysEmit) {
        emitCopy();
      }
    }, debugInfo);
  });
  return function () {
    unsubscribed = true;
    unsubscribe && unsubscribe();
  };
}