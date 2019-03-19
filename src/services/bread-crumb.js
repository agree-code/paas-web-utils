import axios from "axios"

class BreadCrumbService {
  findByViewId(viewId) {
    //跳转到指定菜单页面
    return axios
      .post("platform://custom/C14003", { viewId: viewId })
      .then(res => res.data);
  }
}

// 实例化后导出，全局单例
export default new BreadCrumbService();
