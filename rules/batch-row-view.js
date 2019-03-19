"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _shared = require("./shared");

var _services = require("../services");

var _view = require("./view");

var _view2 = _interopRequireDefault(_view);

var _column3 = require("./column");

var _column4 = _interopRequireDefault(_column3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 私有属性Key
var _batchView = Symbol("BatchView");
var _DESTROYED_FN = Symbol("DESTROYED_FN");

var BatchRow = function (_View) {
  _inherits(BatchRow, _View);

  function BatchRow(result, batchView) {
    _classCallCheck(this, BatchRow);

    var _this = _possibleConstructorReturn(this, (BatchRow.__proto__ || Object.getPrototypeOf(BatchRow)).call(this));

    _this[_batchView] = batchView;
    _this[_shared._columnMap] = {};
    _this.rules = {};
    _this.columns = [];
    _this.formModel = {};
    _this.handlerView(result, "batchFormRow");
    return _this;
  }

  _createClass(BatchRow, [{
    key: "handler",
    value: function handler(index) {
      var _this2 = this;

      this.renderData.columnList.forEach(function (_column) {
        var column = new _column4.default();
        // 处理字段
        column.render(_column, _this2);
        // 处理字段默认事件
        column.handlerColumnDefaultEvent();
        // 处理字段只读内容
        column.handlerColumnReadonly();
        // 处理字段显示隐藏
        column.handlerColumnHidden();
        // 处理字段校验规则
        column.handlerColumnValidRule();
        // 建立映射
        _this2.columnMap[column.$id] = column;
        _this2.columnMap[column.columnCode + "@" + column.moduleCode] = column;
        // 添加到表单模型
        _this2.formModel[column.valKey] = undefined;
        // 添加字段规则
        _this2.rules[column.valKey] = column.rules;
        // 添加字段
        _this2.columns.push(column);
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
      this[_DESTROYED_FN] = function () {
        _this2.handlerDestroy();
      };
      this[_batchView].$on("destroyed", this[_DESTROYED_FN]);
      return this;
    }
  }, {
    key: "triggerRelation",
    value: function triggerRelation(relation) {
      var _this3 = this;

      if (!relation) return;
      var promise = undefined;
      // 部门关联数据 特殊处理
      if (!relation.relationId) {
        promise = Promise.resolve([{}]);
      } else if (relation.relationViewId === _shared.SYS_ORG_LIST) {
        promise = _services.userService.findUserList({
          userIdList: [relation.relationId]
        });
      } else {
        promise = _services.businessService.findAllByViewIdAndRecordIds({
          viewId: relation.relationViewId,
          recordIds: [relation.relationId]
        });
      }
      promise.then(function (res) {
        _this3.handlerRelationColumn(relation, res[0]);
      });
    }

    /**
     * 处理依赖字段
     * @param relation 依赖配置
     * @param record 真实数据
     */

  }, {
    key: "handlerRelationColumn",
    value: function handlerRelationColumn(relation, record) {
      var _this4 = this;

      console.log("依赖字段", relation.relationModuleId, relation, record);

      var _loop = function _loop(colIndex) {
        var column = _this4.columns[colIndex];
        // 避免死循环
        if (relation.sourceColumnId === column.$id) return "continue";
        var dataRelationModuleId = column.dataRelationModuleId;
        if (!relation.sourceColumnId) {
          dataRelationModuleId = column.insertDataRelationModuleId;
        }
        if (relation.relationModuleId === dataRelationModuleId) {
          _this4.$set(_this4.formModel, column.valKey, record.orgCode);
        } else if (relation.relationModuleId.indexOf("," + column.dataRelationModuleId + ",") > -1) {
          if (column.isOtherModuleRelated) {
            var value = record[column.valKey];
            var showValue = record[column.showValKey];
            if (value === null || value === "null") {
              value = undefined;
            }
            if (showValue === null || showValue === "null") {
              value = undefined;
            }
            _this4.$set(_this4.formModel, column.valKey, value);
            _this4.$set(_this4.formModel, column.showValKey, showValue);
          } else {
            column.dataRelationColumn().then(function (dataColumn) {
              if (column.isForeignKey) {
                var _value = record[dataColumn.moduleCode + "_ID"] || record[dataColumn.moduleCode + "_id"];
                if (_value === null || _value === "null") {
                  _value = undefined;
                }
                // TODO: 可能有问题
                _this4.$set(_this4.formModel, column.valKey, _value);
              } else {
                var _value2 = record[dataColumn.valKey];
                var _showValue = record[dataColumn.showValKey];
                if (_value2 === null || _value2 === "null") {
                  _value2 = undefined;
                }
                if (_showValue === null || _showValue === "null") {
                  _value2 = undefined;
                }
                _this4.$set(_this4.formModel, column.valKey, _value2);
                _this4.$set(_this4.formModel, column.showValKey, _showValue);
              }
            });
          }
        }
      };

      for (var colIndex in this.columns) {
        var _ret = _loop(colIndex);

        if (_ret === "continue") continue;
      }
    }
  }, {
    key: "findViewGroupByColumnId",
    value: function findViewGroupByColumnId() {
      return this;
    }
  }, {
    key: "$offDestroy",
    value: function $offDestroy() {
      this[_batchView].$off("destroyed", this[_DESTROYED_FN]);
    }
  }, {
    key: "$destroy",
    value: function $destroy() {
      _get(BatchRow.prototype.__proto__ || Object.getPrototypeOf(BatchRow.prototype), "$destroy", this).call(this);
      this.handlerDestroy();
    }
  }, {
    key: "handlerDestroy",
    value: function handlerDestroy() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _column2 = _step.value;

          _column2.handlerBashColumn(undefined, undefined);
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

      delete this[_batchView];
      this[_shared._columnMap] = {};
      this.rules = {};
      this.columns = [];
      this.formModel = {};
    }
  }, {
    key: "eventKey",
    get: function get() {
      return "view." + this.$id + ".row-" + this['_puid'];
    }
  }, {
    key: "columnMap",
    get: function get() {
      return this[_shared._columnMap];
    }
  }, {
    key: "status",
    get: function get() {
      return this.record['[[dataStatus]]'];
    }
  }]);

  return BatchRow;
}(_view2.default);

exports.default = BatchRow;