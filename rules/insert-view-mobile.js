"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _insertView = require("./insert-view");

var _insertView2 = _interopRequireDefault(_insertView);

var _render = require("../services/render");

var _render2 = _interopRequireDefault(_render);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InsertViewMobile = function (_InsertView) {
  _inherits(InsertViewMobile, _InsertView);

  function InsertViewMobile() {
    _classCallCheck(this, InsertViewMobile);

    return _possibleConstructorReturn(this, (InsertViewMobile.__proto__ || Object.getPrototypeOf(InsertViewMobile)).call(this));
  }

  _createClass(InsertViewMobile, [{
    key: "_axios",
    value: function _axios(viewId, recordId) {
      var _this2 = this;

      var cacheKey = "renderService.findInsertViewMobileRender(" + viewId + ")";
      if (this.$space[cacheKey]) {
        return this.$space[cacheKey];
      } else {
        var promise = _render2.default.findInsertViewMobileRender(viewId).then(function (result) {
          _this2.$space[cacheKey] = Promise.resolve(result);
          // console.log('移动端 R02001', result)
          return result;
        });
        this.$space[cacheKey] = promise;
        return promise;
      }
    }
  }]);

  return InsertViewMobile;
}(_insertView2.default);

exports.default = InsertViewMobile;