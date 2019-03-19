import axios from "axios"
import loginUser from './login-user'
const WorkflowAuthServiceUserId = user => {
  return `${user.entCode}_${user.userId}`
}
const appKey = window.sessionStorage.getItem("paas:cloud:platform:appKey");
//工作流-流程基础服务相关接口
class WorkflowProcessService {

  /**
   * 启动流程（根据流程定义ID和业务ID）
   * @param {string} user.entCode 企业编码
   * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
   * @param {string} processDefinitionId 流程定义ID
   * @param {string} businessId 业务ID
   * @param {string} title 流程标题
   * @param {string} level 重要等级 GENERAL-普通、MAJOR-重要、URGENT-紧急
   * @param {string} currentGroup 当前发起人所属工作组
   * @param {string} flowType 流流转类型 SAVEDRAFT-保存草稿、SUBMIT-提交审核
   * @param {map} variables	 启动流程变量集合（表单数据，Map形式）
   */
  startProcess({
    processDefinitionId: processDefinitionId,
    title: title,
    level: level,
    currentGroup: currentGroup,
    flowType: flowType,
    variables: variables={},
  }) {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .post(`workflow://Process/start/${appKey}`, {
          processDefinitionId: processDefinitionId,
          title: title,
          level: level,
          currentGroup: currentGroup,
          flowType: flowType,
          variables: variables,
        })
        .then(res => res.data);
    })
  }

  /**
   * 挂起流程定义
   * @param {list} processDefinitionIds	 流程定义ID集合
   */
  startProcessDefinition({
    processDefinitionIds: processDefinitionIds,
  }) {
    return axios
      .post(`workflow://Process/suspendProcessDefinition/${appKey}`, {
        processDefinitionIds: processDefinitionIds,
      })
      .then(res => res.data);
  }

  /**
   * 激活流程定义
   * @param {list} processDefinitionIds	 流程定义ID集合
   */
  activateProcessDefinition({
    processDefinitionIds: processDefinitionIds,
  }) {
    return axios
      .post(`workflow://Process/activateProcessDefinition/${appKey}`, {
        processDefinitionIds: processDefinitionIds,
      })
      .then(res => res.data);
  }

  /**
   * 挂起流程实例
   * @param {list} instanceIds 流程实例ID集合
   */
  suspendProcessInstance({
    instanceIds: instanceIds,
  }) {
    return axios
      .post(`workflow://Process/suspendProcessInstance/${appKey}`, {
        instanceIds: instanceIds,
      })
      .then(res => res.data);
  }

  /**
   * 激活流程实例
   * @param {list} instanceIds 流程实例ID集合
   */
  activateProcessInstance({
    instanceIds: instanceIds,
  }) {
    return axios
      .post(`workflow://Process/activateProcessInstance/${appKey}`, {
        instanceIds: instanceIds,
      })
      .then(res => res.data);
  }

  /**
   * 根据流程定义ID获取模块视图关系
   * @param {string} processDefinitionId 流程定义ID
   */
  findModelRelByProcessDefinitionId({
    processDefinitionId: processDefinitionId,
  }) {
    return axios
      .post(`workflow://process/getModelRel/${appKey}`, {
        processDefinitionId: processDefinitionId,
      })
      .then(res => res.data);
  }

  /**
   * 根据部署ID查询所有版本流程定义
   * @param {string} deploymentId 流程部署ID
   */
  findDdefinitionByDeploymentId({
    deploymentId: deploymentId,
  }) {
    return axios
      .post(`workflow://process/definitions/version/${appKey}`, {
        deploymentId: deploymentId,
      })
      .then(res => res.data);
  }

  /**
   * 根据任务ID获取模块、视图、业务数据关系
   * @param {string} taskId 任务ID
   */
  findShipInfoByTaskId({
    taskId: taskId,
  }) {
    return axios
      .post(`workflow://process/getShipInfo/${appKey}`, {
        taskId: taskId,
      })
      .then(res => res.data);
  }

  /**
   * 流程任务审批
   * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
   * @param {list} taskIds	 任务ID集合
   * @param {string} comment 审批意见 (非必需)
   * @param {map} variables 参数集合 (非必需)
   */
  completeTasksByIds({
    taskIds: taskIds,
    comment: comment = undefined,
    variables: variables = {},
  }) {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .post(`workflow://task/complete/${appKey}`, {
          taskIds: taskIds,
          comment: comment,
          variables: variables,
        })
        .then(res => res.data);
    })
  }

  /**
   * 流程任务收回
   * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
   * @param {string} taskId 任务ID
   * @param {string} comment 审批意见 (非必需)
   */
  recoveryTaskById({
    taskId: taskId,
    comment: comment = undefined,
  }) {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .post(`workflow://task/recovery/${appKey}`, {
          taskId: taskId,
          comment: comment,
        })
        .then(res => res.data);
    })
  }

  /**
   * 流程任务驳回
   * @param {string} user.userId  工作流用户ID （企业编码_原业务系统用户ID）
   * @param {string} taskId 任务ID
   * @param {string} activityId 驳回到的任务节点ID
   * @param {string} comment 审批意见 (非必需)
   * @param {map} variables	 参数集合 (非必需)
   */
  rejectTaskById({
    taskId: taskId,
    activityId: activityId,
    comment: comment = undefined,
    variables: variables = {},
  }) {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .post(`workflow://task/reject/${appKey}`, {
          taskId: taskId,
          activityId: activityId,
          comment: comment,
          variables: variables,
        })
        .then(res => res.data);
    })
  }

  /**
   * 获取流程可驳回的节点集合
   * @param {string} taskId 任务ID
   */
  findRejectListByTaskId({
    taskId: taskId,
  }) {
    return axios
      .post(`workflow://task/reject/list/${appKey}`, {
        taskId: taskId,
      })
      .then(res => res.data);
  }

  /**
   * 自定义数据启动流程
   * @param {string} processDefinitionId 流程定义ID
   * @param {string} businessId 业务数据ID
   * @param {string} title 流程标题
   * @param {string} level 重要等级：GENERAL-普通、MAJOR-重要、URGENT-紧急
   * @param {string} currentGroup 发起人所属工作组
   * @param {string} flowType 流转类型：SAVEDRAFT-保存草稿、SUBMIT-提交审核
   * @param {map} variables 参数集合
   */
  startWorkflowByData({
    processDefinitionId: processDefinitionId,
    businessId: businessId,
    title: title,
    level: level,
    currentGroup: currentGroup,
    flowType: flowType,
    variables: variables,
  }) {
    return axios
      .post(`platform://activiti/P01001`, {
        processDefinitionId: processDefinitionId,
        businessId: businessId,
        title: title,
        level: level,
        currentGroup: currentGroup,
        flowType: flowType,
        variables: variables,
      })
      .then(res => res.data);
  }

  /**
   * 添加真实数据并启动流程
   * @param {string} processDefinitionId 流程定义ID
   * @param {string} businessId 业务数据ID
   * @param {string} title 流程标题
   * @param {string} level 重要等级：GENERAL-普通、MAJOR-重要、URGENT-紧急
   * @param {string} currentGroup 发起人所属工作组
   * @param {string} flowType 流转类型：SAVEDRAFT-保存草稿、SUBMIT-提交审核
   * @param {map} variables 参数集合
   * @param {map} columnMap 要添加的数据
   * @param {map} batchColumn 要添加的子表单的数据
   */
  saveColumnAndStart({
    processDefinitionId: processDefinitionId,
    title: title,
    level: level,
    currentGroup: currentGroup,
    flowType: flowType,
    variables: variables={},
    columnMap: columnMap,
    batchColumn: batchColumn,
    viewId: viewId,
    moduleId: moduleId
  }) {
    return axios
      .post(`platform://activiti/P01002`, {
        processDefinitionId: processDefinitionId,
        title: title,
        level: level,
        currentGroup: currentGroup,
        flowType: flowType,
        variables: variables,
        columnMap: columnMap,
        batchColumn: batchColumn,
        viewId: viewId,
        moduleId: moduleId
      })
      .then(res => res.data);
  }

  /**
   * 编辑草稿
   * @param {string} processDefinitionId 流程定义ID
   * @param {string} taskId 任务ID（草稿任务ID
   * @param {string} businessId 业务数据ID
   * @param {string} title 流程标题
   * @param {string} level	 重要等级：GENERAL-普通、MAJOR-重要、URGENT-紧急
   * @param {string} currentGroup	 发起人所属工作组
   * @param {string} flowType	 流转类型：SAVEDRAFT-保存草稿、SUBMIT-提交审核
   * @param {map} variables	 参数集合
   * @param {string} moduleId 模块ID
   * @param {map} record 需要修改的表单的数据
   */
  updateDraft({
    processDefinitionId: processDefinitionId,
    taskId: taskId,
    businessId: businessId,
    title: title,
    level: level,
    currentGroup: currentGroup,
    flowType: flowType,
    variables: variables={},
    moduleId: moduleId,
    record: record,
    isChange: isChange,
    changeRecord: changeRecord
  }) {
    return axios.post(`platform://activiti/P01003`, {
      processDefinitionId: processDefinitionId,
        taskId: taskId,
        businessId: businessId,
        title: title,
        level: level,
        currentGroup: currentGroup,
        flowType: flowType,
        variables: variables,
        moduleId: moduleId,
        record: record,
        isChange: isChange,
        changeRecord: changeRecord
      })
      .then(res => res.data);
  }

  /**
   * 批量提交草稿
   * @param {list} taskIds 任务ID（草稿任务ID)
   * @param {int} businessId 业务数据ID
   * @param {int} moduleId 模块ID
   */
  submitDrafts({
    taskIds: taskIds,
    record: record,
  }) {
    return axios
      .post(`platform://activiti/P01004`, {
        taskIds: taskIds,
        record: record,
      })
      .then(res => res.data);
  }

  /**
   * 批量删除草稿
   * @param {list} taskIds 任务ID集合
   * @param {list} record
   * @param {int} record.businessId 业务数据ID
   * @param {int} record.moduleId 模块ID
   */
  delDrafts({
    taskIds: taskIds,
    record: record,
  }) {
    return axios
      .post(`platform://activiti/P01005`, {
        taskIds: taskIds,
        record: record,
      })
      .then(res => res.data);
  }

  /**
   * 根据业务ID获取业务变更数据主体
   */
  getChangeData({
    processInstanceId: processInstanceId,
  }){
    return axios
      .get(`workflow://process/record/${processInstanceId}/${appKey}`,{
        processInstanceId: processInstanceId
    })
    .then(res=>res.data);
  }
}

export default new WorkflowProcessService()
