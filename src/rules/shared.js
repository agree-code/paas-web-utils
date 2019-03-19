const CONDITION_TYPE_ENUM = {
  GT: 1,
  LT: 2,
  EQ: 3,
  GE: 4,
  LE: 5,
  CONTAIN: 6,
  NEQ: 7
}
/**
 * 视图条件校验
 * @param columnValue 字段值
 * @param conditionType 视图条件类型
 * @param conditionValue 视图条件值
 * @return true 满足条件，false 不满足条件
 */
export const validateCondition = function( columnValue, conditionType, conditionValue ) {
  let result = false;
  switch (parseInt(conditionType)) {
    case CONDITION_TYPE_ENUM.LE:
      result = columnValue <= conditionValue;
      break;

    case CONDITION_TYPE_ENUM.GE:
      result = columnValue >= conditionValue;
      break;
    case CONDITION_TYPE_ENUM.GT:
      result = columnValue > conditionValue;
      break;
    case CONDITION_TYPE_ENUM.LT:
      result = columnValue < conditionValue;
      break;
    case CONDITION_TYPE_ENUM.CONTAIN:
      result = !columnValue ? false : columnValue.indexOf(conditionValue) !== -1;
      break;
    case CONDITION_TYPE_ENUM.NEQ:
      result = columnValue != conditionValue;
      break;
    case CONDITION_TYPE_ENUM.EQ:
    default:
      result = columnValue == conditionValue;
      break;
  }
  return result;
};
/**
 * 系统内置字段(部门)，和数据权限有相关性
 */
export const SYS_ORG = "SYS_ORG";
/**
 * 系统内置字段编码，所属部门
 */
export const ORG_CODE = "ORG_CODE";
/**
 * 系统内置数据(系统部门集合)，和数据权限有相关性
 */
export const SYS_ORG_LIST = "SYS_ORG_LIST";
/**
 * 系统内置字段编码，负责人
 */
export const OWNER_ID = "OWNER_ID";

// -----------------------------黄金分割线：私有属性---------------------------------

/**
 * 私有属性：ID
 */
export const _id = Symbol("ID");
export const _view = Symbol("View");
export const _bindColumns = Symbol("BindColumns");
export const _targetColumnIds = Symbol("TargetColumnIds");
export const _handlerFn = Symbol("HandlerFunction");
export const _viewData = Symbol("ViewData");
export const _viewGroupData = Symbol("ViewGroupData");
export const _renderData = Symbol("RenderData");
export const _recordId = Symbol("RecordId");
export const _columnMap = Symbol("ColumnMap");
export const _operations = Symbol("Operations");
export const _operationMap = Symbol("OperationMap");
export const _viewFormulas = Symbol("ViewFormulas");
export const _viewRules = Symbol("ViewRules");
export const _viewRule = Symbol("ViewRule");
export const _operatioRules = Symbol("OperatioRules");

