import renderService from "../services/render";
import View from "./view";
import Column from "./column";
import {
  validateCondition,
  _columnMap
} from "./shared";

class ListView extends View {

  constructor() {
    super();
    this[_columnMap] = {};
    this.columns = [];
    this.operations = {
      buttons: [],
      component: [],
      detail: []
    };
    this.hidden = false;
    this.componentRender = false; // 委派组件渲染函数
  }

  get sort() {
    if (this.renderData.sidx && this.renderData.sidx.order && this.renderData.sidx.sidx) {
      return this.renderData.sidx;
    }
    return {
      order: "desc",
      sidx: "ID"
    };
  }

  get columnMap() {
    return this[_columnMap];
  }

  dialogRender(viewId) {
    this.$id = viewId;
    this.datasource = {
      viewId: this.$id, // 加载视图Id
      reload: false, // 特殊状态(是否重新刷新数据内容)
      currentPage: 1, // 当前页码
      pageSize: 10, // 分页大小
      sidx: "id", // 排序字段
      order: "desc", // 升序/降序
      fuzzyQueryVal: undefined, // 模糊搜索值
      recordId: undefined, // 用于查询子模块数据
      curModuleId: undefined, // 用于查询子模块数据
      tagId: undefined, // 当前搜索标签Id
      searchList: [] // 条件内容
    };
    let promise = undefined;
    if (this.$space[`renderService.findListViewRender(${viewId})`]) {
      promise = this.$space[`renderService.findListViewRender(${viewId})`];
    } else {
      promise = renderService.findListViewRender(viewId).then((result) => {
        this.$space[`renderService.findListViewRender(${viewId})`] = Promise.resolve(result);
        return result;
      });
      this.$space[`renderService.findListViewRender(${viewId})`] = promise;
    }
    return promise.then((result) => {
      // 渲染视图公式等
      this.handlerView(result, "list", undefined);
      Object.assign(this.datasource, this.sort);
      this.handlerColumn();
      this.$emit(`created`, this);
      return this;
    });
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
    if (this.$space[`renderService.findListViewRender(${viewId})`]) {
      promise = this.$space[`renderService.findListViewRender(${viewId})`];
    } else {
      promise = renderService.findListViewRender(viewId).then((result) => {
        this.$space[`renderService.findListViewRender(${viewId})`] = Promise.resolve(result);
        return result;
      });
      this.$space[`renderService.findListViewRender(${viewId})`] = promise;
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
   * 行点击事件
   */
  rowClick(vm, rowData) {
    for (const iterator of this.operations.detail) {
      if (!iterator.isHidden(rowData)) {
        iterator.triggerClick(vm, [rowData]);
        break;
      }
    }
  }
  /**
   * table行样式
   */
  rowStyle(rowData) {
    let style = {};
    let viewSpcShowList = this.renderData.viewSpcShowList;
    if (viewSpcShowList instanceof Array) {
      for (const iterator of viewSpcShowList) {
        let column = this.columnMap[iterator.showColumn];
        let value = rowData[column.valKey];
        if (validateCondition(value, iterator.searchType, iterator.searchVal)) {
          style['background'] = iterator.showVal;
        }
      }
    }
    return style;
  }
  /**
   * 获取当前列表所有字段的模块Id分组
   */
  currentModuleIds() {
    let currentModuleIds = {};
    for (const iterator of this.columns) {
      currentModuleIds[iterator.moduleId] = true;
    }
    return Object.keys(currentModuleIds);
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
   * 处理列表视图字段
   * @param {ListView} view 列表视图
   */
  handlerColumn() {
    // 处理字典
    this.columns = [];
    for (const _column of this.renderData.columnList || []) {
      let column = new Column();
      column.render(_column, this);
      // 处理字段显示隐藏
      column.handlerColumnHidden();
      this.columnMap[column.$id] = column;
      this.columnMap[`${column.columnCode}@${column.columnData.moduleCode}`] = column;
      this.columns.push(column);
    }
  }
  /**
   * 处理列表视图操作
   * @param {ListView} view 列表视图
   */
  handlerViewOperation() {
    this.handlerOperation();
    for (const operation of this.operationList) {
      if (operation.isDetail) {
        this.operations.detail.push(operation);
      } else if (operation.isTop) {
        // 按钮组操作
        this.operations.buttons.push(operation);
      } else {
        // 组件内操作
        this.operations.component.push(operation);
      }
    }
  }

  handlerDestroy() {
    console.log("销毁 ListView", this.title);
    this[_columnMap] = {};
    this.columns = [];
    this.operations = {
      buttons: [],
      component: [],
      detail: []
    };
    this.hidden = false;
    this.componentRender = false; // 委派组件渲染函数
  }
}

export default ListView;
