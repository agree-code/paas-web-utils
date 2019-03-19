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

var ModulesInfoService = function (_CRUD) {
  _inherits(ModulesInfoService, _CRUD);

  function ModulesInfoService() {
    _classCallCheck(this, ModulesInfoService);

    var booleanFields = ["isProcess", "dpEnable", "isDataSharing", "isCustomModule"];
    var types = ["string"];
    var formTpl = {
      moduleName: "",
      moduleCode: "",
      dpEnable: true,
      isDataSharing: false,
      isCustomModule: false,
      isProcess: false,
      description: ""
    };
    return _possibleConstructorReturn(this, (ModulesInfoService.__proto__ || Object.getPrototypeOf(ModulesInfoService)).call(this, booleanFields, types, formTpl));
  }

  _createClass(ModulesInfoService, [{
    key: "findModules",
    value: function findModules(params) {
      //查询所有模块列表
      return _axios2.default.post("platform://custom/C10003", params).then(function (res) {
        return res.data;
      });
    }
    /**
     * 查询所有模块列表（分页查询）
     * @param {*} params 
     */

  }, {
    key: "findModuleByPage",
    value: function findModuleByPage(params) {
      return _axios2.default.post("platform://custom/C10002", params).then(function (res) {
        return res.data;
      });
    }
    //新增模块

  }, {
    key: "addModule",
    value: function addModule(params) {
      return _axios2.default.post("platform://custom/C10001", params).then(function (res) {
        return res;
      });
    }
    //更新模块

  }, {
    key: "updateModule",
    value: function updateModule(params) {
      return _axios2.default.post("platform://custom/C10005", params).then(function (res) {
        return res;
      });
    }
    //删除模块

  }, {
    key: "deleteModule",
    value: function deleteModule(params) {
      return _axios2.default.post("platform://custom/C10006", params).then(function (res) {
        return res;
      });
    }
    //查询单个模块

  }, {
    key: "findModuleDetail",
    value: function findModuleDetail(params) {
      return _axios2.default.post("platform://custom/C10004", params).then(function (res) {
        return res.data;
      });
    }
    //模块编码唯一检测

  }, {
    key: "checkModuleCode",
    value: function checkModuleCode(params) {
      return _axios2.default.post("platform://custom/C10008", params).then(function (res) {
        return res.data;
      });
    }
  }, {
    key: "findModuleByName",
    value: function findModuleByName(params) {
      //查询模块分页
      return _axios2.default.post("platform://custom/C10002", params).then(function (res) {
        return res.data;
      });
    }
  }]);

  return ModulesInfoService;
}(_shared.CRUD);

// 实例化后导出，全局单例


exports.default = new ModulesInfoService();