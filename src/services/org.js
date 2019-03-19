import axios from "axios"
class OrgService{
  //查询所有部门组织架构
  findOrgList(){
    return axios
    .post("platform://org/O02006", {
      orgParentCode: 0
    }).then(res => res.data);
  }
  //根据部门ID查询部门信息
  findOrgListById(orgId,orgCode,extCode){
    return axios
    .post("platform://org/O02004", {
      "orgId": orgId,
      "orgCode":orgCode,
      "extCode":extCode,
    }).then(res => res.data);
  }
  //新增部门
  addOrg(orgName,orgDesc,orgParentCode){
    return axios
    .post("platform://org/O02001", {
      "orgName":orgName, 
      "orgDesc":orgDesc, 
      "orgParentCode":orgParentCode,
    }).then(res => res.data);
  }
  //修改部门信息
  editOrg(orgId,orgName,orgDesc){
    return axios
    .post("platform://org/O02002", {
      "orgId":orgId,
      "orgName":orgName, 
      "orgDesc":orgDesc, 
    }).then(res => res.data);
  }
  //删除部门
  removeOrg(orgId){
    return axios
    .post("platform://org/O02003", {
      "orgId":orgId,
    }).then(res => res.data);
  }

}
export default new OrgService()