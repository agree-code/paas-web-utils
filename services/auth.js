"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthService = function () {
  function AuthService() {
    _classCallCheck(this, AuthService);
  }

  _createClass(AuthService, [{
    key: "findMenuByAuth",
    value: function findMenuByAuth() {
      //查询有权限的菜单集合
      return _axios2.default.post("platform://auth/A05007", {}).then(function (res) {
        return res.data;
      });
    }
  }, {
    key: "findMenuByQuick",
    value: function findMenuByQuick() {
      //查询快捷菜单集合
      return _axios2.default.post("platform://auth/A05009", {}).then(function (res) {
        return res.data;
      });
    }
  }, {
    key: "changePageByViewId",
    value: function changePageByViewId(viewId) {
      //跳转到指定菜单页面
      return _axios2.default.post("platform://custom/C11002", { viewId: viewId }).then(function (res) {
        return res.data;
      });
    }
  }, {
    key: "setMenuByQuick",
    value: function setMenuByQuick(menuIds) {
      //查询快捷菜单集合
      return _axios2.default.post("platform://auth/A05008", { menuIds: menuIds }).then(function (res) {
        return res.data;
      });
    }
  }]);

  return AuthService;
}();

// 实例化后导出，全局单例


exports.default = new AuthService();