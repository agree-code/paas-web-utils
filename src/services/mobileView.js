import axios from "axios"
import { CRUD } from "./shared";
class MobileViewService extends CRUD {
  constructor() {
    let booleanFields = [];
    let types = ["string"];
    let formTpl = {};
    super(booleanFields, types, formTpl);
  }

  /**
   * 查询模块集合
   */
  findModuleList(params){
    return axios.post("platform://custom/C10003",params).then(res => res.data);
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
   * 查询单个视图详情
   */
  findViewById(params){
    return axios.post("platform://custom/C11002",params).then(res => res.data);
  }

  /**
   * 查询当前模块下字段集合
   */
  findColumnsByModuleId(params){
    return axios.post("platform://custom/C01023",params).then(res => res.data);
  }
}

// 实例化后导出，全局单例
export default new MobileViewService();
