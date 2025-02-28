"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _logError = _interopRequireDefault(require("../../../utils/common/logError"));
var _invariant = _interopRequireDefault(require("../../../utils/common/invariant"));
var _DatabaseDriver = _interopRequireDefault(require("./DatabaseDriver"));
// don't import whole `utils` to keep worker size small
var DatabaseBridge = exports["default"] = /*#__PURE__*/function () {
  function DatabaseBridge(workerContext) {
    var _this = this;
    this.queue = [];
    this._actionsExecuting = 0;
    this.workerContext = workerContext;
    this.workerContext.onmessage = function (e) {
      var action = e.data;
      // enqueue action
      _this.queue.push(action);
      if (_this.queue.length === 1) {
        _this.executeNext();
      }
    };
  }
  var _proto = DatabaseBridge.prototype;
  _proto.executeNext = function executeNext() {
    var action = this.queue[0];
    try {
      (0, _invariant["default"])(this._actionsExecuting === 0, 'worker should not have ongoing actions'); // sanity check
      this._actionsExecuting += 1;
      var type = action.type,
        payload = action.payload;
      if (type === 'setUp' || type === 'unsafeResetDatabase') {
        this.processActionAsync(action);
      } else {
        var response = this._driverAction(type).apply(void 0, (0, _toConsumableArray2["default"])(payload));
        this.onActionDone(action, {
          value: response
        });
      }
    } catch (error) {
      this._onError(action, error);
    }
  };
  _proto.processActionAsync = /*#__PURE__*/function () {
    var _processActionAsync = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(action) {
      var type, payload, _payload, options, driver, response;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            type = action.type, payload = action.payload;
            if (!(type === 'setUp')) {
              _context.next = 12;
              break;
            }
            // app just launched, set up driver with options sent
            (0, _invariant["default"])(!this.driver, "Loki driver already set up - cannot set up again");
            _payload = (0, _slicedToArray2["default"])(payload, 1), options = _payload[0];
            driver = new _DatabaseDriver["default"](options); // set up, make this.driver available only if successful
            _context.next = 8;
            return driver.setUp();
          case 8:
            this.driver = driver;
            this.onActionDone(action, {
              value: null
            });
            _context.next = 16;
            break;
          case 12:
            _context.next = 14;
            return this._driverAction(type).apply(void 0, (0, _toConsumableArray2["default"])(payload));
          case 14:
            response = _context.sent;
            this.onActionDone(action, {
              value: response
            });
          case 16:
            _context.next = 21;
            break;
          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](0);
            this._onError(action, _context.t0);
          case 21:
          case "end":
            return _context.stop();
        }
      }, _callee, this, [[0, 18]]);
    }));
    function processActionAsync(_x) {
      return _processActionAsync.apply(this, arguments);
    }
    return processActionAsync;
  }();
  _proto.onActionDone = function onActionDone(action, result) {
    (0, _invariant["default"])(this._actionsExecuting === 1, 'worker should be executing 1 action'); // sanity check
    this._actionsExecuting = 0;
    this.queue.shift();
    try {
      var response = {
        id: action.id,
        result: result,
        cloneMethod: action.returnCloneMethod
      };
      this.workerContext.postMessage(response);
    } catch (error) {
      (0, _logError["default"])(error);
    }
    if (this.queue.length) {
      this.executeNext();
    }
  };
  _proto._driverAction = function _driverAction(type) {
    (0, _invariant["default"])(this.driver, "Cannot run actions because driver is not set up");
    var action = this.driver[type].bind(this.driver);
    (0, _invariant["default"])(action, "Unknown worker action ".concat(type));
    return action;
  };
  _proto._onError = function _onError(action, error) {
    // Main process only receives error message (when using web workers) — this logError is to retain call stack
    (0, _logError["default"])(error);
    this.onActionDone(action, {
      error: error
    });
  };
  return DatabaseBridge;
}();