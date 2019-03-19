"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _render = require("../services/render");

var _render2 = _interopRequireDefault(_render);

var _business = require("../services/business");

var _business2 = _interopRequireDefault(_business);

var _user = require("../services/user");

var _user2 = _interopRequireDefault(_user);

var _view = require("./view");

var _view2 = _interopRequireDefault(_view);

var _viewGroup = require("./view-group");

var _viewGroup2 = _interopRequireDefault(_viewGroup);

var _batchView = require("./batch-view");

var _batchView2 = _interopRequireDefault(_batchView);

var _shared = require("./shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InsertView = function (_View) {
  _inherits(InsertView, _View);

  function InsertView() {
    _classCallCheck(this, InsertView);

    var _this = _possibleConstructorReturn(this, (InsertView.__proto__ || Object.getPrototypeOf(InsertView)).call(this));

    _this.groups = [];
    _this.operations = [];
    _this.componentRender = false; // 委派组件渲染函数
    return _this;
  }

  _createClass(InsertView, [{
    key: "render",
    value: function render(viewId, recordId) {
      var _this2 = this;

      this.$id = viewId;
      return this._axios(viewId, recordId).then(function (result) {
        // 处理默认视图信息
        _this2.handlerView(result, _this2.viewType, recordId);
        _this2.handlerViewGroup();
        return _this2.handlerBatchViewGroup();
      }).then(function () {
        // 处理视图操作
        return _this2.handlerViewOperation();
      }).then(function (_) {
        // 处理视图公式
        _this2.handlerViewFormula();
        // 处理视图条件
        _this2.handlerViewRule();
        // 处理操作条件
        _this2.handlerOperationRule();
        // 绑定公式、条件等数据
        _this2.bindEventToView(_this2.columnMap);
        // 绑定真实数据回显
        _this2.handlerViewRecord(_this2.columnMap);
        // 触发创建事件
        _this2.$emit("created", _this2);
        _this2.$timeout(function () {
          _this2.$emit("update", _this2, _this2.record ? [_this2.record] : []);
        });
        _this2.$on("destroyed", function () {
          _this2.handlerDestroy();
        });
        return _this2;
      });
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

    /**
     * 触发关联数据
     * @param relation 关联数据
     */

  }, {
    key: "triggerRelation",
    value: function triggerRelation(relation) {
      var _this3 = this;

      if (!relation) return;
      var promise = undefined;
      if (!relation.relationId) {
        promise = Promise.resolve([{}]);
      } else if (relation.relationViewId === _shared.SYS_ORG_LIST) {
        // 部门关联数据 特殊处理
        promise = _user2.default.findUserList({
          userIdList: [relation.relationId]
        });
      } else {
        promise = _business2.default.findAllByViewIdAndRecordIds({
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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var group = _step.value;

          if (!(group instanceof _viewGroup2.default)) return "continue";
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            var _loop2 = function _loop2() {
              var column = _step2.value;

              // 避免死循环
              if (relation.sourceColumnId === column.$id) return "continue";
              var dataRelationModuleId = column.dataRelationModuleId;
              if (!relation.sourceColumnId) {
                dataRelationModuleId = column.insertDataRelationModuleId;
              }
              if (relation.relationModuleId === dataRelationModuleId) {
                _this4.$set(group.formModel, column.valKey, record.orgCode);
              } else if (relation.relationModuleId.indexOf("," + dataRelationModuleId + ",") > -1) {
                if (column.isOtherModuleRelated) {
                  var value = record[column.valKey];
                  var showValue = record[column.showValKey];
                  if (value === null || value === "null") {
                    value = undefined;
                  }
                  if (showValue === null || showValue === "null") {
                    value = undefined;
                  }
                  _this4.$set(group.formModel, column.valKey, value);
                  _this4.$set(group.formModel, column.showValKey, showValue);
                } else {
                  column.dataRelationColumn().then(function (dataColumn) {
                    if (column.isForeignKey) {
                      var _value = record[dataColumn.moduleCode + "_ID"] || record[dataColumn.moduleCode + "_id"];
                      if (_value === null || _value === "null") {
                        _value = undefined;
                      }
                      // TODO: 可能有问题
                      _this4.$set(group.formModel, column.valKey, _value);
                    } else {
                      var _value2 = record[dataColumn.valKey];
                      var _showValue = record[dataColumn.showValKey];
                      if (_value2 === null || _value2 === "null") {
                        _value2 = undefined;
                      }
                      if (_showValue === null || _showValue === "null") {
                        _value2 = undefined;
                      }
                      _this4.$set(group.formModel, column.valKey, _value2);
                      _this4.$set(group.formModel, column.showValKey, _showValue);
                    }
                  });
                }
              }
            };

            for (var _iterator2 = group.columns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _ret2 = _loop2();

              if (_ret2 === "continue") continue;
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
        };

        for (var _iterator = this.groups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ret = _loop();

          if (_ret === "continue") continue;
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

    /**
     * 根据字段Id获取视图分组
     * @param {*} columnId 字段Id
     */

  }, {
    key: "findViewGroupByColumnId",
    value: function findViewGroupByColumnId(columnId) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.groups[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _group = _step3.value;

          if (_group.columnMap[columnId]) {
            return _group;
          }
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

      return undefined;
    }

    /**
     * 获取视图类型(可以重写该方法)
     */

  }, {
    key: "_axios",

    /**
     * 获取视图渲染数据(可以重写该方法)
     * @param {Integer} viewId 视图Id
     * @param {Integer} recordId 真实数据Id
     */
    value: function _axios(viewId, recordId) {
      var _this5 = this;

      var cacheKey = "renderService.findInsertViewRender(" + viewId + ")";
      if (this.$space[cacheKey]) {
        return this.$space[cacheKey];
      } else {
        var promise = _render2.default.findInsertViewRender(viewId).then(function (result) {
          _this5.$space[cacheKey] = Promise.resolve(result);
          return result;
        });
        this.$space[cacheKey] = promise;
        return promise;
      }
    }
  }, {
    key: "handlerViewGroup",
    value: function handlerViewGroup() {
      var _this6 = this;

      var viewData = this.viewData;
      this.groups.splice(0, this.groups.length);
      // 处理视图分组
      if (viewData.viewGroupList && viewData.viewGroupList.length > 0) {
        viewData.viewGroupList.forEach(function (viewGroupData) {
          if (!viewGroupData.colList) return;
          var group = new _viewGroup2.default(_this6, viewGroupData);
          _this6.groups.push(group);
          group.render();
        });
      }
    }
  }, {
    key: "handlerBatchViewGroup",
    value: function handlerBatchViewGroup() {
      var _this7 = this;

      // 处理批量视图
      var promises = [];
      var batchCtrls = this.viewData.batchCtrls;
      if (batchCtrls && batchCtrls !== null) {
        batchCtrls.forEach(function (batchCtrl) {
          if (batchCtrl.batchId) {
            var _group2 = new _batchView2.default(batchCtrl, _this7);
            _this7.groups.push(_group2);
            promises.push(_group2.render(batchCtrl.batchId, _this7.recordId));
          }
        });
      }
      return Promise.all(promises);
    }
  }, {
    key: "handlerViewOperation",
    value: function handlerViewOperation() {
      var _this8 = this;

      return _get(InsertView.prototype.__proto__ || Object.getPrototypeOf(InsertView.prototype), "handlerOperation", this).call(this).then(function () {
        _this8.operations = _this8.operationList;
        return _this8;
      });
    }
  }, {
    key: "handlerDestroy",
    value: function handlerDestroy() {
      console.log("销毁 InsertView", this.title);
      this.groups = [];
      this.operations = [];
      this.componentRender = false; // 委派组件渲染函数
    }
  }, {
    key: "record",
    get: function get() {
      return this.renderData.record || this.renderData.recordColumns;
    }
  }, {
    key: "columnMap",
    get: function get() {
      var columnMap = {};
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.groups[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _group3 = _step4.value;

          if (_group3 instanceof _viewGroup2.default) {
            Object.assign(columnMap, _group3.columnMap);
          }
        }
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

      return columnMap;
    }
  }, {
    key: "submitModel",
    get: function get() {
      var submitModel = {
        viewId: this.$id,
        columnMap: {},
        batchColumn: {}
      };
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.groups[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _group4 = _step5.value;

          if (_group4 instanceof _viewGroup2.default) {
            Object.assign(submitModel.columnMap, _group4.submitModel);
          } else if (_group4 instanceof _batchView2.default) {
            Object.assign(submitModel.batchColumn, _group4.submitModel);
          }
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

      if (this.recordId) {
        submitModel.columnMap["obj.ID"] = this.recordId;
      }
      return submitModel;
    }
  }, {
    key: "viewType",
    get: function get() {
      return "insert";
    }
  }]);

  return InsertView;
}(_view2.default);

exports.default = InsertView;