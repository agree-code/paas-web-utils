"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _listView = require("./list-view");

var _listView2 = _interopRequireDefault(_listView);

var _render = require("../services/render");

var _render2 = _interopRequireDefault(_render);

var _column2 = require("./column");

var _column3 = _interopRequireDefault(_column2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListViewMobile = function (_ListView) {
  _inherits(ListViewMobile, _ListView);

  function ListViewMobile() {
    _classCallCheck(this, ListViewMobile);

    return _possibleConstructorReturn(this, (ListViewMobile.__proto__ || Object.getPrototypeOf(ListViewMobile)).call(this));
  }

  /**
   * 渲染视图
   * @param viewId 视图Id
   * @param recordId 真实数据Id
   */


  _createClass(ListViewMobile, [{
    key: "render",
    value: function render(viewId) {
      var _this2 = this;

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
      if (this.$space["renderService.findListViewMobileRender(" + viewId + ")"]) {
        promise = this.$space["renderService.findListViewMobileRender(" + viewId + ")"];
      } else {
        promise = _render2.default.findListViewMobileRender(viewId).then(function (result) {
          _this2.$space["renderService.findListViewMobileRender(" + viewId + ")"] = Promise.resolve(result);
          return result;
        });
        this.$space["renderService.findListViewMobileRender(" + viewId + ")"] = promise;
      }
      return promise.then(function (result) {
        _this2.handlerView(result, "list", recordId);
        _this2.handlerColumn();
        _this2.handlerViewOperation(); // 处理操作
        _this2.handlerOperationRule(); // 处理操作条件
        Object.assign(_this2.datasource, _this2.sort);
        // 绑定视图字段中的事件
        _this2.bindEventToView(_this2.columnMap);
        // 触发创建事件
        _this2.$emit("created", _this2);
        _this2.$on("destroyed", function () {
          _this2.handlerDestroy();
        });
        return _this2;
      });
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
      var columnList = this.renderData.columns.ShowColumnList;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (columnList || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _column = _step.value;

          var column = new _column3.default();
          column.render(_column, this);
          // 处理字段显示隐藏
          column.handlerColumnHidden();
          this.columnMap[column.$id] = column;
          this.columnMap[column.columnCode + "@" + column.columnData.moduleCode] = column;
          this.columns.push(column);
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
  }]);

  return ListViewMobile;
}(_listView2.default);

exports.default = ListViewMobile;