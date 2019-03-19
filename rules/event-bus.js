"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vue = require("vue");

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 消息中心
 */
var BUS = new _vue2.default();
var _dataSpace = Symbol("DataSpace");
/**
 * 事件总线
 */

var EventBus = function () {
  function EventBus() {
    _classCallCheck(this, EventBus);

    this[_dataSpace] = {};
  }

  _createClass(EventBus, [{
    key: "$on",

    /**
     * 监听事件
     * @param {string} event 事件名称
     * @param {function} eventCallback 事件回调参数
     */
    value: function $on(uid, event, eventCallback) {
      this.$space[uid] || (this.$space[uid] = []);
      this.$space[uid].push(event);
      BUS.$on(event, eventCallback);
    }
    /**
     * 监听事件，但是只触发一次，在第一次触发之后移除监听器。
     * @param {string} event 事件名称
     * @param {function} eventCallback 事件回调参数
     */

  }, {
    key: "$once",
    value: function $once(event, eventCallback) {
      BUS.$once(event, eventCallback);
    }
    /**
     * 移除事件监听器
     *  1、如果没有提供参数，则移除所有的事件监听器
     *  2、如果只提供了事件，则移除该事件所有的监听器；
     *  3、如果同时提供了事件与回调，则只移除这个回调的监听器。
     * @param {string} event 事件名称
     * @param {function} eventCallback 事件回调参数
     */

  }, {
    key: "$off",
    value: function $off(event, eventCallback) {
      BUS.$off(event, eventCallback);
    }
    /**
     * 移除某空间所有监听器
     * @param {*} uid 某空间
     */

  }, {
    key: "$offAll",
    value: function $offAll(uid) {
      this.$space[uid] || (this.$space[uid] = []);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.$space[uid][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var iterator = _step.value;

          this.$off(iterator);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      delete this.$space[uid];
    }

    /**
     * 触发当前实例上的事件。附加参数都会传给监听器回调
     * @param {string} event 事件名称
     * @param {array} args 附加参数
     */

  }, {
    key: "$emit",
    value: function $emit(event) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      BUS.$emit.apply(BUS, [event].concat(args));
    }
  }, {
    key: "$space",
    get: function get() {
      return this[_dataSpace];
    }
  }]);

  return EventBus;
}();

exports.default = new EventBus();