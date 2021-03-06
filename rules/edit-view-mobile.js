"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _editView = require("./edit-view");

var _editView2 = _interopRequireDefault(_editView);

var _render = require("../services/render");

var _render2 = _interopRequireDefault(_render);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditViewMobile = function (_EditView) {
  _inherits(EditViewMobile, _EditView);

  function EditViewMobile() {
    _classCallCheck(this, EditViewMobile);

    return _possibleConstructorReturn(this, (EditViewMobile.__proto__ || Object.getPrototypeOf(EditViewMobile)).call(this));
  }

  _createClass(EditViewMobile, [{
    key: "_axios",
    value: function _axios(viewId, recordId) {
      return _render2.default.findUpdateViewMobileRender(viewId, recordId);
    }
  }]);

  return EditViewMobile;
}(_editView2.default);

exports.default = EditViewMobile;