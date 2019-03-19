"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _render = require("../services/render");

var _render2 = _interopRequireDefault(_render);

var _view = require("./view");

var _view2 = _interopRequireDefault(_view);

var _viewGroup = require("./view-group");

var _viewGroup2 = _interopRequireDefault(_viewGroup);

var _batchView = require("./batch-view");

var _batchView2 = _interopRequireDefault(_batchView);

var _listView = require("./list-view");

var _listView2 = _interopRequireDefault(_listView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DetailView = function (_View) {
  _inherits(DetailView, _View);

  function DetailView() {
    _classCallCheck(this, DetailView);

    var _this = _possibleConstructorReturn(this, (DetailView.__proto__ || Object.getPrototypeOf(DetailView)).call(this));

    _this.groups = [];
    _this.operations = [];
    _this.componentRender = false; // 委派组件渲染函数
    return _this;
  }

  _createClass(DetailView, [{
    key: "render",


    /**
     * 渲染视图
     * @param viewId 视图Id
     * @param recordId 真实数据Id
     */
    value: function render(viewId, recordId) {
      var _this2 = this;

      return _render2.default.findDetailViewRender(viewId, recordId).then(function (result) {
        // 处理默认视图信息
        _this2.handlerView(result, "detail", recordId);
        _this2.handlerViewGroup();
        if (_this2.viewData.viewType === 7) {
          return _this2.handlerBatchViewGroup();
        } else {
          // 处理视图操作
          return _this2.handlerListGroup();
        }
      }).then(function () {
        return _this2.handlerViewOperation();
      }).then(function () {
        // 处理视图公式
        _this2.handlerViewFormula();
        // 处理视图条件
        _this2.handlerViewRule();
        // 处理操作条件
        _this2.handlerOperationRule();
        // 触发创建事件
        _this2.bindEventToView(_this2.columnMap);
        // 绑定真实数据回显
        _this2.handlerViewRecord(_this2.columnMap);
        // 触发创建事件
        _this2.$emit("created", _this2);
        _this2.$timeout(function () {
          _this2.$emit("update", _this2, [_this2.record]);
        });
        _this2.$on("destroyed", function () {
          _this2.handlerDestroy();
        });
        return _this2;
      });
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
    key: "handlerViewGroup",
    value: function handlerViewGroup() {
      var _this3 = this;

      var viewData = this.viewData;
      this.groups = [];
      // 处理视图分组
      if (viewData.viewGroupList && viewData.viewGroupList.length > 0) {
        viewData.viewGroupList.forEach(function (viewGroupData) {
          var group = new _viewGroup2.default(_this3, viewGroupData);
          _this3.groups.push(group);
          group.render();
        });
      }
    }
  }, {
    key: "handlerListGroup",
    value: function handlerListGroup() {
      var _this4 = this;

      // 处理批量视图
      var promises = [];
      var viewMarks = this.viewData.viewMarks;
      if (viewMarks && viewMarks !== null) {
        viewMarks = viewMarks.split(",");
        viewMarks.forEach(function (viewId) {
          var group = new _listView2.default();
          group['batchId'] = viewId;
          promises.push(group.render(viewId, _this4.recordId, _this4.moduleId));
          _this4.groups.push(group);
          // 注册销毁事件
          _this4.$on("destroyed", function () {
            group.$destroy();
          });
        });
      }
      return Promise.all(promises);
    }
  }, {
    key: "handlerBatchViewGroup",
    value: function handlerBatchViewGroup() {
      var _this5 = this;

      // 处理批量视图
      var promises = [];
      var batchCtrls = this.viewData.batchCtrls;
      if (batchCtrls && batchCtrls !== null) {
        batchCtrls.forEach(function (batchCtrl) {
          if (batchCtrl.batchId) {
            var group = new _batchView2.default(batchCtrl, _this5);
            _this5.groups.push(group);
            promises.push(group.render(batchCtrl.batchId, _this5.recordId, 'detailBatchForm'));
          }
        });
      }
      return Promise.all(promises);
    }
  }, {
    key: "handlerViewOperation",
    value: function handlerViewOperation() {
      var _this6 = this;

      return this.handlerOperation().then(function () {
        _this6.operations = _this6.operationList;
        return _this6;
      });
    }

    /**
    * 根据字段Id获取视图分组
    * @param {*} columnId 字段Id
    */

  }, {
    key: "findViewGroupByColumnId",
    value: function findViewGroupByColumnId(columnId) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.groups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var group = _step.value;

          if (group.columnMap[columnId]) {
            return group;
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

      return {};
    }
  }, {
    key: "handlerDestroy",
    value: function handlerDestroy() {
      console.log("销毁 DetailView", this.title);
      this.groups = [];
      this.operations = [];
      this.componentRender = false; // 委派组件渲染函数
    }
  }, {
    key: "columnMap",
    get: function get() {
      var columnMap = {};
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.groups[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var group = _step2.value;

          if (group instanceof _viewGroup2.default) {
            Object.assign(columnMap, group.columnMap);
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

      return columnMap;
    }
  }, {
    key: "submitModel",
    get: function get() {
      var submitModel = {
        viewId: this.$id,
        columnMap: {},
        batchColumn: {}
      };
      this.groups.forEach(function (group) {
        if (group instanceof _viewGroup2.default) {
          Object.assign(submitModel.columnMap, group.submitModel);
        }
      });
      return submitModel;
    }
  }]);

  return DetailView;
}(_view2.default);

exports.default = DetailView;