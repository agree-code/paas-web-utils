import {
  validateCondition,
  _viewRule,
  _view,
  _bindColumns,
  _handlerFn,
} from "./shared";
import GlobalUid from "./global-uid";

class ViewRule {
  constructor(viewRule, view) {
    this['_puid'] = GlobalUid.get();
    this[_viewRule] = viewRule;
    this[_view] = view;
    this.type; // 控制在什么阶段执行
    this[_bindColumns] = [];
    this.handler();
  }
  /**
   * 处理视图条件
   */
  handler() {
    let rule = this[_viewRule];
    switch (rule.ruleType) {
      case "columnFilter":
        this[_handlerFn] = this.columnOptDataFilter();
        this.type = "COLUMN_OPT_DATA_FILTER";
        break;
      case "hidden":
        this[_handlerFn] = this.columnHidden(true);
        this.type = "COLUMN_HIDDEN";
        break;
      case "show":
        this[_handlerFn] = this.columnHidden(false);
        this.type = "COLUMN_READONLY";
        break;
      case "readOnly":
        this[_handlerFn] = this.columnReadonly();
        this.type = "COLUMN_READONLY";
        break;
    }
    console.log(this[_viewRule].ruleName, "ViewRule", this);
    this[_view].$on('destroyed', () => {
      // 销毁数据
      delete this[_viewRule];
      delete this[_view];
      delete this[_bindColumns];
      delete this[_handlerFn];
    });
  }

  columnOptDataFilter() {
    let ruleConditions = {};
    (this[_viewRule].viewRuleConditions || []).forEach(conditionItem => {
      if (this[_bindColumns].indexOf(conditionItem.conditionValue) < 0) {
        this[_bindColumns].push(conditionItem.conditionValue);
      }
      let ruleCondition = ruleConditions[conditionItem.conditionValue] ? ruleConditions[conditionItem.conditionValue] : (ruleConditions[conditionItem.conditionValue] = []);
      ruleCondition.push({
        screenVal: undefined,
        columnId: conditionItem.customVal,
        searchType: conditionItem.conditionType
      });
    });
    let viewRule = this[_viewRule];
    let view = this[_view];
    return function COLUMN_OPT_DATA_FILTER(column, formModel, type) {
      let columnMap = column.view.columnMap;
      // 影响字段
      let affectColumn = columnMap[viewRule.affectColumns];
      let value = formModel[column.valKey];
      let searchList = affectColumn.datasource.searchList;
      let columnConditions = ruleConditions[column.$id];
      columnConditions.forEach(element => {
        if (value) {
          element.screenVal = value;
          if (searchList.indexOf(element) < 0) {
            searchList.push(element);
          }
        } else {
          element.screenVal = value;
          view.$delete(searchList, searchList.indexOf(element));
        }
      });
      if (Boolean(viewRule.isLinkage) && type !== "created") {
        // 清空数据
        setTimeout(() => {
          view.$set(formModel, affectColumn.valKey, undefined);
        });
      }
      // 字典才实时刷新数据
      if (affectColumn.isDict) {
        view.$set(affectColumn.datasource, "reload", true);
      }
    };
  }

  columnHidden(status = true) {
    let handlers = this.baseHandler();
    let view = this[_view];
    let affectColumns = (this[_viewRule].affectColumns || "").split(",");
    return function COLUMN_HIDDEN(column, formModel) {
      let promises = [];
      handlers.forEach(handler => {
        let value = formModel[column.valKey];
        if (
          validateCondition(
            value,
            handler.conditionType,
            handler.conditionValue
          )
        ) {
          promises.push(Promise.resolve(true));
        } else {
          promises.push(Promise.reject(false));
        }
      });
      Promise.all(promises).then(
        () => {
          for (const affectColumnId of affectColumns) {
            // true
            if (!view.columnMap[affectColumnId]) continue;
            view.$set(view.columnMap[affectColumnId], "hidden", status);
          }
        },
        () => {
          for (const affectColumnId of affectColumns) {
            // false
            if (!view.columnMap[affectColumnId]) continue;
            view.$set(view.columnMap[affectColumnId], "hidden", !status);
          }
        }
      );
    };
  }

  columnReadonly() {
    let handlers = this.baseHandler();
    let view = this[_view];
    let affectColumns = (this[_viewRule].affectColumns || "").split(",");
    return function COLUMN_READONLY(column, formModel) {
      let promises = [];
      handlers.forEach(handler => {
        let value = formModel[column.valKey];
        if (validateCondition(value, handler.conditionType, handler.conditionValue)) {
          promises.push(Promise.resolve(true));
        } else {
          promises.push(Promise.reject(false));
        }
      });
      Promise.all(promises).then(
        () => {
          for (const affectColumnId of affectColumns) {
            // true
            if (!view.columnMap[affectColumnId]) continue;
            view.$set(view.columnMap[affectColumnId], "readonly", true);
          }
        },
        () => {
          for (const affectColumnId of affectColumns) {
            // false
            if (!view.columnMap[affectColumnId]) continue;
            view.$set(view.columnMap[affectColumnId], "readonly", false);
          }
        }
      );
    };
  }

  baseHandler() {
    let handlers = [];
    (this[_viewRule].viewRuleConditions || []).forEach(conditionItem => {
      if (this[_bindColumns].indexOf(conditionItem.sourceColumnId) < 0) {
        this[_bindColumns].push(conditionItem.sourceColumnId);
      }
      handlers.push({
        sourceColumnId: conditionItem.sourceColumnId,
        conditionType: conditionItem.conditionType,
        conditionValue: conditionItem.conditionValue
      });
    });
    return handlers;
  }

  bindEventToViewColumn(columnMap) {
    this[_bindColumns].forEach(columnId => {
      let column = columnMap[columnId];
      if (!column) return;
      if (this.type !== "COLUMN_OPT_DATA_FILTER") {
        column.addEventListener("created", this[_handlerFn]);
      }
      column.addEventListener("update", this[_handlerFn]);
    });
  }
}

export default ViewRule;
