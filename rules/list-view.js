"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _render = require("../services/render");

var _render2 = _interopRequireDefault(_render);

var _view = require("./view");

var _view2 = _interopRequireDefault(_view);

var _column2 = require("./column");

var _column3 = _interopRequireDefault(_column2);

var _shared = require("./shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListView = function (_View) {
  _inherits(ListView, _View);

  function ListView() {
    _classCallCheck(this, ListView);

    var _this = _possibleConstructorReturn(this, (ListView.__proto__ || Object.getPrototypeOf(ListView)).call(this));

    _this[_shared._columnMap] = {};
    _this.columns = [];
    _this.operations = {
      buttons: [],
      component: [],
      detail: []
    };
    _this.hidden = false;
    _this.componentRender = false; // 委派组件渲染函数
    return _this;
  }

  _createClass(ListView, [{
    key: "dialogRender",
    value: function dialogRender(viewId) {
      var _this2 = this;

      this.$id = viewId;
      this.datasource = {
        viewId: this.$id, // 加载视图Id
        reload: false, // 特殊状态(是否重新刷新数据内容)
        currentPage: 1, // 当前页码
        pageSize: 10, // 分页大小
        sidx: "id", // 排序字段
        order: "desc", // 升序/降序
        fuzzyQueryVal: undefined, // 模糊搜索值
        recordId: undefined, // 用于查询子模块数据
        curModuleId: undefined, // 用于查询子模块数据
        tagId: undefined, // 当前搜索标签Id
        searchList: [] // 条件内容
      };
      var promise = undefined;
      if (this.$space["renderService.findListViewRender(" + viewId + ")"]) {
        promise = this.$space["renderService.findListViewRender(" + viewId + ")"];
      } else {
        promise = _render2.default.findListViewRender(viewId).then(function (result) {
          _this2.$space["renderService.findListViewRender(" + viewId + ")"] = Promise.resolve(result);
          return result;
        });
        this.$space["renderService.findListViewRender(" + viewId + ")"] = promise;
      }
      return promise.then(function (result) {
        // 渲染视图公式等
        _this2.handlerView(result, "list", undefined);
        Object.assign(_this2.datasource, _this2.sort);
        _this2.handlerColumn();
        _this2.$emit("created", _this2);
        return _this2;
      });
    }

    /**
     * 渲染视图
     * @param viewId 视图Id
     * @param recordId 真实数据Id
     */

  }, {
    key: "render",
    value: function render(viewId) {
      var _this3 = this;

      var recordId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var moduleId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      this.$id = viewId;
      // 配置数据源
      this.datasource = {
        viewId: viewId, // 加载视图Id
        reload: false, // 特殊状态(是否重新刷新数据内容)
        currentPage: 1, // 当前页码
        pageSize: 10, // 分页大小
        sidx: "id", // 排序字段
        order: "desc", // 升序/降序
        fuzzyQueryVal: undefined, // 模糊搜索值
        recordId: recordId, // 用于查询子模块数据
        curModuleId: moduleId, // 用于查询子模块数据
        tagId: undefined, // 当前搜索标签Id
        searchList: [] // 条件内容
      };
      var promise = undefined;
      if (this.$space["renderService.findListViewRender(" + viewId + ")"]) {
        promise = this.$space["renderService.findListViewRender(" + viewId + ")"];
      } else {
        promise = _render2.default.findListViewRender(viewId).then(function (result) {
          _this3.$space["renderService.findListViewRender(" + viewId + ")"] = Promise.resolve(result);
          return result;
        });
        this.$space["renderService.findListViewRender(" + viewId + ")"] = promise;
      }

      return promise.then(function (result) {
        _this3.handlerView(result, "list", recordId);
        _this3.handlerColumn();
        _this3.handlerViewOperation(); // 处理操作
        _this3.handlerOperationRule(); // 处理操作条件
        Object.assign(_this3.datasource, _this3.sort);
        // 绑定视图字段中的事件
        _this3.bindEventToView(_this3.columnMap);
        // 触发创建事件
        _this3.$emit("created", _this3);
        _this3.$on("destroyed", function () {
          _this3.handlerDestroy();
        });
        return _this3;
      });
    }

    /**
     * 行点击事件
     */

  }, {
    key: "rowClick",
    value: function rowClick(vm, rowData) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.operations.detail[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var iterator = _step.value;

          if (!iterator.isHidden(rowData)) {
            iterator.triggerClick(vm, [rowData]);
            break;
          }
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
     * table行样式
     */

  }, {
    key: "rowStyle",
    value: function rowStyle(rowData) {
      var style = {};
      var viewSpcShowList = this.renderData.viewSpcShowList;
      if (viewSpcShowList instanceof Array) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = viewSpcShowList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var iterator = _step2.value;

            var column = this.columnMap[iterator.showColumn];
            var value = rowData[column.valKey];
            if ((0, _shared.validateCondition)(value, iterator.searchType, iterator.searchVal)) {
              style['background'] = iterator.showVal;
            }
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
      }
      return style;
    }
    /**
     * 获取当前列表所有字段的模块Id分组
     */

  }, {
    key: "currentModuleIds",
    value: function currentModuleIds() {
      var currentModuleIds = {};
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.columns[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var iterator = _step3.value;

          currentModuleIds[iterator.moduleId] = true;
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

      return Object.keys(currentModuleIds);
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

    /**
     * 处理列表视图字段
     * @param {ListView} view 列表视图
     */

  }, {
    key: "handlerColumn",
    value: function handlerColumn() {
      // 处理字典
      this.columns = [];
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = (this.renderData.columnList || [])[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _column = _step4.value;

          var column = new _column3.default();
          column.render(_column, this);
          // 处理字段显示隐藏
          column.handlerColumnHidden();
          this.columnMap[column.$id] = column;
          this.columnMap[column.columnCode + "@" + column.columnData.moduleCode] = column;
          this.columns.push(column);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
    /**
     * 处理列表视图操作
     * @param {ListView} view 列表视图
     */

  }, {
    key: "handlerViewOperation",
    value: function handlerViewOperation() {
      this.handlerOperation();
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.operationList[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var operation = _step5.value;

          if (operation.isDetail) {
            this.operations.detail.push(operation);
          } else if (operation.isTop) {
            // 按钮组操作
            this.operations.buttons.push(operation);
          } else {
            // 组件内操作
            this.operations.component.push(operation);
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }, {
    key: "handlerDestroy",
    value: function handlerDestroy() {
      console.log("销毁 ListView", this.title);
      this[_shared._columnMap] = {};
      this.columns = [];
      this.operations = {
        buttons: [],
        component: [],
        detail: []
      };
      this.hidden = false;
      this.componentRender = false; // 委派组件渲染函数
    }
  }, {
    key: "sort",
    get: function get() {
      if (this.renderData.sidx && this.renderData.sidx.order && this.renderData.sidx.sidx) {
        return this.renderData.sidx;
      }
      return {
        order: "desc",
        sidx: "ID"
      };
    }
  }, {
    key: "columnMap",
    get: function get() {
      return this[_shared._columnMap];
    }
  }]);

  return ListView;
}(_view2.default);

exports.default = ListView;