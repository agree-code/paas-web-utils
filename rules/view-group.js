"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _column = require("./column");

var _column2 = _interopRequireDefault(_column);

var _shared = require("./shared");

var _globalUid = require("./global-uid");

var _globalUid2 = _interopRequireDefault(_globalUid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewGroup = function () {
  function ViewGroup(view, viewGroupData) {
    _classCallCheck(this, ViewGroup);

    this['_puid'] = _globalUid2.default.get();
    this[_shared._view] = view;
    this[_shared._viewGroupData] = viewGroupData;
    this[_shared._columnMap] = {};
    this.componentRender = false; // 委派组件渲染函数
    this.hidden = false;
    this.columns = []; // 分组包含字段
    this.formModel = {}; // 表单模型
    this.rules = {};
  }

  _createClass(ViewGroup, [{
    key: "render",
    value: function render() {
      var _this = this;

      this.handlerColumn();
      this.view.$on("destroyed", function () {
        _this.handlerDestroy();
      });
      return this;
    }

    /**
     * 触发创建事件
     */

  }, {
    key: "handlerColumn",
    value: function handlerColumn() {
      var viewGroupData = this.viewGroupData;
      this.columns = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = viewGroupData.colList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var columnData = _step.value;

          var column = new _column2.default();
          // 处理字段
          column.render(columnData, this.view);
          // 处理字段默认事件
          column.handlerColumnDefaultEvent();
          // 处理字段只读内容
          column.handlerColumnReadonly();
          // 处理字段显示隐藏
          column.handlerColumnHidden();
          // 处理字段校验规则
          column.handlerColumnValidRule();
          // 创建字段映射
          this.columnMap[column.$id] = column;
          this.columnMap[column.columnCode + "@" + column.columnData.moduleCode] = column;
          this.columns.push(column);
          // 添加校验规则
          this.rules[column.valKey] = column.rules;
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
    }

    /**
     * 委派渲染
     * @param fn 渲染函数(jsx写法)
     * @example https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage
     */

  }, {
    key: "appointRender",
    value: function appointRender(fn) {
      this.componentRender = fn || false;
    }
  }, {
    key: "handlerDestroy",
    value: function handlerDestroy() {
      // 处理销毁的数据
      console.log("销毁 ViewGroup", this.title);
      delete this[_shared._view];
      delete this[_shared._viewGroupData];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.columns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var column = _step2.value;

          column.handlerBashColumn(undefined, undefined);
        }
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

      this[_shared._columnMap] = {};
      this.componentRender = false;
      this.hidden = false;
      this.columns = [];
      this.formModel = {};
      this.rules = {};
    }
  }, {
    key: "$id",
    get: function get() {
      return this.viewGroupData.id || this.view.$id + "-" + this['_puid'];
    }
  }, {
    key: "title",
    get: function get() {
      return this.viewGroupData.name;
    }
  }, {
    key: "view",
    get: function get() {
      return this[_shared._view];
    }
  }, {
    key: "type",
    get: function get() {
      return "formLayout";
    }
  }, {
    key: "moduleId",
    get: function get() {
      return this.view.moduleId;
    }
  }, {
    key: "viewGroupData",
    get: function get() {
      return this[_shared._viewGroupData] || {};
    }
  }, {
    key: "columnMap",
    get: function get() {
      return this[_shared._columnMap];
    }
  }, {
    key: "submitModel",
    get: function get() {
      var _this2 = this;

      if (this.hidden) return {};
      var submitModel = {};
      this.columns.forEach(function (column) {
        submitModel[column.fromSubmitKey] = _this2.formModel[column.valKey];
      });
      return submitModel;
    }
  }]);

  return ViewGroup;
}();

exports.default = ViewGroup;