"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _common = require("../utils/common");
/* eslint-disable no-use-before-define */
var ReaderInterfaceImpl = /*#__PURE__*/function () {
  function ReaderInterfaceImpl(queue, item) {
    this.__workQueue = queue;
    this.__workItem = item;
  }
  var _proto = ReaderInterfaceImpl.prototype;
  _proto.__validateQueue = function __validateQueue() {
    (0, _common.invariant)(this.__workQueue._queue[0] === this.__workItem, 'Illegal call on a reader/writer that should no longer be running');
  };
  _proto.callReader = function callReader(reader) {
    this.__validateQueue();
    return this.__workQueue.subAction(reader);
  };
  return ReaderInterfaceImpl;
}();
var WriterInterfaceImpl = /*#__PURE__*/function (_ReaderInterfaceImpl) {
  function WriterInterfaceImpl() {
    return _ReaderInterfaceImpl.apply(this, arguments) || this;
  }
  (0, _inheritsLoose2["default"])(WriterInterfaceImpl, _ReaderInterfaceImpl);
  var _proto2 = WriterInterfaceImpl.prototype;
  _proto2.callWriter = function callWriter(writer) {
    this.__validateQueue();
    return this.__workQueue.subAction(writer);
  };
  _proto2.batch = function batch() {
    this.__validateQueue();
    for (var _len = arguments.length, records = new Array(_len), _key = 0; _key < _len; _key++) {
      records[_key] = arguments[_key];
    }
    return this.__workQueue._db.batch(records);
  };
  return WriterInterfaceImpl;
}(ReaderInterfaceImpl);
var actionInterface = function actionInterface(queue, item) {
  return item.isWriter ? new WriterInterfaceImpl(queue, item) : new ReaderInterfaceImpl(queue, item);
};
var WorkQueue = exports["default"] = /*#__PURE__*/function () {
  function WorkQueue(db) {
    this._queue = [];
    this._subActionIncoming = false;
    this._db = db;
  }
  var _proto3 = WorkQueue.prototype;
  _proto3.enqueue = function enqueue(work, description, isWriter) {
    var _this = this;
    // If a subAction was scheduled using subAction(), database.write/read() calls skip the line
    if (this._subActionIncoming) {
      this._subActionIncoming = false;
      var currentWork = this._queue[0];
      if (!currentWork.isWriter) {
        (0, _common.invariant)(!isWriter, 'Cannot call a writer block from a reader block');
      }
      return work(actionInterface(this, currentWork));
    }
    return new Promise(function (resolve, reject) {
      var workItem = {
        work: work,
        isWriter: isWriter,
        resolve: resolve,
        reject: reject,
        description: description
      };
      if (process.env.NODE_ENV !== 'production' && _this._queue.length) {
        setTimeout(function () {
          var queue = _this._queue;
          var current = queue[0];
          if (current === workItem || !queue.includes(workItem)) {
            return;
          }
          var enqueuedKind = isWriter ? 'writer' : 'reader';
          var currentKind = current.isWriter ? 'writer' : 'reader';
          _common.logger.warn("The ".concat(enqueuedKind, " you're trying to run (").concat(description || 'unnamed', ") can't be performed yet, because there are ").concat(queue.length, " other readers/writers in the queue.\n\nCurrent ").concat(currentKind, ": ").concat(current.description || 'unnamed', ".\n\nIf everything is working fine, you can safely ignore this message (queueing is working as expected). But if your readers/writers are not running, it's because the current ").concat(currentKind, " is stuck.\nRemember that if you're calling a reader/writer from another reader/writer, you must use callReader()/callWriter(). See docs for more details."));
          _common.logger.log("Enqueued ".concat(enqueuedKind, ":"), work);
          _common.logger.log("Running ".concat(currentKind, ":"), current.work);
        }, 1500);
      }
      _this._queue.push(workItem);
      if (_this._queue.length === 1) {
        _this._executeNext();
      }
    });
  };
  _proto3.subAction = function subAction(work) {
    try {
      this._subActionIncoming = true;
      var promise = work();
      (0, _common.invariant)(!this._subActionIncoming, 'callReader/callWriter call must call a reader/writer synchronously');
      return promise;
    } catch (error) {
      this._subActionIncoming = false;
      return Promise.reject(error);
    }
  };
  _proto3._executeNext = /*#__PURE__*/function () {
    var _executeNext2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var _this2 = this;
      var workItem, work, resolve, reject, isWriter, workPromise;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            workItem = this._queue[0];
            work = workItem.work, resolve = workItem.resolve, reject = workItem.reject, isWriter = workItem.isWriter;
            _context.prev = 2;
            workPromise = work(actionInterface(this, workItem));
            if (process.env.NODE_ENV !== 'production') {
              (0, _common.invariant)(workPromise instanceof Promise, "The function passed to database.".concat(isWriter ? 'write' : 'read', "() or a method marked as @").concat(isWriter ? 'writer' : 'reader', " must be asynchronous (marked as 'async' or always returning a promise) (in: ").concat(workItem.description || 'unnamed', ")"));
            }
            _context.t0 = resolve;
            _context.next = 8;
            return workPromise;
          case 8:
            _context.t1 = _context.sent;
            (0, _context.t0)(_context.t1);
            _context.next = 15;
            break;
          case 12:
            _context.prev = 12;
            _context.t2 = _context["catch"](2);
            reject(_context.t2);
          case 15:
            this._queue.shift();
            if (this._queue.length) {
              setTimeout(function () {
                return _this2._executeNext();
              }, 0);
            }
          case 17:
          case "end":
            return _context.stop();
        }
      }, _callee, this, [[2, 12]]);
    }));
    function _executeNext() {
      return _executeNext2.apply(this, arguments);
    }
    return _executeNext;
  }();
  _proto3._abortPendingWork = function _abortPendingWork() {
    (0, _common.invariant)(this._queue.length >= 1, '_abortPendingWork can only be called from a reader/writer');
    var workToAbort = this._queue.splice(1); // leave only the caller on the queue
    workToAbort.forEach(function (_ref) {
      var reject = _ref.reject;
      reject(new Error('Reader/writer has been aborted because the database was reset'));
    });
  };
  return (0, _createClass2["default"])(WorkQueue, [{
    key: "isWriterRunning",
    get: function get() {
      var _this$_queue = (0, _slicedToArray2["default"])(this._queue, 1),
        item = _this$_queue[0];
      return Boolean(item && item.isWriter);
    }
  }]);
}();