"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _loginUser = require("./login-user");

var _loginUser2 = _interopRequireDefault(_loginUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PAGENOW = 1;
var PAGESIZE = 20;
var WorkflowAuthServiceUserId = function WorkflowAuthServiceUserId(user) {
  return user.entCode + "_" + user.userId;
};
var appKey = window.sessionStorage.getItem("paas:cloud:platform:appKey");
//工作流-流程模型相关接口

var WorkflowModelService = function () {
  function WorkflowModelService() {
    _classCallCheck(this, WorkflowModelService);
  }

  _createClass(WorkflowModelService, [{
    key: "newModel",


    /**
     * 1.创建新的模型
     * @param {string} user.entCode 企业编码
     * @param {string} user.userId 工作流用户ID （企业编码_原业务系统用户ID）
     * @param {string} name 模型名称
     * @param {string} key 模型编码
     * @param {string} categoryCode	 模型分类编码
     * @param {int} moduleId 模块ID
     * @param {int} viewId 视图ID
     * @param {int} viewLookId	 展示视图ID
     * @param {string} moduleTableName	 业务系统模块表名称 (非必需)
     * @param {string} title 启动流程时展示标题字段 (非必需)
     * @param {string} description 模型描述 (非必需)
     * @param {map} variables 其他参数 (非必需)
     */
    value: function newModel(_ref) {
      var name = _ref.name,
          key = _ref.key,
          categoryCode = _ref.categoryCode,
          moduleId = _ref.moduleId,
          viewId = _ref.viewId,
          viewLookId = _ref.viewLookId,
          _ref$moduleTableName = _ref.moduleTableName,
          moduleTableName = _ref$moduleTableName === undefined ? undefined : _ref$moduleTableName,
          _ref$title = _ref.title,
          title = _ref$title === undefined ? undefined : _ref$title,
          _ref$description = _ref.description,
          description = _ref$description === undefined ? undefined : _ref$description,
          _ref$variables = _ref.variables,
          variables = _ref$variables === undefined ? undefined : _ref$variables,
          isChange = _ref.isChange,
          isSubmitChange = _ref.isSubmitChange,
          userIds = _ref.userIds,
          groupIds = _ref.groupIds,
          orgCodes = _ref.orgCodes;

      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.post("workflow://model/" + appKey, {
          name: name,
          key: key,
          categoryCode: categoryCode,
          moduleId: moduleId,
          viewId: viewId,
          viewLookId: viewLookId,
          moduleTableName: moduleTableName,
          title: title,
          description: description,
          variables: variables,
          isChange: isChange,
          isSubmitChange: isSubmitChange,
          userIds: userIds,
          groupIds: groupIds,
          orgCodes: orgCodes
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 2.创建文件模型
     * @param {string} user.entCode 企业编码
     * @param {string} user.userId 工作流用户ID （企业编码_原业务系统用户ID）
     * @param {file} bpmnFile 模型文件（XXX.bpmn/XXX.bpmn20.xml）
     * @param {string} categoryCode 模型分类编码
     * @param {int} moduleId 模块ID
     * @param {int} viewId	 视图ID
     * @param {int} viewLookId 展示视图ID
     * @param {string} moduleTableName 业务系统模块表名称 (非必需)
     * @param {string} title 启动流程时展示标题字段 (非必需)
     * @param {string} description 模型描述 (非必需)
     * @param {map} variables 其他参数 (非必需)
     */

  }, {
    key: "uploadFile",
    value: function uploadFile(_ref2) {
      var bpmnFile = _ref2.bpmnFile,
          categoryCode = _ref2.categoryCode,
          moduleId = _ref2.moduleId,
          viewId = _ref2.viewId,
          viewLookId = _ref2.viewLookId,
          _ref2$moduleTableName = _ref2.moduleTableName,
          moduleTableName = _ref2$moduleTableName === undefined ? undefined : _ref2$moduleTableName,
          _ref2$title = _ref2.title,
          title = _ref2$title === undefined ? undefined : _ref2$title,
          _ref2$description = _ref2.description,
          description = _ref2$description === undefined ? undefined : _ref2$description,
          _ref2$variables = _ref2.variables,
          variables = _ref2$variables === undefined ? undefined : _ref2$variables;

      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.post("workflow://model/fileUpload/" + appKey, {
          bpmnFile: bpmnFile,
          categoryCode: categoryCode,
          moduleId: moduleId,
          viewId: viewId,
          viewLookId: viewLookId,
          moduleTableName: moduleTableName,
          title: title,
          description: description,
          variables: variables
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 3.编辑模型基本信息
     * @param {*} user.modelId 流程模型ID
     * @param {string} name 模型名称
     * @param {string} categoryCode 模型分类编码
     * @param {int} moduleId 模块ID
     * @param {int} viewId	 视图ID
     * @param {int} viewLookId 展示视图ID
     * @param {string} moduleTableName 业务系统模块表名称 (非必需)
     * @param {string} title 启动流程时展示标题字段 (非必需)
     * @param {string} description 模型描述 (非必需)
     * @param {map} variables 其他参数 (非必需)
     * @param {map} variables 是否为变更流程
     * @param {map} variables 流程结束，是否提交表更数据
     */

  }, {
    key: "update",
    value: function update(_ref3) {
      var name = _ref3.name,
          categoryCode = _ref3.categoryCode,
          moduleId = _ref3.moduleId,
          viewId = _ref3.viewId,
          viewLookId = _ref3.viewLookId,
          _ref3$moduleTableName = _ref3.moduleTableName,
          moduleTableName = _ref3$moduleTableName === undefined ? undefined : _ref3$moduleTableName,
          _ref3$title = _ref3.title,
          title = _ref3$title === undefined ? undefined : _ref3$title,
          _ref3$description = _ref3.description,
          description = _ref3$description === undefined ? undefined : _ref3$description,
          _ref3$variables = _ref3.variables,
          variables = _ref3$variables === undefined ? undefined : _ref3$variables,
          isChange = _ref3.isChange,
          isSubmitChange = _ref3.isSubmitChange,
          modelId = _ref3.modelId,
          userIds = _ref3.userIds,
          groupIds = _ref3.groupIds,
          orgCodes = _ref3.orgCodes;

      return _axios2.default.put("workflow://model/" + modelId + "/" + appKey, {
        name: name,
        categoryCode: categoryCode,
        moduleId: moduleId,
        viewId: viewId,
        viewLookId: viewLookId,
        moduleTableName: moduleTableName,
        title: title,
        description: description,
        variables: variables,
        isChange: isChange,
        isSubmitChange: isSubmitChange,
        modelId: modelId,
        userIds: userIds,
        groupIds: groupIds,
        orgCodes: orgCodes
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 4.获取模型集合
     * @param {string} user.entCode 企业编码
     * @param {string} categoryCode 模型分类编码 (非必需)
     * @param {string} processName 模型名称（模糊匹配） (非必需)
     * @param {string} state 状态：禁用-DISABLE；启用-ENABLE；发布-RELEASE；未发布-NORELEASE
     * @param {int} pageNow 当前页码
     * @param {int} pageSize 页数
     */

  }, {
    key: "findList",
    value: function findList(_ref4) {
      var _ref4$categoryCode = _ref4.categoryCode,
          categoryCode = _ref4$categoryCode === undefined ? undefined : _ref4$categoryCode,
          _ref4$processName = _ref4.processName,
          processName = _ref4$processName === undefined ? undefined : _ref4$processName,
          state = _ref4.state,
          _ref4$pageNow = _ref4.pageNow,
          pageNow = _ref4$pageNow === undefined ? PAGENOW : _ref4$pageNow,
          _ref4$pageSize = _ref4.pageSize,
          pageSize = _ref4$pageSize === undefined ? PAGESIZE : _ref4$pageSize;

      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.post("workflow://model/list/" + appKey, {
          categoryCode: categoryCode,
          processName: processName,
          state: state,
          pageNow: pageNow,
          pageSize: pageSize
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 5.获取模型详细信息
     * @param {*} modelId 流程模型ID
     */

  }, {
    key: "findById",
    value: function findById(_ref5) {
      var modelId = _ref5.modelId;

      return _axios2.default.get("workflow://model/" + modelId + "/" + appKey, {}).then(function (res) {
        return res.data;
      });
    }

    /**
     * 6.流程部署（即发布）
     * @param {*} modelId 流程模型ID
     * 流程项目部署成功，可访问：http://IP:端口号/workflow/static/models.html 页面设计流程图，也可在此页面发布流程和导出流程文件
     */

  }, {
    key: "deploy",
    value: function deploy(_ref6) {
      var modelId = _ref6.modelId;

      return _axios2.default.get("workflow://model/" + modelId + "/deploy/" + appKey).then(function (res) {
        return res;
      });
    }

    /**
     * 7.校验模型编码
     * @param {string} user.entCode 企业编码
     * @param {string} key 模型编码
     */

  }, {
    key: "checkKey",
    value: function checkKey(_ref7) {
      var key = _ref7.key;

      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.post("workflow://model/checkKey/" + appKey, {
          key: key
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 8.获取历史流程图
     * @param {string} instanceId 流程实例ID
     * 以GET方式获取到流程图信息，会在浏览器页面中生成相应的图片信息
     */

  }, {
    key: "findFlowChartByInstanceId",
    value: function findFlowChartByInstanceId(_ref8) {
      var instanceId = _ref8.instanceId;

      return _axios2.default.get("workflow://model/flowChart/" + appKey + "?processInstanceId=" + instanceId).then(function (res) {
        return res.data;
      });
    }

    /**
     * 9.根据模型ID获取最新版本流程定义
     * @param {*} modelId 流程实例ID
     */

  }, {
    key: "findProcessDefinition",
    value: function findProcessDefinition(_ref9) {
      var modelId = _ref9.modelId;

      return _axios2.default.get("workflow://model/" + modelId + "/processDefinition/" + appKey, {}).then(function (res) {
        return res.data;
      });
    }

    /**
     * 10.导出流程文件
     * @param {*} modelId 流程实例ID
     * 以GET方式获取到流程文件信息，生成文件保存在本地
     */

  }, {
    key: "exportWorkflow",
    value: function exportWorkflow(_ref10) {
      var modelId = _ref10.modelId;

      return _axios2.default.get("workflow://model/export/" + modelId + "/" + appKey).then(function (res) {
        return res.data;
      });
    }
  }]);

  return WorkflowModelService;
}();

exports.default = new WorkflowModelService();