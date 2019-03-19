import {
  SYS_ORG_LIST,
  _columnMap, // 当前视图的所有字段映射
} from "./shared";
import {
  businessService,
  userService
} from "../services";
import View from "./view";
import Column from "./column";
// 私有属性Key
const _batchView = Symbol("BatchView");
const _DESTROYED_FN = Symbol("DESTROYED_FN");

class BatchRow extends View {
  constructor(result, batchView) {
    super();
    this[_batchView] = batchView;
    this[_columnMap] = {};
    this.rules = {};
    this.columns = [];
    this.formModel = {};
    this.handlerView(result, "batchFormRow");
  }

  get eventKey() {
    return `view.${this.$id}.row-${this['_puid']}`;
  }

  get columnMap() {
    return this[_columnMap];
  }

  get status(){
    return this.record['[[dataStatus]]'];
  }

  handler(index) {
    this.renderData.columnList.forEach(_column => {
      let column = new Column();
      // 处理字段
      column.render(_column, this);
      // 处理字段默认事件
      column.handlerColumnDefaultEvent();
      // 处理字段只读内容
      column.handlerColumnReadonly();
      // 处理字段显示隐藏
      column.handlerColumnHidden();
      // 处理字段校验规则
      column.handlerColumnValidRule();
      // 建立映射
      this.columnMap[column.$id] = column;
      this.columnMap[`${column.columnCode}@${column.moduleCode}`] = column;
      // 添加到表单模型
      this.formModel[column.valKey] = undefined;
      // 添加字段规则
      this.rules[column.valKey] = column.rules;
      // 添加字段
      this.columns.push(column);
    });
    // 处理视图公式
    this.handlerViewFormula();
    // 处理视图条件
    this.handlerViewRule();
    // 绑定公式、条件等数据
    this.bindEventToView(this.columnMap);
    // 处理字段真实数据
    this.handlerViewRecord(this.columnMap);
    // 同步绑定事件
    this[_batchView].inheritEvent(this);
    // 触发创建事件
    this.$emit('created', this, index);
    this[_DESTROYED_FN] = () => {
      this.handlerDestroy();
    }
    this[_batchView].$on("destroyed", this[_DESTROYED_FN]);
    return this;
  }

  triggerRelation(relation) {
    if (!relation) return;
    let promise = undefined;
    // 部门关联数据 特殊处理
    if (!relation.relationId) {
      promise = Promise.resolve([{}]);
    } else if (relation.relationViewId === SYS_ORG_LIST) {
      promise = userService.findUserList({
        userIdList: [relation.relationId]
      });
    } else {
      promise = businessService.findAllByViewIdAndRecordIds({
        viewId: relation.relationViewId,
        recordIds: [relation.relationId]
      });
    }
    promise.then(res => {
      this.handlerRelationColumn(relation, res[0]);
    });
  }

  /**
   * 处理依赖字段
   * @param relation 依赖配置
   * @param record 真实数据
   */
  handlerRelationColumn(relation, record) {
    console.log("依赖字段", relation.relationModuleId, relation, record);
    for (const colIndex in this.columns) {
      const column = this.columns[colIndex]
      // 避免死循环
      if (relation.sourceColumnId === column.$id) continue;
      let dataRelationModuleId = column.dataRelationModuleId;
      if (!relation.sourceColumnId) {
        dataRelationModuleId = column.insertDataRelationModuleId;
      }
      if (relation.relationModuleId === dataRelationModuleId) {
        this.$set(this.formModel, column.valKey, record.orgCode);
      } else if (relation.relationModuleId.indexOf(`,${column.dataRelationModuleId},`) > -1) {
        if (column.isOtherModuleRelated) {
          let value = record[column.valKey];
          let showValue = record[column.showValKey];
          if (value === null || value === "null") {
            value = undefined;
          }
          if (showValue === null || showValue === "null") {
            value = undefined;
          }
          this.$set(this.formModel, column.valKey, value);
          this.$set(this.formModel, column.showValKey, showValue);
        } else {
          column.dataRelationColumn().then((dataColumn) => {
            if (column.isForeignKey) {
              let value = record[`${dataColumn.moduleCode}_ID`] || record[`${dataColumn.moduleCode}_id`];
              if (value === null || value === "null") {
                value = undefined;
              }
              // TODO: 可能有问题
              this.$set(this.formModel, column.valKey, value);
            } else {
              let value = record[dataColumn.valKey];
              let showValue = record[dataColumn.showValKey];
              if (value === null || value === "null") {
                value = undefined;
              }
              if (showValue === null || showValue === "null") {
                value = undefined;
              }
              this.$set(this.formModel, column.valKey, value);
              this.$set(this.formModel, column.showValKey, showValue);
            }
          })
        }
      }
    }
  }

  findViewGroupByColumnId() {
    return this;
  }

  $offDestroy() {
    this[_batchView].$off("destroyed", this[_DESTROYED_FN]);
  }

  $destroy() {
    super.$destroy();
    this.handlerDestroy();
  }

  handlerDestroy() {
    for (const column of this.columns) {
      column.handlerBashColumn(undefined, undefined)
    }
    delete this[_batchView];
    this[_columnMap] = {};
    this.rules = {};
    this.columns = [];
    this.formModel = {};
  }
}

export default BatchRow;
