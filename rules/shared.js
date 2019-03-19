"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CONDITION_TYPE_ENUM = {
  GT: 1,
  LT: 2,
  EQ: 3,
  GE: 4,
  LE: 5,
  CONTAIN: 6,
  NEQ: 7
  /**
   * 视图条件校验
   * @param columnValue 字段值
   * @param conditionType 视图条件类型
   * @param conditionValue 视图条件值
   * @return true 满足条件，false 不满足条件
   */
};var validateCondition = exports.validateCondition = function validateCondition(columnValue, conditionType, conditionValue) {
  var result = false;
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
var SYS_ORG = exports.SYS_ORG = "SYS_ORG";
/**
 * 系统内置字段编码，所属部门
 */
var ORG_CODE = exports.ORG_CODE = "ORG_CODE";
/**
 * 系统内置数据(系统部门集合)，和数据权限有相关性
 */
var SYS_ORG_LIST = exports.SYS_ORG_LIST = "SYS_ORG_LIST";
/**
 * 系统内置字段编码，负责人
 */
var OWNER_ID = exports.OWNER_ID = "OWNER_ID";

// -----------------------------黄金分割线：私有属性---------------------------------

/**
 * 私有属性：ID
 */
var _id = exports._id = Symbol("ID");
var _view = exports._view = Symbol("View");
var _bindColumns = exports._bindColumns = Symbol("BindColumns");
var _targetColumnIds = exports._targetColumnIds = Symbol("TargetColumnIds");
var _handlerFn = exports._handlerFn = Symbol("HandlerFunction");
var _viewData = exports._viewData = Symbol("ViewData");
var _viewGroupData = exports._viewGroupData = Symbol("ViewGroupData");
var _renderData = exports._renderData = Symbol("RenderData");
var _recordId = exports._recordId = Symbol("RecordId");
var _columnMap = exports._columnMap = Symbol("ColumnMap");
var _operations = exports._operations = Symbol("Operations");
var _operationMap = exports._operationMap = Symbol("OperationMap");
var _viewFormulas = exports._viewFormulas = Symbol("ViewFormulas");
var _viewRules = exports._viewRules = Symbol("ViewRules");
var _viewRule = exports._viewRule = Symbol("ViewRule");
var _operatioRules = exports._operatioRules = Symbol("OperatioRules");