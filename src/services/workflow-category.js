import axios from "axios"
import loginUser from "./login-user";
const WorkflowAuthServiceUserId = user => {
  return `${user.entCode}_${user.userId}`
}
const appKey = window.sessionStorage.getItem("paas:cloud:platform:appKey");
//工作流-流程分类相关接口
class WorkflowCategoryService {
  /**
   * 1.创建分类信息
   * @param {string} user.entCode 企业编码
   * @param {string} user.userId 工作流用户ID （企业编码_原业务系统用户ID）
   * @param {string} categoryName 分类名称
   * @param {string} categoryCode 分类编码（唯一）
   * @param {int} pid 上级分类ID
   */
  save({
    categoryName: categoryName,
    categoryCode: categoryCode,
    pid: pid,
  }) {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .post(`workflow://category/${appKey}`, {
          categoryName: categoryName,
          categoryCode: categoryCode,
          pid: pid,
        })
        .then(res => res.data);
    })
  }

  /**
   * 2.编辑分类信息
   * @param {int} id 主键
   * @param {string} categoryName 分类名称
   * @param {int} pid 上级分类ID
   * @param {int} isDelete 是否删除 0-否；1-是
   */
  update({
    id: id,
    categoryName: categoryName,
    pid: pid,
    isDelete: isDelete,
  }) {
    return axios
      .put(`workflow://category/${appKey}`, {
        id: id,
        categoryName: categoryName,
        pid: pid,
        isDelete: isDelete,
      })
      .then(res => res.data);
  }

  /**
   * 3.删除分类信息
   * @param {int} user.userId 主键
   */
  delById() {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .delete(`workflow://category/${appKey}`, {})
        .then(res => res.data);
    })
  }

  /**
   * 4.获取全部分类列表
   * @param {string} user.entCode 企业编码
   */
  findAll() {
    return loginUser.get().then((user) => {
      return axios
        .get(`workflow://category/list/${appKey}`, {})
        .then(res => res.data);
    })
  }

  /**
   * 5.获取指定分类列表
   * @param {int} user.userId 主键
   */
  findById() {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .get(`workflow://category/${appKey}`, {})
        .then(res => res.data);
    })
  }

  /**
   * 6.校验分类编码
   * @param {string} user.entCode 企业编码
   * @param {string} categoryCode 分类编码
   */
  checkCodeUnique({
    categoryCode: categoryCode,
  }) {
    return loginUser.get().then((user) => {
      return axios
        .post(`workflow://category/checkCode/${appKey}`, {
          categoryCode: categoryCode,
        })
        .then(res => res.data);
    })
  }
}

export default new WorkflowCategoryService()
