import axios from "axios"
// import loginUser from "./login-user";

class ModuleService {
  
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
  save({
    moduleCode: moduleCode,
    dpEnable: dpEnable = null,
    moduleName: moduleName,
    description: description = null,
    isDataSharing: isDataSharing,
    isCustomModule: isCustomModule,
    isProcess: isProcess,
  }) {
    return axios
      .post(`platform://custom/C10001`, {
        moduleCode: moduleCode,
        dpEnable: dpEnable,
        moduleName: moduleName,
        description: description,
        isDataSharing: isDataSharing,
        isCustomModule: isCustomModule,
        isProcess: isProcess,
      })
      .then(res => res.data);
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
  update({
    dpEnable: dpEnable = null,
    moduleName: moduleName,
    description: description = null,
    isDataSharing: isDataSharing,
    isProcess: isProcess,
    id: id,
  }) {
    return axios
      .post(`platform://custom/C10005`, {
        dpEnable: dpEnable,
        moduleName: moduleName,
        description: description,
        isDataSharing: isDataSharing,
        isProcess: isProcess,
        id: id,
      })
      .then(res => res.data);
  }

  /**
   * 3.删除模块
   * @param {list} moduleIds 模块Id集合 
   */
  delByModuleIds({
    moduleIds: moduleIds,
  }) {
    return axios
      .post(`platform://custom/C10006`, {
        moduleIds: moduleIds,
      })
      .then(res => res.data);
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
  findModules({
    moduleIds: moduleIds = undefined,
    isRelated: isRelated = undefined,
    isEqModuleId: isEqModuleId = undefined,
    isCustom: isCustom = undefined,
    isDelete: isDelete = 0,
    dpEnable: dpEnable = undefined,
    isProcess: isProcess = undefined,
  }) {
    return axios
      .post(`platform://custom/C10003`, {
        moduleIds: moduleIds,
        isRelated: isRelated,
        isEqModuleId: isEqModuleId,
        isCustom: isCustom,
        isDelete: isDelete,
        dpEnable: dpEnable,
        isProcess: isProcess,
      })
      .then(res => res.data);
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
  findModulesPage({
    keyValue: keyValue = null,
    moduleName: moduleName = null,
    moduleCode: moduleCode = null,
    isDelete: isDelete,
    sidx: sidx = null,
    order: order = null,
    pageNow: pageNow,
    pageSize: pageSize,
  }) {
    return axios
      .post(`platform://custom/C10002`, {
        keyValue: keyValue,
        moduleName: moduleName,
        moduleCode: moduleCode,
        isDelete: isDelete,
        sidx: sidx,
        order: order,
        pageNow: pageNow,
        pageSize: pageSize,
      })
      .then(res => res.data);
  }

  /**
   * 6.查询单个模块
   * @param {string(30)} moduleCode 模块编码 (非必需)
   * @param {int} moduleId 模块id 
   */
  findOne({
    moduleCode: moduleCode = null,
    moduleId: moduleId,
  }) {
    return axios
      .post(`platform://custom/C10004`, {
        moduleCode: moduleCode,
        moduleId: moduleId,
      })
      .then(res => res.data);
  }

  /**
   * 7.模块编码唯一校验
   * 判断模块是否已存在
   * @param {string(9)} moduleCode 模块编码 
   */
  unique({
    moduleCode: moduleCode,
  }) {
    return axios
      .post(`platform://custom/C10008`, {
        moduleCode: moduleCode,
      })
      .then(res => res.data);
  }

  /**
   * 8.根据字段ID集合查询模块集合
   * @param {list} columnIds	 字段ID集合 
   */
  findModulesByColumnIds({
    columnIds: columnIds,
  }) {
    return axios
      .post(`platform://custom/C10009`, {
        columnIds: columnIds,
      })
      .then(res => res.data);
  }
  /**
   * 查询模块关系
   * @param {*} param0 
   */
  findModuleRelated({
    moduleRelatedId = undefined,
    columnId = undefined,
    moduleId = undefined,
    otherModuleId = undefined
  }) {
    return axios.post("platform://custom/C03003", {
      "moduleRelatedId": moduleRelatedId,
      "columnId": columnId,
      "moduleId": moduleId,
      "otherModuleId": otherModuleId
    }).then(res => res.data);
  }
}

export default new ModuleService()
