"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PAGENOW = 1;
var PAGESIZE = 20;

// 真实数据相关接口

var BusinessService = function () {
  function BusinessService() {
    _classCallCheck(this, BusinessService);
  }

  _createClass(BusinessService, [{
    key: "updateListByViewId",

    /**
     * 真实数据批量更新-列表（ALL）
     * @param {int(11)} viewId 视图Id
     * @param {int(11)} tagId 标签ID (非必需)
     * @param {map} columnMap	 更新字段数据
     * @param {list} searchList 关键字查询条件 (非必需)
     * @param {string} searchList.columnId	 字段名称 (非必需)
     * @param {string} searchList.screenVal	 关键字值 (非必需)
     * @param {int(11)} searchList.searchType	 关键字查找类型 (非必需)
     * @param {string} fuzzyQueryVal 关键字查询条件 (非必需)
     */
    value: function updateListByViewId(_ref) {
      var viewId = _ref.viewId,
          _ref$tagId = _ref.tagId,
          tagId = _ref$tagId === undefined ? undefined : _ref$tagId,
          columnMap = _ref.columnMap,
          _ref$searchList = _ref.searchList,
          searchList = _ref$searchList === undefined ? undefined : _ref$searchList,
          _ref$fuzzyQueryVal = _ref.fuzzyQueryVal,
          fuzzyQueryVal = _ref$fuzzyQueryVal === undefined ? undefined : _ref$fuzzyQueryVal;

      return _axios2.default.post("platform://custom/C12015", {
        viewId: viewId,
        tagId: tagId,
        columnMap: columnMap,
        searchList: searchList,
        fuzzyQueryVal: fuzzyQueryVal
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 真实数据导出
     * @param {int(11)} viewId 视图Id
     * @param {string} sidx 排序字段
     * @param {string} order 排序方式
     * @param {int(11)} tagId 标签ID
     * @param {list} searchList	 关键字查询条件 (非必需)
     * @param {string} searchList.columnId	 字段名称 (非必需)
     * @param {string} searchList.screenVal	 关键字值 (非必需)
     * @param {int(11)} searchList.searchType	 关键字查找类型 (非必需)
     * @param {list} searchColumnIdList	 导出字段的id集合
     * 正常分页查询的数据导出：查询出的数据为所有的数据
     * 使用查询条件：满足给出的查询条件所有的数据
     * 使用查询标签：满足给出的查询标签的所有的数据
     * 查询标签和查询条件只能使用一种条件进行搜索，即如果使用了查询标签就不能再使用查询条件进行搜索
     * 视图类型必须为列表(showType=1)
     */

  }, {
    key: "export",
    value: function _export(_ref2) {
      var viewId = _ref2.viewId,
          sidx = _ref2.sidx,
          order = _ref2.order,
          tagId = _ref2.tagId,
          _ref2$searchList = _ref2.searchList,
          searchList = _ref2$searchList === undefined ? undefined : _ref2$searchList,
          _ref2$fuzzyQueryVal = _ref2.fuzzyQueryVal,
          fuzzyQueryVal = _ref2$fuzzyQueryVal === undefined ? undefined : _ref2$fuzzyQueryVal,
          searchColumnIdList = _ref2.searchColumnIdList;

      return _axios2.default.post("platform://custom/C12016", {
        viewId: viewId,
        sidx: sidx,
        order: order,
        tagId: tagId,
        searchList: searchList,
        fuzzyQueryVal: fuzzyQueryVal,
        searchColumnIdList: searchColumnIdList
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 根据模块id修改业务数据
     * @param {int(11)} moduleId	 模块id
     * @param {map} record	 要更新的数据
     * @param {string} primaryKey	 主键字段名（修改数据依赖的主键，默认ID）
     * @param {string} primaryKeyValue	 主键值
     */

  }, {
    key: "updateByModuleId",
    value: function updateByModuleId(_ref3) {
      var moduleId = _ref3.moduleId,
          record = _ref3.record,
          primaryKey = _ref3.primaryKey,
          primaryKeyValue = _ref3.primaryKeyValue;

      return _axios2.default.post("platform://custom/C12017", {
        moduleId: moduleId,
        record: record,
        primaryKey: primaryKey,
        primaryKeyValue: primaryKeyValue
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 真实数据详情页面子数据
     * @param {int(11)} viewId 详情页面下关联的视图Id
     * @param {int(11)} curModuleId 详情页面所属模块Id
     * @param {int(11)} recordId	 真实数据Id
     * @param {string} currentPage	 当前页
     * @param {string} pageSize 每页记录数
     * @param {string} sidx 排序字段
     * @param {string} order 排序方式
     */

  }, {
    key: "findBatchAll",
    value: function findBatchAll(_ref4) {
      var viewId = _ref4.viewId,
          curModuleId = _ref4.curModuleId,
          recordId = _ref4.recordId,
          _ref4$currentPage = _ref4.currentPage,
          currentPage = _ref4$currentPage === undefined ? undefined : _ref4$currentPage,
          _ref4$pageSize = _ref4.pageSize,
          pageSize = _ref4$pageSize === undefined ? undefined : _ref4$pageSize,
          _ref4$sidx = _ref4.sidx,
          sidx = _ref4$sidx === undefined ? undefined : _ref4$sidx,
          _ref4$order = _ref4.order,
          order = _ref4$order === undefined ? undefined : _ref4$order;

      return _axios2.default.post("platform://custom/C12012", {
        viewId: viewId,
        curModuleId: curModuleId,
        recordId: recordId,
        currentPage: currentPage,
        pageSize: pageSize,
        sidx: sidx,
        order: order
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 删除真实数据
     * @param {int(11)} viewId 详情页面下关联的视图Id
     * @param {list} recordIds 真实数据Id集合
     * 根据视图id，真实数据id删除真实数据
     * 真实数据为逻辑删除
     */

  }, {
    key: "delByViewIdAndRecordIds",
    value: function delByViewIdAndRecordIds(_ref5) {
      var viewId = _ref5.viewId,
          recordIds = _ref5.recordIds;

      return _axios2.default.post("platform://custom/C12003", {
        viewId: viewId,
        recordIds: recordIds
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 真实数据分页
     * @param {int(11)} viewId 详情页面下关联的视图Id
     * @param {string(11)} currentPage 当前页
     * @param {string} pageSize 每页记录数
     * @param {string} sidx 排序字段
     * @param {string} order	 排序方式
     * @param {int(11)} tagId	 标签ID
     * @param {list} searchList	 关键字查询条件 (非必需)
     * @param {string} searchList.columnId	 字段名称 (非必需)
     * @param {string} searchList.screenVal	 关键字值 (非必需)
     * @param {int(11)} searchList.searchType	 关键字查找类型 (非必需)
     * @param {string} fuzzyQueryVal 模糊搜索的值(在模糊搜索时需要)
     * 分别给出的正常分页查询，使用查询条件，使用查询标签三种情况
     * 正常分页查询：查询出的数据为所有的数据
     * 使用查询条件：满足给出的查询条件所有的数据
     * 使用查询标签：满足给出的查询标签的所有的数据
     * 查询标签和查询条件只能使用一种条件进行搜索，即如果使用了查询标签就不能再使用查询条件进行搜索
     * 视图类型必须为列表(showType=1)
     * 进行时间搜索 (searchType:8 时间段查询，beginTime\endTime必填；searchType:9 时间范围查询，screenVal[1、今日；2、昨日；3、明日；4、本周；5、上周；6、本月；7、上月]必填；)
     * 进行模糊搜索 (fuzzyQueryVal:模糊搜索的值)
     * 如果进行搜索（不使用查询标签）
     * 使用查询标签的情况
     */

  }, {
    key: "pageBusiness",
    value: function pageBusiness(_ref6) {
      var viewId = _ref6.viewId,
          sidx = _ref6.sidx,
          order = _ref6.order,
          _ref6$currentPage = _ref6.currentPage,
          currentPage = _ref6$currentPage === undefined ? PAGENOW : _ref6$currentPage,
          _ref6$pageSize = _ref6.pageSize,
          pageSize = _ref6$pageSize === undefined ? PAGESIZE : _ref6$pageSize,
          _ref6$tagId = _ref6.tagId,
          tagId = _ref6$tagId === undefined ? undefined : _ref6$tagId,
          _ref6$recordId = _ref6.recordId,
          recordId = _ref6$recordId === undefined ? undefined : _ref6$recordId,
          _ref6$curModuleId = _ref6.curModuleId,
          curModuleId = _ref6$curModuleId === undefined ? undefined : _ref6$curModuleId,
          _ref6$searchList = _ref6.searchList,
          searchList = _ref6$searchList === undefined ? undefined : _ref6$searchList,
          _ref6$fuzzyQueryVal = _ref6.fuzzyQueryVal,
          fuzzyQueryVal = _ref6$fuzzyQueryVal === undefined ? undefined : _ref6$fuzzyQueryVal;

      return _axios2.default.post("platform://custom/C12002", {
        viewId: viewId,
        currentPage: currentPage,
        pageSize: pageSize,
        sidx: sidx,
        order: order,
        tagId: tagId,
        searchList: searchList,
        recordId: recordId,
        curModuleId: curModuleId,
        fuzzyQueryVal: fuzzyQueryVal
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 修改真实数据
     * 根据视图ID修改真实数据（含批量更新子表单数据[增、删、改）
     * @param {int(11)} viewId 详情页面下关联的视图Id
     * @param {map} columnMap 要添加的数据
     * @param {map} batchColumn 要添加的子表单的数据
     */

  }, {
    key: "updateByViewId",
    value: function updateByViewId(_ref7) {
      var viewId = _ref7.viewId,
          columnMap = _ref7.columnMap,
          batchColumn = _ref7.batchColumn;

      return _axios2.default.post("platform://custom/C12005", {
        viewId: viewId,
        columnMap: columnMap,
        batchColumn: batchColumn
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 新增真实数据，根据自定义模块添加对象的数据
     * @param {int(11)} viewId 详情页面下关联的视图Id
     * @param {map} columnMap 要添加的数据 (自定义module的字段)
     * @param {map} batchColumn 要添加的子表单的数据
     */

  }, {
    key: "save",
    value: function save(_ref8) {
      var viewId = _ref8.viewId,
          columnMap = _ref8.columnMap,
          batchColumn = _ref8.batchColumn;

      // console.log('新增真实数据', viewId, columnMap, batchColumn)
      return _axios2.default.post("platform://custom/C12004", {
        viewId: viewId,
        columnMap: columnMap,
        batchColumn: batchColumn
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 真实数据查询集合
     * @param {int(11)} viewId 详情页面下关联的视图Id
     * @param {list} recordIds	 真实数据id集合.不为空时，则查询指定recordIds数据;为空时则查询该视图对应真实数据模块的所有真实数据集合
     * 视图类型必须为列表(showType=1)
     */

  }, {
    key: "findAllByViewIdAndRecordIds",
    value: function findAllByViewIdAndRecordIds(_ref9) {
      var viewId = _ref9.viewId,
          recordIds = _ref9.recordIds;

      return _axios2.default.post("platform://custom/C12001", {
        viewId: viewId,
        recordIds: recordIds
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 查询一条真实数据
     * @param {int(11)} viewId 详情页面下关联的视图Id
     * @param {int(11)} recordId 真实数据id
     *  根据试图id和真实数据id查询真实数据
     */

  }, {
    key: "findOne",
    value: function findOne(_ref10) {
      var viewId = _ref10.viewId,
          recordId = _ref10.recordId;

      return _axios2.default.post("platform://custom/C12006", {
        viewId: viewId,
        recordId: recordId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 模块数据迁移
     * @param {int(11)} userId 源用户id
     * @param {int(11)} targetUserId	 目标用户ID
     * @param {list} moduleIds	 模块id集合
     * 将目标用户(targetUserId)的模块数据(moduleIds)迁移到用户(userId)
     */

  }, {
    key: "transferModuleIds",
    value: function transferModuleIds(_ref11) {
      var userId = _ref11.userId,
          targetUserId = _ref11.targetUserId,
          moduleIds = _ref11.moduleIds;

      return _axios2.default.post("platform://custom/C12007", {
        userId: userId,
        targetUserId: targetUserId,
        moduleIds: moduleIds
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 真实数据字段唯一性校验
     * @param {int(11)} moduleId 模块ID (非必需)
     * @param {string(255)} columnName	 字段名称 (非必需)
     * @param {int(11)} recordId	 真实数据ID (非必需)
     * @param {string(255)} columnValue	 字段值
     * @param {string(255)} primaryKey 主键名称 (非必需)
     * 真实数据新增时，根据moduleId，columnName，columnValue判断数据唯一性
     * 真实数据修改时，根据moduleId，columnName，columnValue，recordId，primaryKey判断数据唯一性
     * primaryKey为空时，默认主键为ID
     */

  }, {
    key: "checkUnique",
    value: function checkUnique(_ref12) {
      var _ref12$moduleId = _ref12.moduleId,
          moduleId = _ref12$moduleId === undefined ? undefined : _ref12$moduleId,
          _ref12$columnName = _ref12.columnName,
          columnName = _ref12$columnName === undefined ? undefined : _ref12$columnName,
          _ref12$recordId = _ref12.recordId,
          recordId = _ref12$recordId === undefined ? undefined : _ref12$recordId,
          columnValue = _ref12.columnValue,
          _ref12$primaryKey = _ref12.primaryKey,
          primaryKey = _ref12$primaryKey === undefined ? undefined : _ref12$primaryKey;

      return _axios2.default.post("platform://custom/C12009", {
        moduleId: moduleId,
        columnName: columnName,
        recordId: recordId,
        columnValue: columnValue,
        primaryKey: primaryKey
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 获取真实数据已存在的数据
     * @param {int(11)} moduleId 模块Id （非必需）
     * @param {int(11)} columnName 字段名称 （非必需）
     * @param {string(255)} columnValue	 字段值
     * @param {int(11)} recordId	 真实数据ID （非必需）
     * @param {string(255)} primaryKey 主键名称 (非必需)
     * 根据字段id(curColId)和字段值(curColVal)模糊查询真实数据已经存在的数据
     * 真实数据添加时，根据字段ID(curColId)，字段值(curColVal)获取真实数据已存在的数据
     * 真实数据修改时，根据curColId，curColVal，recordId获取真实数据已存在的数据
     * primaryKey为空时，默认主键为ID
     */

  }, {
    key: "findExist",
    value: function findExist(_ref13) {
      var _ref13$moduleId = _ref13.moduleId,
          moduleId = _ref13$moduleId === undefined ? undefined : _ref13$moduleId,
          _ref13$columnName = _ref13.columnName,
          columnName = _ref13$columnName === undefined ? undefined : _ref13$columnName,
          columnValue = _ref13.columnValue,
          _ref13$recordId = _ref13.recordId,
          recordId = _ref13$recordId === undefined ? undefined : _ref13$recordId,
          _ref13$primaryKey = _ref13.primaryKey,
          primaryKey = _ref13$primaryKey === undefined ? null : _ref13$primaryKey;

      return _axios2.default.post("platform://custom/C12010", {
        moduleId: moduleId,
        columnName: columnName,
        columnValue: columnValue,
        recordId: recordId,
        primaryKey: primaryKey
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 真实数据批量更新
     * @param {int(11)} viewId 详情页面下关联的视图Id
     * @param {list} recordIds	 真实数据Id集合
     * @param {map} columnMap	 真实数据
     */

  }, {
    key: "updateByViewIdAndRecordIds",
    value: function updateByViewIdAndRecordIds(_ref14) {
      var viewId = _ref14.viewId,
          recordIds = _ref14.recordIds,
          columnMap = _ref14.columnMap;

      return _axios2.default.post("platform://custom/C12013", {
        viewId: viewId,
        recordIds: recordIds,
        columnMap: columnMap
      }).then(function (res) {
        return res.data;
      });
    }
  }]);

  return BusinessService;
}();

exports.default = new BusinessService();