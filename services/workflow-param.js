"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var appKey = window.sessionStorage.getItem("paas:cloud:platform:appKey");
//工作流-流程参数相关接口

var WorkflowParamService = function () {
  function WorkflowParamService() {
    _classCallCheck(this, WorkflowParamService);
  }

  _createClass(WorkflowParamService, [{
    key: "save",

    /**
     * 1.添加自定义参数
     * 参数为数组，每一个元素是对象
     * {
        inputParam: inputParam,
        outParam: outParam,
        name: name,
        type: type,
        rev: rev = undefined,
        defaultVal: defaultVal,
        isConvert: isConvert,
        isSysDef: isSysDef,
      }
     * @param {string} modelId 流程模型ID
     * @param {string} inputParam 入参
     * @param {string} outParam 出参
     * @param {string} name 名称
     * @param {string} type 类型
     * @param {string} rev 版本 (非必需)
     * @param {string} defaultVal 默认值
     * @param {string} isConvert 是否转换
     * @param {string} isSysDef	 是否系统参数（true/false）
     */
    value: function save(modelId, param) {
      return _axios2.default.post("workflow://param/" + modelId + "/" + appKey, param).then(function (res) {
        return res.data;
      });
    }

    /**
     * 2.编辑自定义参数
     * 参数为数组，每一个元素是对象
     *{
        inputParam: inputParam,
        outParam: outParam,
        name: name,
        type: type,
        rev: rev,
        defaultVal: defaultVal,
        isConvert: isConvert,
        isSysDef: isSysDef,
      }
     * @param {string} modelId 流程模型ID
     * @param {string} inputParam 入参
     * @param {string} outParam 出参
     * @param {string} name 名称
     * @param {string} type 类型
     * @param {string} rev 版本 (非必需)
     * @param {string} defaultVal 默认值
     * @param {string} isConvert 是否转换
     * @param {string} isSysDef	 是否系统参数（true/false）
     */

  }, {
    key: "update",
    value: function update(_ref) {
      var modelId = _ref.modelId,
          inputParam = _ref.inputParam,
          outParam = _ref.outParam,
          name = _ref.name,
          type = _ref.type,
          _ref$rev = _ref.rev,
          rev = _ref$rev === undefined ? undefined : _ref$rev,
          defaultVal = _ref.defaultVal,
          isConvert = _ref.isConvert,
          isSysDef = _ref.isSysDef;

      return _axios2.default.put("workflow://param/" + modelId + "/" + appKey, {
        modelId: modelId,
        inputParam: inputParam,
        outParam: outParam,
        name: name,
        type: type,
        rev: rev,
        defaultVal: defaultVal,
        isConvert: isConvert,
        isSysDef: isSysDef
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 3.删除自定义参数
     * @param {string} modelId 流程模型ID
     */

  }, {
    key: "delByModelId",
    value: function delByModelId(_ref2) {
      var modelId = _ref2.modelId;

      return _axios2.default.delete("workflow://param/del/" + modelId + "/" + appKey, {}).then(function (res) {
        return res.data;
      });
    }

    /**
     * 获取自定义参数集合
     * @param {string} modelId 流程模型ID
     */

  }, {
    key: "findAllByModelId",
    value: function findAllByModelId(_ref3) {
      var modelId = _ref3.modelId;

      return _axios2.default.get("workflow://param/" + modelId + "/" + appKey, {}).then(function (res) {
        return res.data;
      });
    }
  }]);

  return WorkflowParamService;
}();

exports.default = new WorkflowParamService();