import axios from "axios"

class TaskService {
  /**
   * 1.获取任务分页
   * @param {int} moduleId 关联模块ID 可选
   * @param {int} name 任务名称 可选
   * @param {int} status 任务状态 可选
   * @param {int} pageNow 当前页 
   * @param {int} pageSize 每页条数 
   */
  findAllInPage({
    moduleId = null,
    name = null,
    status = null,
    order = null,
    sidx = null,
    pageNow = 1,
    pageSize = 20,
  }) {
    return axios.post(`platform://qrtz/Q01002`, {
      moduleId,
      name,
      status,
      order,
      sidx,
      pageNow,
      pageSize,  
    }).then(res => res.data)
  }

  /**
   * 2.新增定时任务
   */
  save(param) {
    return axios.post(`platform://qrtz/Q01001`, param).then(res => res.data)
  }

  /**
   * 3.获取任务详情
   * @param {int} taskId 任务ID 
   */
  findOne({
    taskId,
  }) {
    return axios.post(`platform://qrtz/Q01005`, {
      taskId,
    }).then(res => res.data)
  }

  /**
   * 4.删除定时任务
   * @param {int} taskId 任务ID 
   */
  delete(param) {
    return axios.post(`platform://qrtz/Q01006`, param).then(res => res.data)
  }

  /**
   * 5.启用/禁用定时任务
   * @param {int} taskIds 任务ID集合 
   * @param {String} status 状态：ENABLE-启用；DISABLE-禁用
   */
  changeStatusByTaskIds({
    taskIds,
    status,
  }) {
    return axios.post(`platform://qrtz/Q01004`, {
      taskIds,
      status,  
    }).then(res => res.data)
  }

  /**
   * 6.编辑定时任务
   */
  update(param) {
    return axios.post(`platform://qrtz/Q01003`, param).then(res => res.data)
  }

}

export default new TaskService()