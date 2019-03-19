import axios from "axios"
class dashboardService {
  //新增面板
  addPanel(params){
    return axios.post("platform://custom/C06001", params)
      .then(res => res.data);
  }
  //编辑面板
  editPanel(params){
    return axios.post("platform://custom/C06002", params)
      .then(res => res.data);
  }
  //删除面板
  removePanel(params){
    return axios.post("platform://custom/C06003", params)
      .then(res => res.data);
  }
  //查询单个面板详情
  findPanelDetail(params){
    return axios.post("platform://custom/C06006", params)
      .then(res => res.data);
  }
  //查询面板集合
  findPanel(params){
    return axios.post("platform://custom/C06004", params)
      .then(res => res.data);
  }
  //查询所有有权限的面板集合
  findAllPermissionPanel(params){
    return axios.post("platform://custom/C06005", params)
      .then(res => res.data);
  }
  //查询面板分页
  findPanelPage(params){
    return axios.post("platform://custom/C06014", params)
      .then(res => res.data);
  }
  //查询模块集合
  findModules(params) {
    return axios.post("platform://custom/C10003", params)
      .then(res => res.data);
  }
  //查询视图集合
  findViews(params) {
    return axios.post("platform://custom/C11008", params)
      .then(res => res.data);
  }
  //根据id查询视图详情
  findViewById(params){
    return axios.post("platform://custom/C11002",params).then(res => res.data);
  }
  //根据视图查询字段
  findColumns(params) {
    return axios.post("platform://custom/C01016", params)
      .then(res => res.data);
  }
  //查询角色集合
  findRoles(params){
    return axios.post("platform://auth/A03006",params)
    .then(res => res.data);
  }
  // 查询所有用户集合
  findUsers(params){
    return axios.post("platform://auth/A02005", params).then(res => res.data);
  }
  //根据字段id查询字段详细信息
  findColumnDetail(params){
    return axios.post("platform://custom/C01005", params).then(res => res.data);
  }
  //根据视图id查询真实数据
  findRealDataByViewId(params){
    return axios.post("platform://custom/C12001", params).then(res => res.data);
  }
  //获取统计数
  getTotalData(params){
    return axios.post("platform://custom/C06019", params).then(res => res.data);
  }
  //获取指定指标维度数据
  getChartsData(params){
    return axios.post("platform://custom/C06020", params).then(res => res.data);
  }
  //获取数据源地址数据
  getSourceData(sourceUrl, params = {}){
    return axios.post(sourceUrl, params).then(res => res.data);
  }

  /* 
   * 系统主页相关
  */
  // 新增系统主页
  addDashboard(params){
    return axios.post("platform://custom/C06007", params).then(res => res);
  }
  // 获取单个系统主页信息
  findDashboardInfo(params){
    return axios.post("platform://custom/C06013", params).then(res => res.data);
  }
  // 修改系统主页
  updateDashboard(params){
    return axios.post("platform://custom/C06008", params).then(res => res);
  }
  // 删除系统主页
  deleteDashboard(params){
    return axios.post("platform://custom/C06010", params).then(res => res);
  }
  // 查询所有系统主页集合
  findAllDashboardList(params){
    return axios.post("platform://custom/C06011", params).then(res => res.data);
  }
  // 查询系统主页的分页列表
  findDashboardList(params){
    return axios.post("platform://custom/C06015", params).then(res => res.data);
  }

  /* 
   * 用户个人主页相关
  */
  // 新增个人主页
  addUserDashboard(params){
    return axios.post("platform://custom/C06016", params).then(res => res);
  }
  // 获取单个个人主页信息
  findUserDashboardInfo(params){
    return axios.post("platform://custom/C06009", params).then(res => res.data);
  }
  // 修改个人主页
  updateUserDashboard(params){
    return axios.post("platform://custom/C06018", params).then(res => res);
  }
  // 删除个人主页
  deleteUserDashboard(params){
    return axios.post("platform://custom/C06017", params).then(res => res);
  }
  // 查询所有有权限的主页集合
  findAllLimitDashboardList(params){
    return axios.post("platform://custom/C06012", params).then(res => res.data);
  }
}
export default new dashboardService();