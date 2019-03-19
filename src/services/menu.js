import axios from "axios"
class menuService {
  //新增菜单
  addMenu(params) {
    return axios.post("platform://auth/A05001", params)
      .then(res => res.data);
  }
  //更新菜单信息
  editMenu(params) {
    return axios.post("platform://auth/A05002", params)
      .then(res => res.data)
  }
  //删除菜单
  removeMenu(params) {
    return axios.post("platform://auth/A05005", params)
      .then(res => res.data);
  }
  //查询菜单集合
  findMenu(params) {
    return axios.post("platform://auth/A05003", params)
      .then(res => res.data);
  }
  //查询单个菜单信息
  findMenuDetail(params) {
    return axios.post("platform://auth/A05004", params)
      .then(res => res.data);
  }
  //查询分页菜单集合
  findMenuPage(params) {
    return axios.post("platform://auth/A05006", params)
      .then(res => res.data);
  }
  //查询移动端菜单集合
  findMobile(params) {
    return axios.post("platform://auth/A05012", params)
      .then(res => res.data);
  }
  //查询移动端分页菜单集合
  findMobilePage(params) {
    return axios.post("platform://auth/A05013", params)
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
  /**
   * 根据id查询视图详情
   */
  findViewById(params){
    return axios.post("platform://custom/C11002",params).then(res => res.data);
  }
}
export default new menuService();
