import axios from "axios"
class operationService{
  //新增操作
  addOperation(params){
    return axios
    .post("platform://custom/C04001", params).then(res => res.data);
  }
  //更新操作
  editOperation(params){
    return axios
    .post("platform://custom/C04003", params).then(res => res.data);
  }
  //删除操作
  removeOperation(params){
    return axios
    .post("platform://custom/C04002", params).then(res => res.data);
  }
  //查询操作分页
  findOperationPage(params){
    return axios
    .post("platform://custom/C04005", params).then(res => res.data);
  }
  //查询单个操作
  findOperationDetail(params){
    return axios
    .post("platform://custom/C04004", params).then(res => res.data);
  }

}
export default new operationService()