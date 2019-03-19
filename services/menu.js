"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var menuService = function () {
  function menuService() {
    _classCallCheck(this, menuService);
  }

  _createClass(menuService, [{
    key: "addMenu",

    //新增菜单
    value: function addMenu(params) {
      return _axios2.default.post("platform://auth/A05001", params).then(function (res) {
        return res.data;
      });
    }
    //更新菜单信息

  }, {
    key: "editMenu",
    value: function editMenu(params) {
      return _axios2.default.post("platform://auth/A05002", params).then(function (res) {
        return res.data;
      });
    }
    //删除菜单

  }, {
    key: "removeMenu",
    value: function removeMenu(params) {
      return _axios2.default.post("platform://auth/A05005", params).then(function (res) {
        return res.data;
      });
    }
    //查询菜单集合

  }, {
    key: "findMenu",
    value: function findMenu(params) {
      return _axios2.default.post("platform://auth/A05003", params).then(function (res) {
        return res.data;
      });
    }
    //查询单个菜单信息

  }, {
    key: "findMenuDetail",
    value: function findMenuDetail(params) {
      return _axios2.default.post("platform://auth/A05004", params).then(function (res) {
        return res.data;
      });
    }
    //查询分页菜单集合

  }, {
    key: "findMenuPage",
    value: function findMenuPage(params) {
      return _axios2.default.post("platform://auth/A05006", params).then(function (res) {
        return res.data;
      });
    }
    //查询移动端菜单集合

  }, {
    key: "findMobile",
    value: function findMobile(params) {
      return _axios2.default.post("platform://auth/A05012", params).then(function (res) {
        return res.data;
      });
    }
    //查询移动端分页菜单集合

  }, {
    key: "findMobilePage",
    value: function findMobilePage(params) {
      return _axios2.default.post("platform://auth/A05013", params).then(function (res) {
        return res.data;
      });
    }
    //查询模块集合

  }, {
    key: "findModules",
    value: function findModules(params) {
      return _axios2.default.post("platform://custom/C10003", params).then(function (res) {
        return res.data;
      });
    }
    //查询视图集合

  }, {
    key: "findViews",
    value: function findViews(params) {
      return _axios2.default.post("platform://custom/C11008", params).then(function (res) {
        return res.data;
      });
    }
    /**
     * 根据id查询视图详情
     */

  }, {
    key: "findViewById",
    value: function findViewById(params) {
      return _axios2.default.post("platform://custom/C11002", params).then(function (res) {
        return res.data;
      });
    }
  }]);

  return menuService;
}();

exports.default = new menuService();