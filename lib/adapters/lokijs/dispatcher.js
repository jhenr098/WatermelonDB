"use strict";

exports.__esModule = true;
exports["default"] = void 0;
function createWorker(useWebWorker) {
  if (useWebWorker) {
    var LokiWebWorker = require('./worker/loki.worker');
    return new LokiWebWorker();
  }
  var LokiSynchronousWorker = require('./worker/synchronousWorker')["default"];
  return new LokiSynchronousWorker();
}
var _actionId = 0;
function nextActionId() {
  _actionId += 1;
  return _actionId;
}
var LokiDispatcher = exports["default"] = /*#__PURE__*/function () {
  function LokiDispatcher(useWebWorker) {
    var _this = this;
    this._pendingCalls = [];
    this._worker = createWorker(useWebWorker);
    this._worker.onmessage = function (_ref) {
      var data = _ref.data;
      var _ref2 = data,
        result = _ref2.result,
        responseId = _ref2.id;
      var _this$_pendingCalls$s = _this._pendingCalls.shift(),
        callback = _this$_pendingCalls$s.callback,
        id = _this$_pendingCalls$s.id;

      // sanity check
      if (id !== responseId) {
        callback({
          error: new Error('Loki worker responses are out of order')
        });
        return;
      }
      callback(result);
    };
  }

  // TODO: `any` return should be `WorkerResponsePayload`
  var _proto = LokiDispatcher.prototype;
  _proto.call = function call(type) {
    var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
    var cloneMethod = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'immutable';
    var returnCloneMethod = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'immutable';
    var id = nextActionId();
    this._pendingCalls.push({
      callback: callback,
      id: id
    });
    this._worker.postMessage({
      id: id,
      type: type,
      payload: payload,
      cloneMethod: cloneMethod,
      returnCloneMethod: returnCloneMethod
    });
  };
  return LokiDispatcher;
}();