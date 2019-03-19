"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _md = require("md5");

var _md2 = _interopRequireDefault(_md);

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
//工作流-流程查询相关接口

var WorkflowTaskService = function () {
  function WorkflowTaskService() {
    _classCallCheck(this, WorkflowTaskService);
  }

  _createClass(WorkflowTaskService, [{
    key: "isSignById",

    /**
     * 1.根据任务ID判断当前节点是否为会签节点
     * @param {string} taskId 任务ID
     */
    value: function isSignById(_ref) {
      var taskId = _ref.taskId;

      return _axios2.default.post("workflow://task/isSign/" + appKey, {
        taskId: taskId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 2.根据实例ID获取当前可收回的任务ID
     * @param {string} instanceId 流程实例ID
     */

  }, {
    key: "findRecoveryByInstanceId",
    value: function findRecoveryByInstanceId(_ref2) {
      var instanceId = _ref2.instanceId;

      return _axios2.default.post("workflow://task/allow/recovery/" + appKey, {
        instanceId: instanceId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 3.获取企业部署的流程定义集合
     * @param {string} user.entCode 企业编码
     */

  }, {
    key: "findDefinitionList",
    value: function findDefinitionList() {
      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.post("workflow://process/definition/list/" + appKey, {}).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 4.获取用户可发起的流程定义集合
     * @param {string} user.entCode 企业编码
     * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
     * @param {string} categoryCode 流程分类编码 (非必需)
     * @param {int} pageNow
     * @param {int} pageSize
     */

  }, {
    key: "findPeocessListByCategoryCode",
    value: function findPeocessListByCategoryCode(_ref3) {
      var _ref3$categoryCode = _ref3.categoryCode,
          categoryCode = _ref3$categoryCode === undefined ? undefined : _ref3$categoryCode,
          _ref3$pageNow = _ref3.pageNow,
          pageNow = _ref3$pageNow === undefined ? PAGENOW : _ref3$pageNow,
          _ref3$pageSize = _ref3.pageSize,
          pageSize = _ref3$pageSize === undefined ? PAGESIZE : _ref3$pageSize;

      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.post("workflow://process/allow/start/" + appKey, {
          categoryCode: categoryCode,
          pageNow: pageNow,
          pageSize: pageSize
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 5.查询用户草稿
     * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
     * @param {string} selectType 查询类型 ALL-全部、DRAFT-草稿、REJECT-驳回 (非必需)
     * @param {string} categoryCode	 流程分类编码 (非必需)
     * @param {string} startTime	 开始时间
     * @param {int} pageNow 当前页码
     * @param {int} pageSize 页数
     */

  }, {
    key: "pageDrafts",
    value: function pageDrafts(_ref4) {
      var _ref4$selectType = _ref4.selectType,
          selectType = _ref4$selectType === undefined ? 'ALL' : _ref4$selectType,
          _ref4$categoryCode = _ref4.categoryCode,
          categoryCode = _ref4$categoryCode === undefined ? undefined : _ref4$categoryCode,
          startTime = _ref4.startTime,
          _ref4$pageNow = _ref4.pageNow,
          pageNow = _ref4$pageNow === undefined ? PAGENOW : _ref4$pageNow,
          _ref4$pageSize = _ref4.pageSize,
          pageSize = _ref4$pageSize === undefined ? PAGESIZE : _ref4$pageSize;

      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.post("workflow://search/drafts/" + appKey, {
          selectType: selectType,
          categoryCode: categoryCode,
          startTime: startTime,
          pageNow: pageNow,
          pageSize: pageSize
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 6.查询用户待办
     * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
     * @param {string} taskType 任务类型 指定审批人-APPROVAL、指定任务候选人-CANDIDATE、指定候选工作组-CANDIDATEGROUP
     * @param {list} userIds	 申请人ID集合 (非必需)
     * @param {string} selectType	 查询类型 ALL- 全部，ME-本人，AGENT-代理 (非必需)
     * @param {string} categoryCode	 流程分类编码 (非必需)
     * @param {string} orgCode	 申请部门编码 (非必需)
     * @param {string} startTime	 开始时间
     * @param {int} pageNow 当前页码
     * @param {int} pageSize 页数
     */

  }, {
    key: "pageDeals",
    value: function pageDeals(_ref5) {
      var taskType = _ref5.taskType,
          _ref5$userIds = _ref5.userIds,
          userIds = _ref5$userIds === undefined ? undefined : _ref5$userIds,
          _ref5$selectType = _ref5.selectType,
          selectType = _ref5$selectType === undefined ? 'ALL' : _ref5$selectType,
          _ref5$categoryCode = _ref5.categoryCode,
          categoryCode = _ref5$categoryCode === undefined ? undefined : _ref5$categoryCode,
          _ref5$orgCode = _ref5.orgCode,
          orgCode = _ref5$orgCode === undefined ? undefined : _ref5$orgCode,
          startTime = _ref5.startTime,
          _ref5$pageNow = _ref5.pageNow,
          pageNow = _ref5$pageNow === undefined ? PAGENOW : _ref5$pageNow,
          _ref5$pageSize = _ref5.pageSize,
          pageSize = _ref5$pageSize === undefined ? PAGESIZE : _ref5$pageSize;

      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.post("workflow://search/deals/" + appKey, {
          taskType: taskType,
          userIds: userIds,
          selectType: selectType,
          categoryCode: categoryCode,
          orgCode: orgCode,
          startTime: startTime,
          pageNow: pageNow,
          pageSize: pageSize
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 7.查询用户已办
     * @param {string} user.entCode 企业编码
     * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
     * @param {list} userIds 申请人ID集合 (非必需)
     * @param {string} selectType	 查询类型 ALL- 全部，ME-本人，AGENT-代理 (非必需)
     * @param {string} categoryCode	 流程分类编码 (非必需)
     * @param {string} orgCode	 申请部门编码 (非必需)
     * @param {string} startTime	 开始时间
     * @param {int} pageNow 当前页码
     * @param {int} pageSize 页数
       */

  }, {
    key: "pageComplete",
    value: function pageComplete(_ref6) {
      var _ref6$userIds = _ref6.userIds,
          userIds = _ref6$userIds === undefined ? undefined : _ref6$userIds,
          _ref6$selectType = _ref6.selectType,
          selectType = _ref6$selectType === undefined ? undefined : _ref6$selectType,
          _ref6$categoryCode = _ref6.categoryCode,
          categoryCode = _ref6$categoryCode === undefined ? undefined : _ref6$categoryCode,
          _ref6$orgCode = _ref6.orgCode,
          orgCode = _ref6$orgCode === undefined ? undefined : _ref6$orgCode,
          startTime = _ref6.startTime,
          _ref6$pageNow = _ref6.pageNow,
          pageNow = _ref6$pageNow === undefined ? PAGENOW : _ref6$pageNow,
          _ref6$pageSize = _ref6.pageSize,
          pageSize = _ref6$pageSize === undefined ? PAGESIZE : _ref6$pageSize;

      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.post("workflow://search/complete/" + appKey, {
          userIds: userIds,
          selectType: selectType,
          categoryCode: categoryCode,
          orgCode: orgCode,
          startTime: startTime,
          pageNow: pageNow,
          pageSize: pageSize
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 8.查询所有流程实例
     * @param {string} user.entCode 企业编码
     * @param {int} pageNow
     * @param {int} pageSize
     */

  }, {
    key: "pageAllInstance",
    value: function pageAllInstance(_ref7) {
      var _ref7$pageNow = _ref7.pageNow,
          pageNow = _ref7$pageNow === undefined ? PAGENOW : _ref7$pageNow,
          _ref7$pageSize = _ref7.pageSize,
          pageSize = _ref7$pageSize === undefined ? PAGESIZE : _ref7$pageSize;

      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.post("workflow://search/instance/all/" + appKey, {
          pageNow: pageNow,
          pageSize: pageSize
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 9.查询用户发起的流程实例
     * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
     * @param {string} categoryCode 流程分类编码 (非必需)
     * @param {string} startTime 开始时间
     * @param {string} approvalStatus 审批状态 ALL-所有；PENDING-审批中；COMPLETE-已完成 (非必需)
     */

  }, {
    key: "findUserInstance",
    value: function findUserInstance(_ref8) {
      var _ref8$categoryCode = _ref8.categoryCode,
          categoryCode = _ref8$categoryCode === undefined ? undefined : _ref8$categoryCode,
          startTime = _ref8.startTime,
          _ref8$approvalStatus = _ref8.approvalStatus,
          approvalStatus = _ref8$approvalStatus === undefined ? undefined : _ref8$approvalStatus;

      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.post("workflow://search/instance/user/" + appKey, {
          categoryCode: categoryCode,
          startTime: startTime,
          approvalStatus: approvalStatus
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 10.查询用户发起的审批集合
     * @param {string} user.entCode 企业编码
     * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
     * @param {string} categoryCode 流程分类编码 (非必需)
     * @param {string} startTime 开始时间
     * @param {string} approvalStatus 审批状态 ALL-所有；PENDING-审批中；COMPLETE-已完成 (非必需)
     * @param {int} pageNow
     * @param {int} pageSize
     */

  }, {
    key: "pageUserApproval",
    value: function pageUserApproval(_ref9) {
      var _ref9$categoryCode = _ref9.categoryCode,
          categoryCode = _ref9$categoryCode === undefined ? 'AOS' : _ref9$categoryCode,
          startTime = _ref9.startTime,
          _ref9$approvalStatus = _ref9.approvalStatus,
          approvalStatus = _ref9$approvalStatus === undefined ? 'ALL' : _ref9$approvalStatus,
          _ref9$pageNow = _ref9.pageNow,
          pageNow = _ref9$pageNow === undefined ? 1 : _ref9$pageNow,
          _ref9$pageSize = _ref9.pageSize,
          pageSize = _ref9$pageSize === undefined ? 20 : _ref9$pageSize;

      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.post("workflow://search/approval/user/" + appKey, { //测试数据将user.userId改为了AOS_1
          categoryCode: categoryCode,
          startTime: startTime,
          approvalStatus: approvalStatus,
          pageNow: pageNow,
          pageSize: pageSize
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 11.获取用户待办总记录数
     * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
     */

  }, {
    key: "countUserDeals",
    value: function countUserDeals() {
      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.post("workflow://search/deals/count/" + appKey, {}).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 12.获取任务审批记录集合
     * @param {string} taskId 任务ID (非必需)
     * @param {string} instanceId	 流程实例ID (非必需)
     * 任务ID和流程实例ID不能同时为空，必须有一个值
     */

  }, {
    key: "findCommentsByTaskIdOrInstanceId",
    value: function findCommentsByTaskIdOrInstanceId(_ref10) {
      var _ref10$taskId = _ref10.taskId,
          taskId = _ref10$taskId === undefined ? undefined : _ref10$taskId,
          _ref10$instanceId = _ref10.instanceId,
          instanceId = _ref10$instanceId === undefined ? undefined : _ref10$instanceId;

      return _axios2.default.post("workflow://search/comments/" + appKey, {
        taskId: taskId,
        instanceId: instanceId
      }).then(function (res) {
        return res.data;
      });
    }
  }]);

  return WorkflowTaskService;
}();

exports.default = new WorkflowTaskService();