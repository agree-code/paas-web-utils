import axios from "axios"
import MD5 from "md5";
import loginUser from './login-user'
class UserService {
  //查询用户列表
  findUserList(params) {
    return axios.post("platform://auth/A02005", params)
      .then(res => res.data);
  }
  //查询分页用户列表
  findUserByPage(params){
    return axios.post("platform://auth/A02009",params)
    .then(res => res.data);
  } 
  //新增用户
  addUser(params){
    return axios.post("platform://auth/A02001",params)
    .then(res => res.data);
  }
  //查询用户详情
  userDetail(params){
    return axios.post("platform://auth/A02003",params)
    .then(res => res.data);
  }
  //修改用户
  editUser(params){
    return axios.post("platform://auth/A02002",params)
    .then(res => res.data);
  }
  //删除用户
  removeUser(params){
    return axios.post("platform://auth/A02004",params)
    .then(res => res.data);
  }
  //查询角色集合
  findRoles(params){
    return axios.post("platform://auth/A03006",params)
    .then(res => res.data);
  }
  //字典编码唯一校验
  checkAccountId(params){
    return axios.post("platform://auth/A02012",params)
    .then(res => res.data);
  }
  /**
 * 13.修改密码
 * 任务ID和流程实例ID不能同时为空，必须有一个值
 */
  changePassWord({
    oldPwd: oldPwd,
    newPwd: newPwd
  }) {
    return loginUser.get().then((user) => {
      return axios
        .post(`platform://auth/A02008`, {
          oldPwd: MD5(oldPwd),
          newPwd: MD5(newPwd),
          userId: user.userId,
        })
        .then(res => res.data);
    })
  }
}
export default new UserService();
