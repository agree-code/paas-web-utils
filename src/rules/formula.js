import axios from "axios"
import {
  _view,
  _targetColumnIds,
  _handlerFn
} from "./shared";
import GlobalUid from "./global-uid";
const _viewFormula = Symbol("ViewFormula");
/**
 * 视图公式
 */
class ViewFormula {
  constructor(viewFormula, view) {
    this['_puid'] = GlobalUid.get();
    this[_targetColumnIds] = []; // 目录字段Id集合
    this[_handlerFn] = new Function();
    this.type = undefined; // 控制在什么阶段执行
    this[_view] = view;
    this[_viewFormula] = viewFormula;
    this.handler();
  }

  get viewFormula() {
    return this[_viewFormula];
  }

  get view() {
    return this[_view];
  }

  /**
   * 处理视图公式
   */
  handler() {
    if (
      this.viewFormula.targetColumnId ||
      this.viewFormula.targetColumnId == 0
    ) {
      if (!isNaN(this.viewFormula.targetColumnId)) {
        this[_targetColumnIds] = [this.viewFormula.targetColumnId];
      } else {
        this[_targetColumnIds] = this.viewFormula.targetColumnId.split(",");
      }
    }
    switch (this.viewFormula.type) {
      case 0:
        this.type = "CUSTOM_SERVICE_COMPUTE";
        this[_handlerFn] = this.customServiceCompute();
        break;
      case 1:
        this.type = "DEFAULT_VALUE";
        this[_handlerFn] = this.defaultValue();
        break;
      case 2:
        this.type = "BY_EXPRESSION";
        this[_handlerFn] = this.byExpression();
        break;
    }
    console.log("ViewFormula", this);
    this.view.$on("destroyed", () => {
      this[_targetColumnIds] = []; // 目录字段Id集合
      this[_handlerFn] = new Function();
      this.type = undefined; // 控制在什么阶段执行
      delete this[_view];
      delete this[_viewFormula];
    })
  }

  /**
   * 自定义服务
   */
  customServiceCompute() {
    let formulaData = this.viewFormula.content ?
      this.viewFormula.content.replace(/\s+/g, "") :
      "";
    let viewFormula = this.viewFormula;
    let view = this.view;
    return function CUSTOM_SERVICE_COMPUTE(column, formModel) {
      if (viewFormula.customUrl) {
        axios.post(viewFormula.customUrl, {
          formula: formulaData
        }).then(result => {
          view.$set(formModel, column.valKey, result.data);
        });
      }
    };
  }
  /**
   * 默认值处理
   */
  defaultValue() {
    let view = this.view;
    let viewFormula = this.viewFormula;
    return function DEFAULT_VALUE(column, formModel) {
      setTimeout(() => {
        view.$set(formModel, column.valKey, viewFormula.defaultVal);
      }, 100);
    };
  }
  /**
   * 自定义公式处理
   */
  byExpression() {
    // TODO: 执行公式内容(需要重新抽取公式内容)
    return function BY_EXPRESSION(column, formModel) {};
  }

  bindEventToViewColumn(columnMap = undefined) {
    columnMap = columnMap ? columnMap : this.view.columnMap;
    this[_targetColumnIds].forEach(columnId => {
      let column = columnMap[columnId];
      if (!column) return;
      switch (this.type) {
        case "DEFAULT_VALUE":
          column.addEventListener("created", this[_handlerFn]);
          break;
        case "CUSTOM_SERVICE_COMPUTE":
          column.addEventListener("created", this[_handlerFn]);
          column.addEventListener("change", this[_handlerFn]);
          break;
        case "BY_EXPRESSION":
          column.addEventListener("created", this[_handlerFn]);
          column.addEventListener("change", this[_handlerFn]);
          break;
      }
    });
  }
}

export default ViewFormula;
