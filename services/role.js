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

var RoleService = function (_CRUD) {
  _inherits(RoleService, _CRUD);

  function RoleService() {
    _classCallCheck(this, RoleService);

    var booleanFields = [];
    var types = ["string"];
    var formTpl = {};
    return _possibleConstructorReturn(this, (RoleService.__proto__ || Object.getPrototypeOf(RoleService)).call(this, booleanFields, types, formTpl));
  }

  // 查询所有角色分页


  _createClass(RoleService, [{
    key: "findRoleByPage",
    value: function findRoleByPage(params) {
      return _axios2.default.post("platform://auth/A03002", params).then(function (res) {
        return res.data;
      });
    }

    // 查询角色集合

  }, {
    key: "findRoleAll",
    value: function findRoleAll(params) {
      return _axios2.default.post("platform://auth/A03006", params).then(function (res) {
        return res.data;
      });
    }

    // 新增角色

  }, {
    key: "addRole",
    value: function addRole(params) {
      return _axios2.default.post("platform://auth/A03001", params).then(function (res) {
        return res;
      });
    }

    // 角色明细

  }, {
    key: "findRoleById",
    value: function findRoleById(params) {
      return _axios2.default.post("platform://auth/A03005", params).then(function (res) {
        return res.data;
      });
    }

    // 编辑角色

  }, {
    key: "updateRole",
    value: function updateRole(params) {
      return _axios2.default.post("platform://auth/A03003", params).then(function (res) {
        return res;
      });
    }

    // 删除角色

  }, {
    key: "deleteRole",
    value: function deleteRole(params) {
      return _axios2.default.post("platform://auth/A03004", params).then(function (res) {
        return res;
      });
    }

    // 查询角色权限集合

  }, {
    key: "getRolePerById",
    value: function getRolePerById(params) {
      return _axios2.default.post("platform://auth/A04002", params).then(function (res) {
        return res.data;
      });
    }

    // 查询模块集合

  }, {
    key: "getModuleList",
    value: function getModuleList(params) {
      return _axios2.default.post("platform://custom/C10003", params).then(function (res) {
        return res.data;
      });
    }

    // 获取权限列表

  }, {
    key: "getPermissionList",
    value: function getPermissionList(params) {
      return _axios2.default.post("platform://auth/A06004", params).then(function (res) {
        return res.data;
      });
    }

    // 新增角色权限

  }, {
    key: "updateRolePermission",
    value: function updateRolePermission(params) {
      return _axios2.default.post("platform://auth/A04001", params).then(function (res) {
        return res;
      });
    }

    // 角色权限克隆

  }, {
    key: "cloneRole",
    value: function cloneRole(params) {
      return _axios2.default.post("platform://auth/A04003", params).then(function (res) {
        return res;
      });
    }

    // 查询组织架构集合

  }, {
    key: "findOrgList",
    value: function findOrgList(params) {
      return _axios2.default.post("platform://org/O02006", params).then(function (res) {
        return res.data;
      });
    }

    // 根据父级组织机构编码查询子级组织架构集合

  }, {
    key: "findOrgListByParent",
    value: function findOrgListByParent(params) {
      return _axios2.default.post("platform://org/O02005", params).then(function (res) {
        return res.data;
      });
    }

    // 查询用户集合

  }, {
    key: "findUserList",
    value: function findUserList(params) {
      return _axios2.default.post("platform://auth/A02005", params).then(function (res) {
        return res.data;
      });
    }

    // 角色授予多个用户

  }, {
    key: "grantRole",
    value: function grantRole(params) {
      return _axios2.default.post("platform://auth/A02006", params).then(function (res) {
        return res;
      });
    }
  }]);

  return RoleService;
}(_shared.CRUD);

// 实例化后导出，全局单例


exports.default = new RoleService();