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
  var entCode = user.entCode;
  var userId = user.userId;
  return entCode + "_" + userId;
};
var appKey = window.sessionStorage.getItem("paas:cloud:platform:appKey");
//工作流-身份认证相关接口

var WorkflowAuthService = function () {
  function WorkflowAuthService() {
    _classCallCheck(this, WorkflowAuthService);
  }

  _createClass(WorkflowAuthService, [{
    key: "syncEntInfo",

    /** 
     * 1. 企业信息同步
     * @param {string} user.entCode 企业编码
     */
    value: function syncEntInfo() {
      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.post("workflow://auth/synchronization/" + appKey, {}).then(function (res) {
          return res;
        });
      });
    }

    /**
     * 2.创建工作组
     * @param {string} user.entCode 企业编码
     * @param {string} groupName 工作组名称
     * @param {srting} groupCode 工作组编码（唯一）
     * @param {string} type 工作组类型：DEPT-部门；TEMPORARY-临时
     * @param {string} state 工作组状态：ENABLE-启用；DISABLE-停用
     * @param {string} description 工作组描述 （非必填）
     */

  }, {
    key: "saveGroup",
    value: function saveGroup(_ref) {
      var groupName = _ref.groupName,
          groupCode = _ref.groupCode,
          type = _ref.type,
          state = _ref.state,
          _ref$description = _ref.description,
          description = _ref$description === undefined ? undefined : _ref$description;

      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.post("workflow://auth/group/" + appKey, {
          groupName: groupName,
          groupCode: groupCode,
          type: type,
          state: state,
          description: description
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 3.编辑工作组
     * @param {string} groupId 工作组ID（唯一标识）
     * @param {string} groupName 工作组名称
     * @param {string} type 工作组类型：DEPT-部门；TEMPORARY-临时
     * @param {string} state 工作组状态：ENABLE-启用；DISABLE-停用
     * @param {string} description 工作组描述 (非必需)
     */

  }, {
    key: "update",
    value: function update(_ref2) {
      var groupId = _ref2.groupId,
          groupName = _ref2.groupName,
          type = _ref2.type,
          state = _ref2.state,
          _ref2$description = _ref2.description,
          description = _ref2$description === undefined ? undefined : _ref2$description;

      return _axios2.default.put("workflow://auth/group/" + appKey, {
        groupId: groupId,
        groupName: groupName,
        type: type,
        state: state,
        description: description
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 4.批量删除工作组
     * @param {string} groupIds 工作组ID集合（唯一标识）
     */

  }, {
    key: "delGroups",
    value: function delGroups(_ref3) {
      var groupIds = _ref3.groupIds;

      return _axios2.default.put("workflow://auth/group/del/" + appKey, {
        groupIds: groupIds
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 5.获取工作组集合
     * @param {string} groupName 工作组名称（模糊匹配）
     * @param {string} groupCode 工作组编码
     * @param {int} pageNow 当前页码
     * @param {int} pageSize 页数
     */

  }, {
    key: "findGroups",
    value: function findGroups(_ref4) {
      var groupName = _ref4.groupName,
          groupCode = _ref4.groupCode,
          _ref4$pageNow = _ref4.pageNow,
          pageNow = _ref4$pageNow === undefined ? PAGENOW : _ref4$pageNow,
          _ref4$pageSize = _ref4.pageSize,
          pageSize = _ref4$pageSize === undefined ? PAGESIZE : _ref4$pageSize;

      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.post("workflow://auth/group/list/" + appKey, {
          groupName: groupName,
          groupCode: groupCode,
          pageNow: pageNow,
          pageSize: pageSize
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 6.启用工作组
     * @param {list} groupIds 工作组ID集合（唯一标识）
     */

  }, {
    key: "enableGroupsByIds",
    value: function enableGroupsByIds(_ref5) {
      var groupIds = _ref5.groupIds;

      return _axios2.default.put("workflow://auth/group/enable/" + appKey, {
        groupIds: groupIds
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 7.禁用工作组
     * @param {list} groupIds 工作组ID集合（唯一标识）
     */

  }, {
    key: "disableGroupsByIds",
    value: function disableGroupsByIds(_ref6) {
      var groupIds = _ref6.groupIds;

      return _axios2.default.put("workflow://auth/group/disable/" + appKey, {
        groupIds: groupIds
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 8.绑定工作组与人员列表关系
     * @param {string} groupId 工作组ID（唯一标识）
     * @param {list} userIds 工作流用户ID集合（唯一标识）
     */

  }, {
    key: "bindShipByGroupIdAndUserId",
    value: function bindShipByGroupIdAndUserId(_ref7) {
      var groupId = _ref7.groupId,
          userIds = _ref7.userIds;

      return _axios2.default.put("workflow://auth/group/bind/" + appKey, {
        groupId: groupId,
        userIds: userIds
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 9.删除工作组与人员列表关系
     * @param {string} groupId 工作组ID（唯一标识）
     * @param {list} userIds 工作流用户ID集合（唯一标识）
     */

  }, {
    key: "delShipByGroupIdAndUserId",
    value: function delShipByGroupIdAndUserId(_ref8) {
      var groupId = _ref8.groupId,
          userIds = _ref8.userIds;

      return _axios2.default.put("workflow://auth/group/user/ship/del/" + appKey, {
        groupId: groupId,
        userIds: userIds
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 10.获取用户所属工作组集合
     * @param {string} userId 工作流用户ID
     */

  }, {
    key: "findGroupsByUserId",
    value: function findGroupsByUserId() {
      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.get("workflow://auth/user/" + userid + "/groups/" + appKey, {}).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 11.获取用户详情
     * @param {string} userId 工作流用户ID
     */

  }, {
    key: "findInfoByUserId",
    value: function findInfoByUserId(_ref9) {
      var userId = _ref9.userId;

      return _axios2.default.get("workflow://auth/user/" + appKey, {
        userId: userId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 12.删除用户信息
     * @param {string} userId 工作流用户ID
     */

  }, {
    key: "delInfoByUserId",
    value: function delInfoByUserId(_ref10) {
      var userId = _ref10.userId;

      return _axios2.default.delete("workflow://auth/user/" + appKey, {
        userId: userId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 13.获取部门（即组织）下用户集合
     * @param {string} user.entCode 企业编码
     * @param {string} orgCode 组织编码
     * @param {list} groupCodes 工作组编码集合 (非必需)
     */

  }, {
    key: "findUserByOrgCode",
    value: function findUserByOrgCode(_ref11) {
      var orgCode = _ref11.orgCode,
          _ref11$groupCodes = _ref11.groupCodes,
          groupCodes = _ref11$groupCodes === undefined ? undefined : _ref11$groupCodes;

      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.post("workflow://auth/user/org/groups/" + appKey, {
          orgCode: orgCode,
          groupCodes: groupCodes
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 14.获取工作组下的用户集合
     * @param {string} user.entCode 企业编码
     * @param {string} groupCode 工作组编码
     * @param {list} groupCodes 工作组编码集合 (非必需)
     */

  }, {
    key: "findUserByGroupCode",
    value: function findUserByGroupCode(_ref12) {
      var groupCode = _ref12.groupCode,
          _ref12$groupCodes = _ref12.groupCodes,
          groupCodes = _ref12$groupCodes === undefined ? undefined : _ref12$groupCodes;

      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.post("workflow://auth/user/group/groups/" + appKey, {
          groupCode: groupCode,
          groupCodes: groupCodes
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 15.获取企业组织架构
     * @param {string} user.entCode 企业编码
     */

  }, {
    key: "findOrgAll",
    value: function findOrgAll() {
      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.get("workflow://auth/org/" + appKey, {}).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 16.获取部门（即组织）下用户集合
     * @param {string} user.entCode 企业编码
     * @param {string} orgCode 组织编码
     */

  }, {
    key: "findUserOrgCode",
    value: function findUserOrgCode(_ref13) {
      var orgCode = _ref13.orgCode;

      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.post("workflow://auth/user/getByOrg/" + appKey, {
          orgCode: orgCode
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 17.模糊查询用户列表
     * @param {string} user.entCode 企业编码
     * @param {string} name 名称
     */

  }, {
    key: "findUserByName",
    value: function findUserByName(_ref14) {
      var name = _ref14.name;

      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.post("workflow://auth/user/getByName/" + appKey, {
          name: name
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 18.解除指定工作组下的所有用户关系
     * @param {string} groupId 工作组ID（唯一标识）
     */

  }, {
    key: "delShipByGroupId",
    value: function delShipByGroupId(_ref15) {
      var groupId = _ref15.groupId;

      return _axios2.default.put("workflow://auth/group/ship/del/" + appKey, {
        groupId: groupId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 19.维护指定工作组成员
     * @param {string} groupId 工作组ID（唯一标识）
     * @param {list} userIds 工作流用户ID集合（唯一标识）
     */

  }, {
    key: "maintainUser",
    value: function maintainUser(_ref16) {
      var groupId = _ref16.groupId,
          userIds = _ref16.userIds;

      return _axios2.default.put("workflow://auth/ship/maintain/" + appKey, {
        groupId: groupId,
        userIds: userIds
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 20.获取指定工作组下的所有用户集合
     * @param {string} groupId 工作组ID（唯一标识）
     */

  }, {
    key: "findUserByGroupId",
    value: function findUserByGroupId(_ref17) {
      var groupId = _ref17.groupId;

      return _axios2.default.post("workflow://auth/group/users/" + appKey, {
        groupId: groupId
      }).then(function (res) {
        return res.data;
      });
    }
    /**
     * 21.获取工作组分页
     * @param {string} groupId 工作组ID（唯一标识）
     */

  }, {
    key: "getWorkGroupPage",
    value: function getWorkGroupPage(_ref18) {
      var _ref18$groupName = _ref18.groupName,
          groupName = _ref18$groupName === undefined ? undefined : _ref18$groupName,
          _ref18$groupCode = _ref18.groupCode,
          groupCode = _ref18$groupCode === undefined ? undefined : _ref18$groupCode,
          _ref18$PAGENOW = _ref18.PAGENOW,
          PAGENOW = _ref18$PAGENOW === undefined ? PAGENOW : _ref18$PAGENOW,
          _ref18$pageSize = _ref18.pageSize,
          pageSize = _ref18$pageSize === undefined ? pageSize : _ref18$pageSize;

      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.post("workflow://auth/group/list/" + appKey, {
          groupName: groupName,
          groupCode: groupCode
        }).then(function (res) {
          return res.data;
        });
      });
    }
  }]);

  return WorkflowAuthService;
}();

exports.default = new WorkflowAuthService();