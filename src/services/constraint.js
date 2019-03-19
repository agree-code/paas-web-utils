import axios from "axios"
import {CRUD} from './shared';
class constraintService extends CRUD{
  constructor() {
    let booleanFields = [
    ];
    let types = ["string"];
    let formTpl = {
    };
    super(booleanFields, types, formTpl);
  }
  /**
   * 查询约束集合
   * @param {*} params 
   */
  findConstraints(params) {
    return axios.post("platform://custom/C13001", params).then(res => res.data);
  }
 
}
export default new constraintService()