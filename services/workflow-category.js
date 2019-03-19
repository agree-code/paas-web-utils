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
//工作流-流程分类相关接口

var WorkflowCategoryService = function () {
  function WorkflowCategoryService() {
    _classCallCheck(this, WorkflowCategoryService);
  }

  _createClass(WorkflowCategoryService, [{
    key: "save",

    /**
     * 1.创建分类信息
     * @param {string} user.entCode 企业编码
     * @param {string} user.userId 工作流用户ID （企业编码_原业务系统用户ID）
     * @param {string} categoryName 分类名称
     * @param {string} categoryCode 分类编码（唯一）
     * @param {int} pid 上级分类ID
     */
    value: function save(_ref) {
      var categoryName = _ref.categoryName,
          categoryCode = _ref.categoryCode,
          pid = _ref.pid;

      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.post("workflow://category/" + appKey, {
          categoryName: categoryName,
          categoryCode: categoryCode,
          pid: pid
        }).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 2.编辑分类信息
     * @param {int} id 主键
     * @param {string} categoryName 分类名称
     * @param {int} pid 上级分类ID
     * @param {int} isDelete 是否删除 0-否；1-是
     */

  }, {
    key: "update",
    value: function update(_ref2) {
      var id = _ref2.id,
          categoryName = _ref2.categoryName,
          pid = _ref2.pid,
          isDelete = _ref2.isDelete;

      return _axios2.default.put("workflow://category/" + appKey, {
        id: id,
        categoryName: categoryName,
        pid: pid,
        isDelete: isDelete
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 3.删除分类信息
     * @param {int} user.userId 主键
     */

  }, {
    key: "delById",
    value: function delById() {
      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.delete("workflow://category/" + appKey, {}).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 4.获取全部分类列表
     * @param {string} user.entCode 企业编码
     */

  }, {
    key: "findAll",
    value: function findAll() {
      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.get("workflow://category/list/" + appKey, {}).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 5.获取指定分类列表
     * @param {int} user.userId 主键
     */

  }, {
    key: "findById",
    value: function findById() {
      return _loginUser2.default.get().then(function (user) {
        var userid = WorkflowAuthServiceUserId(user);
        return _axios2.default.get("workflow://category/" + appKey, {}).then(function (res) {
          return res.data;
        });
      });
    }

    /**
     * 6.校验分类编码
     * @param {string} user.entCode 企业编码
     * @param {string} categoryCode 分类编码
     */

  }, {
    key: "checkCodeUnique",
    value: function checkCodeUnique(_ref3) {
      var categoryCode = _ref3.categoryCode;

      return _loginUser2.default.get().then(function (user) {
        return _axios2.default.post("workflow://category/checkCode/" + appKey, {
          categoryCode: categoryCode
        }).then(function (res) {
          return res.data;
        });
      });
    }
  }]);

  return WorkflowCategoryService;
}();

exports.default = new WorkflowCategoryService();