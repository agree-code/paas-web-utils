import axios from "axios"
import loginUser from "../services/login-user";
import View from "./view";
import ListView from "./list-view";
import {
  columnService
} from "../services";
import dict from "./dict";
import {
  validateCondition,
  ORG_CODE,
  SYS_ORG,
  SYS_ORG_LIST,
  OWNER_ID
} from "./shared";
import {
  _view,
} from "./shared";

import {
  COLUMN_ENUM,
  CONDITION_TYPE
} from "./enum";
import { HTTP_CONFIG } from "../common/http.js";

const getDate = function (val, type) {
  let value = new Date(val);
  let seconds = value.getSeconds();
  let minutes = value.getMinutes();
  let hours = value.getHours();
  let months = value.getMonth() + 1;
  let days = value.getDate();
  let second, minute, hour, month, day;
  if (seconds < 10) {
    second = "0" + seconds;
  } else {
    second = seconds;
  }
  if (minutes < 10) {
    minute = "0" + minutes;
  } else {
    minute = minutes;
  }
  if (hours < 10) {
    hour = "0" + hours;
  } else {
    hour = hours;
  }
  if (months < 10) {
    month = "0" + months;
  } else {
    month = months;
  }
  if (days < 10) {
    day = "0" + days;
  } else {
    day = days;
  }
  switch (type) {
    case 1:
      return `${value.getFullYear()}-${month}-${day} ${hour}:${minute}`;
    case 2:
      return `${value.getFullYear()}-${month}-${day}`;
    case 3:
      return `${value.getFullYear()}-${month}`;
    case 4:
      return `${value.getFullYear()}-01`;
  }
}

const _dataRelationColumn = Symbol("DataRelationColumn");
const _dataShowColumn = Symbol("DataShowColumn");
const _foreignKeyView = Symbol("ForeignKeyView");
const _columnData = Symbol("ColumnData");
const _moduleRelated = Symbol("ModuleRelated");

class Column {

  get $id() {
    return this.columnData.id;
  }

  get label() {
    return this.columnData.columnName
  }

  get moduleId() {
    return this.columnData.moduleId
  }

  get moduleCode() {
    return this.columnData.moduleCode
  }
  /**
   * 所属视图信息
   */
  get view() {
    return this[_view];
  }
  /**
   * 字段接口返回数据
   */
  get columnData() {
    return this[_columnData] || {};
  }

  get columnCode() {
    return this.columnData.columnCode;
  }
  /**
   * 转换只读数据
   */
  get readonlyScope() {
    let _readonlyScope = `,${this.columnData.readonlyScope || ""},`;
    let readonlyScope = [];
    if (_readonlyScope.indexOf(",0,") >= 0) {
      // 新增页面
      readonlyScope.push(2);
      readonlyScope.push(7);
    }
    if (_readonlyScope.indexOf(",1,") >= 0) {
      // 修改页面
      readonlyScope.push(3);
      readonlyScope.push(8);
    }
    return `,${readonlyScope.join(",")},`;
  }

  /**
   * 外键字段信息
   */
  get relatedData() {
    if (this.view && this.view.renderData.moduleRelateds) {
      return this.view.renderData.moduleRelateds[this.columnCode];
    } else {
      return this[_moduleRelated] || {};
    }
  }
  /**
   * 其他调用时数据配置
   */
  static get relatedDataKey(){
    return _moduleRelated;
  }

  /**
   * 字段条件类型集合
   * TODO: 需要优化选项
   */
  get conditionTypes() {
    let conditionTypes = [];
    switch (this.type) {
      case COLUMN_ENUM.TEXT_INPUT:
      case COLUMN_ENUM.TEXT_LONG_INPUT:
      case COLUMN_ENUM.TEXT_AREA:
        conditionTypes.push(CONDITION_TYPE.EQ);
        conditionTypes.push(CONDITION_TYPE.NEQ);
        if (this.isMoney || this.isNumber) {
          conditionTypes.push(CONDITION_TYPE.GT);
          conditionTypes.push(CONDITION_TYPE.GTE);
          conditionTypes.push(CONDITION_TYPE.LT);
          conditionTypes.push(CONDITION_TYPE.LTE);
        } else {
          conditionTypes.push(CONDITION_TYPE.LIKE);
        }
        break;
      case COLUMN_ENUM.FILE:
      case COLUMN_ENUM.IMAGE:
        conditionTypes.push(CONDITION_TYPE.EQ);
        conditionTypes.push(CONDITION_TYPE.NEQ);
        break;
      case COLUMN_ENUM.RADIO:
      case COLUMN_ENUM.RADIO_GROUP:
      case COLUMN_ENUM.CHECKBOX:
      case COLUMN_ENUM.CHECKBOX_GROUP:
      case COLUMN_ENUM.SELECT:
        conditionTypes.push(CONDITION_TYPE.EQ);
        conditionTypes.push(CONDITION_TYPE.NEQ);
        conditionTypes.push(CONDITION_TYPE.LIKE);
        break;
      case COLUMN_ENUM.TIME:
      case COLUMN_ENUM.DATE:
      case COLUMN_ENUM.DATETIME:
        conditionTypes.push(CONDITION_TYPE.EQ);
        conditionTypes.push(CONDITION_TYPE.NEQ);
        conditionTypes.push(CONDITION_TYPE.GTE);
        conditionTypes.push(CONDITION_TYPE.LTE);
        conditionTypes.push(CONDITION_TYPE.BETWEEN);
        conditionTypes.push(CONDITION_TYPE.CUSTOM);
        break;
      case COLUMN_ENUM.RELATED_SELECT:
      case COLUMN_ENUM.FOREIGNKEY:
      case COLUMN_ENUM.DATA_SELECT:
      case COLUMN_ENUM.USER_SELECT:
      case COLUMN_ENUM.DEPT_SELECT:
        conditionTypes.push(CONDITION_TYPE.EQ);
        conditionTypes.push(CONDITION_TYPE.NEQ);
        conditionTypes.push(CONDITION_TYPE.LIKE);
        break;
    }
    return conditionTypes;
  }


  /**
   * 数据依赖模块Id
   */
  get dataRelationModuleId() {
    if (this.isOtherModuleRelated) {
      return this.moduleId;
    } else if (this.isRelated) {
      return this.columnData.relyModuleId;
    } else if (this.columnCode === ORG_CODE && this.type === COLUMN_ENUM.DEPT_SELECT) {
      return `${SYS_ORG}_${this.moduleId}`;
    }
    return undefined;
  }
  /**
   * 新增关联模块数据依赖模块Id(其他视图跳转调用)
   */
  get insertDataRelationModuleId() {
    let dataRelationModuleId = this.dataRelationModuleId;
    if (!dataRelationModuleId && this.isForeignKey) {
      dataRelationModuleId = this.relatedData.relModuleId;
    }
    return dataRelationModuleId;
  }

  get createdEventName(){
    return `created`;
  }

  get updateEventName(){
    return `${this.valKey}.update`;
  }

  get destroyedEventName(){
    return "destroyed";
  }

  /**
   * 获取字段依赖关系字段
   */
  dataRelationColumn() {
    return this.handlerDataRelationColumn();
  }
  /**
   * 数据显示字段
   */
  dataShowColumn(){
    // TODO: 数据显示字段
    if(this[_dataShowColumn]) return Promise.resolve(this[_dataShowColumn]);
    if(!this.isOtherModuleRelated) return this.dataRelationColumn();
    let moduleId = undefined;
    let columnId = undefined;
    if (this.isForeignKey) {
      moduleId = this.relatedData.relModuleId;
      columnId = this.relatedData.showColumnId;
    } else if (this.isChosenData) {
      moduleId = this.columnData.selectModuleId;
      columnId = this.columnData.selectShowColId;
    }
    if(!moduleId) return Promise.reject();
    if(this['[[DataShowColumnPromise]]']) return this['[[DataShowColumnPromise]]'];
    this['[[DataShowColumnPromise]]'] = columnService.findById({
      columnId,
      moduleId
    }).then((columnData) => {
      this[_dataShowColumn] = new Column();
      this[_dataShowColumn].render(columnData);
      delete this['[[DataShowColumnPromise]]'];
      return this[_dataShowColumn];
    });
    return this['[[DataShowColumnPromise]]'];
  }

  get unit() {
    return this.columnData.columnUnit;
  }

  get gridLabel() {
    if (this.unit) {
      return `${this.label}(${this.unit})`;
    }
    return this.label;
  }

  get gridKey() {
    return `${this.moduleCode}.${this.columnData.phyColumnName}`;
  }

  /**
   * 触发改变事件
   */
  triggerChange(formModel) {
    if (this.isForeignKey) {
      let foreignKeyView = this.foreignKeyView();
      foreignKeyView.then(listView => {
        let currentModuleIds = listView['currentModuleIds']();
        let relationViewId = !this.view.flag ? this.relatedData.showViewId : this.relatedData.showMobileViewId
        this.view.triggerRelation({
          sourceColumn: this.label,
          sourceColumnId: this.$id,
          // relationViewId: this.relatedData.showViewId,
          relationViewId: relationViewId,
          relationId: formModel[this.valKey],
          relationModuleId: `,${currentModuleIds.join(",")},`
        });
      });
    } else if (this.columnCode === OWNER_ID && this.type === COLUMN_ENUM.USER_SELECT) {
      this.view.triggerRelation({
        sourceColumn: this.label,
        sourceColumnId: this.$id,
        relationViewId: SYS_ORG_LIST,
        relationId: formModel[this.valKey],
        relationModuleId: `${SYS_ORG}_${this.moduleId}`
      });
    }
    this.view.$emit(this.updateEventName, this, formModel);
  }

  /**
   * 添加触发事件
   * @param type 事件类型
   * @param fn 事件回调函数
   */
  addEventListener(type, fn) {
    if (type === "change") type = "update";
    if (type === "created" || type === "destroyed") {
      this.view.addEventListener(type, (view) => {
        // 求当前字段分组
        fn(this, view.findViewGroupByColumnId(this.$id).formModel);
      });
    } else {
      this.view.$on(`${this.valKey}.${type}`, fn);
    }
  }

  /**
   * 删除触发事件
   * @param type 事件类型
   * @param fn 事件回调函数
   */
  removeEventListener(type, fn) {
    if (type === "change") type = "update";
    if (type === "created" || type === "destroyed") {
      this.view.removeEventListener(type, fn);
    } else {
      this.view.$off(`${this.view.eventKey}.${this.valKey}.${type}`, fn);
    }
  }

  triggerShowValueChanage(value) {
    if (this.view) {
      this.view.findViewGroupByColumnId(this.$id).formModel[this.showValKey] = value;
    }
  }

  render(columnData, view = undefined) {
    this.handlerBashColumn(columnData, view);
    // 处理字段类型
    this.handlerColumnType();
    // 处理字段信息
    this.handlerColumnDataKey();
    // 处理字段数据源
    this.handlerColumnDatasource();
  }

  handlerBashColumn(columnData, view){
    this[_columnData] = columnData;
    this[_view] = view;
    // 公共属性
    this.type = undefined;
    this.placeholder = undefined;

    this.fromSubmitKey = undefined;
    this.valKey = undefined;
    this.showValKey = undefined;
    this.rules = [];
    this.datasource = {};
    this.full = false;

    this.isRequired = false; // 是否必填
    this.isMultiple = false; // 是否多选
    this.isMoney = false; // 金额字段
    this.isNumber = false; // 数字字段
    this.isForeignKey = false; // 外键选择
    this.isDict = false; // 是否为字典字段
    this.isRelated = false; // 字段依赖
    this.isOtherModuleRelated = false; // 其他模块字段依赖
    this.isChosenData = false; // 数据选择
    this.readonly = false;
    this.hidden = false;
    this.componentRender = false; // 委派组件渲染函数

    this.isHighlight = false; // 是否高亮
    // 其他属性
    if (this[_foreignKeyView] && this[_foreignKeyView].$destroy) {
      this[_foreignKeyView].$destroy();
    }
    delete this[_foreignKeyView];
    delete this[_dataRelationColumn];
    delete this[_moduleRelated];
  }

  foreignKeyView() {
    if (this[_foreignKeyView] instanceof ListView) {
      return Promise.resolve(this[_foreignKeyView]);
    } else if(this['_loadingForeignKeyView()']){
      return this['_loadingForeignKeyView()'];
    } else if (this.isForeignKey || this.isChosenData) {
      // let viewId = this.isForeignKey ? this.relatedData.showViewId : this.columnData.selectViewId;
      let viewId = undefined
      // 移动端获取数据
      if(this.view.flag === 1){
        viewId = this.isForeignKey ? this.relatedData.showMobileViewId : this.columnData.mobileSelectViewId;
      } else {
        viewId = this.isForeignKey ? this.relatedData.showViewId : this.columnData.selectViewId;
      }
      if (viewId == -1) {
        this[_foreignKeyView] = {};
        return Promise.resolve(this[_foreignKeyView]);
      }
      let foreignKeyView = new ListView();
      this['_loadingForeignKeyView()'] = foreignKeyView.dialogRender(viewId).then(view => {
        this[_foreignKeyView] = view;
        // 替换view 数据源 信息
        let datasource = view.datasource;
        delete datasource.searchList;
        delete this['_loadingForeignKeyView()'];
        view.datasource = Object.assign(this.datasource, datasource);
        return view;
      });
      return this['_loadingForeignKeyView()'];
    }
    return Promise.resolve({});
  }

  /**
   * 委派渲染
   * @param fn 渲染函数(jsx写法)
   * @example https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage
   */
  appointRender(fn) {
    this.componentRender = fn || false;
  }

  /**
   * 处理字段数据Key
   */
  handlerColumnDataKey() {
    let column = this;
    let columnData = column.columnData;
    let suffix = "";
    if (this.isForeignKey) {
      suffix = "_RNAME";
    } else if (this.isChosenData) {
      suffix = "_SDNAME";
    } else if (this.isDict) {
      suffix = "_DNAME";
    } else if (columnData.colMark == "DEPARTMENT") {
      if (columnData.showColValSet == 3) {
        // 部门
        suffix = "_ONAME";
      } else if (columnData.showColValSet == 4) {
        // 用户
        suffix = "_UNAME";
      } else if (columnData.showColValSet == 5) {
        //TODO: 角色信息未完善
      }
    }
    // 表单数据Key
    column.fromSubmitKey = `obj.${columnData.phyColumnName}`;
    if (this.view && columnData.moduleId != this.view.moduleId) {
      column.fromSubmitKey = `${columnData.moduleCode}.${
        columnData.phyColumnName
      }`;
    }
    // 数据值Key
    column.valKey = columnData.moduleCode + "_" + columnData.phyColumnName;
    // 可读数据值Key
    column.showValKey = columnData.moduleCode + "_" + columnData.phyColumnName + suffix;
  }
  /**
   * 处理字段类型
   */
  handlerColumnType() {
    let column = this;
    let columnData = column.columnData;
    let type = COLUMN_ENUM.TEXT_INPUT;
    switch (Number(columnData.showType)) {
      case 1:
        switch (columnData.colMark) {
          case "AUTOCODE":
            type = COLUMN_ENUM.TEXT_INPUT;
            column.readonly = true;
            break;
          case "MONEY":
            type = COLUMN_ENUM.TEXT_INPUT;
            column.isMoney = true;
            break;
          case "NUMBER":
            type = COLUMN_ENUM.TEXT_INPUT;
            column.isNumber = true;
            break;
          case "FOREIGNKEY":
            type = COLUMN_ENUM.FOREIGNKEY;
            column.isForeignKey = true;
            break;
          case "RELATED":
            type = COLUMN_ENUM.RELATED_SELECT;
            column.isRelated = true;
            break;
          default:
            type = COLUMN_ENUM.TEXT_INPUT;
            break;
        }
        break;
      case 2:
        type = COLUMN_ENUM.RADIO_GROUP;
        this.isDict = true;
        break;
      case 3:
        type = COLUMN_ENUM.CHECKBOX_GROUP;
        column.isMultiple = true;
        this.isDict = true;
        break;
      case 4:
        type = COLUMN_ENUM.SELECT;
        this.isDict = true;
        break;
      case 5:
        type = COLUMN_ENUM.TEXT_AREA;
        break;
      case 6:
        switch (String(columnData.dateType).toUpperCase()) {
          case "DATE":
            type = COLUMN_ENUM.DATE;
            break;
          case "TIME":
            type = COLUMN_ENUM.TIME;
            break;
          case "YEAR":
            type = COLUMN_ENUM.YEAR;
            break;
          case "YEAR_MONTH":
            type = COLUMN_ENUM.YEAR_MONTH;
            break;
          case "MONTH":
            type = COLUMN_ENUM.MONTH;
            break;
          case "MONTH_DAY":
            type = COLUMN_ENUM.MONTH_DAY;
            break;
          case "DATETIME":
          default:
            type = COLUMN_ENUM.DATETIME;
            break;
        }
        break;
      case 7:
        switch (columnData.colMark) {
          case "CHOSENDATA":
            type = COLUMN_ENUM.DATA_SELECT;
            column.isChosenData = true;
            column.isMultiple = Boolean(columnData.isMoreData);
            break;
          case "DEPARTMENT":
            switch (Number(columnData.showColValSet)) {
              case 3:
                type = COLUMN_ENUM.DEPT_SELECT;
                break;
              case 4:
                type = COLUMN_ENUM.USER_SELECT;
                column.isMultiple = Boolean(columnData.isMoreData);
                break;
              case 5:
                break;
            }
            break;
        }
        
        break;
      case 8:
        type = COLUMN_ENUM.FILE;
        break;
      case 9:
        type = COLUMN_ENUM.IMAGE;
        break;
      case 10:
        type = COLUMN_ENUM.TEXT_AREA;
        break;
      case 50:
        type = COLUMN_ENUM.TEXT_LONG_INPUT;
        break;
    }
    column.placeholder = columnData.fieldIptPrompt || type.placeholder(columnData.columnName);
    let viewData = (column.view || {}).viewData;
    if (viewData && column.moduleId !== viewData.moduleId) {
      column.isOtherModuleRelated = true;
    }
    // 判断是否为依赖字段
    column.isRelated = Boolean(columnData.relyModuleId);
    column.full = type.full;
    return (column.type = type);
  }
  /**
   * 添加字段默认事件
   */
  handlerColumnDefaultEvent() {
    // 添加字段创建事件
    this.addEventListener("created", (column, formModel) => {
      //详情页不进行默认值的赋值
      if(this.view && this.view.type === 'detail') {
        return;
      }
      if (Boolean(this.columnData.defaultVal) && this.columnData.defaultVal !== null && this.columnData.colMark == "DATE") {
        let date;
        switch (this.columnData.defaultVal) {
          case "$YY-$MN-$DD $HH:$MM":
            date = getDate(new Date(), 1);
            date = new Date(Date.parse(date.replace(/-/g, "/")));
            date = date.getTime();
            break;
          case "$YY-$MN-$DD":
            date = getDate(new Date(), 2);
            date = new Date(Date.parse(date.replace(/-/g, "/")));
            date = date.getTime();
            break;
          case "$YY-$MN":
          case "$MN":
            date = getDate(new Date(), 3);
            date = new Date(Date.parse(date.replace(/-/g, "/")));
            date = date.getTime();
            break;
          case "$YY":
            date = getDate(new Date(), 4);
            date = new Date(Date.parse(date.replace(/-/g, "/")));
            date = date.getTime();
            break;
          default:
            date = new Date().getTime();
        }
        View.$set(formModel, column.valKey, date);
      } else if (Boolean(this.columnData.defaultVal) && this.columnData.defaultVal !== null) {
        View.$set(formModel, column.valKey, this.columnData.defaultVal);
      }
      // 判断如果是 部门选择 默认值为当前用户部门
      if (this.columnCode === ORG_CODE && this.type === COLUMN_ENUM.DEPT_SELECT) {
        loginUser.get().then(user => {
          if (!formModel[column.valKey]) {
            View.$set(formModel, column.valKey, user.orgCode);
          }
        });
      }
      // 如果为负责人则默认为当前用户
      if (this.columnCode === OWNER_ID && this.type === COLUMN_ENUM.USER_SELECT) {
        loginUser.get().then(user => {
          if (!formModel[column.valKey]) {
            View.$set(formModel, column.valKey, user.userId);
          }
        });
      }
    });
  }


  /**
   * 处理字段只读配置
   */
  handlerColumnReadonly() {
    let columnData = this.columnData;
    let view = this.view;
    let readonly = false;
    if (this.readonlyScope.indexOf(`,${view.typeNum},`) >= 0) {
      readonly = true;
    } else if (columnData.moduleId !== view.moduleId) {
      readonly = `,${view.viewData.editRelatedModule},`.indexOf(`,${this.moduleId},`) < 0;
    }
    View.$set(this, "readonly", readonly);
  }
  /**
   * 处理字段默认隐藏信息
   */
  handlerColumnHidden() {
    let column = this;
    let viewData = column.view.viewData;
    let showColumns = `,${viewData.showColumns},`;
    if (viewData.showColumns === "ALL" || !Boolean(viewData.showColumns)) {
      View.$set(this, "hidden", false);
    } else if (showColumns.indexOf(`,${column.$id},`) < 0) {
      View.$set(this, "hidden", true);
    }
  }
  /**
   * 处理字段校验规则
   */
  handlerColumnValidRule() {
    let column = this;
    // 视图相关的字段校验规则
    let viewData = column.view.viewData;
    let renderData = column.view.renderData;
    let columnData = column.columnData;

    let requiredCols = "," + viewData.requiredCols + ",";
    if (requiredCols.indexOf("," + column.$id + ",") >= 0) {
      column.rules.push({
        required: true,
        validator: (rule, value, callback) => {
          if (((Boolean(value) || value === 0) && String(value).trim().length > 0) || this.hidden) {
            callback();
          } else {
            callback(new Error(rule.message));
          }
        },
        message: column.placeholder,
        trigger: "blur"
      });
      this.isRequired = true;
    }
    // 长度校验
    let lenRule = {
      validator: (rule, value, callback) => {
        let _value = (value || value===0) ? String(value) : "";
        let bool = true;
        if (rule.min) {
          _value.length < rule.min && (bool = false);
        }
        if (rule.max) {
          _value.length > rule.max && (bool = false);
        }
        if (bool || this.hidden) {
          callback();
        } else {
          callback(new Error(rule.message));
        }
      }
    };
    if (parseInt(columnData.minLen) > 0) {
      lenRule.min = parseInt(columnData.minLen);
    }
    if (parseInt(columnData.maxLen) > 0) {
      lenRule.max = parseInt(columnData.maxLen);
    }
    if (lenRule.min || lenRule.max) {
      column.rules.push(lenRule);
      if (lenRule.min && !lenRule.max) {
        lenRule.message = `至少${lenRule.min}个字符`;
      } else if (!lenRule.min && lenRule.max) {
        lenRule.message = `最长${lenRule.max}个字符`;
      } else {
        lenRule.message = `长度在 ${lenRule.min} 到 ${lenRule.max} 个字符`;
      }
    }

    // 金额字段校验
    if (this.isMoney) {
      column.rules.push({
        validator: (rule, value, callback) => {
          if (!value || String(value).match(/^(\-?)\d+(\.\d+)?$/g) !== null) {
            callback();
          } else {
            callback(new Error(rule.message))
          }
        },
        message: "数据格式有误"
      });
    }

    // 数字字段校验
    if (this.isNumber) {
      column.rules.push({
        validator: (rule, value, callback) => {
          if (!value || !isNaN(Number(value))) {
            callback();
          } else {
            callback(new Error(rule.message))
          }
        },
        message: "数据格式有误"
      });
    }

    // 唯一校验
    if (columnData.isUnique == 1) {
      column.rules.push({
        validator: (rule, value, callback) => {
          // 其他模块依赖字段不触发唯一校验
          if (!Boolean(value) || (column.isOtherModuleRelated && column.readonly)) {
            callback();
            return;
          }
          axios.post("platform://custom/C12009", {
            moduleId: viewData.moduleId,
            columnName: columnData.phyColumnName,
            recordId: column.view.recordId,
            columnValue: value
          }).then(result => {
            if (result.data === "NOTEXIST") {
              callback();
            } else {
              callback(new Error(`${columnData.columnName}已存在`));
            }
          });
        }
      });
    }
    // beginDateColumnId
    if (columnData.beginDateColumnId && columnData.beginDateColumnId !== null) {
      column.rules.push({
        validator: (rule, value, callback) => {
          let beginDateColumn = this.view.columnMap[
            columnData.beginDateColumnId
          ];
          let beginDate = this.view.formModel[beginDateColumn.valKey];
          if (value >= beginDate) {
            callback();
          } else {
            callback(
              new Error(`${column.label}需要大于等于${beginDateColumn.label}`)
            );
          }
        }
      });
    }
    // 其他约束
    if (
      columnData.colConstraint &&
      columnData.colConstraint != -1 &&
      columnData.colConstraint != ""
    ) {
      for (var index in renderData.constraintList) {
        let constraint = renderData.constraintList[index];
        if (columnData.colConstraint == constraint.id) {
          column.rules.push({
            expression: constraint.regularExpression,
            message: constraint.promptContent,
            validator: (rule, value, callback) => {
              if (!value || String(value).match(rule.expression) !== null) {
                callback();
              } else {
                callback(new Error(rule.message))
              }
            }
          });
        }
      }
    }
  }
  /**
   * 处理字段数据源
   */
  handlerColumnDatasource() {
    let columnData = this.columnData;
    let view = this.view;
    switch (this.type) {
      case COLUMN_ENUM.FILE:
      case COLUMN_ENUM.IMAGE:
        this.datasource = {
          multiple: columnData.isMoreData === 1,
          action: `saveFile/${columnData.entCode}/file`,
          accept: columnData.fileType || "*"
        };
        let fileUri = HTTP_CONFIG.mapping.file
        let newUri = loginUser.newUri(fileUri, this.datasource['action'])
        View.$set(this.datasource, "action", newUri)
        // loginUser.get().then((user) => {
        //   View.$set(this.datasource, "action", loginUser.newUri(user.fileUri, this.datasource['action']));
        // });
        break;
      case COLUMN_ENUM.RADIO_GROUP:
      case COLUMN_ENUM.CHECKBOX_GROUP:
      case COLUMN_ENUM.SELECT:
        this.datasource = {
          reload: false, // 特殊状态(是否重新刷新数据内容)
          searchList: [], // 条件内容
          loading() {
            return dict.loading(columnData.showColVal).then(res => {
              let options = [];
              res.forEach(dictObj => {
                options.push({
                  label: dictObj.dictName,
                  value: dictObj.dictCode
                });
              });
              // 过滤结果
              options = options.filter(opt => {
                let result = true;
                for (const key in this.searchList) {
                  if (!result) break;
                  const element = this.searchList[key];
                  if (!element.screenVal) break;
                  result = validateCondition(
                    opt.value,
                    element.searchType,
                    element.screenVal
                  );
                }
                return result;
              });
              return options;
            });
          },
          loadVal(value) {
            return dict.loadVal(columnData.showColVal, value);
          }
        };
        break;
      case COLUMN_ENUM.FOREIGNKEY:
        // 外键选择数据源
        this.datasource = {
          viewId: this.relatedData.showViewId, // 加载视图Id
          reload: false, // 特殊状态(是否重新刷新数据内容)
          searchList: [] // 条件内容
        };
        break;
      case COLUMN_ENUM.DATA_SELECT:
        // 数据选择数据源
        this.datasource = {
          viewId: this.columnData.selectViewId, // 加载视图Id
          reload: false, // 特殊状态(是否重新刷新数据内容)
          searchList: [] // 条件内容
        };
        break;
    }
  }
  /**
   * 处理关联字段数据
   */
  handlerDataRelationColumn() {
    let moduleId = undefined;
    let columnId = undefined;
    if (this.isOtherModuleRelated) {
      // 其他模块依赖字段
      this[_dataRelationColumn] = this;
      return Promise.resolve(this[_dataRelationColumn]);
    } else if (this.isRelated) {
      moduleId = this.columnData.relyModuleId;
      columnId = this.columnData.relyColumnId;
    } else if (this.isForeignKey) {
      moduleId = this.relatedData.relModuleId;
      columnId = this.relatedData.showColumnId;
    } else if (this.isChosenData) {
      moduleId = this.columnData.selectModuleId;
      columnId = this.columnData.selectShowColId;
    }
    if (!moduleId) return;
    
    if (this.view) {
      let cacheKey = `columnService.findById({${moduleId}, ${columnId}})`;
      let promise = undefined;
      if (this.view.$space[cacheKey]) {
        promise = this.view.$space[cacheKey];
      } else {
        promise = columnService.findById({
          columnId,
          moduleId
        }).then((columnData) => {
          this.view.$space[cacheKey] = Promise.resolve(columnData);
          return columnData;
        });
      }
      this.view.$space[cacheKey] = promise;
      return promise.then((columnData) => {
        this[_dataRelationColumn] = new Column();
        this[_dataRelationColumn].render(columnData);
        return this[_dataRelationColumn];
      })
    } else {
      if (!this['initPromise()']) {
        this['initPromise()'] = columnService.findById({
          columnId,
          moduleId
        }).then((columnData) => {
          this[_dataRelationColumn] = new Column();
          this[_dataRelationColumn].render(columnData);
          return this[_dataRelationColumn];
        });
      }
      return this['initPromise()'];
    }
  }

}

export default Column;
