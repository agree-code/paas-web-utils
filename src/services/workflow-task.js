import axios from "axios"
import MD5 from "md5";
import loginUser from './login-user'
const PAGENOW = 1
const PAGESIZE = 20
const WorkflowAuthServiceUserId = user => {
  return `${user.entCode}_${user.userId}`
}
const appKey = window.sessionStorage.getItem("paas:cloud:platform:appKey");
//工作流-流程查询相关接口
class WorkflowTaskService {
  /**
   * 1.根据任务ID判断当前节点是否为会签节点
   * @param {string} taskId 任务ID
   */
  isSignById({
    taskId: taskId,
  }) {
    return axios
      .post(`workflow://task/isSign/${appKey}`, {
        taskId: taskId,
      })
      .then(res => res.data);
  }

  /**
   * 2.根据实例ID获取当前可收回的任务ID
   * @param {string} instanceId 流程实例ID
   */
  findRecoveryByInstanceId({
    instanceId: instanceId,
  }) {
    return axios
      .post(`workflow://task/allow/recovery/${appKey}`, {
        instanceId: instanceId,
      })
      .then(res => res.data);
  }

  /**
   * 3.获取企业部署的流程定义集合
   * @param {string} user.entCode 企业编码
   */
  findDefinitionList() {
    return loginUser.get().then((user) => {
      return axios
        .post(`workflow://process/definition/list/${appKey}`, {})
        .then(res => res.data);
    })

  }

  /**
   * 4.获取用户可发起的流程定义集合
   * @param {string} user.entCode 企业编码
   * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
   * @param {string} categoryCode 流程分类编码 (非必需)
   * @param {int} pageNow
   * @param {int} pageSize
   */
  findPeocessListByCategoryCode({
    categoryCode: categoryCode = undefined,
    pageNow: pageNow = PAGENOW,
    pageSize: pageSize = PAGESIZE,
  }) {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .post(`workflow://process/allow/start/${appKey}`, {
          categoryCode: categoryCode,
          pageNow: pageNow,
          pageSize: pageSize,
        })
        .then(res => res.data);
    })
  }

  /**
   * 5.查询用户草稿
   * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
   * @param {string} selectType 查询类型 ALL-全部、DRAFT-草稿、REJECT-驳回 (非必需)
   * @param {string} categoryCode	 流程分类编码 (非必需)
   * @param {string} startTime	 开始时间
   * @param {int} pageNow 当前页码
   * @param {int} pageSize 页数
   */
  pageDrafts({
    selectType: selectType = 'ALL',
    categoryCode: categoryCode = undefined,
    startTime: startTime,
    pageNow: pageNow = PAGENOW,
    pageSize: pageSize = PAGESIZE,
  }) {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .post(`workflow://search/drafts/${appKey}`, {
          selectType: selectType,
          categoryCode: categoryCode,
          startTime: startTime,
          pageNow: pageNow,
          pageSize: pageSize,
        })
        .then(res => res.data);
    })

  }

  /**
   * 6.查询用户待办
   * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
   * @param {string} taskType 任务类型 指定审批人-APPROVAL、指定任务候选人-CANDIDATE、指定候选工作组-CANDIDATEGROUP
   * @param {list} userIds	 申请人ID集合 (非必需)
   * @param {string} selectType	 查询类型 ALL- 全部，ME-本人，AGENT-代理 (非必需)
   * @param {string} categoryCode	 流程分类编码 (非必需)
   * @param {string} orgCode	 申请部门编码 (非必需)
   * @param {string} startTime	 开始时间
   * @param {int} pageNow 当前页码
   * @param {int} pageSize 页数
   */
  pageDeals({
    taskType: taskType,
    userIds: userIds = undefined,
    selectType: selectType = 'ALL',
    categoryCode: categoryCode = undefined,
    orgCode: orgCode = undefined,
    startTime: startTime,
    pageNow: pageNow = PAGENOW,
    pageSize: pageSize = PAGESIZE,
  }) {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .post(`workflow://search/deals/${appKey}`, {  
          taskType: taskType,
          userIds: userIds,
          selectType: selectType,
          categoryCode: categoryCode,
          orgCode: orgCode,
          startTime: startTime,
          pageNow: pageNow,
          pageSize: pageSize,
        })
        .then(res => res.data);
    })
  }

  /**
   * 7.查询用户已办
   * @param {string} user.entCode 企业编码
   * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
   * @param {list} userIds 申请人ID集合 (非必需)
   * @param {string} selectType	 查询类型 ALL- 全部，ME-本人，AGENT-代理 (非必需)
   * @param {string} categoryCode	 流程分类编码 (非必需)
   * @param {string} orgCode	 申请部门编码 (非必需)
   * @param {string} startTime	 开始时间
   * @param {int} pageNow 当前页码
   * @param {int} pageSize 页数

   */
  pageComplete({
    userIds: userIds = undefined,
    selectType: selectType = undefined,
    categoryCode: categoryCode = undefined,
    orgCode: orgCode = undefined,
    startTime: startTime,
    pageNow: pageNow = PAGENOW,
    pageSize: pageSize = PAGESIZE,
  }) {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .post(`workflow://search/complete/${appKey}`, {
          userIds: userIds,
          selectType: selectType,
          categoryCode: categoryCode,
          orgCode: orgCode,
          startTime: startTime,
          pageNow: pageNow,
          pageSize: pageSize,
        })
        .then(res => res.data);
    })
  }

  /**
   * 8.查询所有流程实例
   * @param {string} user.entCode 企业编码
   * @param {int} pageNow
   * @param {int} pageSize
   */
  pageAllInstance({
    pageNow: pageNow = PAGENOW,
    pageSize: pageSize = PAGESIZE,
  }) {
    return loginUser.get().then((user) => {
      return axios
        .post(`workflow://search/instance/all/${appKey}`, {
          pageNow: pageNow,
          pageSize: pageSize,
        })
        .then(res => res.data);
    })
  }

  /**
   * 9.查询用户发起的流程实例
   * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
   * @param {string} categoryCode 流程分类编码 (非必需)
   * @param {string} startTime 开始时间
   * @param {string} approvalStatus 审批状态 ALL-所有；PENDING-审批中；COMPLETE-已完成 (非必需)
   */
  findUserInstance({
    categoryCode: categoryCode = undefined,
    startTime: startTime,
    approvalStatus: approvalStatus = undefined,
  }) {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .post(`workflow://search/instance/user/${appKey}`, {
          categoryCode: categoryCode,
          startTime: startTime,
          approvalStatus: approvalStatus,
        })
        .then(res => res.data);
    })
  }

  /**
   * 10.查询用户发起的审批集合
   * @param {string} user.entCode 企业编码
   * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
   * @param {string} categoryCode 流程分类编码 (非必需)
   * @param {string} startTime 开始时间
   * @param {string} approvalStatus 审批状态 ALL-所有；PENDING-审批中；COMPLETE-已完成 (非必需)
   * @param {int} pageNow
   * @param {int} pageSize
   */
  pageUserApproval({
    categoryCode: categoryCode ='AOS',
    startTime: startTime,
    approvalStatus: approvalStatus = 'ALL',
    pageNow: pageNow = 1,
    pageSize: pageSize = 20,
  }) {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .post(`workflow://search/approval/user/${appKey}`, {//测试数据将user.userId改为了AOS_1
          categoryCode: categoryCode,
          startTime: startTime,
          approvalStatus: approvalStatus,
          pageNow: pageNow,
          pageSize: pageSize,
        })
        .then(res => res.data);
    })
  }

  /**
   * 11.获取用户待办总记录数
   * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
   */
  countUserDeals() {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .post(`workflow://search/deals/count/${appKey}`, {})
        .then(res => res.data);
    })
  }

  /**
   * 12.获取任务审批记录集合
   * @param {string} taskId 任务ID (非必需)
   * @param {string} instanceId	 流程实例ID (非必需)
   * 任务ID和流程实例ID不能同时为空，必须有一个值
   */
  findCommentsByTaskIdOrInstanceId({
    taskId: taskId = undefined,
    instanceId: instanceId = undefined,
  }) {
    return axios
      .post(`workflow://search/comments/${appKey}`, {
        taskId: taskId,
        instanceId: instanceId,
      })
      .then(res => res.data);
  }

}

export default new WorkflowTaskService()
