"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dashboardService = function () {
  function dashboardService() {
    _classCallCheck(this, dashboardService);
  }

  _createClass(dashboardService, [{
    key: "addPanel",

    //新增面板
    value: function addPanel(params) {
      return _axios2.default.post("platform://custom/C06001", params).then(function (res) {
        return res.data;
      });
    }
    //编辑面板

  }, {
    key: "editPanel",
    value: function editPanel(params) {
      return _axios2.default.post("platform://custom/C06002", params).then(function (res) {
        return res.data;
      });
    }
    //删除面板

  }, {
    key: "removePanel",
    value: function removePanel(params) {
      return _axios2.default.post("platform://custom/C06003", params).then(function (res) {
        return res.data;
      });
    }
    //查询单个面板详情

  }, {
    key: "findPanelDetail",
    value: function findPanelDetail(params) {
      return _axios2.default.post("platform://custom/C06006", params).then(function (res) {
        return res.data;
      });
    }
    //查询面板集合

  }, {
    key: "findPanel",
    value: function findPanel(params) {
      return _axios2.default.post("platform://custom/C06004", params).then(function (res) {
        return res.data;
      });
    }
    //查询所有有权限的面板集合

  }, {
    key: "findAllPermissionPanel",
    value: function findAllPermissionPanel(params) {
      return _axios2.default.post("platform://custom/C06005", params).then(function (res) {
        return res.data;
      });
    }
    //查询面板分页

  }, {
    key: "findPanelPage",
    value: function findPanelPage(params) {
      return _axios2.default.post("platform://custom/C06014", params).then(function (res) {
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
    //根据id查询视图详情

  }, {
    key: "findViewById",
    value: function findViewById(params) {
      return _axios2.default.post("platform://custom/C11002", params).then(function (res) {
        return res.data;
      });
    }
    //根据视图查询字段

  }, {
    key: "findColumns",
    value: function findColumns(params) {
      return _axios2.default.post("platform://custom/C01016", params).then(function (res) {
        return res.data;
      });
    }
    //查询角色集合

  }, {
    key: "findRoles",
    value: function findRoles(params) {
      return _axios2.default.post("platform://auth/A03006", params).then(function (res) {
        return res.data;
      });
    }
    // 查询所有用户集合

  }, {
    key: "findUsers",
    value: function findUsers(params) {
      return _axios2.default.post("platform://auth/A02005", params).then(function (res) {
        return res.data;
      });
    }
    //根据字段id查询字段详细信息

  }, {
    key: "findColumnDetail",
    value: function findColumnDetail(params) {
      return _axios2.default.post("platform://custom/C01005", params).then(function (res) {
        return res.data;
      });
    }
    //根据视图id查询真实数据

  }, {
    key: "findRealDataByViewId",
    value: function findRealDataByViewId(params) {
      return _axios2.default.post("platform://custom/C12001", params).then(function (res) {
        return res.data;
      });
    }
    //获取统计数

  }, {
    key: "getTotalData",
    value: function getTotalData(params) {
      return _axios2.default.post("platform://custom/C06019", params).then(function (res) {
        return res.data;
      });
    }
    //获取指定指标维度数据

  }, {
    key: "getChartsData",
    value: function getChartsData(params) {
      return _axios2.default.post("platform://custom/C06020", params).then(function (res) {
        return res.data;
      });
    }
    //获取数据源地址数据

  }, {
    key: "getSourceData",
    value: function getSourceData(sourceUrl) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _axios2.default.post(sourceUrl, params).then(function (res) {
        return res.data;
      });
    }

    /* 
     * 系统主页相关
    */
    // 新增系统主页

  }, {
    key: "addDashboard",
    value: function addDashboard(params) {
      return _axios2.default.post("platform://custom/C06007", params).then(function (res) {
        return res;
      });
    }
    // 获取单个系统主页信息

  }, {
    key: "findDashboardInfo",
    value: function findDashboardInfo(params) {
      return _axios2.default.post("platform://custom/C06013", params).then(function (res) {
        return res.data;
      });
    }
    // 修改系统主页

  }, {
    key: "updateDashboard",
    value: function updateDashboard(params) {
      return _axios2.default.post("platform://custom/C06008", params).then(function (res) {
        return res;
      });
    }
    // 删除系统主页

  }, {
    key: "deleteDashboard",
    value: function deleteDashboard(params) {
      return _axios2.default.post("platform://custom/C06010", params).then(function (res) {
        return res;
      });
    }
    // 查询所有系统主页集合

  }, {
    key: "findAllDashboardList",
    value: function findAllDashboardList(params) {
      return _axios2.default.post("platform://custom/C06011", params).then(function (res) {
        return res.data;
      });
    }
    // 查询系统主页的分页列表

  }, {
    key: "findDashboardList",
    value: function findDashboardList(params) {
      return _axios2.default.post("platform://custom/C06015", params).then(function (res) {
        return res.data;
      });
    }

    /* 
     * 用户个人主页相关
    */
    // 新增个人主页

  }, {
    key: "addUserDashboard",
    value: function addUserDashboard(params) {
      return _axios2.default.post("platform://custom/C06016", params).then(function (res) {
        return res;
      });
    }
    // 获取单个个人主页信息

  }, {
    key: "findUserDashboardInfo",
    value: function findUserDashboardInfo(params) {
      return _axios2.default.post("platform://custom/C06009", params).then(function (res) {
        return res.data;
      });
    }
    // 修改个人主页

  }, {
    key: "updateUserDashboard",
    value: function updateUserDashboard(params) {
      return _axios2.default.post("platform://custom/C06018", params).then(function (res) {
        return res;
      });
    }
    // 删除个人主页

  }, {
    key: "deleteUserDashboard",
    value: function deleteUserDashboard(params) {
      return _axios2.default.post("platform://custom/C06017", params).then(function (res) {
        return res;
      });
    }
    // 查询所有有权限的主页集合

  }, {
    key: "findAllLimitDashboardList",
    value: function findAllLimitDashboardList(params) {
      return _axios2.default.post("platform://custom/C06012", params).then(function (res) {
        return res.data;
      });
    }
  }]);

  return dashboardService;
}();

exports.default = new dashboardService();