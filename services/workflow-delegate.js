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
//工作流-流程代理相关接口

var WorkflowDelegateService = function () {
  function WorkflowDelegateService() {
    _classCallCheck(this, WorkflowDelegateService);
  }

  _createClass(WorkflowDelegateService, [{
    key: "save",

    /**
     * 添加代理记录
     * @param {string} user.entCode 企业编码
     * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
     * @param {string} attorney 被代理人ID
     * @param {date} startTime	 被代理开始时间
     * @param {date} endTime	 被代理结束时间
     * @param {string} processDefinitionId	 流程定义ID
     * @param {int} status 代理状态：0-启用；1-禁用
     * @param {string} content 简述 (非必需)
     */
    value: function save(_ref) {
      var attorney = _ref.attorney,
          startTime = _ref.startTime,
          endTime = _ref.endTime,
          processDefinitionId = _ref.processDefinitionId,
          status = _ref.status,
          _ref$content = _ref.content,
          content = _ref$content === undefined ? undefined : _ref$content;

      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.post("workflow://delegate/" + appKey, {
          attorney: attorney,
          startTime: startTime,
          endTime: endTime,
          processDefinitionId: processDefinitionId,
          status: status,
          content: content
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 编辑代理记录
     * @param {string} attorney 被代理人ID
     * @param {*} startTime	 被代理开始时间
     * @param {*} endTime	 被代理结束时间
     * @param {string} processDefinitionId	 流程定义ID
     * @param {int} status 代理状态：0-启用；1-禁用
     * @param {string} content 简述 (非必需)
     * @param {int} id 主键
     */

  }, {
    key: "update",
    value: function update(_ref2) {
      var id = _ref2.id,
          attorney = _ref2.attorney,
          startTime = _ref2.startTime,
          endTime = _ref2.endTime,
          processDefinitionId = _ref2.processDefinitionId,
          status = _ref2.status,
          _ref2$content = _ref2.content,
          content = _ref2$content === undefined ? undefined : _ref2$content;

      return _axios2.default.put("workflow://delegate/" + appKey, {
        attorney: attorney,
        startTime: startTime,
        endTime: endTime,
        processDefinitionId: processDefinitionId,
        status: status,
        content: content,
        id: id
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 批量删除代理信息
     * @param {list} ids 主键集合
     */

  }, {
    key: "delByIds",
    value: function delByIds(_ref3) {
      var ids = _ref3.ids;

      return _axios2.default.put("workflow://delegate/del/" + appKey, {
        ids: ids
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 获取用户代理列表
     * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
     * @param {list} ids 主键集合
     * @param {int} pageNow 当前页
     * @param {int} pageSize 页面显示条数
     */

  }, {
    key: "findByIds",
    value: function findByIds(_ref4) {
      var ids = _ref4.ids,
          _ref4$pageNow = _ref4.pageNow,
          pageNow = _ref4$pageNow === undefined ? PAGENOW : _ref4$pageNow,
          _ref4$pageSize = _ref4.pageSize,
          pageSize = _ref4$pageSize === undefined ? PAGESIZE : _ref4$pageSize;

      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.put("workflow://delegate/list/" + appKey, {
          ids: ids,
          pageNow: pageNow,
          pageSize: pageSize
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 查询代理详细
     * @param {string} user.userId 主键
     */

  }, {
    key: "findOne",
    value: function findOne() {
      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.get("workflow://delegate/" + appKey, {}).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 启用代理
     * @param {list} ids 主键集合
     */

  }, {
    key: "enableByIds",
    value: function enableByIds(_ref5) {
      var ids = _ref5.ids;

      return _axios2.default.put("workflow://delegate/enable/" + appKey, {
        ids: ids
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 禁用代理
     * @param {list} ids 主键集合
     */

  }, {
    key: "disableByIds",
    value: function disableByIds(_ref6) {
      var ids = _ref6.ids;

      return _axios2.default.put("workflow://delegate/disable/" + appKey, {
        ids: ids
      }).then(function (res) {
        return res.data;
      });
    }
  }]);

  return WorkflowDelegateService;
}();

exports.default = new WorkflowDelegateService();