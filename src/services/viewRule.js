import axios from "axios"
import { CRUD } from "./shared";
class ViewRuleService extends CRUD {
  constructor() {
    let booleanFields = [];
    let types = ["string"];
    let formTpl = {};
    super(booleanFields, types, formTpl);
  }

  /**
   * 查询视图条件分页
   */
  findViewRuleByPage(params){
    return axios.post("platform://custom/C07003",params).then(res => res.data);
  }

  /**
   * 添加视图条件
   */
  addViewRule(params){
    return axios.post("platform://custom/C07004",params).then(res => res);
  }

  /**
   * 更新视图条件
   */
  updateViewRule(params){
    return axios.post("platform://custom/C07005",params).then(res => res);
  }

  /**
   * 删除视图条件
   */
  deleteViewRule(params){
    return axios.post("platform://custom/C07001",params).then(res => res);
  }

  /**
   * 根据id查询视图条件详情
   */
  findViewRuleById(params){
    return axios.post("platform://custom/C07002",params).then(res => res.data);
  }

  /**
   * 根据模块id查询视图集合
   */
  findViewListByModuleId(params){
    return axios.post("platform://custom/C11008",params).then(res => res.data);
  }

  /**
   * 根据视图id查询影响字段集合
   */
  findAffectColumnsByViewId(params){
    return axios.post("platform://custom/C01016",params).then(res => res.data);
  }

  /**
   * 根据视图id获取视图可配置字段集合
   */
  findSourceColumnsByViewId(params){
    return axios.post("platform://custom/C01017",params).then(res => res.data);
  }
}

// 实例化后导出，全局单例
export default new ViewRuleService();
