import axios from "axios"

class dictionaryService{
  /**
   * 查询字典集合
   * @param 
   * {"isFindAll":1,//是否查询全部:1,全部，0，非全部
    "dictType":"",//字典类型
    "dictIdList":"",
    "ownParentFlag":"",//是否包含当前父节点
    "condition":""
    "dictParentCode"//父节点编码
   } params 
   */
  findDictionaries(params) {
    return axios.post("platform://base/B03008", params).then(res => res.data);
  }
  //查询分页字典
  findDictionariesPage(params) {
    return axios.post("platform://base/B03009", params).then(res => res.data);
  }
  //新增字典
  addDictionary(params){
    return axios.post("platform://base/B03003", params).then(res => res.data);
  }
  //更新字典
  editDictionary(params){
    return axios.post("platform://base/B03004", params).then(res => res.data);
  }
  //删除字典
  removeDictionary(params){
    return axios.post("platform://base/B03005", params).then(res => res.data);
  }
  //字典编码唯一校验
  checkDictCode(params){
    return axios.post("platform://base/B03011", params).then(res => res.data);
  }
 
}
export default new dictionaryService()