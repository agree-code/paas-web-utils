import axios from "axios"
import loginUser from "./login-user";
const PAGENOW = 1
const PAGESIZE = 20
const WorkflowAuthServiceUserId = user => {
  return `${user.entCode}_${user.userId}`
}
const appKey = window.sessionStorage.getItem("paas:cloud:platform:appKey");
//工作流-流程模型相关接口
class WorkflowModelService {

  /**
   * 1.创建新的模型
   * @param {string} user.entCode 企业编码
   * @param {string} user.userId 工作流用户ID （企业编码_原业务系统用户ID）
   * @param {string} name 模型名称
   * @param {string} key 模型编码
   * @param {string} categoryCode	 模型分类编码
   * @param {int} moduleId 模块ID
   * @param {int} viewId 视图ID
   * @param {int} viewLookId	 展示视图ID
   * @param {string} moduleTableName	 业务系统模块表名称 (非必需)
   * @param {string} title 启动流程时展示标题字段 (非必需)
   * @param {string} description 模型描述 (非必需)
   * @param {map} variables 其他参数 (非必需)
   */
  newModel({
    name: name,
    key: key,
    categoryCode: categoryCode,
    moduleId: moduleId,
    viewId: viewId,
    viewLookId: viewLookId,
    moduleTableName: moduleTableName = undefined,
    title: title = undefined,
    description: description = undefined,
    variables: variables = undefined,
    isChange:isChange,
    isSubmitChange:isSubmitChange,
    userIds: userIds,
    groupIds: groupIds,
    orgCodes: orgCodes
  }) {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .post(`workflow://model/${appKey}`, {
          name: name,
          key: key,
          categoryCode: categoryCode,
          moduleId: moduleId,
          viewId: viewId,
          viewLookId: viewLookId,
          moduleTableName: moduleTableName,
          title: title,
          description: description,
          variables: variables,
          isChange: isChange,
          isSubmitChange: isSubmitChange,
          userIds: userIds,
          groupIds: groupIds,
          orgCodes: orgCodes
        })
        .then(res => res.data);
    })
  }

  /**
   * 2.创建文件模型
   * @param {string} user.entCode 企业编码
   * @param {string} user.userId 工作流用户ID （企业编码_原业务系统用户ID）
   * @param {file} bpmnFile 模型文件（XXX.bpmn/XXX.bpmn20.xml）
   * @param {string} categoryCode 模型分类编码
   * @param {int} moduleId 模块ID
   * @param {int} viewId	 视图ID
   * @param {int} viewLookId 展示视图ID
   * @param {string} moduleTableName 业务系统模块表名称 (非必需)
   * @param {string} title 启动流程时展示标题字段 (非必需)
   * @param {string} description 模型描述 (非必需)
   * @param {map} variables 其他参数 (非必需)
   */
  uploadFile({
    bpmnFile: bpmnFile,
    categoryCode: categoryCode,
    moduleId: moduleId,
    viewId: viewId,
    viewLookId: viewLookId,
    moduleTableName: moduleTableName = undefined,
    title: title = undefined,
    description: description = undefined,
    variables: variables = undefined,
  }) {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .post(`workflow://model/fileUpload/${appKey}`, {
          bpmnFile: bpmnFile,
          categoryCode: categoryCode,
          moduleId: moduleId,
          viewId: viewId,
          viewLookId: viewLookId,
          moduleTableName: moduleTableName,
          title: title,
          description: description,
          variables: variables,
        })
        .then(res => res.data);
    })
  }

  /**
   * 3.编辑模型基本信息
   * @param {*} user.modelId 流程模型ID
   * @param {string} name 模型名称
   * @param {string} categoryCode 模型分类编码
   * @param {int} moduleId 模块ID
   * @param {int} viewId	 视图ID
   * @param {int} viewLookId 展示视图ID
   * @param {string} moduleTableName 业务系统模块表名称 (非必需)
   * @param {string} title 启动流程时展示标题字段 (非必需)
   * @param {string} description 模型描述 (非必需)
   * @param {map} variables 其他参数 (非必需)
   * @param {map} variables 是否为变更流程
   * @param {map} variables 流程结束，是否提交表更数据
   */
  update({
    name: name,
    categoryCode: categoryCode,
    moduleId: moduleId,
    viewId: viewId,
    viewLookId: viewLookId,
    moduleTableName: moduleTableName = undefined,
    title: title = undefined,
    description: description = undefined,
    variables: variables = undefined,
    isChange: isChange,
    isSubmitChange: isSubmitChange,
    modelId: modelId,
    userIds: userIds,
    groupIds: groupIds,
    orgCodes: orgCodes
  }) {
    return axios
      .put(`workflow://model/${modelId}/${appKey}`, {
        name: name,
        categoryCode: categoryCode,
        moduleId: moduleId,
        viewId: viewId,
        viewLookId: viewLookId,
        moduleTableName: moduleTableName,
        title: title,
        description: description,
        variables: variables,
        isChange: isChange,
        isSubmitChange: isSubmitChange,
        modelId: modelId,
        userIds: userIds,
        groupIds: groupIds,
        orgCodes: orgCodes
      })
      .then(res => res.data);
  }

  /**
   * 4.获取模型集合
   * @param {string} user.entCode 企业编码
   * @param {string} categoryCode 模型分类编码 (非必需)
   * @param {string} processName 模型名称（模糊匹配） (非必需)
   * @param {string} state 状态：禁用-DISABLE；启用-ENABLE；发布-RELEASE；未发布-NORELEASE
   * @param {int} pageNow 当前页码
   * @param {int} pageSize 页数
   */
  findList({
    categoryCode: categoryCode = undefined,
    processName: processName = undefined,
    state: state,
    pageNow: pageNow = PAGENOW,
    pageSize: pageSize = PAGESIZE,
  }) {
    return loginUser.get().then((user) => {
      return axios
        .post(`workflow://model/list/${appKey}`, {
          categoryCode: categoryCode,
          processName: processName,
          state: state,
          pageNow: pageNow,
          pageSize: pageSize,
        })
        .then(res => res.data);
    })
  }

  /**
   * 5.获取模型详细信息
   * @param {*} modelId 流程模型ID
   */
  findById({
    modelId: modelId,
  }) {
    return axios
      .get(`workflow://model/${modelId}/${appKey}`, {})
      .then(res => res.data);
  }

  /**
   * 6.流程部署（即发布）
   * @param {*} modelId 流程模型ID
   * 流程项目部署成功，可访问：http://IP:端口号/workflow/static/models.html 页面设计流程图，也可在此页面发布流程和导出流程文件
   */
  deploy({
    modelId: modelId,
  }) {
    return axios.get(`workflow://model/${modelId}/deploy/${appKey}`)
      .then(res => res);
  }

  /**
   * 7.校验模型编码
   * @param {string} user.entCode 企业编码
   * @param {string} key 模型编码
   */
  checkKey({
    key: key,
  }) {
    return loginUser.get().then((user) => {
      return axios
        .post(`workflow://model/checkKey/${appKey}`, {
          key: key,
        })
        .then(res => res.data);
    })
  }

  /**
   * 8.获取历史流程图
   * @param {string} instanceId 流程实例ID
   * 以GET方式获取到流程图信息，会在浏览器页面中生成相应的图片信息
   */
  findFlowChartByInstanceId({
    instanceId: instanceId,
  }) {
    return axios
      .get(`workflow://model/flowChart/${appKey}?processInstanceId=${instanceId}`)
      .then(res => res.data);
  }

  /**
   * 9.根据模型ID获取最新版本流程定义
   * @param {*} modelId 流程实例ID
   */
  findProcessDefinition({
    modelId: modelId,
  }) {
    return axios
      .get(`workflow://model/${modelId}/processDefinition/${appKey}`, {})
      .then(res => res.data);
  }

  /**
   * 10.导出流程文件
   * @param {*} modelId 流程实例ID
   * 以GET方式获取到流程文件信息，生成文件保存在本地
   */
  exportWorkflow({
    modelId: modelId,
  }) {
    return axios
      .get(`workflow://model/export/${modelId}/${appKey}`)
      .then(res => res.data);
  }

}

export default new WorkflowModelService()
