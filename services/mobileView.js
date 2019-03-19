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

var MobileViewService = function (_CRUD) {
  _inherits(MobileViewService, _CRUD);

  function MobileViewService() {
    _classCallCheck(this, MobileViewService);

    var booleanFields = [];
    var types = ["string"];
    var formTpl = {};
    return _possibleConstructorReturn(this, (MobileViewService.__proto__ || Object.getPrototypeOf(MobileViewService)).call(this, booleanFields, types, formTpl));
  }

  /**
   * 查询模块集合
   */


  _createClass(MobileViewService, [{
    key: "findModuleList",
    value: function findModuleList(params) {
      return _axios2.default.post("platform://custom/C10003", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 查询视图分页
     */

  }, {
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
     * 查询单个视图详情
     */

  }, {
    key: "findViewById",
    value: function findViewById(params) {
      return _axios2.default.post("platform://custom/C11002", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 查询当前模块下字段集合
     */

  }, {
    key: "findColumnsByModuleId",
    value: function findColumnsByModuleId(params) {
      return _axios2.default.post("platform://custom/C01023", params).then(function (res) {
        return res.data;
      });
    }
  }]);

  return MobileViewService;
}(_shared.CRUD);

// 实例化后导出，全局单例


exports.default = new MobileViewService();