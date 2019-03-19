"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 查询标签相关接口封装
 */

var Query = function () {
  function Query() {
    _classCallCheck(this, Query);
  }

  _createClass(Query, [{
    key: "findCustomTagByViewId",

    /**
     * 1.根据视图Id查询用户自定义查询标签
     * @param {int(11)} viewId 视图Id 
     */
    value: function findCustomTagByViewId(_ref) {
      var viewId = _ref.viewId;

      return _axios2.default.post("platform://custom/C08005", {
        viewId: viewId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 2.根据视图Id查询系统查询标签
     * @param {int(11)} viewId 视图ID 
     */

  }, {
    key: "findSystemTagByViewId",
    value: function findSystemTagByViewId(_ref2) {
      var viewId = _ref2.viewId;

      return _axios2.default.post("platform://custom/C08002", {
        viewId: viewId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 3.新增查询标签
     * @param {int(11)} moduleId 模块ID 
     * @param {string(20)} tagName 标签名称 (非必需)
     * @param {int(11)} viewId 视图ID 
     * @param {list(30)} searchs 集合
     * @param {string} searchType searchs元素的属性 搜索条件类型 1、大于 2、小于 3、等于 4、大于等于 5、小于等于 6、包含 7、不等于
     * @param {int(20)} columnId searchs元素的属性 列ID 
     */

  }, {
    key: "save",
    value: function save(_ref3) {
      var moduleId = _ref3.moduleId,
          _ref3$tagName = _ref3.tagName,
          tagName = _ref3$tagName === undefined ? undefined : _ref3$tagName,
          viewId = _ref3.viewId,
          searchs = _ref3.searchs;

      return _axios2.default.post("platform://custom/C08007", {
        moduleId: moduleId,
        tagName: tagName,
        viewId: viewId,
        searchs: searchs
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 4.根据查询标签Id删除查询标签
     * 根据Id删除查询标签，同时会删除查询标签下的查询条件。查询标签和查询条件的删除均为物理删除。
     * @param {int(11)} id 查询标签Id 
     */

  }, {
    key: "delById",
    value: function delById(_ref4) {
      var id = _ref4.id;

      return _axios2.default.post("platform://custom/C08004", {
        id: id
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 5.根据查询标签Id查询查询条件
     * @param {long(11)} tagId 查询标签Id 
     */

  }, {
    key: "findByTagId",
    value: function findByTagId(_ref5) {
      var tagId = _ref5.tagId;

      return _axios2.default.post("platform://custom/C09002", {
        tagId: tagId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 6.根据模块Id查询查询标签（非关联视图的查询标签）
     * @param {long(11)} moduleId	 模块Id 
     */

  }, {
    key: "findByModuleId",
    value: function findByModuleId(_ref6) {
      var moduleId = _ref6.moduleId;

      return _axios2.default.post("platform://custom/C08001", {
        moduleId: moduleId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
    * 7.根据查询标签Id查询查询条件
    * @param {long(11)} tagId 查询标签Id 
    */

  }, {
    key: "findInfByTagId",
    value: function findInfByTagId(_ref7) {
      var tagId = _ref7.tagId;

      return _axios2.default.post("platform://custom/C08008", {
        tagId: tagId
      }).then(function (res) {
        return res.data;
      });
    }
  }]);

  return Query;
}();

exports.default = new Query();