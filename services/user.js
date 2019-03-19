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

var UserService = function () {
  function UserService() {
    _classCallCheck(this, UserService);
  }

  _createClass(UserService, [{
    key: "findUserList",

    //查询用户列表
    value: function findUserList(params) {
      return _axios2.default.post("platform://auth/A02005", params).then(function (res) {
        return res.data;
      });
    }
    //查询分页用户列表

  }, {
    key: "findUserByPage",
    value: function findUserByPage(params) {
      return _axios2.default.post("platform://auth/A02009", params).then(function (res) {
        return res.data;
      });
    }
    //新增用户

  }, {
    key: "addUser",
    value: function addUser(params) {
      return _axios2.default.post("platform://auth/A02001", params).then(function (res) {
        return res.data;
      });
    }
    //查询用户详情

  }, {
    key: "userDetail",
    value: function userDetail(params) {
      return _axios2.default.post("platform://auth/A02003", params).then(function (res) {
        return res.data;
      });
    }
    //修改用户

  }, {
    key: "editUser",
    value: function editUser(params) {
      return _axios2.default.post("platform://auth/A02002", params).then(function (res) {
        return res.data;
      });
    }
    //删除用户

  }, {
    key: "removeUser",
    value: function removeUser(params) {
      return _axios2.default.post("platform://auth/A02004", params).then(function (res) {
        return res.data;
      });
    }
    //查询角色集合

  }, {
    key: "findRoles",
    value: function findRoles(params) {
      return _axios2.default.post("platform://auth/A03006", params).then(function (res) {
        return res.data;
      });
    }
    //字典编码唯一校验

  }, {
    key: "checkAccountId",
    value: function checkAccountId(params) {
      return _axios2.default.post("platform://auth/A02012", params).then(function (res) {
        return res.data;
      });
    }
    /**
    * 13.修改密码
    * 任务ID和流程实例ID不能同时为空，必须有一个值
    */

  }, {
    key: "changePassWord",
    value: function changePassWord(_ref) {
      var oldPwd = _ref.oldPwd,
          newPwd = _ref.newPwd;

      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.post("platform://auth/A02008", {
          oldPwd: (0, _md2.default)(oldPwd),
          newPwd: (0, _md2.default)(newPwd),
          userId: user.userId
        }).then(function (res) {
          return res.data;
        });
      });
    }
  }]);

  return UserService;
}();

exports.default = new UserService();