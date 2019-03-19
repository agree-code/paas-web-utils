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

var OperationRuleService = function (_CRUD) {
  _inherits(OperationRuleService, _CRUD);

  function OperationRuleService() {
    _classCallCheck(this, OperationRuleService);

    var booleanFields = [];
    var types = ["string"];
    var formTpl = {};
    return _possibleConstructorReturn(this, (OperationRuleService.__proto__ || Object.getPrototypeOf(OperationRuleService)).call(this, booleanFields, types, formTpl));
  }

  /**
   * 查询操作条件分页
   */


  _createClass(OperationRuleService, [{
    key: "findOperationRuleByPage",
    value: function findOperationRuleByPage(params) {
      return _axios2.default.post("platform://custom/C05002", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 添加操作条件
     */

  }, {
    key: "addOperationRule",
    value: function addOperationRule(params) {
      return _axios2.default.post("platform://custom/C05001", params).then(function (res) {
        return res;
      });
    }

    /**
     * 更新操作条件
     */

  }, {
    key: "updateOperationRule",
    value: function updateOperationRule(params) {
      return _axios2.default.post("platform://custom/C05005", params).then(function (res) {
        return res;
      });
    }

    /**
     * 删除操作条件
     */

  }, {
    key: "deleteOperationRule",
    value: function deleteOperationRule(params) {
      return _axios2.default.post("platform://custom/C05004", params).then(function (res) {
        return res;
      });
    }

    /**
     * 根据id查询操作条件详情
     */

  }, {
    key: "findOperationRuleById",
    value: function findOperationRuleById(params) {
      return _axios2.default.post("platform://custom/C05003", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 根据模块id查询视图集合
     */

  }, {
    key: "findViewListByModuleId",
    value: function findViewListByModuleId(params) {
      return _axios2.default.post("platform://custom/C11008", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 根据视图id查询影响操作集合
     */

  }, {
    key: "findAffectOperationsByViewId",
    value: function findAffectOperationsByViewId(params) {
      return _axios2.default.post("platform://custom/C04006", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 根据操作id获取操作可配置字段集合
     */

  }, {
    key: "findSourceColumnsByViewId",
    value: function findSourceColumnsByViewId(params) {
      return _axios2.default.post("platform://custom/C01017", params).then(function (res) {
        return res.data;
      });
    }
  }]);

  return OperationRuleService;
}(_shared.CRUD);

// 实例化后导出，全局单例


exports.default = new OperationRuleService();