import renderService from "../services/render";
import InsertView from "./insert-view";
import ViewGroup from "./view-group";
import BatchView from "./batch-view";

class EditView extends InsertView {
  constructor() {
    super();
  }

  /**
   * 获取改变字段内容
   */
  getChangeContent() {
    let record = this.record || {};

    let changeContent = {
      viewId: this.$id,
      record: Object.assign({}, record),
      changeRecord: Object.assign({}, record),
      highlightColumns: [],
      batchViews: []
    };

    for (const group of this.groups) {
      if (group instanceof ViewGroup) {
        for (const column of group.columns) {
          let oldValue = Boolean(record[column.valKey]) ? record[column.valKey] : undefined;
          let value = Boolean(group.formModel[column.valKey]) ? group.formModel[column.valKey] : undefined;
          if (oldValue != value) {
            changeContent.highlightColumns.push(column.$id);
            let oldShowVal = EditView.format(record, column);
            let showVal = EditView.format(group.formModel, column);
            if(!oldShowVal){
              oldShowVal = "Null";
            }
            if(!showVal){
              showVal = "Null";
            }
            changeContent.changeRecord[column.showValKey + '_ALTERATION'] = `${oldShowVal} => ${showVal}`;
          }
          changeContent.changeRecord[column.showValKey] = group.formModel[column.showValKey];
          changeContent.changeRecord[column.valKey] = group.formModel[column.valKey];
        }
      } else if (group instanceof BatchView) {
        changeContent.batchViews.push(group.getChangeContent());
      }
    }
    return changeContent;
  }

  /**
   * 获取视图类型(可以重写该方法)
   */
  get viewType() {
    return "update";
  }
  /**
   * 获取视图渲染数据(可以重写该方法)
   * @param {Integer} viewId 视图Id
   * @param {Integer} recordId 真实数据Id
   */
  _axios(viewId, recordId) {
    return renderService.findUpdateViewRender(viewId, recordId);
  }
}

export default EditView;
