import Column from "./column";
import {
  _viewGroupData,
  _view,
  _columnMap,
} from "./shared";
import GlobalUid from "./global-uid";

class ViewGroup {

  constructor(view, viewGroupData) {
    this['_puid'] = GlobalUid.get();
    this[_view] = view;
    this[_viewGroupData] = viewGroupData;
    this[_columnMap] = {};
    this.componentRender = false; // 委派组件渲染函数
    this.hidden = false;
    this.columns = []; // 分组包含字段
    this.formModel = {}; // 表单模型
    this.rules = {};
  }

  get $id() {
    return this.viewGroupData.id || `${this.view.$id}-${this['_puid']}`;
  }

  get title() {
    return this.viewGroupData.name
  }

  get view() {
    return this[_view];
  }

  get type() {
    return "formLayout";
  }

  get moduleId() {
    return this.view.moduleId;
  }

  get viewGroupData() {
    return this[_viewGroupData] || {};
  }

  get columnMap() {
    return this[_columnMap];
  }

  get submitModel() {
    if (this.hidden) return {};
    let submitModel = {};
    this.columns.forEach((column) => {
      submitModel[column.fromSubmitKey] = this.formModel[column.valKey];
    })
    return submitModel;
  }

  render() {
    this.handlerColumn();
    this.view.$on("destroyed", () => {
      this.handlerDestroy();
    });
    return this;
  }

  /**
   * 触发创建事件
   */
  handlerColumn() {
    let viewGroupData = this.viewGroupData;
    this.columns = [];
    for (const columnData of viewGroupData.colList) {
      let column = new Column();
      // 处理字段
      column.render(columnData, this.view);
      // 处理字段默认事件
      column.handlerColumnDefaultEvent();
      // 处理字段只读内容
      column.handlerColumnReadonly();
      // 处理字段显示隐藏
      column.handlerColumnHidden();
      // 处理字段校验规则
      column.handlerColumnValidRule();
      // 创建字段映射
      this.columnMap[column.$id] = column;
      this.columnMap[`${column.columnCode}@${column.columnData.moduleCode}`] = column;
      this.columns.push(column);
      // 添加校验规则
      this.rules[column.valKey] = column.rules;
    }
  }

  /**
   * 委派渲染
   * @param fn 渲染函数(jsx写法)
   * @example https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage
   */
  appointRender(fn) {
    this.componentRender = fn || false;
  }

  handlerDestroy(){
    // 处理销毁的数据
    console.log("销毁 ViewGroup", this.title);
    delete this[_view];
    delete this[_viewGroupData];
    for (const column of this.columns) {
      column.handlerBashColumn(undefined, undefined)
    }
    this[_columnMap] = {};
    this.componentRender = false;
    this.hidden = false;
    this.columns = [];
    this.formModel = {};
    this.rules = {};
  }
}

export default ViewGroup;
