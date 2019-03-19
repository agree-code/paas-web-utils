import axios from "axios"
class EntService {
  //查询企业信息
  findEnterpriseData(params) {
    return axios.post("platform://org/O01001", params)
      .then(res => res.data);
  }
  //更新企业信息
  updateEnterpriseData(params) {
    return axios.post("platform://org/O01002", params)
      .then(res => res.data);
  }
}
export default new EntService();
