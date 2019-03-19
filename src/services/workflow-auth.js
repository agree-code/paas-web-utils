import axios from "axios"
import loginUser from "./login-user";
const PAGENOW = 1
const PAGESIZE = 20
const WorkflowAuthServiceUserId = user => {
  let entCode = user.entCode
  let userId = user.userId
  return `${entCode}_${userId}`
}
const appKey = window.sessionStorage.getItem("paas:cloud:platform:appKey");
//工作流-身份认证相关接口
class WorkflowAuthService {
  /** 
   * 1. 企业信息同步
   * @param {string} user.entCode 企业编码
   */
  syncEntInfo() {
    return loginUser.get().then((user) => {
      return axios
        .post(`workflow://auth/synchronization/${appKey}`, {})
        .then(res => res);
    })
  }

  /**
   * 2.创建工作组
   * @param {string} user.entCode 企业编码
   * @param {string} groupName 工作组名称
   * @param {srting} groupCode 工作组编码（唯一）
   * @param {string} type 工作组类型：DEPT-部门；TEMPORARY-临时
   * @param {string} state 工作组状态：ENABLE-启用；DISABLE-停用
   * @param {string} description 工作组描述 （非必填）
   */
  saveGroup({
    groupName: groupName,
    groupCode: groupCode,
    type: type,
    state: state,
    description: description = undefined,
  }) {
    return loginUser.get().then((user) => {
      return axios
        .post(`workflow://auth/group/${appKey}`, {
          groupName: groupName,
          groupCode: groupCode,
          type: type,
          state: state,
          description: description,
        })
        .then(res => res.data);
    })
  }

  /**
   * 3.编辑工作组
   * @param {string} groupId 工作组ID（唯一标识）
   * @param {string} groupName 工作组名称
   * @param {string} type 工作组类型：DEPT-部门；TEMPORARY-临时
   * @param {string} state 工作组状态：ENABLE-启用；DISABLE-停用
   * @param {string} description 工作组描述 (非必需)
   */
  update({
    groupId: groupId,
    groupName: groupName,
    type: type,
    state: state,
    description: description = undefined,
  }) {
    return axios
      .put(`workflow://auth/group/${appKey}`, {
        groupId: groupId,
        groupName: groupName,
        type: type,
        state: state,
        description: description,
      })
      .then(res => res.data);
  }

  /**
   * 4.批量删除工作组
   * @param {string} groupIds 工作组ID集合（唯一标识）
   */
  delGroups({
    groupIds: groupIds,
  }) {
    return axios
      .put(`workflow://auth/group/del/${appKey}`, {
        groupIds: groupIds,
      })
      .then(res => res.data);
  }

  /**
   * 5.获取工作组集合
   * @param {string} groupName 工作组名称（模糊匹配）
   * @param {string} groupCode 工作组编码
   * @param {int} pageNow 当前页码
   * @param {int} pageSize 页数
   */
  findGroups({
    groupName: groupName,
    groupCode: groupCode,
    pageNow: pageNow = PAGENOW,
    pageSize: pageSize = PAGESIZE,
  }) {
    return loginUser.get().then((user) => {
      return axios
        .post(`workflow://auth/group/list/${appKey}`, {
          groupName: groupName,
          groupCode: groupCode,
          pageNow: pageNow,
          pageSize: pageSize,
        })
        .then(res => res.data);
    })
  }

  /**
   * 6.启用工作组
   * @param {list} groupIds 工作组ID集合（唯一标识）
   */
  enableGroupsByIds({
    groupIds: groupIds,
  }) {
    return axios
      .put(`workflow://auth/group/enable/${appKey}`, {
        groupIds: groupIds,
      })
      .then(res => res.data);
  }

  /**
   * 7.禁用工作组
   * @param {list} groupIds 工作组ID集合（唯一标识）
   */
  disableGroupsByIds({
    groupIds: groupIds,
  }) {
    return axios
      .put(`workflow://auth/group/disable/${appKey}`, {
        groupIds: groupIds,
      })
      .then(res => res.data);
  }

  /**
   * 8.绑定工作组与人员列表关系
   * @param {string} groupId 工作组ID（唯一标识）
   * @param {list} userIds 工作流用户ID集合（唯一标识）
   */
  bindShipByGroupIdAndUserId({
    groupId: groupId,
    userIds: userIds,
  }) {
    return axios
      .put(`workflow://auth/group/bind/${appKey}`, {
        groupId: groupId,
        userIds: userIds,
      })
      .then(res => res.data);
  }

  /**
   * 9.删除工作组与人员列表关系
   * @param {string} groupId 工作组ID（唯一标识）
   * @param {list} userIds 工作流用户ID集合（唯一标识）
   */
  delShipByGroupIdAndUserId({
    groupId: groupId,
    userIds: userIds,
  }) {
    return axios
      .put(`workflow://auth/group/user/ship/del/${appKey}`, {
        groupId: groupId,
        userIds: userIds,
      })
      .then(res => res.data);
  }

  /**
   * 10.获取用户所属工作组集合
   * @param {string} userId 工作流用户ID
   */
  findGroupsByUserId() {
    return loginUser.get().then((user) => {
      let userid = WorkflowAuthServiceUserId(user)
      return axios
        .get(`workflow://auth/user/${userid}/groups/${appKey}`, {})
      .then(res => res.data);
    })
  }

  /**
   * 11.获取用户详情
   * @param {string} userId 工作流用户ID
   */
  findInfoByUserId({
    userId: userId,
  }) {
    return axios
      .get(`workflow://auth/user/${appKey}`, {
        userId: userId,
      })
      .then(res => res.data);
  }

  /**
   * 12.删除用户信息
   * @param {string} userId 工作流用户ID
   */
  delInfoByUserId({
    userId: userId,
  }) {
    return axios
      .delete(`workflow://auth/user/${appKey}`, {
        userId: userId,
      })
      .then(res => res.data);
  }

  /**
   * 13.获取部门（即组织）下用户集合
   * @param {string} user.entCode 企业编码
   * @param {string} orgCode 组织编码
   * @param {list} groupCodes 工作组编码集合 (非必需)
   */
  findUserByOrgCode({
    orgCode: orgCode,
    groupCodes: groupCodes = undefined,
  }) {
    return loginUser.get().then((user) => {
      return axios
        .post(`workflow://auth/user/org/groups/${appKey}`, {
          orgCode: orgCode,
          groupCodes: groupCodes,
        })
        .then(res => res.data);
    })
  }

  /**
   * 14.获取工作组下的用户集合
   * @param {string} user.entCode 企业编码
   * @param {string} groupCode 工作组编码
   * @param {list} groupCodes 工作组编码集合 (非必需)
   */
  findUserByGroupCode({
    groupCode: groupCode,
    groupCodes: groupCodes = undefined,
  }) {
    return loginUser.get().then((user) => {
      return axios
        .post(`workflow://auth/user/group/groups/${appKey}`, {
          groupCode: groupCode,
          groupCodes: groupCodes,
        })
        .then(res => res.data);
    })
  }

  /**
   * 15.获取企业组织架构
   * @param {string} user.entCode 企业编码
   */
  findOrgAll() {
    return loginUser.get().then((user) => {
      return axios
        .get(`workflow://auth/org/${appKey}`, {})
        .then(res => res.data);
    })
  }

  /**
   * 16.获取部门（即组织）下用户集合
   * @param {string} user.entCode 企业编码
   * @param {string} orgCode 组织编码
   */
  findUserOrgCode({
    orgCode: orgCode,
  }) {
    return loginUser.get().then((user) => {
      return axios
        .post(`workflow://auth/user/getByOrg/${appKey}`, {
          orgCode: orgCode,
        })
        .then(res => res.data);
    })
  }

  /**
   * 17.模糊查询用户列表
   * @param {string} user.entCode 企业编码
   * @param {string} name 名称
   */
  findUserByName({
    name: name,
  }) {
    return loginUser.get().then((user) => {
      return axios
        .post(`workflow://auth/user/getByName/${appKey}`, {
          name: name,
        })
        .then(res => res.data);
    })
  }

  /**
   * 18.解除指定工作组下的所有用户关系
   * @param {string} groupId 工作组ID（唯一标识）
   */
  delShipByGroupId({
    groupId: groupId,
  }) {
    return axios
      .put(`workflow://auth/group/ship/del/${appKey}`, {
        groupId: groupId,
      })
      .then(res => res.data);
  }

  /**
   * 19.维护指定工作组成员
   * @param {string} groupId 工作组ID（唯一标识）
   * @param {list} userIds 工作流用户ID集合（唯一标识）
   */
  maintainUser({
    groupId: groupId,
    userIds: userIds,
  }) {
    return axios
      .put(`workflow://auth/ship/maintain/${appKey}`, {
        groupId: groupId,
        userIds: userIds,
      })
      .then(res => res.data);
  }

  /**
   * 20.获取指定工作组下的所有用户集合
   * @param {string} groupId 工作组ID（唯一标识）
   */
  findUserByGroupId({
    groupId: groupId,
  }) {
    return axios
      .post(`workflow://auth/group/users/${appKey}`, {
        groupId: groupId,
      })
      .then(res => res.data);
  }
  /**
   * 21.获取工作组分页
   * @param {string} groupId 工作组ID（唯一标识）
   */
  getWorkGroupPage({
    groupName: groupName=undefined,
    groupCode: groupCode = undefined,
    PAGENOW: PAGENOW = PAGENOW,
    pageSize: pageSize = pageSize
  }) {
    return loginUser.get().then((user) => {
      return axios
        .post(`workflow://auth/group/list/${appKey}`, {
          groupName: groupName,
          groupCode: groupCode,
        })
        .then(res => res.data);
    })
  }
}
export default new WorkflowAuthService()
