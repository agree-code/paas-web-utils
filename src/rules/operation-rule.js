import {
  validateCondition,
  _view
} from "./shared";
import GlobalUid from "./global-uid";
const _operationRuleData = Symbol("OperationRuleData");
/**
 * 操作条件
 */
class OperationRule {

  constructor(operationRuleData, view) {
    this['_puid'] = GlobalUid.get();
    this[_view] = view;
    this[_operationRuleData] = operationRuleData;
    view.$on("destroyed", () => {
      delete this[_view];
      delete this[_operationRuleData];
    });
    console.log(this[_operationRuleData].ruleName, "OperationRule", this);
  }

  get $id() {
    return this[_operationRuleData].id;
  }

  get operationId() {
    return this[_operationRuleData].affectOperationId;
  }

  get operationRuleConditions() {
    return this[_operationRuleData].operationRuleConditions || [];
  }

  handler(columnMap) {
    let ts = this;
    return function HANDLER(rowDatas) {
      let status = false;
      let ruleConditions = ts.operationRuleConditions;
      for (var index in rowDatas) {
        let rowData = rowDatas[index] || {};
        for (let i in ruleConditions) {
          let ruleCondition = ruleConditions[i];
          let column = columnMap[ruleCondition.sourceColumnId] || {};
          let value = rowData[column.valKey];
          // if(!value) {
          //   //若操作相关字段没有值，则将操作都隐藏
          //   status = true
          // }else {
          //   status = validateCondition(value, ruleCondition.conditionType, ruleCondition.conditionValue);
          // }
          if(!value && value !== 0) {
            value = ''
          }
          status = validateCondition(value, ruleCondition.conditionType, ruleCondition.conditionValue);
          // status = true 满足条件
          if (status) {
            break;
          }
        }
        if (status) {
          break;
        }
      }
      return status;
    };
  }

  bindEventToViewOperation(operationMap, columnMap) {
    let operation = operationMap[this.operationId];
    if (operation) {
      operation.rules || (operation.rules = []);
      operation.rules.push(this.handler(columnMap));
    }
  }
}

export default OperationRule;
