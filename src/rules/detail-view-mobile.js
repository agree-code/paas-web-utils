import DetailView from './detail-view'
import renderService from "../services/render";

class DetailViewMobile extends DetailView {
  constructor() {
    super()
  }

  /**
   * 渲染视图
   * @param viewId 视图Id
   * @param recordId 真实数据Id
   */
  render(viewId, recordId) {
    return renderService.findDetailViewMobileRender(viewId, recordId).then(result => {
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
}

export default DetailViewMobile