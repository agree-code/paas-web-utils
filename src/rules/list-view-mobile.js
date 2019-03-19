import ListView from './list-view'
import renderService from "../services/render";
import Column from "./column";

class ListViewMobile extends ListView {
  constructor() {
    super()
  }

  /**
   * 渲染视图
   * @param viewId 视图Id
   * @param recordId 真实数据Id
   */
  render(viewId, recordId = undefined, moduleId = undefined) {
    this.$id = viewId;
    // 配置数据源
    this.datasource = {
      viewId: viewId, // 加载视图Id
      reload: false, // 特殊状态(是否重新刷新数据内容)
      currentPage: 1, // 当前页码
      pageSize: 10, // 分页大小
      sidx: "id", // 排序字段
      order: "desc", // 升序/降序
      fuzzyQueryVal: undefined, // 模糊搜索值
      recordId: recordId, // 用于查询子模块数据
      curModuleId: moduleId, // 用于查询子模块数据
      tagId: undefined, // 当前搜索标签Id
      searchList: [] // 条件内容
    };
    let promise = undefined;
    if (this.$space[`renderService.findListViewMobileRender(${viewId})`]) {
      promise = this.$space[`renderService.findListViewMobileRender(${viewId})`];
    } else {
      promise = renderService.findListViewMobileRender(viewId).then((result) => {
        this.$space[`renderService.findListViewMobileRender(${viewId})`] = Promise.resolve(result);
        return result;
      });
      this.$space[`renderService.findListViewMobileRender(${viewId})`] = promise;
    }
    return promise.then(result => {
      this.handlerView(result, "list", recordId);
      this.handlerColumn();
      this.handlerViewOperation(); // 处理操作
      this.handlerOperationRule(); // 处理操作条件
      Object.assign(this.datasource, this.sort);
      // 绑定视图字段中的事件
      this.bindEventToView(this.columnMap);
      // 触发创建事件
      this.$emit(`created`, this);
      this.$on("destroyed", () => {
        this.handlerDestroy();
      });
      return this;
    });
  }

  /**
   * 处理列表视图字段
   * @param {ListView} view 列表视图
   */
  handlerColumn() {
    // 处理字典
    this.columns = [];
    let columnList = this.renderData.columns.ShowColumnList
    for (const _column of columnList || []) {
      let column = new Column();
      column.render(_column, this);
      // 处理字段显示隐藏
      column.handlerColumnHidden();
      this.columnMap[column.$id] = column;
      this.columnMap[`${column.columnCode}@${column.columnData.moduleCode}`] = column;
      this.columns.push(column);
    }
  }

}

export default ListViewMobile