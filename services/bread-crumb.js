"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BreadCrumbService = function () {
  function BreadCrumbService() {
    _classCallCheck(this, BreadCrumbService);
  }

  _createClass(BreadCrumbService, [{
    key: "findByViewId",
    value: function findByViewId(viewId) {
      //跳转到指定菜单页面
      return _axios2.default.post("platform://custom/C14003", { viewId: viewId }).then(function (res) {
        return res.data;
      });
    }
  }]);

  return BreadCrumbService;
}();

// 实例化后导出，全局单例


exports.default = new BreadCrumbService();