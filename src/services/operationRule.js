import axios from "axios"
import { CRUD } from "./shared";
class OperationRuleService extends CRUD {
  constructor() {
    let booleanFields = [];
    let types = ["string"];
    let formTpl = {};
    super(booleanFields, types, formTpl);
  }

  /**
   * 查询操作条件分页
   */
  findOperationRuleByPage(params){
    return axios.post("platform://custom/C05002",params).then(res => res.data);
  }

  /**
   * 添加操作条件
   */
  addOperationRule(params){
    return axios.post("platform://custom/C05001",params).then(res => res);
  }

  /**
   * 更新操作条件
   */
  updateOperationRule(params){
    return axios.post("platform://custom/C05005",params).then(res => res);
  }

  /**
   * 删除操作条件
   */
  deleteOperationRule(params){
    return axios.post("platform://custom/C05004",params).then(res => res);
  }

  /**
   * 根据id查询操作条件详情
   */
  findOperationRuleById(params){
    return axios.post("platform://custom/C05003",params).then(res => res.data);
  }

  /**
   * 根据模块id查询视图集合
   */
  findViewListByModuleId(params){
    return axios.post("platform://custom/C11008",params).then(res => res.data);
  }

  /**
   * 根据视图id查询影响操作集合
   */
  findAffectOperationsByViewId(params){
    return axios.post("platform://custom/C04006",params).then(res => res.data);
  }

  /**
   * 根据操作id获取操作可配置字段集合
   */
  findSourceColumnsByViewId(params){
    return axios.post("platform://custom/C01017",params).then(res => res.data);
  }
}

// 实例化后导出，全局单例
export default new OperationRuleService();
