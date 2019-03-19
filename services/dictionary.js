"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dictionaryService = function () {
  function dictionaryService() {
    _classCallCheck(this, dictionaryService);
  }

  _createClass(dictionaryService, [{
    key: "findDictionaries",

    /**
     * 查询字典集合
     * @param 
     * {"isFindAll":1,//是否查询全部:1,全部，0，非全部
      "dictType":"",//字典类型
      "dictIdList":"",
      "ownParentFlag":"",//是否包含当前父节点
      "condition":""
      "dictParentCode"//父节点编码
     } params 
     */
    value: function findDictionaries(params) {
      return _axios2.default.post("platform://base/B03008", params).then(function (res) {
        return res.data;
      });
    }
    //查询分页字典

  }, {
    key: "findDictionariesPage",
    value: function findDictionariesPage(params) {
      return _axios2.default.post("platform://base/B03009", params).then(function (res) {
        return res.data;
      });
    }
    //新增字典

  }, {
    key: "addDictionary",
    value: function addDictionary(params) {
      return _axios2.default.post("platform://base/B03003", params).then(function (res) {
        return res.data;
      });
    }
    //更新字典

  }, {
    key: "editDictionary",
    value: function editDictionary(params) {
      return _axios2.default.post("platform://base/B03004", params).then(function (res) {
        return res.data;
      });
    }
    //删除字典

  }, {
    key: "removeDictionary",
    value: function removeDictionary(params) {
      return _axios2.default.post("platform://base/B03005", params).then(function (res) {
        return res.data;
      });
    }
    //字典编码唯一校验

  }, {
    key: "checkDictCode",
    value: function checkDictCode(params) {
      return _axios2.default.post("platform://base/B03011", params).then(function (res) {
        return res.data;
      });
    }
  }]);

  return dictionaryService;
}();

exports.default = new dictionaryService();