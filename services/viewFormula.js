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

var ViewFormulaService = function (_CRUD) {
  _inherits(ViewFormulaService, _CRUD);

  function ViewFormulaService() {
    _classCallCheck(this, ViewFormulaService);

    var booleanFields = [];
    var types = ["string"];
    var formTpl = {};
    return _possibleConstructorReturn(this, (ViewFormulaService.__proto__ || Object.getPrototypeOf(ViewFormulaService)).call(this, booleanFields, types, formTpl));
  }

  /**
   * 查询视图公式分页
   */


  _createClass(ViewFormulaService, [{
    key: "findViewFormulaByPage",
    value: function findViewFormulaByPage(params) {
      return _axios2.default.post("platform://custom/C02001", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 添加视图公式
     */

  }, {
    key: "addViewFormula",
    value: function addViewFormula(params) {
      return _axios2.default.post("platform://custom/C02002", params).then(function (res) {
        return res;
      });
    }

    /**
     * 更新视图公式
     */

  }, {
    key: "updateViewFormula",
    value: function updateViewFormula(params) {
      return _axios2.default.post("platform://custom/C02003", params).then(function (res) {
        return res;
      });
    }

    /**
     * 删除视图公式
     */

  }, {
    key: "deleteViewFormula",
    value: function deleteViewFormula(params) {
      return _axios2.default.post("platform://custom/C02004", params).then(function (res) {
        return res;
      });
    }

    /**
     * 查询单个视图公式详情
     */

  }, {
    key: "findViewFormulaById",
    value: function findViewFormulaById(params) {
      return _axios2.default.post("platform://custom/C02005", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 根据模块id获取目标字段集合
     */

  }, {
    key: "findTargetColumnsByModuleId",
    value: function findTargetColumnsByModuleId(params) {
      return _axios2.default.post("platform://custom/C01023", params).then(function (res) {
        return res.data;
      });
    }

    /**
     * 根据模块id获取来源字段集合
     */

  }, {
    key: "findSourceColumnsByModuleId",
    value: function findSourceColumnsByModuleId(params) {
      return _axios2.default.post("platform://custom/C01010", params).then(function (res) {
        return res.data;
      });
    }
  }]);

  return ViewFormulaService;
}(_shared.CRUD);

// 实例化后导出，全局单例


exports.default = new ViewFormulaService();