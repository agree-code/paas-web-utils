import axios from "axios"
import { CRUD } from "./shared";
class RoleService extends CRUD {
  constructor() {
    let booleanFields = [];
    let types = ["string"];
    let formTpl = {};
    super(booleanFields, types, formTpl);
  }

  // 查询所有角色分页
  findRoleByPage(params){
    return axios.post("platform://auth/A03002",params).then(res => res.data);
  }

  // 查询角色集合
  findRoleAll(params){
    return axios.post("platform://auth/A03006",params).then(res => res.data);
  }

  // 新增角色
  addRole(params) {
    return axios.post("platform://auth/A03001", params).then(res => res);
  }

  // 角色明细
  findRoleById(params) {
    return axios.post("platform://auth/A03005", params).then(res => res.data);
  }

  // 编辑角色
  updateRole(params) {
    return axios.post("platform://auth/A03003", params).then(res => res);
  }

  // 删除角色
  deleteRole(params) {
    return axios.post("platform://auth/A03004", params).then(res => res);
  }

  // 查询角色权限集合
  getRolePerById(params) {
    return axios.post("platform://auth/A04002", params).then(res => res.data);
  }

  // 查询模块集合
  getModuleList(params) {
    return axios.post("platform://custom/C10003", params).then(res => res.data);
  }

  // 获取权限列表
  getPermissionList(params) {
    return axios.post("platform://auth/A06004", params).then(res => res.data);
  }

  // 新增角色权限
  updateRolePermission(params) {
    return axios.post("platform://auth/A04001", params).then(res => res);
  }

  // 角色权限克隆
  cloneRole(params) {
    return axios.post("platform://auth/A04003", params).then(res => res);
  }

  // 查询组织架构集合
  findOrgList(params) {
    return axios.post("platform://org/O02006", params).then(res => res.data);
  }

  // 根据父级组织机构编码查询子级组织架构集合
  findOrgListByParent(params) {
    return axios.post("platform://org/O02005", params).then(res => res.data);
  }

  // 查询用户集合
  findUserList(params) {
    return axios.post("platform://auth/A02005", params).then(res => res.data);
  }

  // 角色授予多个用户
  grantRole(params) {
    return axios.post("platform://auth/A02006", params).then(res => res);
  }
}

// 实例化后导出，全局单例
export default new RoleService();
