import renderService from "../services/render";
import View from "./view";
import ViewGroup from "./view-group";
import BatchView from "./batch-view";
import ListView from "./list-view";

class DetailView extends View {
  constructor() {
    super();
    this.groups = [];
    this.operations = [];
    this.componentRender = false; // 委派组件渲染函数
  }

  get columnMap(){
    let columnMap = {};
    for (const group of this.groups) {
      if (group instanceof ViewGroup){
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
    this.groups.forEach(group => {
      if (group instanceof ViewGroup) {
        Object.assign(submitModel.columnMap, group.submitModel);
      }
    });
    return submitModel;
  }

  /**
   * 渲染视图
   * @param viewId 视图Id
   * @param recordId 真实数据Id
   */
  render(viewId, recordId) {
    return renderService.findDetailViewRender(viewId, recordId).then(result => {
      // 处理默认视图信息
      this.handlerView(result, "detail", recordId);
      this.handlerViewGroup();
      if (this.viewData.viewType === 7) {
        return this.handlerBatchViewGroup();
      } else {
        // 处理视图操作
        return this.handlerListGroup();
      }
    }).then(() => {
      return this.handlerViewOperation();
    }).then(() => {
      // 处理视图公式
      this.handlerViewFormula();
      // 处理视图条件
      this.handlerViewRule();
      // 处理操作条件
      this.handlerOperationRule();
       // 触发创建事件
       this.bindEventToView(this.columnMap);
       // 绑定真实数据回显
      this.handlerViewRecord(this.columnMap);
      // 触发创建事件
      this.$emit("created", this);
      this.$timeout(() => {
        this.$emit("update", this, [this.record]);
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

  handlerViewGroup() {
    let viewData = this.viewData;
    this.groups = [];
    // 处理视图分组
    if (viewData.viewGroupList && viewData.viewGroupList.length > 0) {
      viewData.viewGroupList.forEach(viewGroupData => {
        let group = new ViewGroup(this, viewGroupData);
        this.groups.push(group);
        group.render();
      });
    }
  }

  handlerListGroup() {
    // 处理批量视图
    let promises = [];
    let viewMarks = this.viewData.viewMarks;
    if (viewMarks && viewMarks !== null) {
      viewMarks = viewMarks.split(",");
      viewMarks.forEach(viewId => {
        let group = new ListView();
        group['batchId'] = viewId;
        promises.push(group.render(viewId, this.recordId, this.moduleId));
        this.groups.push(group);
        // 注册销毁事件
        this.$on("destroyed", () => {
          group.$destroy();
        });
      });
    }
    return Promise.all(promises);
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
          promises.push(group.render(batchCtrl.batchId, this.recordId, 'detailBatchForm'));
        }
      });
    }
    return Promise.all(promises);
  }

  handlerViewOperation() {
    return this.handlerOperation().then(() =>{
      this.operations = this.operationList;
      return this;
    });
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
    return {};
  }

  handlerDestroy(){
    console.log("销毁 DetailView", this.title);
    this.groups = [];
    this.operations = [];
    this.componentRender = false; // 委派组件渲染函数
  }
}

export default DetailView;
