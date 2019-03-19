import axios from "axios"
import { CRUD } from "./shared";
class CustomPermissionService extends CRUD {
  constructor() {
    let booleanFields = [];
    let types = ["string"];
    let formTpl = {};
    super(booleanFields, types, formTpl);
  }

  // 查询自定义权限分页
  findPermissionByPage(params){
    return axios.post("platform://auth/A07001",params).then(res => res.data);
  }

  // 新增权限
  addPermission(params) {
    return axios.post("platform://auth/A07005", params).then(res => res);
  }

  // 权限明细
  findPermissionById(params) {
    return axios.post("platform://auth/A07002", params).then(res => res.data);
  }

  // 编辑权限
  updatePermission(params) {
    return axios.post("platform://auth/A07004", params).then(res => res);
  }

  // 删除权限
  deletePermission(params) {
    return axios.post("platform://auth/A07003", params).then(res => res);
  }
}

// 实例化后导出，全局单例
export default new CustomPermissionService();
