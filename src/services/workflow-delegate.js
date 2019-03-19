import axios from "axios"
import loginUser from "./login-user";
const PAGENOW = 1
const PAGESIZE = 20
const WorkflowAuthServiceUserId = user => {
  return `${user.entCode}_${user.userId}`
}
const appKey = window.sessionStorage.getItem("paas:cloud:platform:appKey");
//工作流-流程代理相关接口
class WorkflowDelegateService {
  /**
   * 添加代理记录
   * @param {string} user.entCode 企业编码
   * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
   * @param {string} attorney 被代理人ID
   * @param {date} startTime	 被代理开始时间
   * @param {date} endTime	 被代理结束时间
   * @param {string} processDefinitionId	 流程定义ID
   * @param {int} status 代理状态：0-启用；1-禁用
   * @param {string} content 简述 (非必需)
   */
  save({
    attorney: attorney,
    startTime: startTime,
    endTime: endTime,
    processDefinitionId: processDefinitionId,
    status: status,
    content: content = undefined,
  }) {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .post(`workflow://delegate/${appKey}`, {
          attorney: attorney,
          startTime: startTime,
          endTime: endTime,
          processDefinitionId: processDefinitionId,
          status: status,
          content: content,
        })
        .then(res => res.data);
    })
  }

  /**
   * 编辑代理记录
   * @param {string} attorney 被代理人ID
   * @param {*} startTime	 被代理开始时间
   * @param {*} endTime	 被代理结束时间
   * @param {string} processDefinitionId	 流程定义ID
   * @param {int} status 代理状态：0-启用；1-禁用
   * @param {string} content 简述 (非必需)
   * @param {int} id 主键
   */
  update({
    id: id,
    attorney: attorney,
    startTime: startTime,
    endTime: endTime,
    processDefinitionId: processDefinitionId,
    status: status,
    content: content = undefined,
  }) {
    return axios
      .put(`workflow://delegate/${appKey}`, {
        attorney: attorney,
        startTime: startTime,
        endTime: endTime,
        processDefinitionId: processDefinitionId,
        status: status,
        content: content,
        id: id,
      })
      .then(res => res.data);
  }

  /**
   * 批量删除代理信息
   * @param {list} ids 主键集合
   */
  delByIds({
    ids: ids,
  }) {
    return axios
      .put(`workflow://delegate/del/${appKey}`, {
        ids: ids,
      })
      .then(res => res.data);
  }

  /**
   * 获取用户代理列表
   * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
   * @param {list} ids 主键集合
   * @param {int} pageNow 当前页
   * @param {int} pageSize 页面显示条数
   */
  findByIds({
    ids: ids,
    pageNow: pageNow = PAGENOW,
    pageSize: pageSize = PAGESIZE,
  }) {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .put(`workflow://delegate/list/${appKey}`, {
          ids: ids,
          pageNow: pageNow,
          pageSize: pageSize,
        })
        .then(res => res.data);
    })
  }

  /**
   * 查询代理详细
   * @param {string} user.userId 主键
   */
  findOne() {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .get(`workflow://delegate/${appKey}`, {})
        .then(res => res.data);
    })
  }

  /**
   * 启用代理
   * @param {list} ids 主键集合
   */
  enableByIds({
    ids: ids,
  }) {
    return axios
      .put(`workflow://delegate/enable/${appKey}`, {
        ids: ids,
      })
      .then(res => res.data);
  }

  /**
   * 禁用代理
   * @param {list} ids 主键集合
   */
  disableByIds({
    ids: ids,
  }) {
    return axios
      .put(`workflow://delegate/disable/${appKey}`, {
        ids: ids,
      })
      .then(res => res.data);
  }

}

export default new WorkflowDelegateService()
