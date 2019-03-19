import axios from "axios"
const appKey = window.sessionStorage.getItem("paas:cloud:platform:appKey");
//工作流-流程参数相关接口
class WorkflowParamService {
  /**
   * 1.添加自定义参数
   * 参数为数组，每一个元素是对象
   * {
      inputParam: inputParam,
      outParam: outParam,
      name: name,
      type: type,
      rev: rev = undefined,
      defaultVal: defaultVal,
      isConvert: isConvert,
      isSysDef: isSysDef,
    }
   * @param {string} modelId 流程模型ID
   * @param {string} inputParam 入参
   * @param {string} outParam 出参
   * @param {string} name 名称
   * @param {string} type 类型
   * @param {string} rev 版本 (非必需)
   * @param {string} defaultVal 默认值
   * @param {string} isConvert 是否转换
   * @param {string} isSysDef	 是否系统参数（true/false）
   */
  save(modelId, param) {
    return axios
      .post(`workflow://param/${modelId}/${appKey}`, param)
      .then(res => res.data);
  }

  /**
   * 2.编辑自定义参数
   * 参数为数组，每一个元素是对象
   *{
      inputParam: inputParam,
      outParam: outParam,
      name: name,
      type: type,
      rev: rev,
      defaultVal: defaultVal,
      isConvert: isConvert,
      isSysDef: isSysDef,
    }
   * @param {string} modelId 流程模型ID
   * @param {string} inputParam 入参
   * @param {string} outParam 出参
   * @param {string} name 名称
   * @param {string} type 类型
   * @param {string} rev 版本 (非必需)
   * @param {string} defaultVal 默认值
   * @param {string} isConvert 是否转换
   * @param {string} isSysDef	 是否系统参数（true/false）
   */
  update({
    modelId: modelId,
    inputParam: inputParam,
    outParam: outParam,
    name: name,
    type:type,
    rev: rev=undefined,
    defaultVal: defaultVal,
    isConvert: isConvert,
    isSysDef: isSysDef
  }) {
    return axios
      .put(`workflow://param/${modelId}/${appKey}`, {
        modelId: modelId,
        inputParam: inputParam,
        outParam: outParam,
        name: name,
        type: type,
        rev: rev,
        defaultVal: defaultVal,
        isConvert: isConvert,
        isSysDef: isSysDef
      })
      .then(res => res.data);
  }

  /**
   * 3.删除自定义参数
   * @param {string} modelId 流程模型ID
   */
  delByModelId({
    modelId: modelId,
  }) {
    return axios
      .delete(`workflow://param/del/${modelId}/${appKey}`, {})
      .then(res => res.data);
  }

  /**
   * 获取自定义参数集合
   * @param {string} modelId 流程模型ID
   */
  findAllByModelId({
    modelId: modelId,
  }) {
    return axios
      .get(`workflow://param/${modelId}/${appKey}`, {})
      .then(res => res.data);
  }
}

export default new WorkflowParamService()
