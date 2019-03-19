"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vue = require("vue");

var _vue2 = _interopRequireDefault(_vue);

var _formula = require("./formula");

var _formula2 = _interopRequireDefault(_formula);

var _viewRule = require("./view-rule");

var _viewRule2 = _interopRequireDefault(_viewRule);

var _operation2 = require("./operation");

var _operation3 = _interopRequireDefault(_operation2);

var _operationRule = require("./operation-rule");

var _operationRule2 = _interopRequireDefault(_operationRule);

var _eventBus = require("./event-bus");

var _eventBus2 = _interopRequireDefault(_eventBus);

var _shared = require("./shared");

var _globalUid = require("./global-uid");

var _globalUid2 = _interopRequireDefault(_globalUid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DATA_SPACE = {};
var ViewStatus = Symbol("ViewStatus");
_eventBus2.default.$on('RootView', "PUI_CLEAR_CACHE", function () {
  for (var key in DATA_SPACE) {
    delete DATA_SPACE[key];
    console.log("清空数据", key);
  }
});

var View = function () {
  function View() {
    _classCallCheck(this, View);

    this['_puid'] = _globalUid2.default.get();
    this[_shared._id] = undefined;
    // 公共属性
    this.type = "loading"; // 视图类型
    this[ViewStatus] = "pending";
  }

  _createClass(View, [{
    key: "addEventListener",


    /**
     * 添加触发事件
     * @param type 事件类型
     * @param fn 事件回调函数
     */
    value: function addEventListener(type, fn) {
      if (type === "chanage") type = "update";
      if (type === "update") {
        this.$on(type, fn);
      } else {
        this.$once(type, fn);
        if (type === "created" && this[ViewStatus] === "resolved") {
          // 创建事件已经执行
          this.$emit("created", this);
        }
        if (type === "destroyed" && this[ViewStatus] === "destroyed") {
          this.$emit("destroyed", this);
        }
      }
    }

    /**
     * 删除触发事件
     * @param type 事件类型
     * @param fn 事件回调函数
     */

  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, fn) {
      if (type === "chanage") type = "update";
      this.$off(type, fn);
    }

    /**
     * 处理视图基本信息
     * @param {type} type 列表视图
     */

  }, {
    key: "handlerView",
    value: function handlerView(result, type) {
      var _this = this;

      var recordId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      this[_shared._recordId] = recordId;
      this[_shared._renderData] = result;
      this[_shared._id] = this.viewData.id;
      this.type = type; // 视图类型
      this.addEventListener("created", function () {
        _this[ViewStatus] = "resolved";
      });
      this.addEventListener("destroyed", function () {
        _this[ViewStatus] = "destroyed";
      });
    }
    /**
     * 处理视图真实数据回显
     */

  }, {
    key: "handlerViewRecord",
    value: function handlerViewRecord(columnMap) {
      var _this2 = this;

      if (this.record) {
        for (var key in columnMap) {
          if (columnMap.hasOwnProperty(key) && !isNaN(Number(key))) {
            var column = columnMap[key];
            column.addEventListener("created", function (_column, formModel) {
              var value = _this2.record[_column.valKey];
              var showValue = _this2.record[_column.showValKey];
              if (value === null || value === "null") {
                value = undefined;
              }
              if (showValue === null || showValue === "null") {
                showValue = undefined;
              }
              // 数据库中的值有效才进行赋值
              if (value || value === 0) {
                _this2.$set(formModel, _column.valKey, value);
                _this2.$set(formModel, _column.showValKey, showValue);
                // 触发当前字段更新事件
                _this2.$timeout(function () {
                  _this2.$emit(_column.updateEventName, _column, formModel, 'created');
                });
              }
            });
          }
        }
      }
    }
  }, {
    key: "handlerViewFormula",
    value: function handlerViewFormula() {
      var _this3 = this;

      var result = this[_shared._renderData];
      this[_shared._viewFormulas] = [];
      (result.formulaList || []).forEach(function (formula) {
        _this3[_shared._viewFormulas].push(new _formula2.default(formula, _this3));
      });
    }
  }, {
    key: "handlerViewRule",
    value: function handlerViewRule() {
      var _this4 = this;

      var result = this[_shared._renderData];
      this[_shared._viewRules] = [];
      (result.viewRuleList || []).forEach(function (viewRule) {
        _this4[_shared._viewRules].push(new _viewRule2.default(viewRule, _this4));
      });
    }
  }, {
    key: "handlerOperationRule",
    value: function handlerOperationRule() {
      var _this5 = this;

      var result = this[_shared._renderData];
      this[_shared._operatioRules] = [];
      (result.operationRuleList || []).forEach(function (operationRule) {
        _this5[_shared._operatioRules].push(new _operationRule2.default(operationRule, _this5));
      });
    }
  }, {
    key: "handlerOperation",
    value: function handlerOperation() {
      var _this6 = this;

      this[_shared._operations] = [];
      this[_shared._operationMap] = {};
      var promises = [];
      var operationList = this.renderData.operationList;
      if (operationList && operationList.length > 0) {
        operationList.forEach(function (_operation) {
          var operation = new _operation3.default(_this6, _operation);
          _this6[_shared._operations].push(operation);
          _this6[_shared._operationMap][operation.$id] = operation;
          promises.push(operation.handler());
        });
        operationList.sort(function (a, b) {
          return a.sort - b.sort;
        });
      }
      return Promise.all(promises);
    }
  }, {
    key: "findViewGroupByColumnId",
    value: function findViewGroupByColumnId() {
      return this;
    }

    /**
     * 绑定视图字段事件
     */

  }, {
    key: "bindEventToView",
    value: function bindEventToView(columnMap) {
      // 绑定视图公式
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.viewFormulas[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var formula = _step.value;

          formula.bindEventToViewColumn(columnMap);
        }
        // 绑定视图条件
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

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.viewRules[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var viewRule = _step2.value;

          viewRule.bindEventToViewColumn(columnMap);
        }

        // 绑定操作条件
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.operatioRules[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var operationRule = _step3.value;

          operationRule.bindEventToViewOperation(this.operationMap, columnMap);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: "$set",
    value: function $set(target, key, value) {
      _vue2.default.set(target, key, value);
    }
  }, {
    key: "$delete",
    value: function $delete(target, key) {
      _vue2.default.delete(target, key);
    }
  }, {
    key: "$on",
    value: function $on(event, eventCallback) {
      this.$bus.$on(this.eventKey, this.eventKey + "." + event, eventCallback);
    }
  }, {
    key: "$once",
    value: function $once(event, eventCallback) {
      this.$bus.$once(this.eventKey + "." + event, eventCallback);
    }
  }, {
    key: "$off",
    value: function $off(event, eventCallback) {
      this.$bus.$off(this.eventKey + "." + event, eventCallback);
    }
  }, {
    key: "$emit",
    value: function $emit(event) {
      var _$bus;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (_$bus = this.$bus).$emit.apply(_$bus, [this.eventKey + "." + event].concat(args));
    }
  }, {
    key: "$timeout",
    value: function $timeout(code, millisec) {
      setTimeout(code, millisec);
    }
    /**
     * 销毁视图对象
     */

  }, {
    key: "$destroy",
    value: function $destroy() {
      var _this7 = this;

      this.$emit("destroyed", this);
      this.$timeout(function () {
        // 清空所有事件
        _this7.$bus.$offAll(_this7.$eventKey);
        // 销毁 对象属性
        delete _this7[_shared._viewFormulas];
        delete _this7[_shared._viewRules];
        delete _this7[_shared._operatioRules];
        delete _this7[_shared._operations];
        delete _this7[_shared._operationMap];
        delete _this7[_shared._renderData];
        _this7[_shared._id] = undefined;
        // 公共属性
        _this7.type = "loading"; // 视图类型
      }, 500);
    }
  }, {
    key: "$id",
    get: function get() {
      return this[_shared._id];
    },
    set: function set(viewId) {
      this[_shared._id] = viewId;
    }
  }, {
    key: "title",
    get: function get() {
      return this.viewData.viewName || "数据加载中...";
    }
  }, {
    key: "$bus",
    get: function get() {
      return _eventBus2.default;
    }
  }, {
    key: "$space",
    get: function get() {
      return View.$space;
    }
  }, {
    key: "typeNum",

    /**
     * 视图类型编号
     */
    get: function get() {
      switch (this.type) {
        case 'list':
          return 1;
        case 'insert':
        case 'batchFormRow':
        case 'batchForm':
          return 2;
        case 'update':
          return 3;
        case 'detail':
          return 4;
        default:
          return -1;
      }
    }
  }, {
    key: "viewData",
    get: function get() {
      return this.renderData.view || {};
    }
  }, {
    key: "renderData",
    get: function get() {
      return this[_shared._renderData] || {};
    }
  }, {
    key: "recordId",
    get: function get() {
      return this[_shared._recordId];
    }
  }, {
    key: "record",
    get: function get() {
      return this.renderData.record || this.renderData.recordColumns || {};
    }
  }, {
    key: "moduleId",
    get: function get() {
      return this.viewData.moduleId;
    }
  }, {
    key: "moduleCode",
    get: function get() {
      return this.viewData.moduleCode;
    }
  }, {
    key: "operationMap",
    get: function get() {
      return this[_shared._operationMap] || {};
    }
  }, {
    key: "viewFormulas",
    get: function get() {
      return this[_shared._viewFormulas] || [];
    }
  }, {
    key: "viewRules",
    get: function get() {
      return this[_shared._viewRules] || [];
    }
  }, {
    key: "operatioRules",
    get: function get() {
      return this[_shared._operatioRules] || [];
    }
  }, {
    key: "operationList",
    get: function get() {
      return this[_shared._operations] || [];
    }
  }, {
    key: "eventKey",
    get: function get() {
      return "view." + this.$id;
    }
  }], [{
    key: "$set",
    value: function $set(target, key, value) {
      _vue2.default.set(target, key, value);
    }
  }, {
    key: "$delete",
    value: function $delete(target, key) {
      _vue2.default.delete(target, key);
    }
  }, {
    key: "format",
    value: function format(formModel, column) {
      if (column.type.format) {
        return column.type.format(formModel[column.valKey]) || formModel[column.showValKey];
      }
      var showVal = formModel[column.showValKey];
      if (showVal === null || showVal === "null") showVal = undefined;
      var val = formModel[column.valKey];
      if (val === null || val === "null") val = undefined;
      return showVal || val;
    }
  }, {
    key: "$space",
    get: function get() {
      return DATA_SPACE;
    }
  }]);

  return View;
}();

exports.default = View;