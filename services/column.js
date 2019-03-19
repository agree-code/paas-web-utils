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

var columnService = function (_CRUD) {
  _inherits(columnService, _CRUD);

  function columnService() {
    _classCallCheck(this, columnService);

    var booleanFields = ["isProcess", "dpEnable", "isDataSharing", "isCustomField"];
    var types = ["string"];
    var formTpl = {
      FieldName: "",
      FieldCode: "",
      dpEnable: true,
      isDataSharing: false,
      isCustomField: false,
      isProcess: false,
      description: ""
    };
    return _possibleConstructorReturn(this, (columnService.__proto__ || Object.getPrototypeOf(columnService)).call(this, booleanFields, types, formTpl));
  }
  // findFields(params) {
  //   //查询当前模块可搜索字段列表
  //   return axios.post("platform://custom/C01011", params).then(res => res.data);
  // }
  /**
   * 查询所有字段列表（分页查询）
   * @param {*} params 
   */


  _createClass(columnService, [{
    key: "findFieldsByPage",
    value: function findFieldsByPage(params) {
      return _axios2.default.post("platform://custom/C01002", params).then(function (res) {
        return res.data;
      });
    }
  }, {
    key: "addField",
    value: function addField(params) {
      // var formData = this.transData2AddParams(params);
      return _axios2.default.post("platform://custom/C01001", params).then(function (res) {
        return res;
      });
    }
  }, {
    key: "updateField",
    value: function updateField(params) {
      // var formData = this.transData2UpdateParams(params);
      return _axios2.default.post("platform://custom/C01003", params).then(function (res) {
        return res;
      });
    }
  }, {
    key: "deleteField",
    value: function deleteField(params) {
      return _axios2.default.post("platform://custom/C01006", params).then(function (res) {
        return res;
      });
    }
  }, {
    key: "findFieldById",
    value: function findFieldById(params) {
      return _axios2.default.post("platform://custom/C01005", params).then(function (res) {
        return res.data;
      });
    }
    /**
     * 根据模块id查询当前模块下的字段信息
     * @param {*} params 
     */

  }, {
    key: "findFieldsByModuleId",
    value: function findFieldsByModuleId(_ref) {
      var moduleId = _ref.moduleId;

      return _axios2.default.post("platform://custom/C01023", { moduleId: moduleId }).then(function (res) {
        return res.data[0].columnList;
      });
    }
    /**
     * 根据视图id获取视图查询字段
     * @param {long} viewId 视图ID
     */

  }, {
    key: "findByViewId",
    value: function findByViewId(_ref2) {
      var viewId = _ref2.viewId;

      return _axios2.default.post("platform://custom/C01017", {
        viewId: viewId
      }).then(function (res) {
        return res.data;
      });
    }
    /**
    * 根据视图id获取视图包含字段
    * @param {long} viewId 视图ID
    */

  }, {
    key: "findColumnByViewId",
    value: function findColumnByViewId(_ref3) {
      var viewId = _ref3.viewId;

      return _axios2.default.post("platform://custom/C01016", {
        viewId: viewId
      }).then(function (res) {
        return res.data;
      });
    }
  }, {
    key: "findById",
    value: function findById(_ref4) {
      var columnId = _ref4.columnId,
          _ref4$moduleId = _ref4.moduleId,
          moduleId = _ref4$moduleId === undefined ? undefined : _ref4$moduleId;

      return _axios2.default.post("platform://custom/C01005", {
        columnId: columnId,
        moduleId: moduleId
      }).then(function (res) {
        return res.data;
      });
    }
    /**
     * 根据模块Id查询可搜索字段数据
     * @param {*} moduleId 模块Id
     */

  }, {
    key: "findSearchByModuleId",
    value: function findSearchByModuleId(moduleId) {
      return _axios2.default.post("platform://custom/C01011", { moduleId: moduleId }).then(function (res) {
        return res.data;
      });
    }
    //查询字段约束集合

  }, {
    key: "findConstraint",
    value: function findConstraint(params) {
      return _axios2.default.post("platform://custom/C13001", params).then(function (res) {
        return res.data;
      });
    }
    //新增字段约束集合

  }, {
    key: "addConstraint",
    value: function addConstraint(params) {
      return _axios2.default.post("platform://custom/C13002", params).then(function (res) {
        return res.data;
      });
    }
    //字段编码唯一校验

  }, {
    key: "checkColumnCode",
    value: function checkColumnCode(params) {
      return _axios2.default.post("platform://custom/C01015", params).then(function (res) {
        return res.data;
      });
    }
    //获取关联模块

  }, {
    key: "findRelatedModule",
    value: function findRelatedModule(params) {
      return _axios2.default.post("platform://custom/C03003", params).then(function (res) {
        return res.data;
      });
    }
  }]);

  return columnService;
}(_shared.CRUD);

exports.default = new columnService();