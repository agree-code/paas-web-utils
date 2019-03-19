import {
  renderService,
  businessService
} from "../services";
import {
  _view,
  _columnMap,
} from "./shared";
import View from "./view";
import Column from "./column";
import BatchRow from "./batch-row-view";

const _batchCtrl = Symbol("BatchCtrl");
const _records = Symbol("Records");
const _events = Symbol("EVENTS");

class BatchView extends View {
  constructor(batchCtrl, view) {
    super();
    this[_batchCtrl] = batchCtrl;
    this[_view] = view;
    this[_columnMap] = {};
    this.batchRows = [];
    this.columns = [];
    this.formKey = "object";
    this.formDeleteKey = "object";
    this.formModel = [];
    this.hidden = false;
    this.componentRender = false; // 委派组件渲染函数
  }

  get batchId() {
    return this[_batchCtrl].batchId;
  }

  get view() {
    return this[_view];
  }

  get records(){
    return this[_records] || [];
  }

  set records(records){
    this[_records] = records;
  }

  get minLen() {
    return this[_batchCtrl].min + this.deleteLen;
  }

  get maxLen() {
    return this[_batchCtrl].max + this.deleteLen;
  }

  get deleteLen(){
    let deleteRecord = [];
    for (const record of this.records || []) {
      if(record['[[dataStatus]]'] === 'is-remove'){
        deleteRecord.push(record);
      }
    }
    return deleteRecord.length;
  }

  get insertStatus() {
    return this.batchRows.length >= this.maxLen;
  }

  get deleteStatus() {
    return this.batchRows.length <= this.minLen;
  }

  get columnMap() {
    return this[_columnMap];
  }


  get submitModel() {
    if (this.hidden) return {};
    let submitModel = {};
    let formDatas = (submitModel[this.formKey] = []);
    this.batchRows.forEach((batchRow) => {
      if(batchRow.status === 'is-remove') return;
      let formData = {};
      this.columns.forEach(column => {
        formData[column.fromSubmitKey] = batchRow.formModel[column.valKey];
      });
      if (batchRow.record) {
        formData["obj.ID"] = batchRow.record["ID"] || batchRow.record["id"];
      }
      formDatas.push(formData);
    });
    return submitModel;
  }
  insertData(record) {
    let index = this.formModel.length;
    this.$set(this.formModel, index, {});
    return new Promise((resolve, reject) => {
      if (this.maxLen && this.batchRows.length >= this.maxLen) {
        reject(new Error(`超过最多${this.maxLen}条记录限制`));
      }
      let batchRow = new BatchRow({
          columnList: this.renderData.columnList,
          constraintList: this.renderData.constraintList,
          formulaList: this.renderData.formulaList,
          moduleRelateds: this.renderData.moduleRelateds,
          operationList: this.renderData.operationList,
          viewRuleList: this.renderData.viewRuleList,
          view: this.viewData,
          record: record
        },
        this
      );
      batchRow.handler(index);
      this.$set(this.batchRows, index, batchRow);
      this.$set(this.formModel, index, batchRow.formModel);
      resolve();
    });
  }

  inheritEvent(batchRow) {
    // 分配事件
    for (const type in this[_events]) {
      let typeEvents = this[_events][type];
      for (const iterator of typeEvents) {
        batchRow.addEventListener(type, iterator);
      }
    }
  }

  /**
   * 删除数据
   * @param {Integer} indexs 数据索引集合
   */
  deleteData(indexs) {
    if (this.minLen && this.batchRows.length <= this.minLen) {
      return new Error(`最少提交${this.minLen}条记录`);
    }
    indexs = indexs instanceof Array ? indexs : [indexs];
    indexs = `,${indexs.join(",")},`;

    let batchRows = this.batchRows.filter((batchRow, index) => {
      if (indexs.indexOf(`,${index},`) >= 0) {
        return true;
      }
      return false;
    });
    for (const batchRow of batchRows) {
      let index = this.batchRows.indexOf(batchRow);
      if (index === -1) continue;
      this.$delete(this.batchRows, index);
      this.$delete(this.formModel, index);
      batchRow.$offDestroy();
      batchRow.$destroy();
    }
    this.$timeout(() => {
      this.$emit("update", this);
    });
  }
  /**
   * 清空数据
   */
  clearData() {
    if (this.minLen > 0) {
      return new Error(`存在最少数据限制不能清空所有`);
    }
    while (this.batchRows.length > 0) {
      let batchRow = this.batchRows[0];
      this.$delete(this.batchRows, 0);
      this.$delete(this.formModel, 0);
      batchRow.$offDestroy();
      batchRow.$destroy();
    }
    this.$timeout(() => {
      this.$emit("update", this);
    });
  }

  /**
   * 渲染视图
   * @param viewId 视图Id
   * @param recordId 真实数据Id
   */
  render(viewId, recordId, type = 'batchForm') {
    this.$id = viewId;
    return renderService.findInsertViewRender(viewId).then(result => {
      this.handlerView(result, type, recordId);
      this.handlerBatchHeader();
      return this.handlerBatchViewRecord();
    }).then(() => {
      // 触发 分组创建事件
      this.$emit('created', this);
      this.view.$on("destroyed", () => {
        this.handlerDestroy();
      });
      return this;
    });
  }

  handlerBatchHeader() {
    this.formKey = `obj${this.viewData.id}`;
    this.columns = [];
    this.renderData.columnList.forEach(_column => {
      let column = new Column();
      // 处理字段
      column.render(_column, this);
      // 处理字段只读内容
      column.handlerColumnReadonly();
      // 处理字段显示隐藏
      column.handlerColumnHidden();
      // 处理字段校验规则
      column.handlerColumnValidRule();
      // 建立映射
      this[_columnMap][column.$id] = column;
      this[_columnMap][`${column.columnCode}@${column.moduleCode}`] = column;
      this.columns.push(column);
    });
  }

  handlerBatchViewRecord() {
    let promises = [];
    if (this.recordId) {
      // 初始化 列表数据
      return businessService.findBatchAll({
        viewId: this.$id,
        currentPage: 1,
        pageSize: this.maxLen || 10000,
        curModuleId: this.view.moduleId,
        recordId: this.recordId
      }).then(res => res.record).then(records => {
        this.records = records;
        for (const record of records) {
          promises.push(this.insertData(record))
        }
        return Promise.all(promises);
      }, function (){
        return Promise.all(promises);
      });
    } else {
      let dataIndex = this.batchRows.length;
      let minLen = this.minLen;
      while (dataIndex < minLen) {
        promises.push(this.insertData());
        dataIndex++;
      }
    }
    return Promise.all(promises);
  }

  /**
   * 获取改变视图
   */
  getChangeContent() {
    let batchViewContent = {
      batchCtrl: this[_batchCtrl],
      highlightColumns: [],
      changeRecords: [],
      records: []
    };
    // 确定删除操作
    let temRecords = [];
    temRecords.push.apply(temRecords, this.records);
    for (const batchRow of this.batchRows) {
      if (batchRow.status === 'is-remove') continue;
      let changeRecord = Object.assign({}, batchRow.record);
      let highlightColumn = [];
      let recordIndex = temRecords.indexOf(batchRow.record);
      if (recordIndex < 0 || batchRow.status === 'is-create') {
        // 新增行
        changeRecord['[[dataStatus]]'] = "is-create";
      } else {
        temRecords.splice(recordIndex, 1);
      }
      let isNone = true;
      for (const column of batchRow.columns) {
        let oldValue = Boolean(batchRow.record[column.valKey]) ? batchRow.record[column.valKey] : undefined;
        let value = Boolean(batchRow.formModel[column.valKey]) ? batchRow.formModel[column.valKey] : undefined;
        if (oldValue != value && changeRecord['[[dataStatus]]'] !== 'is-create') {
          highlightColumn.push(column.$id);
          let oldShowVal = BatchView.format(batchRow.record, column);
          let showVal = BatchView.format(batchRow.formModel, column);
          if (!showVal) {
            showVal = "Null";
          }
          if (!oldShowVal) {
            oldShowVal = "Null";
          }
          changeRecord[column.showValKey + '_ALTERATION'] = `${oldShowVal} => ${showVal}`;
          isNone = false;
        }

        changeRecord[column.showValKey] = batchRow.formModel[column.showValKey];
        changeRecord[column.valKey] = batchRow.formModel[column.valKey];
      }

      if (isNone && changeRecord['[[dataStatus]]'] !== 'is-create') {
        // 无变化
        changeRecord['[[dataStatus]]'] = 'is-none';
      }
      batchViewContent.changeRecords.push(changeRecord);
      batchViewContent.highlightColumns.push(highlightColumn);
      if (changeRecord['[[dataStatus]]'] === 'is-create') {
        batchViewContent.records.push(changeRecord);
      } else {
        batchViewContent.records.push(batchRow.record);
      }
    }
    // 已经删除的内容
    for (const record of temRecords) {
      let _record = Object.assign({}, record);
      if(_record['[[dataStatus]]'] === 'is-create') continue;
      _record['[[dataStatus]]'] = "is-remove";
      batchViewContent.changeRecords.push(_record);
      batchViewContent.highlightColumns.push([]);
      batchViewContent.records.push(record);
    }
    return batchViewContent;
  }

  /**
   * 添加触发事件
   * @param type 事件类型
   * @param fn 事件回调函数
   */
  addEventListener(type, fn) {
    switch (type) {
      case 'group.created':
        super.addEventListener('created', fn);
        break;
      case 'group.change':
      case 'group.update':
        super.addEventListener('update', fn);
        break;
      case 'group.destroyed':
        super.addEventListener('destroyed', fn);
        break;
      case 'change':
      case 'update':
        type = "update";
      case 'created':
      case 'destroyed':
        this[_events] || (this[_events] = {});
        this[_events][type] || (this[_events][type] = []);
        this[_events][type].push(fn);
        // 如果有初始化内容自动初始化
        for (const batchRow of this.batchRows) {
          this.inheritEvent(batchRow);
        }
        break;
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

  handlerDestroy() {
    console.log("销毁 BatchView", this.title);
    for (const column of this.columns) {
      column.handlerBashColumn(undefined, undefined)
    }
    delete this[_batchCtrl];
    delete this[_view];
    this[_columnMap] = {};
    this.batchRows = [];
    this.columns = [];
    this.formKey = "object";
    this.formDeleteKey = "object";
    this.formModel = [];
    this.hidden = false;
    this.componentRender = false; // 委派组件渲染函数
    this.$destroy();
  }
}

export default BatchView;
