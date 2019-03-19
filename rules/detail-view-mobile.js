"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _detailView = require("./detail-view");

var _detailView2 = _interopRequireDefault(_detailView);

var _render = require("../services/render");

var _render2 = _interopRequireDefault(_render);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DetailViewMobile = function (_DetailView) {
  _inherits(DetailViewMobile, _DetailView);

  function DetailViewMobile() {
    _classCallCheck(this, DetailViewMobile);

    return _possibleConstructorReturn(this, (DetailViewMobile.__proto__ || Object.getPrototypeOf(DetailViewMobile)).call(this));
  }

  /**
   * 渲染视图
   * @param viewId 视图Id
   * @param recordId 真实数据Id
   */


  _createClass(DetailViewMobile, [{
    key: "render",
    value: function render(viewId, recordId) {
      var _this2 = this;

      return _render2.default.findDetailViewMobileRender(viewId, recordId).then(function (result) {
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
  }]);

  return DetailViewMobile;
}(_detailView2.default);

exports.default = DetailViewMobile;