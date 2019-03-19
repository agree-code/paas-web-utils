"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EntService = function () {
  function EntService() {
    _classCallCheck(this, EntService);
  }

  _createClass(EntService, [{
    key: "findEnterpriseData",

    //查询企业信息
    value: function findEnterpriseData(params) {
      return _axios2.default.post("platform://org/O01001", params).then(function (res) {
        return res.data;
      });
    }
    //更新企业信息

  }, {
    key: "updateEnterpriseData",
    value: function updateEnterpriseData(params) {
      return _axios2.default.post("platform://org/O01002", params).then(function (res) {
        return res.data;
      });
    }
  }]);

  return EntService;
}();

exports.default = new EntService();