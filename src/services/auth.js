import axios from "axios"

class AuthService {
  findMenuByAuth() {//查询有权限的菜单集合
    return axios
      .post("platform://auth/A05007", {})
      .then(res => res.data);
  }
  findMenuByQuick() {//查询快捷菜单集合
    return axios
      .post("platform://auth/A05009", {})
      .then(res => res.data);
  }
  changePageByViewId(viewId) {//跳转到指定菜单页面
    return axios.post("platform://custom/C11002", { viewId: viewId }).then(res => res.data);
  }
  setMenuByQuick(menuIds) {//查询快捷菜单集合
    return axios
      .post("platform://auth/A05008", { menuIds: menuIds })
      .then(res => res.data);
  }
}

// 实例化后导出，全局单例
export default new AuthService();