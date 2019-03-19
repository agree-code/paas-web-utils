import axios from "axios"
import { CRUD } from "./shared";
class ViewFormulaService extends CRUD {
  constructor() {
    let booleanFields = [];
    let types = ["string"];
    let formTpl = {};
    super(booleanFields, types, formTpl);
  }

  /**
   * 查询视图公式分页
   */
  findViewFormulaByPage(params){
    return axios.post("platform://custom/C02001",params).then(res => res.data);
  }

  /**
   * 添加视图公式
   */
  addViewFormula(params){
    return axios.post("platform://custom/C02002",params).then(res => res);
  }

  /**
   * 更新视图公式
   */
  updateViewFormula(params){
    return axios.post("platform://custom/C02003",params).then(res => res);
  }

  /**
   * 删除视图公式
   */
  deleteViewFormula(params){
    return axios.post("platform://custom/C02004",params).then(res => res);
  }

  /**
   * 查询单个视图公式详情
   */
  findViewFormulaById(params){
    return axios.post("platform://custom/C02005",params).then(res => res.data);
  }

  /**
   * 根据模块id获取目标字段集合
   */
  findTargetColumnsByModuleId(params){
    return axios.post("platform://custom/C01023",params).then(res => res.data);
  }

  /**
   * 根据模块id获取来源字段集合
   */
  findSourceColumnsByModuleId(params){
    return axios.post("platform://custom/C01010",params).then(res => res.data);
  }
}

// 实例化后导出，全局单例
export default new ViewFormulaService();
