"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import loginUser from "./login-user";

var ModuleService = function () {
  function ModuleService() {
    _classCallCheck(this, ModuleService);
  }

  _createClass(ModuleService, [{
    key: "save",


    /**
     * 1.创建模块，并且创建模块对应的数据库表、生成默认字段信息
     * @param {string(30)} moduleCode 模块编码 
     * @param {int(1)} dpEnable	 是否启用 (非必需)
     * @param {string(30)} moduleName	 模块名称 
     * @param {string(100)} description	 模块描述 (非必需)
     * @param {int(1)} isDataSharing	 是否开启数据共享 
     * @param {int(1)} isCustomModule	 是否自定义模块 
     * @param {int(1)} isProcess	 是否启用流程 
     */
    value: function save(_ref) {
      var moduleCode = _ref.moduleCode,
          _ref$dpEnable = _ref.dpEnable,
          dpEnable = _ref$dpEnable === undefined ? null : _ref$dpEnable,
          moduleName = _ref.moduleName,
          _ref$description = _ref.description,
          description = _ref$description === undefined ? null : _ref$description,
          isDataSharing = _ref.isDataSharing,
          isCustomModule = _ref.isCustomModule,
          isProcess = _ref.isProcess;

      return _axios2.default.post("platform://custom/C10001", {
        moduleCode: moduleCode,
        dpEnable: dpEnable,
        moduleName: moduleName,
        description: description,
        isDataSharing: isDataSharing,
        isCustomModule: isCustomModule,
        isProcess: isProcess
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 2.更新模块
     * @param {int(1)} dpEnable	 是否启用 (非必需)
     * @param {string(30)} moduleName	 模块名称 
     * @param {string(100)} description	 模块描述 (非必需)
     * @param {int(1)} isDataSharing	 是否开启数据共享 
     * @param {int(1)} isProcess	 是否启用流程 
     * @param {int(11)} id id 
     */

  }, {
    key: "update",
    value: function update(_ref2) {
      var _ref2$dpEnable = _ref2.dpEnable,
          dpEnable = _ref2$dpEnable === undefined ? null : _ref2$dpEnable,
          moduleName = _ref2.moduleName,
          _ref2$description = _ref2.description,
          description = _ref2$description === undefined ? null : _ref2$description,
          isDataSharing = _ref2.isDataSharing,
          isProcess = _ref2.isProcess,
          id = _ref2.id;

      return _axios2.default.post("platform://custom/C10005", {
        dpEnable: dpEnable,
        moduleName: moduleName,
        description: description,
        isDataSharing: isDataSharing,
        isProcess: isProcess,
        id: id
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 3.删除模块
     * @param {list} moduleIds 模块Id集合 
     */

  }, {
    key: "delByModuleIds",
    value: function delByModuleIds(_ref3) {
      var moduleIds = _ref3.moduleIds;

      return _axios2.default.post("platform://custom/C10006", {
        moduleIds: moduleIds
      }).then(function (res) {
        return res.data;
      });
    }

    /**
       * 4.查询模块集合
       * @param {list} moduleIds 模块ID集合(单个moduleId长度不能超过11) (非必需)
       * @param {int(1)} isRelated 是否查询关联 0 ----字段无效 1---关联模块 2---非关联模块 (非必需)
       * @param {string(50)} isEqModuleId 获取不包含模块id的数据(true -- 包含 false --不包含，默认true) (非必需)
       * @param {int(1)} isCustom 自定义(0---字段无效，1--可自定义，2--不可自定义) (非必需)
       * @param {int(1)} isDelete 是否删除( 0---未删除 1--删除) (非必需)
       * @param {int(1)} dpEnable 是否启用数据权限：0、否 1、是 (非必需)
       * @param {int(1)} isProcess (0--非流程模块，1--流程模块) (非必需)
       * 查询所有模块集合
       * 根据模块Id集合，查询模块集合
       * 当moduleIds为空时会根据条件查询所有和条件相符的模块集合
       * 当moduleIds不为空时则根据模块id进行条件匹配查询模块集合，模块ID可以单个或多个
       * 所有可使用的模块(isDelete = 0)
       * 获取可作为外键的模块集合(isRelated = 2,moduleIds=[id],isCustom=1)
       * 获取所有外键关联关系的模块集合(isRelated = 1,moduleIds=[id]，isEqModuleId=true,isCustom=1)
       * 校验模块编码是否可用(isEqModuleId=true)
       * 查询模块数据访问权限(dpEnable=1)
       */

  }, {
    key: "findModules",
    value: function findModules(_ref4) {
      var _ref4$moduleIds = _ref4.moduleIds,
          moduleIds = _ref4$moduleIds === undefined ? undefined : _ref4$moduleIds,
          _ref4$isRelated = _ref4.isRelated,
          isRelated = _ref4$isRelated === undefined ? undefined : _ref4$isRelated,
          _ref4$isEqModuleId = _ref4.isEqModuleId,
          isEqModuleId = _ref4$isEqModuleId === undefined ? undefined : _ref4$isEqModuleId,
          _ref4$isCustom = _ref4.isCustom,
          isCustom = _ref4$isCustom === undefined ? undefined : _ref4$isCustom,
          _ref4$isDelete = _ref4.isDelete,
          isDelete = _ref4$isDelete === undefined ? 0 : _ref4$isDelete,
          _ref4$dpEnable = _ref4.dpEnable,
          dpEnable = _ref4$dpEnable === undefined ? undefined : _ref4$dpEnable,
          _ref4$isProcess = _ref4.isProcess,
          isProcess = _ref4$isProcess === undefined ? undefined : _ref4$isProcess;

      return _axios2.default.post("platform://custom/C10003", {
        moduleIds: moduleIds,
        isRelated: isRelated,
        isEqModuleId: isEqModuleId,
        isCustom: isCustom,
        isDelete: isDelete,
        dpEnable: dpEnable,
        isProcess: isProcess
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 5.查询模块集合(分页)
     * @param {string} keyValue 关键字 (非必需) 不为空时,moduleName和moduleCode会对关键字进行模糊查询
     * @param {string(30)} moduleName 模块名称 (非必需)
     * @param {string(30)} moduleCode 模块编码 (非必需)
     * @param {int(1)} isDelete 是否删除 
     * @param {string} sidx	 排序字段 (非必需)
     * @param {string} order 排序方式(倒序：DESC 顺序: ASC) (非必需)
     * @param {int} pageNow 当前页数 
     * @param {int} pageSize 每页记录数 
     * sidx和order为空时，默认根据create_time倒序排序
     */

  }, {
    key: "findModulesPage",
    value: function findModulesPage(_ref5) {
      var _ref5$keyValue = _ref5.keyValue,
          keyValue = _ref5$keyValue === undefined ? null : _ref5$keyValue,
          _ref5$moduleName = _ref5.moduleName,
          moduleName = _ref5$moduleName === undefined ? null : _ref5$moduleName,
          _ref5$moduleCode = _ref5.moduleCode,
          moduleCode = _ref5$moduleCode === undefined ? null : _ref5$moduleCode,
          isDelete = _ref5.isDelete,
          _ref5$sidx = _ref5.sidx,
          sidx = _ref5$sidx === undefined ? null : _ref5$sidx,
          _ref5$order = _ref5.order,
          order = _ref5$order === undefined ? null : _ref5$order,
          pageNow = _ref5.pageNow,
          pageSize = _ref5.pageSize;

      return _axios2.default.post("platform://custom/C10002", {
        keyValue: keyValue,
        moduleName: moduleName,
        moduleCode: moduleCode,
        isDelete: isDelete,
        sidx: sidx,
        order: order,
        pageNow: pageNow,
        pageSize: pageSize
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 6.查询单个模块
     * @param {string(30)} moduleCode 模块编码 (非必需)
     * @param {int} moduleId 模块id 
     */

  }, {
    key: "findOne",
    value: function findOne(_ref6) {
      var _ref6$moduleCode = _ref6.moduleCode,
          moduleCode = _ref6$moduleCode === undefined ? null : _ref6$moduleCode,
          moduleId = _ref6.moduleId;

      return _axios2.default.post("platform://custom/C10004", {
        moduleCode: moduleCode,
        moduleId: moduleId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 7.模块编码唯一校验
     * 判断模块是否已存在
     * @param {string(9)} moduleCode 模块编码 
     */

  }, {
    key: "unique",
    value: function unique(_ref7) {
      var moduleCode = _ref7.moduleCode;

      return _axios2.default.post("platform://custom/C10008", {
        moduleCode: moduleCode
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 8.根据字段ID集合查询模块集合
     * @param {list} columnIds	 字段ID集合 
     */

  }, {
    key: "findModulesByColumnIds",
    value: function findModulesByColumnIds(_ref8) {
      var columnIds = _ref8.columnIds;

      return _axios2.default.post("platform://custom/C10009", {
        columnIds: columnIds
      }).then(function (res) {
        return res.data;
      });
    }
    /**
     * 查询模块关系
     * @param {*} param0 
     */

  }, {
    key: "findModuleRelated",
    value: function findModuleRelated(_ref9) {
      var _ref9$moduleRelatedId = _ref9.moduleRelatedId,
          moduleRelatedId = _ref9$moduleRelatedId === undefined ? undefined : _ref9$moduleRelatedId,
          _ref9$columnId = _ref9.columnId,
          columnId = _ref9$columnId === undefined ? undefined : _ref9$columnId,
          _ref9$moduleId = _ref9.moduleId,
          moduleId = _ref9$moduleId === undefined ? undefined : _ref9$moduleId,
          _ref9$otherModuleId = _ref9.otherModuleId,
          otherModuleId = _ref9$otherModuleId === undefined ? undefined : _ref9$otherModuleId;

      return _axios2.default.post("platform://custom/C03003", {
        "moduleRelatedId": moduleRelatedId,
        "columnId": columnId,
        "moduleId": moduleId,
        "otherModuleId": otherModuleId
      }).then(function (res) {
        return res.data;
      });
    }
  }]);

  return ModuleService;
}();

exports.default = new ModuleService();