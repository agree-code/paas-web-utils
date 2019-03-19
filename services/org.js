"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OrgService = function () {
  function OrgService() {
    _classCallCheck(this, OrgService);
  }

  _createClass(OrgService, [{
    key: "findOrgList",

    //查询所有部门组织架构
    value: function findOrgList() {
      return _axios2.default.post("platform://org/O02006", {
        orgParentCode: 0
      }).then(function (res) {
        return res.data;
      });
    }
    //根据部门ID查询部门信息

  }, {
    key: "findOrgListById",
    value: function findOrgListById(orgId, orgCode, extCode) {
      return _axios2.default.post("platform://org/O02004", {
        "orgId": orgId,
        "orgCode": orgCode,
        "extCode": extCode
      }).then(function (res) {
        return res.data;
      });
    }
    //新增部门

  }, {
    key: "addOrg",
    value: function addOrg(orgName, orgDesc, orgParentCode) {
      return _axios2.default.post("platform://org/O02001", {
        "orgName": orgName,
        "orgDesc": orgDesc,
        "orgParentCode": orgParentCode
      }).then(function (res) {
        return res.data;
      });
    }
    //修改部门信息

  }, {
    key: "editOrg",
    value: function editOrg(orgId, orgName, orgDesc) {
      return _axios2.default.post("platform://org/O02002", {
        "orgId": orgId,
        "orgName": orgName,
        "orgDesc": orgDesc
      }).then(function (res) {
        return res.data;
      });
    }
    //删除部门

  }, {
    key: "removeOrg",
    value: function removeOrg(orgId) {
      return _axios2.default.post("platform://org/O02003", {
        "orgId": orgId
      }).then(function (res) {
        return res.data;
      });
    }
  }]);

  return OrgService;
}();

exports.default = new OrgService();