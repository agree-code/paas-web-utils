import axios from "axios"
import {CRUD} from './shared';
class columnService extends CRUD{
  constructor() {
    let booleanFields = [
      "isProcess",
      "dpEnable",
      "isDataSharing",
      "isCustomField"
    ];
    let types = ["string"];
    let formTpl = {
      FieldName: "",
      FieldCode: "",
      dpEnable: true,
      isDataSharing: false,
      isCustomField: false,
      isProcess: false,
      description: ""
    };
    super(booleanFields, types, formTpl);
  }
  // findFields(params) {
  //   //查询当前模块可搜索字段列表
  //   return axios.post("platform://custom/C01011", params).then(res => res.data);
  // }
  /**
   * 查询所有字段列表（分页查询）
   * @param {*} params 
   */
  findFieldsByPage(params){
    return axios.post("platform://custom/C01002",params).then(res=>res.data);
  }
  addField(params) {
    // var formData = this.transData2AddParams(params);
    return axios.post("platform://custom/C01001", params).then(res => res);
  }
  updateField(params) {
    // var formData = this.transData2UpdateParams(params);
    return axios.post("platform://custom/C01003", params).then(res => res);
  }
  deleteField(params) {
    return axios.post("platform://custom/C01006", params).then(res => res);
  }
  findFieldById(params) {
    return axios.post("platform://custom/C01005", params).then(res => res.data);
  }
  /**
   * 根据模块id查询当前模块下的字段信息
   * @param {*} params 
   */
  findFieldsByModuleId({moduleId:moduleId}){
    return axios.post("platform://custom/C01023", { moduleId: moduleId }).then(res=>res.data[0].columnList);
  }
  /**
   * 根据视图id获取视图查询字段
   * @param {long} viewId 视图ID
   */
  findByViewId({ viewId: viewId }) {
    return axios
      .post(`platform://custom/C01017`, {
        viewId: viewId
      })
      .then(res => res.data);
  }
   /**
   * 根据视图id获取视图包含字段
   * @param {long} viewId 视图ID
   */
  findColumnByViewId({ viewId: viewId }) {
    return axios
      .post(`platform://custom/C01016`, {
        viewId: viewId
      })
      .then(res => res.data);
  }

  findById({ columnId: columnId, moduleId: moduleId = undefined }) {
    return axios
      .post("platform://custom/C01005", {
        columnId: columnId,
        moduleId: moduleId
      })
      .then(res => res.data);
  }
  /**
   * 根据模块Id查询可搜索字段数据
   * @param {*} moduleId 模块Id
   */
  findSearchByModuleId(moduleId) {
    return axios
      .post("platform://custom/C01011", { moduleId })
      .then(res => res.data);
  }
  //查询字段约束集合
  findConstraint(params){
    return axios
      .post("platform://custom/C13001", params)
      .then(res => res.data);
  }
  //新增字段约束集合
  addConstraint(params){
    return axios
      .post("platform://custom/C13002", params)
      .then(res => res.data);
  }
  //字段编码唯一校验
  checkColumnCode(params){
    return axios
      .post("platform://custom/C01015", params)
      .then(res => res.data);
  }
  //获取关联模块
  findRelatedModule(params){
    return axios
    .post("platform://custom/C03003", params).then(res => res.data);
  }
}

export default new columnService();
