import axios from "axios"
import { CRUD } from "./shared";
class ModulesInfoService extends CRUD {
  constructor() {
    let booleanFields = [
      "isProcess",
      "dpEnable",
      "isDataSharing",
      "isCustomModule"
    ];
    let types = ["string"];
    let formTpl = {
      moduleName: "",
      moduleCode: "",
      dpEnable: true,
      isDataSharing: false,
      isCustomModule: false,
      isProcess: false,
      description: ""
    };
    super(booleanFields, types, formTpl);
  }

  findModules(params) {
    //查询所有模块列表
    return axios.post("platform://custom/C10003", params).then(res => res.data);
  }
  /**
   * 查询所有模块列表（分页查询）
   * @param {*} params 
   */
  findModuleByPage(params){
    return axios.post("platform://custom/C10002",params).then(res=>res.data);
  }
  //新增模块
  addModule(params) {
    return axios.post("platform://custom/C10001", params).then(res => res);
  }
  //更新模块
  updateModule(params) {
    return axios.post("platform://custom/C10005", params).then(res => res);
  }
  //删除模块
  deleteModule(params) {
    return axios.post("platform://custom/C10006", params).then(res => res);
  }
  //查询单个模块
  findModuleDetail(params) {
    return axios.post("platform://custom/C10004", params).then(res => res.data);
  }
  //模块编码唯一检测
  checkModuleCode(params) {
    return axios.post("platform://custom/C10008", params).then(res => res.data);
  }
  findModuleByName(params) {
    //查询模块分页
    return axios.post("platform://custom/C10002", params).then(res => res.data);
  }
}

// 实例化后导出，全局单例
export default new ModulesInfoService();
