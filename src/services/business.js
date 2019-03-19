import axios from "axios"
const PAGENOW = 1
const PAGESIZE = 20

// 真实数据相关接口
class BusinessService {
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
  updateListByViewId({
    viewId: viewId,
    tagId: tagId = undefined,
    columnMap: columnMap,
    searchList: searchList = undefined,
    fuzzyQueryVal: fuzzyQueryVal = undefined,
  }) {
    return axios
      .post(`platform://custom/C12015`, {
        viewId: viewId,
        tagId: tagId,
        columnMap: columnMap,
        searchList: searchList,
        fuzzyQueryVal: fuzzyQueryVal,
      })
      .then(res => res.data);
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
  export ({
    viewId: viewId,
    sidx: sidx,
    order: order,
    tagId: tagId,
    searchList: searchList = undefined,
    fuzzyQueryVal: fuzzyQueryVal = undefined,
    searchColumnIdList: searchColumnIdList,
  }) {
    return axios
      .post(`platform://custom/C12016`, {
        viewId: viewId,
        sidx: sidx,
        order: order,
        tagId: tagId,
        searchList: searchList,
        fuzzyQueryVal: fuzzyQueryVal,
        searchColumnIdList: searchColumnIdList,
      })
      .then(res => res.data);
  }

  /**
   * 根据模块id修改业务数据
   * @param {int(11)} moduleId	 模块id
   * @param {map} record	 要更新的数据
   * @param {string} primaryKey	 主键字段名（修改数据依赖的主键，默认ID）
   * @param {string} primaryKeyValue	 主键值
   */
  updateByModuleId({
    moduleId: moduleId,
    record: record,
    primaryKey: primaryKey,
    primaryKeyValue: primaryKeyValue,
  }) {
    return axios
      .post(`platform://custom/C12017`, {
        moduleId: moduleId,
        record: record,
        primaryKey: primaryKey,
        primaryKeyValue: primaryKeyValue,
      })
      .then(res => res.data);
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
  findBatchAll({
    viewId: viewId,
    curModuleId: curModuleId,
    recordId: recordId,
    currentPage: currentPage = undefined,
    pageSize: pageSize = undefined,
    sidx: sidx = undefined,
    order: order = undefined,
  }) {
    return axios
      .post(`platform://custom/C12012`, {
        viewId: viewId,
        curModuleId: curModuleId,
        recordId: recordId,
        currentPage: currentPage,
        pageSize: pageSize,
        sidx: sidx,
        order: order,
      })
      .then(res => res.data);
  }

  /**
   * 删除真实数据
   * @param {int(11)} viewId 详情页面下关联的视图Id
   * @param {list} recordIds 真实数据Id集合
   * 根据视图id，真实数据id删除真实数据
   * 真实数据为逻辑删除
   */
  delByViewIdAndRecordIds({
    viewId: viewId,
    recordIds: recordIds,
  }) {
    return axios
      .post(`platform://custom/C12003`, {
        viewId: viewId,
        recordIds: recordIds,
      })
      .then(res => res.data);
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
  pageBusiness({
    viewId: viewId,
    sidx: sidx,
    order: order,
    currentPage: currentPage = PAGENOW,
    pageSize: pageSize = PAGESIZE,
    tagId: tagId = undefined,
    recordId: recordId = undefined,
    curModuleId: curModuleId = undefined,
    searchList: searchList = undefined,
    fuzzyQueryVal: fuzzyQueryVal = undefined,
  }) {
    return axios
      .post(`platform://custom/C12002`, {
        viewId: viewId,
        currentPage: currentPage,
        pageSize: pageSize,
        sidx: sidx,
        order: order,
        tagId: tagId,
        searchList: searchList,
        recordId: recordId,
        curModuleId: curModuleId,
        fuzzyQueryVal: fuzzyQueryVal,
      })
      .then(res => res.data);
  }

  /**
   * 修改真实数据
   * 根据视图ID修改真实数据（含批量更新子表单数据[增、删、改）
   * @param {int(11)} viewId 详情页面下关联的视图Id
   * @param {map} columnMap 要添加的数据
   * @param {map} batchColumn 要添加的子表单的数据
   */
  updateByViewId({
    viewId: viewId,
    columnMap: columnMap,
    batchColumn: batchColumn,
  }) {
    return axios
      .post(`platform://custom/C12005`, {
        viewId: viewId,
        columnMap: columnMap,
        batchColumn: batchColumn,
      })
      .then(res => res.data);
  }

  /**
   * 新增真实数据，根据自定义模块添加对象的数据
   * @param {int(11)} viewId 详情页面下关联的视图Id
   * @param {map} columnMap 要添加的数据 (自定义module的字段)
   * @param {map} batchColumn 要添加的子表单的数据
   */
  save({
    viewId: viewId,
    columnMap: columnMap,
    batchColumn: batchColumn,
  }) {
    // console.log('新增真实数据', viewId, columnMap, batchColumn)
    return axios
      .post(`platform://custom/C12004`, {
        viewId: viewId,
        columnMap: columnMap,
        batchColumn: batchColumn,
      })
      .then(res => res.data);
  }

  /**
   * 真实数据查询集合
   * @param {int(11)} viewId 详情页面下关联的视图Id
   * @param {list} recordIds	 真实数据id集合.不为空时，则查询指定recordIds数据;为空时则查询该视图对应真实数据模块的所有真实数据集合
   * 视图类型必须为列表(showType=1)
   */
  findAllByViewIdAndRecordIds({
    viewId: viewId,
    recordIds: recordIds,
  }) {
    return axios
      .post(`platform://custom/C12001`, {
        viewId: viewId,
        recordIds: recordIds,
      })
      .then(res => res.data);
  }

  /**
   * 查询一条真实数据
   * @param {int(11)} viewId 详情页面下关联的视图Id
   * @param {int(11)} recordId 真实数据id
   *  根据试图id和真实数据id查询真实数据
   */
  findOne({
    viewId: viewId,
    recordId: recordId,
  }) {
    return axios
      .post(`platform://custom/C12006`, {
        viewId: viewId,
        recordId: recordId,
      })
      .then(res => res.data);
  }

  /**
   * 模块数据迁移
   * @param {int(11)} userId 源用户id
   * @param {int(11)} targetUserId	 目标用户ID
   * @param {list} moduleIds	 模块id集合
   * 将目标用户(targetUserId)的模块数据(moduleIds)迁移到用户(userId)
   */
  transferModuleIds({
    userId: userId,
    targetUserId: targetUserId,
    moduleIds: moduleIds,
  }) {
    return axios
      .post(`platform://custom/C12007`, {
        userId: userId,
        targetUserId: targetUserId,
        moduleIds: moduleIds,
      })
      .then(res => res.data);
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
  checkUnique({
    moduleId: moduleId = undefined,
    columnName: columnName = undefined,
    recordId: recordId = undefined,
    columnValue: columnValue,
    primaryKey: primaryKey = undefined,
  }) {
    return axios
      .post(`platform://custom/C12009`, {
        moduleId: moduleId,
        columnName: columnName,
        recordId: recordId,
        columnValue: columnValue,
        primaryKey: primaryKey,
      })
      .then(res => res.data);
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
  findExist({
    moduleId: moduleId = undefined,
    columnName: columnName = undefined,
    columnValue: columnValue,
    recordId: recordId = undefined,
    primaryKey: primaryKey = null,
  }) {
    return axios
      .post(`platform://custom/C12010`, {
        moduleId: moduleId,
        columnName: columnName,
        columnValue: columnValue,
        recordId: recordId,
        primaryKey: primaryKey,
      })
      .then(res => res.data);
  }

  /**
   * 真实数据批量更新
   * @param {int(11)} viewId 详情页面下关联的视图Id
   * @param {list} recordIds	 真实数据Id集合
   * @param {map} columnMap	 真实数据
   */
  updateByViewIdAndRecordIds({
    viewId: viewId,
    recordIds: recordIds,
    columnMap: columnMap,
  }) {
    return axios
      .post(`platform://custom/C12013`, {
        viewId: viewId,
        recordIds: recordIds,
        columnMap: columnMap,
      })
      .then(res => res.data);
  }
}

export default new BusinessService()
