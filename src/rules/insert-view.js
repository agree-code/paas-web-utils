import renderService from "../services/render";
import businessService from "../services/business";
import userService from "../services/user";
import View from "./view";
import ViewGroup from "./view-group";
import BatchView from "./batch-view";
import {
  SYS_ORG_LIST
} from "./shared";

class InsertView extends View {
  constructor() {
    super();
    this.groups = [];
    this.operations = [];
    this.componentRender = false; // 委派组件渲染函数
  }

  get record() {
    return this.renderData.record || this.renderData.recordColumns;
  }

  get columnMap() {
    let columnMap = {};
    for (const group of this.groups) {
      if (group instanceof ViewGroup) {
        Object.assign(columnMap, group.columnMap);
      }
    }
    return columnMap;
  }

  get submitModel() {
    let submitModel = {
      viewId: this.$id,
      columnMap: {},
      batchColumn: {}
    };
    for (const group of this.groups) {
      if (group instanceof ViewGroup) {
        Object.assign(submitModel.columnMap, group.submitModel);
      } else if (group instanceof BatchView) {
        Object.assign(submitModel.batchColumn, group.submitModel);
      }
    }
    if (this.recordId) {
      submitModel.columnMap["obj.ID"] = this.recordId;
    }
    return submitModel;
  }
 
  render(viewId, recordId) {
    this.$id = viewId;
    return this._axios(viewId, recordId).then(result => {
      // 处理默认视图信息
      this.handlerView(result, this.viewType, recordId);
      this.handlerViewGroup();
      return this.handlerBatchViewGroup();
    }).then(() => {
      // 处理视图操作
      return this.handlerViewOperation();
    }).then(_ => {
      // 处理视图公式
      this.handlerViewFormula();
      // 处理视图条件
      this.handlerViewRule();
      // 处理操作条件
      this.handlerOperationRule();
      // 绑定公式、条件等数据
      this.bindEventToView(this.columnMap);
      // 绑定真实数据回显
      this.handlerViewRecord(this.columnMap);
      // 触发创建事件
      this.$emit("created", this);
      this.$timeout(() => {
        this.$emit("update", this, this.record ? [this.record] : []);
      });
      this.$on("destroyed", () => {
        this.handlerDestroy();
      });
      return this;
    });
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
   * 触发关联数据
   * @param relation 关联数据
   */
  triggerRelation(relation) {
    if (!relation) return;
    let promise = undefined;
    if (!relation.relationId) {
      promise = Promise.resolve([{}]);
    } else if (relation.relationViewId === SYS_ORG_LIST) {
      // 部门关联数据 特殊处理
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
    for (const group of this.groups) {
      if (!(group instanceof ViewGroup)) continue;
      for (const column of group.columns) {
        // 避免死循环
        if (relation.sourceColumnId === column.$id) continue;
        let dataRelationModuleId = column.dataRelationModuleId;
        if (!relation.sourceColumnId) {
          dataRelationModuleId = column.insertDataRelationModuleId;
        }
        if (relation.relationModuleId === dataRelationModuleId) {
          this.$set(group.formModel, column.valKey, record.orgCode);
        } else if (relation.relationModuleId.indexOf(`,${dataRelationModuleId},`) > -1) {
          if (column.isOtherModuleRelated) {
            let value = record[column.valKey];
            let showValue = record[column.showValKey];
            if (value === null || value === "null") {
              value = undefined;
            }
            if (showValue === null || showValue === "null") {
              value = undefined;
            }
            this.$set(group.formModel, column.valKey, value);
            this.$set(group.formModel, column.showValKey, showValue);
          } else {
            column.dataRelationColumn().then((dataColumn) => {
              if (column.isForeignKey) {
                let value = record[`${dataColumn.moduleCode}_ID`] || record[`${dataColumn.moduleCode}_id`];
                if (value === null || value === "null") {
                  value = undefined;
                }
                // TODO: 可能有问题
                this.$set(group.formModel, column.valKey, value);
              } else {
                let value = record[dataColumn.valKey];
                let showValue = record[dataColumn.showValKey];
                if (value === null || value === "null") {
                  value = undefined;
                }
                if (showValue === null || showValue === "null") {
                  value = undefined;
                }
                this.$set(group.formModel, column.valKey, value);
                this.$set(group.formModel, column.showValKey, showValue);
              }
            })
          }

        }
      }
    }
  }

  /**
   * 根据字段Id获取视图分组
   * @param {*} columnId 字段Id
   */
  findViewGroupByColumnId(columnId) {
    for (const group of this.groups) {
      if (group.columnMap[columnId]) {
        return group;
      }
    }
    return undefined;
  }

  /**
   * 获取视图类型(可以重写该方法)
   */
  get viewType() {
    return "insert";
  }
  /**
   * 获取视图渲染数据(可以重写该方法)
   * @param {Integer} viewId 视图Id
   * @param {Integer} recordId 真实数据Id
   */
  _axios(viewId, recordId) {
    let cacheKey = `renderService.findInsertViewRender(${viewId})`;
    if (this.$space[cacheKey]) {
      return this.$space[cacheKey];
    } else {
      let promise = renderService.findInsertViewRender(viewId).then((result) => {
        this.$space[cacheKey] = Promise.resolve(result);
        return result;
      });
      this.$space[cacheKey] = promise;
      return promise;
    }
  }

  handlerViewGroup() {
    let viewData = this.viewData;
    this.groups.splice(0, this.groups.length);
    // 处理视图分组
    if (viewData.viewGroupList && viewData.viewGroupList.length > 0) {
      viewData.viewGroupList.forEach(viewGroupData => {
        if (!viewGroupData.colList) return;
        let group = new ViewGroup(this, viewGroupData);
        this.groups.push(group);
        group.render();
      });
    }
  }

  handlerBatchViewGroup(){
    // 处理批量视图
    let promises = [];
    let batchCtrls = this.viewData.batchCtrls;
    if (batchCtrls && batchCtrls !== null) {
      batchCtrls.forEach(batchCtrl => {
        if (batchCtrl.batchId) {
          let group = new BatchView(batchCtrl, this);
          this.groups.push(group);
          promises.push(group.render(batchCtrl.batchId, this.recordId));
        }
      });
    }
    return Promise.all(promises);
  }

  handlerViewOperation() {
    return super.handlerOperation().then(() => {
      this.operations = this.operationList;
      return this
    })   
  }

  handlerDestroy() {
    console.log("销毁 InsertView", this.title);
    this.groups = [];
    this.operations = [];
    this.componentRender = false; // 委派组件渲染函数
  }
}

export default InsertView;
