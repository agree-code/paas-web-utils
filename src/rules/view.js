import Vue from "vue";
import ViewFormula from "./formula";
import ViewRule from "./view-rule";
import Operation from "./operation";
import OperationRule from "./operation-rule";
import EventBus from "./event-bus";
import {
  _id,
  _renderData,
  _recordId,
  _operationMap, // 当前视图的所有操作映射
  _operations, // 当前视图的所有操作映射
  _viewFormulas, // 视图公式
  _viewRules, // 视图条件
  _operatioRules // 操作条件
} from "./shared";
import GlobalUid from "./global-uid";


let DATA_SPACE = {};
const ViewStatus = Symbol("ViewStatus");
EventBus.$on('RootView', "PUI_CLEAR_CACHE", () => {
  for (const key in DATA_SPACE) {
    delete DATA_SPACE[key];
    console.log("清空数据", key);
  }
});

class View {
  constructor() {
    this['_puid'] = GlobalUid.get();
    this[_id] = undefined;
    // 公共属性
    this.type = "loading"; // 视图类型
    this[ViewStatus] = "pending";
  }

  get $id() {
    return this[_id];
  }

  set $id(viewId) {
    this[_id] = viewId;
  }

  get title() {
    return this.viewData.viewName || "数据加载中..."
  }

  get $bus() {
    return EventBus;
  }

  get $space() {
    return View.$space;
  }

  static get $space() {
    return DATA_SPACE;
  }
  /**
   * 视图类型编号
   */
  get typeNum() {
    switch (this.type) {
      case 'list':
        return 1;
      case 'insert':
      case 'batchFormRow':
      case 'batchForm':
        return 2;
      case 'update':
        return 3;
      case 'detail':
        return 4;
      default:
        return -1;
    }
  }

  get viewData() {
    return this.renderData.view || {};
  }

  get renderData() {
    return this[_renderData] || {};
  }

  get recordId() {
    return this[_recordId];
  }

  get record() {
    return this.renderData.record || this.renderData.recordColumns || {};
  }

  get moduleId() {
    return this.viewData.moduleId;
  }

  get moduleCode() {
    return this.viewData.moduleCode;
  }


  get operationMap() {
    return this[_operationMap] || {};
  }

  get viewFormulas() {
    return this[_viewFormulas] || [];
  }

  get viewRules() {
    return this[_viewRules] || [];
  }

  get operatioRules() {
    return this[_operatioRules] || [];
  }

  get operationList() {
    return this[_operations] || [];
  }

  get eventKey() {
    return `view.${this.$id}`;
  }

  /**
   * 添加触发事件
   * @param type 事件类型
   * @param fn 事件回调函数
   */
  addEventListener(type, fn) {
    if (type === "chanage") type = "update";
    if (type === "update") {
      this.$on(type, fn);
    } else {
      this.$once(type, fn);
      if (type === "created" && this[ViewStatus] === "resolved") {
        // 创建事件已经执行
        this.$emit(`created`, this);
      }
      if (type === "destroyed" && this[ViewStatus] === "destroyed") {
        this.$emit(`destroyed`, this);
      }
    }
  }

  /**
   * 删除触发事件
   * @param type 事件类型
   * @param fn 事件回调函数
   */
  removeEventListener(type, fn) {
    if (type === "chanage") type = "update";
    this.$off(type, fn);
  }

  /**
   * 处理视图基本信息
   * @param {type} type 列表视图
   */
  handlerView(result, type, recordId = undefined) {
    this[_recordId] = recordId;
    this[_renderData] = result;
    this[_id] = this.viewData.id;
    this.type = type; // 视图类型
    this.addEventListener("created", () => {
      this[ViewStatus] = "resolved";
    });
    this.addEventListener("destroyed", () => {
      this[ViewStatus] = "destroyed";
    });
  }
  /**
   * 处理视图真实数据回显
   */
  handlerViewRecord(columnMap) {
    if (this.record) {
      for (const key in columnMap) {
        if (columnMap.hasOwnProperty(key) && !isNaN(Number(key))) {
          const column = columnMap[key];
          column.addEventListener("created", (_column, formModel) => {
            let value = this.record[_column.valKey];
            let showValue = this.record[_column.showValKey];
            if (value === null || value === "null") {
              value = undefined;
            }
            if (showValue === null || showValue === "null") {
              showValue = undefined;
            }
            // 数据库中的值有效才进行赋值
            if(value || value === 0) {
              this.$set(formModel, _column.valKey, value);
              this.$set(formModel, _column.showValKey, showValue);
              // 触发当前字段更新事件
              this.$timeout(() => {
                this.$emit(_column.updateEventName, _column, formModel, 'created');
              });  
            }
          });
        }
      }
    }
  }


  handlerViewFormula() {
    let result = this[_renderData];
    this[_viewFormulas] = [];
    (result.formulaList || []).forEach(formula => {
      this[_viewFormulas].push(new ViewFormula(formula, this));
    });
  }

  handlerViewRule() {
    let result = this[_renderData];
    this[_viewRules] = [];
    (result.viewRuleList || []).forEach(viewRule => {
      this[_viewRules].push(new ViewRule(viewRule, this));
    });
  }

  handlerOperationRule() {
    let result = this[_renderData];
    this[_operatioRules] = [];
    (result.operationRuleList || []).forEach(operationRule => {
      this[_operatioRules].push(new OperationRule(operationRule, this));
    });
  }

  handlerOperation() {
    this[_operations] = [];
    this[_operationMap] = {};
    let promises = [];
    let operationList = this.renderData.operationList;
    if (operationList && operationList.length > 0) {
      operationList.forEach(_operation => {
        let operation = new Operation(this, _operation);
        this[_operations].push(operation);
        this[_operationMap][operation.$id] = operation;
        promises.push(operation.handler());
      });
      operationList.sort((a, b) => {
        return a.sort - b.sort;
      });
    }
    return Promise.all(promises);
  }

  findViewGroupByColumnId() {
    return this;
  }

  /**
   * 绑定视图字段事件
   */
  bindEventToView(columnMap) {
    // 绑定视图公式
    for (const formula of this.viewFormulas) {
      formula.bindEventToViewColumn(columnMap);
    }
    // 绑定视图条件
    for (const viewRule of this.viewRules) {
      viewRule.bindEventToViewColumn(columnMap);
    }

    // 绑定操作条件
    for (const operationRule of this.operatioRules) {
      operationRule.bindEventToViewOperation(this.operationMap, columnMap);
    }
  }

  $set(target, key, value) {
    Vue.set(target, key, value);
  }

  $delete(target, key) {
    Vue.delete(target, key);
  }

  static $set(target, key, value) {
    Vue.set(target, key, value);
  }

  static $delete(target, key) {
    Vue.delete(target, key);
  }

  static format(formModel, column) {
      if (column.type.format) {
        return (
          column.type.format(formModel[column.valKey]) ||
          formModel[column.showValKey]
        );
      }
      let showVal = formModel[column.showValKey];
      if (showVal === null || showVal === "null") showVal = undefined;
      let val = formModel[column.valKey];
      if (val === null || val === "null") val = undefined;
      return showVal || val;
    }

  $on(event, eventCallback) {
    this.$bus.$on(this.eventKey, `${this.eventKey}.${event}`, eventCallback);
  }

  $once(event, eventCallback) {
    this.$bus.$once(`${this.eventKey}.${event}`, eventCallback);
  }

  $off(event, eventCallback) {
    this.$bus.$off(`${this.eventKey}.${event}`, eventCallback);
  }

  $emit(event, ...args) {
    this.$bus.$emit(`${this.eventKey}.${event}`, ...args);
  }

  $timeout(code, millisec) {
    setTimeout(code, millisec);
  }
  /**
   * 销毁视图对象
   */
  $destroy() {
    this.$emit("destroyed", this);
    this.$timeout(() => {
      // 清空所有事件
      this.$bus.$offAll(this.$eventKey);
      // 销毁 对象属性
      delete this[_viewFormulas];
      delete this[_viewRules];
      delete this[_operatioRules];
      delete this[_operations];
      delete this[_operationMap];
      delete this[_renderData];
      this[_id] = undefined;
      // 公共属性
      this.type = "loading"; // 视图类型
    }, 500);
  };
}

export default View;
