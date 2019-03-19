import axios from "axios"
import { CRUD } from "./shared";

class viewService extends CRUD {
  constructor() {
    let booleanFields = [
    ];
    let types = ["string"];
    let formTpl = {
      viewName: "",
      viewCode: "",
      description: ""
    };
    super(booleanFields, types, formTpl);
  }

  /**
   * 查询视图分页
   */
  findViewByPage(params){
    return axios.post("platform://custom/C11001",params).then(res => res.data);
  }

  /**
   * 添加视图
   */
  addView(params){
    return axios.post("platform://custom/C11003",params).then(res => res);
  }

  /**
   * 更新视图
   */
  updateView(params){
    return axios.post("platform://custom/C11006",params).then(res => res);
  }

  /**
   * 删除视图
   */
  deleteView(params){
    return axios.post("platform://custom/C11005",params).then(res => res);
  }
  /**
   * 删除视图
   */
  getViewTree(params){
    return axios.post("platform://custom/C11007",params).then(res => res);
  }
  /**
   * 根据id查询视图详情
   */
  findViewById(params){
    return axios.post("platform://custom/C11002",params).then(res => res.data);
  }

  /**
   * 根据模块id,查询模块字段及其关联模块的字段的集合
   */
  findColumnsByModuleId(params){
    return axios.post("platform://custom/C01010",params).then(res => res.data);
  }

  /**
   * 查询当前模块下视图集合
   */
  findViewsByModuleId(params){
    return axios.post("platform://custom/C11008",params).then(res => res.data);
  }

  /**
   * 查询模块字段及其关联模块字段的集合
   */
  findModulesColumns(params){
    return axios.post("platform://custom/C01010",params).then(res => res.data);
  }

  /**
   * 更新视图分组集合
   */
  updateViewGroup(params){
    return axios.post("platform://custom/C11019",params).then(res => res);
  }

  /**
   * 查询可以批量新增的视图集合
   */
  findBatchViewList(params){
    return axios.post("platform://custom/C11009",params).then(res => res.data);
  }

  /**
   * 查询视图公式集合
   */
  findViewFormulaList(params){
    return axios.post("platform://custom/C02006",params).then(res => res.data);
  }
  
  /**
   * 查询可修改数据关联模块
   */
  findEditRelatedModuleList(params){
    return axios.post("platform://custom/C10003",params).then(res => res.data);
  }

  /**
   * 根据视图id获取视图可配置字段集合
   */
  findSourceColumnsByViewId(params){
    return axios.post("platform://custom/C01017",params).then(res => res.data);
  }

  /**
   * 新增查询标签（查询条件）
   */
  addSearchTag(params){
    return axios.post("platform://custom/C08007",params).then(res => res.data);
  }

  /**
   * 查询模块下的查询标签
   */
  findSearchTags(params){
    return axios.post("platform://custom/C08001",params).then(res => res.data);
  }

  /**
   * 根据查询标签Id删除查询标签
   */
  deleteSearchTag(params){
    return axios.post("platform://custom/C08004",params).then(res => res);
  }
}

export default new viewService();