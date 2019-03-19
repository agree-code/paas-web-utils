"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _services = require("../services");

var _shared = require("./shared");

var _view2 = require("./view");

var _view3 = _interopRequireDefault(_view2);

var _column2 = require("./column");

var _column3 = _interopRequireDefault(_column2);

var _batchRowView = require("./batch-row-view");

var _batchRowView2 = _interopRequireDefault(_batchRowView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _batchCtrl = Symbol("BatchCtrl");
var _records = Symbol("Records");
var _events = Symbol("EVENTS");

var BatchView = function (_View) {
  _inherits(BatchView, _View);

  function BatchView(batchCtrl, view) {
    _classCallCheck(this, BatchView);

    var _this = _possibleConstructorReturn(this, (BatchView.__proto__ || Object.getPrototypeOf(BatchView)).call(this));

    _this[_batchCtrl] = batchCtrl;
    _this[_shared._view] = view;
    _this[_shared._columnMap] = {};
    _this.batchRows = [];
    _this.columns = [];
    _this.formKey = "object";
    _this.formDeleteKey = "object";
    _this.formModel = [];
    _this.hidden = false;
    _this.componentRender = false; // 委派组件渲染函数
    return _this;
  }

  _createClass(BatchView, [{
    key: "insertData",
    value: function insertData(record) {
      var _this2 = this;

      var index = this.formModel.length;
      this.$set(this.formModel, index, {});
      return new Promise(function (resolve, reject) {
        if (_this2.maxLen && _this2.batchRows.length >= _this2.maxLen) {
          reject(new Error("\u8D85\u8FC7\u6700\u591A" + _this2.maxLen + "\u6761\u8BB0\u5F55\u9650\u5236"));
        }
        var batchRow = new _batchRowView2.default({
          columnList: _this2.renderData.columnList,
          constraintList: _this2.renderData.constraintList,
          formulaList: _this2.renderData.formulaList,
          moduleRelateds: _this2.renderData.moduleRelateds,
          operationList: _this2.renderData.operationList,
          viewRuleList: _this2.renderData.viewRuleList,
          view: _this2.viewData,
          record: record
        }, _this2);
        batchRow.handler(index);
        _this2.$set(_this2.batchRows, index, batchRow);
        _this2.$set(_this2.formModel, index, batchRow.formModel);
        resolve();
      });
    }
  }, {
    key: "inheritEvent",
    value: function inheritEvent(batchRow) {
      // 分配事件
      for (var type in this[_events]) {
        var typeEvents = this[_events][type];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = typeEvents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var iterator = _step.value;

            batchRow.addEventListener(type, iterator);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }

    /**
     * 删除数据
     * @param {Integer} indexs 数据索引集合
     */

  }, {
    key: "deleteData",
    value: function deleteData(indexs) {
      var _this3 = this;

      if (this.minLen && this.batchRows.length <= this.minLen) {
        return new Error("\u6700\u5C11\u63D0\u4EA4" + this.minLen + "\u6761\u8BB0\u5F55");
      }
      indexs = indexs instanceof Array ? indexs : [indexs];
      indexs = "," + indexs.join(",") + ",";

      var batchRows = this.batchRows.filter(function (batchRow, index) {
        if (indexs.indexOf("," + index + ",") >= 0) {
          return true;
        }
        return false;
      });
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = batchRows[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var batchRow = _step2.value;

          var index = this.batchRows.indexOf(batchRow);
          if (index === -1) continue;
          this.$delete(this.batchRows, index);
          this.$delete(this.formModel, index);
          batchRow.$offDestroy();
          batchRow.$destroy();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.$timeout(function () {
        _this3.$emit("update", _this3);
      });
    }
    /**
     * 清空数据
     */

  }, {
    key: "clearData",
    value: function clearData() {
      var _this4 = this;

      if (this.minLen > 0) {
        return new Error("\u5B58\u5728\u6700\u5C11\u6570\u636E\u9650\u5236\u4E0D\u80FD\u6E05\u7A7A\u6240\u6709");
      }
      while (this.batchRows.length > 0) {
        var batchRow = this.batchRows[0];
        this.$delete(this.batchRows, 0);
        this.$delete(this.formModel, 0);
        batchRow.$offDestroy();
        batchRow.$destroy();
      }
      this.$timeout(function () {
        _this4.$emit("update", _this4);
      });
    }

    /**
     * 渲染视图
     * @param viewId 视图Id
     * @param recordId 真实数据Id
     */

  }, {
    key: "render",
    value: function render(viewId, recordId) {
      var _this5 = this;

      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'batchForm';

      this.$id = viewId;
      return _services.renderService.findInsertViewRender(viewId).then(function (result) {
        _this5.handlerView(result, type, recordId);
        _this5.handlerBatchHeader();
        return _this5.handlerBatchViewRecord();
      }).then(function () {
        // 触发 分组创建事件
        _this5.$emit('created', _this5);
        _this5.view.$on("destroyed", function () {
          _this5.handlerDestroy();
        });
        return _this5;
      });
    }
  }, {
    key: "handlerBatchHeader",
    value: function handlerBatchHeader() {
      var _this6 = this;

      this.formKey = "obj" + this.viewData.id;
      this.columns = [];
      this.renderData.columnList.forEach(function (_column) {
        var column = new _column3.default();
        // 处理字段
        column.render(_column, _this6);
        // 处理字段只读内容
        column.handlerColumnReadonly();
        // 处理字段显示隐藏
        column.handlerColumnHidden();
        // 处理字段校验规则
        column.handlerColumnValidRule();
        // 建立映射
        _this6[_shared._columnMap][column.$id] = column;
        _this6[_shared._columnMap][column.columnCode + "@" + column.moduleCode] = column;
        _this6.columns.push(column);
      });
    }
  }, {
    key: "handlerBatchViewRecord",
    value: function handlerBatchViewRecord() {
      var _this7 = this;

      var promises = [];
      if (this.recordId) {
        // 初始化 列表数据
        return _services.businessService.findBatchAll({
          viewId: this.$id,
          currentPage: 1,
          pageSize: this.maxLen || 10000,
          curModuleId: this.view.moduleId,
          recordId: this.recordId
        }).then(function (res) {
          return res.record;
        }).then(function (records) {
          _this7.records = records;
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = records[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var record = _step3.value;

              promises.push(_this7.insertData(record));
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          return Promise.all(promises);
        }, function () {
          return Promise.all(promises);
        });
      } else {
        var dataIndex = this.batchRows.length;
        var minLen = this.minLen;
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

  }, {
    key: "getChangeContent",
    value: function getChangeContent() {
      var batchViewContent = {
        batchCtrl: this[_batchCtrl],
        highlightColumns: [],
        changeRecords: [],
        records: []
      };
      // 确定删除操作
      var temRecords = [];
      temRecords.push.apply(temRecords, this.records);
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.batchRows[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var batchRow = _step4.value;

          if (batchRow.status === 'is-remove') continue;
          var changeRecord = Object.assign({}, batchRow.record);
          var highlightColumn = [];
          var recordIndex = temRecords.indexOf(batchRow.record);
          if (recordIndex < 0 || batchRow.status === 'is-create') {
            // 新增行
            changeRecord['[[dataStatus]]'] = "is-create";
          } else {
            temRecords.splice(recordIndex, 1);
          }
          var isNone = true;
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = batchRow.columns[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var column = _step6.value;

              var oldValue = Boolean(batchRow.record[column.valKey]) ? batchRow.record[column.valKey] : undefined;
              var value = Boolean(batchRow.formModel[column.valKey]) ? batchRow.formModel[column.valKey] : undefined;
              if (oldValue != value && changeRecord['[[dataStatus]]'] !== 'is-create') {
                highlightColumn.push(column.$id);
                var oldShowVal = BatchView.format(batchRow.record, column);
                var showVal = BatchView.format(batchRow.formModel, column);
                if (!showVal) {
                  showVal = "Null";
                }
                if (!oldShowVal) {
                  oldShowVal = "Null";
                }
                changeRecord[column.showValKey + '_ALTERATION'] = oldShowVal + " => " + showVal;
                isNone = false;
              }

              changeRecord[column.showValKey] = batchRow.formModel[column.showValKey];
              changeRecord[column.valKey] = batchRow.formModel[column.valKey];
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
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
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = temRecords[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var record = _step5.value;

          var _record = Object.assign({}, record);
          if (_record['[[dataStatus]]'] === 'is-create') continue;
          _record['[[dataStatus]]'] = "is-remove";
          batchViewContent.changeRecords.push(_record);
          batchViewContent.highlightColumns.push([]);
          batchViewContent.records.push(record);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return batchViewContent;
    }

    /**
     * 添加触发事件
     * @param type 事件类型
     * @param fn 事件回调函数
     */

  }, {
    key: "addEventListener",
    value: function addEventListener(type, fn) {
      switch (type) {
        case 'group.created':
          _get(BatchView.prototype.__proto__ || Object.getPrototypeOf(BatchView.prototype), "addEventListener", this).call(this, 'created', fn);
          break;
        case 'group.change':
        case 'group.update':
          _get(BatchView.prototype.__proto__ || Object.getPrototypeOf(BatchView.prototype), "addEventListener", this).call(this, 'update', fn);
          break;
        case 'group.destroyed':
          _get(BatchView.prototype.__proto__ || Object.getPrototypeOf(BatchView.prototype), "addEventListener", this).call(this, 'destroyed', fn);
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
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = this.batchRows[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var batchRow = _step7.value;

              this.inheritEvent(batchRow);
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }

          break;
      }
    }

    /**
     * 委派渲染
     * @param fn 渲染函数(jsx写法)
     * @example https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage
     */

  }, {
    key: "appointRender",
    value: function appointRender(fn) {
      this.componentRender = fn || false;
    }
  }, {
    key: "handlerDestroy",
    value: function handlerDestroy() {
      console.log("销毁 BatchView", this.title);
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = this.columns[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var column = _step8.value;

          column.handlerBashColumn(undefined, undefined);
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      delete this[_batchCtrl];
      delete this[_shared._view];
      this[_shared._columnMap] = {};
      this.batchRows = [];
      this.columns = [];
      this.formKey = "object";
      this.formDeleteKey = "object";
      this.formModel = [];
      this.hidden = false;
      this.componentRender = false; // 委派组件渲染函数
      this.$destroy();
    }
  }, {
    key: "batchId",
    get: function get() {
      return this[_batchCtrl].batchId;
    }
  }, {
    key: "view",
    get: function get() {
      return this[_shared._view];
    }
  }, {
    key: "records",
    get: function get() {
      return this[_records] || [];
    },
    set: function set(records) {
      this[_records] = records;
    }
  }, {
    key: "minLen",
    get: function get() {
      return this[_batchCtrl].min + this.deleteLen;
    }
  }, {
    key: "maxLen",
    get: function get() {
      return this[_batchCtrl].max + this.deleteLen;
    }
  }, {
    key: "deleteLen",
    get: function get() {
      var deleteRecord = [];
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = (this.records || [])[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var record = _step9.value;

          if (record['[[dataStatus]]'] === 'is-remove') {
            deleteRecord.push(record);
          }
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      return deleteRecord.length;
    }
  }, {
    key: "insertStatus",
    get: function get() {
      return this.batchRows.length >= this.maxLen;
    }
  }, {
    key: "deleteStatus",
    get: function get() {
      return this.batchRows.length <= this.minLen;
    }
  }, {
    key: "columnMap",
    get: function get() {
      return this[_shared._columnMap];
    }
  }, {
    key: "submitModel",
    get: function get() {
      var _this8 = this;

      if (this.hidden) return {};
      var submitModel = {};
      var formDatas = submitModel[this.formKey] = [];
      this.batchRows.forEach(function (batchRow) {
        if (batchRow.status === 'is-remove') return;
        var formData = {};
        _this8.columns.forEach(function (column) {
          formData[column.fromSubmitKey] = batchRow.formModel[column.valKey];
        });
        if (batchRow.record) {
          formData["obj.ID"] = batchRow.record["ID"] || batchRow.record["id"];
        }
        formDatas.push(formData);
      });
      return submitModel;
    }
  }]);

  return BatchView;
}(_view3.default);

exports.default = BatchView;