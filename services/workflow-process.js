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

var WorkflowAuthServiceUserId = function WorkflowAuthServiceUserId(user) {
  return user.entCode + "_" + user.userId;
};
var appKey = window.sessionStorage.getItem("paas:cloud:platform:appKey");
//工作流-流程基础服务相关接口

var WorkflowProcessService = function () {
  function WorkflowProcessService() {
    _classCallCheck(this, WorkflowProcessService);
  }

  _createClass(WorkflowProcessService, [{
    key: "startProcess",


    /**
     * 启动流程（根据流程定义ID和业务ID）
     * @param {string} user.entCode 企业编码
     * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
     * @param {string} processDefinitionId 流程定义ID
     * @param {string} businessId 业务ID
     * @param {string} title 流程标题
     * @param {string} level 重要等级 GENERAL-普通、MAJOR-重要、URGENT-紧急
     * @param {string} currentGroup 当前发起人所属工作组
     * @param {string} flowType 流流转类型 SAVEDRAFT-保存草稿、SUBMIT-提交审核
     * @param {map} variables	 启动流程变量集合（表单数据，Map形式）
     */
    value: function startProcess(_ref) {
      var processDefinitionId = _ref.processDefinitionId,
          title = _ref.title,
          level = _ref.level,
          currentGroup = _ref.currentGroup,
          flowType = _ref.flowType,
          _ref$variables = _ref.variables,
          variables = _ref$variables === undefined ? {} : _ref$variables;

      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.post("workflow://Process/start/" + appKey, {
          processDefinitionId: processDefinitionId,
          title: title,
          level: level,
          currentGroup: currentGroup,
          flowType: flowType,
          variables: variables
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 挂起流程定义
     * @param {list} processDefinitionIds	 流程定义ID集合
     */

  }, {
    key: "startProcessDefinition",
    value: function startProcessDefinition(_ref2) {
      var processDefinitionIds = _ref2.processDefinitionIds;

      return _axios2.default.post("workflow://Process/suspendProcessDefinition/" + appKey, {
        processDefinitionIds: processDefinitionIds
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 激活流程定义
     * @param {list} processDefinitionIds	 流程定义ID集合
     */

  }, {
    key: "activateProcessDefinition",
    value: function activateProcessDefinition(_ref3) {
      var processDefinitionIds = _ref3.processDefinitionIds;

      return _axios2.default.post("workflow://Process/activateProcessDefinition/" + appKey, {
        processDefinitionIds: processDefinitionIds
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 挂起流程实例
     * @param {list} instanceIds 流程实例ID集合
     */

  }, {
    key: "suspendProcessInstance",
    value: function suspendProcessInstance(_ref4) {
      var instanceIds = _ref4.instanceIds;

      return _axios2.default.post("workflow://Process/suspendProcessInstance/" + appKey, {
        instanceIds: instanceIds
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 激活流程实例
     * @param {list} instanceIds 流程实例ID集合
     */

  }, {
    key: "activateProcessInstance",
    value: function activateProcessInstance(_ref5) {
      var instanceIds = _ref5.instanceIds;

      return _axios2.default.post("workflow://Process/activateProcessInstance/" + appKey, {
        instanceIds: instanceIds
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 根据流程定义ID获取模块视图关系
     * @param {string} processDefinitionId 流程定义ID
     */

  }, {
    key: "findModelRelByProcessDefinitionId",
    value: function findModelRelByProcessDefinitionId(_ref6) {
      var processDefinitionId = _ref6.processDefinitionId;

      return _axios2.default.post("workflow://process/getModelRel/" + appKey, {
        processDefinitionId: processDefinitionId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 根据部署ID查询所有版本流程定义
     * @param {string} deploymentId 流程部署ID
     */

  }, {
    key: "findDdefinitionByDeploymentId",
    value: function findDdefinitionByDeploymentId(_ref7) {
      var deploymentId = _ref7.deploymentId;

      return _axios2.default.post("workflow://process/definitions/version/" + appKey, {
        deploymentId: deploymentId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 根据任务ID获取模块、视图、业务数据关系
     * @param {string} taskId 任务ID
     */

  }, {
    key: "findShipInfoByTaskId",
    value: function findShipInfoByTaskId(_ref8) {
      var taskId = _ref8.taskId;

      return _axios2.default.post("workflow://process/getShipInfo/" + appKey, {
        taskId: taskId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 流程任务审批
     * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
     * @param {list} taskIds	 任务ID集合
     * @param {string} comment 审批意见 (非必需)
     * @param {map} variables 参数集合 (非必需)
     */

  }, {
    key: "completeTasksByIds",
    value: function completeTasksByIds(_ref9) {
      var taskIds = _ref9.taskIds,
          _ref9$comment = _ref9.comment,
          comment = _ref9$comment === undefined ? undefined : _ref9$comment,
          _ref9$variables = _ref9.variables,
          variables = _ref9$variables === undefined ? {} : _ref9$variables;

      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.post("workflow://task/complete/" + appKey, {
          taskIds: taskIds,
          comment: comment,
          variables: variables
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 流程任务收回
     * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
     * @param {string} taskId 任务ID
     * @param {string} comment 审批意见 (非必需)
     */

  }, {
    key: "recoveryTaskById",
    value: function recoveryTaskById(_ref10) {
      var taskId = _ref10.taskId,
          _ref10$comment = _ref10.comment,
          comment = _ref10$comment === undefined ? undefined : _ref10$comment;

      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.post("workflow://task/recovery/" + appKey, {
          taskId: taskId,
          comment: comment
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 流程任务驳回
     * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
     * @param {string} taskId 任务ID
     * @param {string} activityId 驳回到的任务节点ID
     * @param {string} comment 审批意见 (非必需)
     * @param {map} variables	 参数集合 (非必需)
     */

  }, {
    key: "rejectTaskById",
    value: function rejectTaskById(_ref11) {
      var taskId = _ref11.taskId,
          activityId = _ref11.activityId,
          _ref11$comment = _ref11.comment,
          comment = _ref11$comment === undefined ? undefined : _ref11$comment,
          _ref11$variables = _ref11.variables,
          variables = _ref11$variables === undefined ? {} : _ref11$variables;

      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.post("workflow://task/reject/" + appKey, {
          taskId: taskId,
          activityId: activityId,
          comment: comment,
          variables: variables
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 获取流程可驳回的节点集合
     * @param {string} taskId 任务ID
     */

  }, {
    key: "findRejectListByTaskId",
    value: function findRejectListByTaskId(_ref12) {
      var taskId = _ref12.taskId;

      return _axios2.default.post("workflow://task/reject/list/" + appKey, {
        taskId: taskId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 自定义数据启动流程
     * @param {string} processDefinitionId 流程定义ID
     * @param {string} businessId 业务数据ID
     * @param {string} title 流程标题
     * @param {string} level 重要等级：GENERAL-普通、MAJOR-重要、URGENT-紧急
     * @param {string} currentGroup 发起人所属工作组
     * @param {string} flowType 流转类型：SAVEDRAFT-保存草稿、SUBMIT-提交审核
     * @param {map} variables 参数集合
     */

  }, {
    key: "startWorkflowByData",
    value: function startWorkflowByData(_ref13) {
      var processDefinitionId = _ref13.processDefinitionId,
          businessId = _ref13.businessId,
          title = _ref13.title,
          level = _ref13.level,
          currentGroup = _ref13.currentGroup,
          flowType = _ref13.flowType,
          variables = _ref13.variables;

      return _axios2.default.post("platform://activiti/P01001", {
        processDefinitionId: processDefinitionId,
        businessId: businessId,
        title: title,
        level: level,
        currentGroup: currentGroup,
        flowType: flowType,
        variables: variables
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 添加真实数据并启动流程
     * @param {string} processDefinitionId 流程定义ID
     * @param {string} businessId 业务数据ID
     * @param {string} title 流程标题
     * @param {string} level 重要等级：GENERAL-普通、MAJOR-重要、URGENT-紧急
     * @param {string} currentGroup 发起人所属工作组
     * @param {string} flowType 流转类型：SAVEDRAFT-保存草稿、SUBMIT-提交审核
     * @param {map} variables 参数集合
     * @param {map} columnMap 要添加的数据
     * @param {map} batchColumn 要添加的子表单的数据
     */

  }, {
    key: "saveColumnAndStart",
    value: function saveColumnAndStart(_ref14) {
      var processDefinitionId = _ref14.processDefinitionId,
          title = _ref14.title,
          level = _ref14.level,
          currentGroup = _ref14.currentGroup,
          flowType = _ref14.flowType,
          _ref14$variables = _ref14.variables,
          variables = _ref14$variables === undefined ? {} : _ref14$variables,
          columnMap = _ref14.columnMap,
          batchColumn = _ref14.batchColumn,
          viewId = _ref14.viewId,
          moduleId = _ref14.moduleId;

      return _axios2.default.post("platform://activiti/P01002", {
        processDefinitionId: processDefinitionId,
        title: title,
        level: level,
        currentGroup: currentGroup,
        flowType: flowType,
        variables: variables,
        columnMap: columnMap,
        batchColumn: batchColumn,
        viewId: viewId,
        moduleId: moduleId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 编辑草稿
     * @param {string} processDefinitionId 流程定义ID
     * @param {string} taskId 任务ID（草稿任务ID
     * @param {string} businessId 业务数据ID
     * @param {string} title 流程标题
     * @param {string} level	 重要等级：GENERAL-普通、MAJOR-重要、URGENT-紧急
     * @param {string} currentGroup	 发起人所属工作组
     * @param {string} flowType	 流转类型：SAVEDRAFT-保存草稿、SUBMIT-提交审核
     * @param {map} variables	 参数集合
     * @param {string} moduleId 模块ID
     * @param {map} record 需要修改的表单的数据
     */

  }, {
    key: "updateDraft",
    value: function updateDraft(_ref15) {
      var processDefinitionId = _ref15.processDefinitionId,
          taskId = _ref15.taskId,
          businessId = _ref15.businessId,
          title = _ref15.title,
          level = _ref15.level,
          currentGroup = _ref15.currentGroup,
          flowType = _ref15.flowType,
          _ref15$variables = _ref15.variables,
          variables = _ref15$variables === undefined ? {} : _ref15$variables,
          moduleId = _ref15.moduleId,
          record = _ref15.record,
          isChange = _ref15.isChange,
          changeRecord = _ref15.changeRecord;

      return _axios2.default.post("platform://activiti/P01003", {
        processDefinitionId: processDefinitionId,
        taskId: taskId,
        businessId: businessId,
        title: title,
        level: level,
        currentGroup: currentGroup,
        flowType: flowType,
        variables: variables,
        moduleId: moduleId,
        record: record,
        isChange: isChange,
        changeRecord: changeRecord
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 批量提交草稿
     * @param {list} taskIds 任务ID（草稿任务ID)
     * @param {int} businessId 业务数据ID
     * @param {int} moduleId 模块ID
     */

  }, {
    key: "submitDrafts",
    value: function submitDrafts(_ref16) {
      var taskIds = _ref16.taskIds,
          record = _ref16.record;

      return _axios2.default.post("platform://activiti/P01004", {
        taskIds: taskIds,
        record: record
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 批量删除草稿
     * @param {list} taskIds 任务ID集合
     * @param {list} record
     * @param {int} record.businessId 业务数据ID
     * @param {int} record.moduleId 模块ID
     */

  }, {
    key: "delDrafts",
    value: function delDrafts(_ref17) {
      var taskIds = _ref17.taskIds,
          record = _ref17.record;

      return _axios2.default.post("platform://activiti/P01005", {
        taskIds: taskIds,
        record: record
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 根据业务ID获取业务变更数据主体
     */

  }, {
    key: "getChangeData",
    value: function getChangeData(_ref18) {
      var processInstanceId = _ref18.processInstanceId;

      return _axios2.default.get("workflow://process/record/" + processInstanceId + "/" + appKey, {
        processInstanceId: processInstanceId
      }).then(function (res) {
        return res.data;
      });
    }
  }]);

  return WorkflowProcessService;
}();

exports.default = new WorkflowProcessService();