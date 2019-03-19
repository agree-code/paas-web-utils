"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var operationService = function () {
  function operationService() {
    _classCallCheck(this, operationService);
  }

  _createClass(operationService, [{
    key: "addOperation",

    //新增操作
    value: function addOperation(params) {
      return _axios2.default.post("platform://custom/C04001", params).then(function (res) {
        return res.data;
      });
    }
    //更新操作

  }, {
    key: "editOperation",
    value: function editOperation(params) {
      return _axios2.default.post("platform://custom/C04003", params).then(function (res) {
        return res.data;
      });
    }
    //删除操作

  }, {
    key: "removeOperation",
    value: function removeOperation(params) {
      return _axios2.default.post("platform://custom/C04002", params).then(function (res) {
        return res.data;
      });
    }
    //查询操作分页

  }, {
    key: "findOperationPage",
    value: function findOperationPage(params) {
      return _axios2.default.post("platform://custom/C04005", params).then(function (res) {
        return res.data;
      });
    }
    //查询单个操作

  }, {
    key: "findOperationDetail",
    value: function findOperationDetail(params) {
      return _axios2.default.post("platform://custom/C04004", params).then(function (res) {
        return res.data;
      });
    }
  }]);

  return operationService;
}();

exports.default = new operationService();