import { object } from "../common/index.js";

export class CRUD {
  constructor(fields = [], types = [], formTpl = {}) {
    this.booleanFields = fields;
    this.types = types;
    this.formTpl = formTpl;
  }
  /**
   * 将编辑的数据转换成更新接口需要的参数对象
   */
  transData2UpdateParams(data) {
    var newObj = { id: data.id };
    Object.keys(this.formTpl).forEach(function(key) {
      newObj[key] = data[key];
    });
    return object.boolean2Type(newObj, this.booleanFields, this.types);
  }

  /**
   * 将添加的表单数据转换成新增接口需要的参数对象
   */
  transData2AddParams(data) {
    return object.boolean2Type(data, this.booleanFields, this.types);
  }
}
