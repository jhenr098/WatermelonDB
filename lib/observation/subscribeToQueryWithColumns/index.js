"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = subscribeToQueryWithColumns;
var _identicalArrays = _interopRequireDefault(require("../../utils/fp/identicalArrays"));
var _subscribeToSimpleQuery = _interopRequireDefault(require("../subscribeToSimpleQuery"));
var _subscribeToQueryReloading = _interopRequireDefault(require("../subscribeToQueryReloading"));
var _canEncode = _interopRequireDefault(require("../encodeMatcher/canEncode"));
var getRecordState = function getRecordState(record, columnNames) {
  var state = [];
  var raw = record._raw;
  for (var i = 0, len = columnNames.length; i < len; i++) {
    // $FlowFixMe
    state.push(raw[columnNames[i]]);
  }
  return state;
};

// Invariant: same length and order of keys!
var recordStatesEqual = _identicalArrays["default"];

// Observes the given observable list of records, and in those records,
// changes to given `rawFields`
//
// Emits a list of records when:
// - source observable emits a new list
// - any of the records in the list has any of the given fields changed
//
// TODO: Possible future optimizations:
// - simpleObserver could emit added/removed events, and this could operate on those instead of
//   re-deriving the same thing. For reloadingObserver, a Rx adapter could be fitted
// - multiple levels of array copying could probably be omitted

function subscribeToQueryWithColumns(query, columnNames, subscriber) {
  // State kept for comparison between emissions
  var unsubscribed = false;
  var sourceIsFetching = true; // do not emit record-level changes while source is fetching new data
  var hasPendingColumnChanges = false;
  var firstEmission = true;
  var observedRecords = [];
  var recordStates = new Map();
  var emitCopy = function emitCopy(records) {
    !unsubscribed && subscriber(records.slice(0));
  };

  // NOTE:
  // Observing both the source subscription and changes to columns is very tricky
  // if we want to avoid unnecessary emissions (we do, because that triggers wasted app renders).
  // The compounding factor is that we have two methods of observation: simpleObserver which is
  // synchronous, and reloadingObserver, which is asynchronous.
  //
  // For reloadingObserver, we use `reloadingObserverWithStatus` to be notified that an async DB query
  // has begun. If it did, we will not emit column-only changes until query has come back.
  //
  // For simpleObserver, we need to configure it to always emit on collection changes. This is a
  // workaround to solve a race condition - collection observation for column check will always
  // emit first, but we don't know if the list of observed records isn't about to change, so we
  // flag, and wait for source response.
  //
  // FIXME: The above explanation is outdated in practice because modern WatermelonDB uses synchronous
  // adapters... However, JSI on Android isn't yet fully shipped (so this is currently broken), and
  // we may get back to some asynchronicity where appropriate...

  // prepare source observable
  // TODO: On one hand it would be nice to bring in the source logic to this function to optimize
  // on the other, it would be good to have source provided as Observable, not Query
  // so that we can reuse cached responses -- but they don't have compatible format
  var canUseSimpleObservation = (0, _canEncode["default"])(query.description);
  var subscribeToSource = canUseSimpleObservation ? function (observer) {
    return (0, _subscribeToSimpleQuery["default"])(query, observer, true);
  } : function (observer) {
    return (0, _subscribeToQueryReloading["default"])(query, observer, true);
  };
  var asyncSource = !canUseSimpleObservation;

  // Observe changes to records we have on the list
  var debugInfo = {
    name: 'subscribeToQueryWithColumns',
    query: query,
    columnNames: columnNames
  };
  var collectionUnsubscribe = query.collection.experimentalSubscribe(
  // eslint-disable-next-line prefer-arrow-callback
  function observeWithColumnsCollectionChanged(changeSet) {
    var hasColumnChanges = false;
    // Can't use `Array.some`, because then we'd skip saving record state for relevant records
    changeSet.forEach(function (_ref) {
      var record = _ref.record,
        type = _ref.type;
      // See if change is relevant to our query
      if (type !== 'updated') {
        return;
      }
      var previousState = recordStates.get(record.id);
      if (!previousState) {
        return;
      }

      // Check if record changed one of its observed fields
      var newState = getRecordState(record, columnNames);
      if (!recordStatesEqual(previousState, newState)) {
        recordStates.set(record.id, newState);
        hasColumnChanges = true;
      }
    });
    if (hasColumnChanges) {
      if (sourceIsFetching || !asyncSource) {
        // Mark change; will emit on source emission to avoid duplicate emissions
        hasPendingColumnChanges = true;
      } else {
        emitCopy(observedRecords);
      }
    }
  }, debugInfo);

  // Observe the source records list (list of records matching a query)
  // eslint-disable-next-line prefer-arrow-callback
  var sourceUnsubscribe = subscribeToSource(function observeWithColumnsSourceChanged(recordsOrStatus) {
    // $FlowFixMe
    if (recordsOrStatus === false) {
      sourceIsFetching = true;
      return;
    }
    sourceIsFetching = false;

    // Emit changes if one of observed columns changed OR list of matching records changed
    var records = recordsOrStatus;
    var shouldEmit = firstEmission || hasPendingColumnChanges || !(0, _identicalArrays["default"])(records, observedRecords);
    hasPendingColumnChanges = false;
    firstEmission = false;

    // Find changes, and save current list for comparison on next emission
    var arrayDifference = require('../../utils/fp/arrayDifference')["default"];
    var _arrayDifference = arrayDifference(observedRecords, records),
      added = _arrayDifference.added,
      removed = _arrayDifference.removed;
    observedRecords = records;

    // Unsubscribe from records removed from list
    removed.forEach(function (record) {
      recordStates["delete"](record.id);
    });

    // Save current record state for later comparison
    added.forEach(function (newRecord) {
      recordStates.set(newRecord.id, getRecordState(newRecord, columnNames));
    });

    // Emit
    shouldEmit && emitCopy(records);
  });
  return function () {
    unsubscribed = true;
    sourceUnsubscribe();
    collectionUnsubscribe();
  };
}