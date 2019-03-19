"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _shared = require("./shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var viewService = function (_CRUD) {
  _inherits(viewService, _CRUD);

  function viewService() {
    _classCallCheck(this, viewService);

    var booleanFields = [];
    var types = ["string"];
    var formTpl = {
      viewName: "",
      viewCode: "",
      description: ""
    };
    return _possibleConstructorReturn(this, (viewService.__proto__ || Object.getPrototypeOf(viewService)).call(this, booleanFields, types, formTpl));
  }

  /**
   * 查询视图分页
   */


  _createClass(viewService, [{
    key: "findViewByPage",
    value: function findViewByPage(params) {
      return _axios2.default.post("platform://custom/C11001", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 添加视图
     */

  }, {
    key: "addView",
    value: function addView(params) {
      return _axios2.default.post("platform://custom/C11003", params).then(function (res) {
        return res;
      });
    }

    /**
     * 更新视图
     */

  }, {
    key: "updateView",
    value: function updateView(params) {
      return _axios2.default.post("platform://custom/C11006", params).then(function (res) {
        return res;
      });
    }

    /**
     * 删除视图
     */

  }, {
    key: "deleteView",
    value: function deleteView(params) {
      return _axios2.default.post("platform://custom/C11005", params).then(function (res) {
        return res;
      });
    }
    /**
     * 删除视图
     */

  }, {
    key: "getViewTree",
    value: function getViewTree(params) {
      return _axios2.default.post("platform://custom/C11007", params).then(function (res) {
        return res;
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

    /**
     * 根据模块id,查询模块字段及其关联模块的字段的集合
     */

  }, {
    key: "findColumnsByModuleId",
    value: function findColumnsByModuleId(params) {
      return _axios2.default.post("platform://custom/C01010", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 查询当前模块下视图集合
     */

  }, {
    key: "findViewsByModuleId",
    value: function findViewsByModuleId(params) {
      return _axios2.default.post("platform://custom/C11008", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 查询模块字段及其关联模块字段的集合
     */

  }, {
    key: "findModulesColumns",
    value: function findModulesColumns(params) {
      return _axios2.default.post("platform://custom/C01010", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 更新视图分组集合
     */

  }, {
    key: "updateViewGroup",
    value: function updateViewGroup(params) {
      return _axios2.default.post("platform://custom/C11019", params).then(function (res) {
        return res;
      });
    }

    /**
     * 查询可以批量新增的视图集合
     */

  }, {
    key: "findBatchViewList",
    value: function findBatchViewList(params) {
      return _axios2.default.post("platform://custom/C11009", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 查询视图公式集合
     */

  }, {
    key: "findViewFormulaList",
    value: function findViewFormulaList(params) {
      return _axios2.default.post("platform://custom/C02006", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 查询可修改数据关联模块
     */

  }, {
    key: "findEditRelatedModuleList",
    value: function findEditRelatedModuleList(params) {
      return _axios2.default.post("platform://custom/C10003", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 根据视图id获取视图可配置字段集合
     */

  }, {
    key: "findSourceColumnsByViewId",
    value: function findSourceColumnsByViewId(params) {
      return _axios2.default.post("platform://custom/C01017", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 新增查询标签（查询条件）
     */

  }, {
    key: "addSearchTag",
    value: function addSearchTag(params) {
      return _axios2.default.post("platform://custom/C08007", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 查询模块下的查询标签
     */

  }, {
    key: "findSearchTags",
    value: function findSearchTags(params) {
      return _axios2.default.post("platform://custom/C08001", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 根据查询标签Id删除查询标签
     */

  }, {
    key: "deleteSearchTag",
    value: function deleteSearchTag(params) {
      return _axios2.default.post("platform://custom/C08004", params).then(function (res) {
        return res;
      });
    }
  }]);

  return viewService;
}(_shared.CRUD);

exports.default = new viewService();