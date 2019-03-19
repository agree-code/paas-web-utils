"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _shared = require("./shared");

var _globalUid = require("./global-uid");

var _globalUid2 = _interopRequireDefault(_globalUid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _viewFormula = Symbol("ViewFormula");
/**
 * 视图公式
 */

var ViewFormula = function () {
  function ViewFormula(viewFormula, view) {
    _classCallCheck(this, ViewFormula);

    this['_puid'] = _globalUid2.default.get();
    this[_shared._targetColumnIds] = []; // 目录字段Id集合
    this[_shared._handlerFn] = new Function();
    this.type = undefined; // 控制在什么阶段执行
    this[_shared._view] = view;
    this[_viewFormula] = viewFormula;
    this.handler();
  }

  _createClass(ViewFormula, [{
    key: "handler",


    /**
     * 处理视图公式
     */
    value: function handler() {
      var _this = this;

      if (this.viewFormula.targetColumnId || this.viewFormula.targetColumnId == 0) {
        if (!isNaN(this.viewFormula.targetColumnId)) {
          this[_shared._targetColumnIds] = [this.viewFormula.targetColumnId];
        } else {
          this[_shared._targetColumnIds] = this.viewFormula.targetColumnId.split(",");
        }
      }
      switch (this.viewFormula.type) {
        case 0:
          this.type = "CUSTOM_SERVICE_COMPUTE";
          this[_shared._handlerFn] = this.customServiceCompute();
          break;
        case 1:
          this.type = "DEFAULT_VALUE";
          this[_shared._handlerFn] = this.defaultValue();
          break;
        case 2:
          this.type = "BY_EXPRESSION";
          this[_shared._handlerFn] = this.byExpression();
          break;
      }
      console.log("ViewFormula", this);
      this.view.$on("destroyed", function () {
        _this[_shared._targetColumnIds] = []; // 目录字段Id集合
        _this[_shared._handlerFn] = new Function();
        _this.type = undefined; // 控制在什么阶段执行
        delete _this[_shared._view];
        delete _this[_viewFormula];
      });
    }

    /**
     * 自定义服务
     */

  }, {
    key: "customServiceCompute",
    value: function customServiceCompute() {
      var formulaData = this.viewFormula.content ? this.viewFormula.content.replace(/\s+/g, "") : "";
      var viewFormula = this.viewFormula;
      var view = this.view;
      return function CUSTOM_SERVICE_COMPUTE(column, formModel) {
        if (viewFormula.customUrl) {
          _axios2.default.post(viewFormula.customUrl, {
            formula: formulaData
          }).then(function (result) {
            view.$set(formModel, column.valKey, result.data);
          });
        }
      };
    }
    /**
     * 默认值处理
     */

  }, {
    key: "defaultValue",
    value: function defaultValue() {
      var view = this.view;
      var viewFormula = this.viewFormula;
      return function DEFAULT_VALUE(column, formModel) {
        setTimeout(function () {
          view.$set(formModel, column.valKey, viewFormula.defaultVal);
        }, 100);
      };
    }
    /**
     * 自定义公式处理
     */

  }, {
    key: "byExpression",
    value: function byExpression() {
      // TODO: 执行公式内容(需要重新抽取公式内容)
      return function BY_EXPRESSION(column, formModel) {};
    }
  }, {
    key: "bindEventToViewColumn",
    value: function bindEventToViewColumn() {
      var _this2 = this;

      var columnMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      columnMap = columnMap ? columnMap : this.view.columnMap;
      this[_shared._targetColumnIds].forEach(function (columnId) {
        var column = columnMap[columnId];
        if (!column) return;
        switch (_this2.type) {
          case "DEFAULT_VALUE":
            column.addEventListener("created", _this2[_shared._handlerFn]);
            break;
          case "CUSTOM_SERVICE_COMPUTE":
            column.addEventListener("created", _this2[_shared._handlerFn]);
            column.addEventListener("change", _this2[_shared._handlerFn]);
            break;
          case "BY_EXPRESSION":
            column.addEventListener("created", _this2[_shared._handlerFn]);
            column.addEventListener("change", _this2[_shared._handlerFn]);
            break;
        }
      });
    }
  }, {
    key: "viewFormula",
    get: function get() {
      return this[_viewFormula];
    }
  }, {
    key: "view",
    get: function get() {
      return this[_shared._view];
    }
  }]);

  return ViewFormula;
}();

exports.default = ViewFormula;