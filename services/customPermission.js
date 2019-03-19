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

var CustomPermissionService = function (_CRUD) {
  _inherits(CustomPermissionService, _CRUD);

  function CustomPermissionService() {
    _classCallCheck(this, CustomPermissionService);

    var booleanFields = [];
    var types = ["string"];
    var formTpl = {};
    return _possibleConstructorReturn(this, (CustomPermissionService.__proto__ || Object.getPrototypeOf(CustomPermissionService)).call(this, booleanFields, types, formTpl));
  }

  // 查询自定义权限分页


  _createClass(CustomPermissionService, [{
    key: "findPermissionByPage",
    value: function findPermissionByPage(params) {
      return _axios2.default.post("platform://auth/A07001", params).then(function (res) {
        return res.data;
      });
    }

    // 新增权限

  }, {
    key: "addPermission",
    value: function addPermission(params) {
      return _axios2.default.post("platform://auth/A07005", params).then(function (res) {
        return res;
      });
    }

    // 权限明细

  }, {
    key: "findPermissionById",
    value: function findPermissionById(params) {
      return _axios2.default.post("platform://auth/A07002", params).then(function (res) {
        return res.data;
      });
    }

    // 编辑权限

  }, {
    key: "updatePermission",
    value: function updatePermission(params) {
      return _axios2.default.post("platform://auth/A07004", params).then(function (res) {
        return res;
      });
    }

    // 删除权限

  }, {
    key: "deletePermission",
    value: function deletePermission(params) {
      return _axios2.default.post("platform://auth/A07003", params).then(function (res) {
        return res;
      });
    }
  }]);

  return CustomPermissionService;
}(_shared.CRUD);

// 实例化后导出，全局单例


exports.default = new CustomPermissionService();