"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _shared = require("./shared");

var _globalUid = require("./global-uid");

var _globalUid2 = _interopRequireDefault(_globalUid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewRule = function () {
  function ViewRule(viewRule, view) {
    _classCallCheck(this, ViewRule);

    this['_puid'] = _globalUid2.default.get();
    this[_shared._viewRule] = viewRule;
    this[_shared._view] = view;
    this.type; // 控制在什么阶段执行
    this[_shared._bindColumns] = [];
    this.handler();
  }
  /**
   * 处理视图条件
   */


  _createClass(ViewRule, [{
    key: "handler",
    value: function handler() {
      var _this = this;

      var rule = this[_shared._viewRule];
      switch (rule.ruleType) {
        case "columnFilter":
          this[_shared._handlerFn] = this.columnOptDataFilter();
          this.type = "COLUMN_OPT_DATA_FILTER";
          break;
        case "hidden":
          this[_shared._handlerFn] = this.columnHidden(true);
          this.type = "COLUMN_HIDDEN";
          break;
        case "show":
          this[_shared._handlerFn] = this.columnHidden(false);
          this.type = "COLUMN_READONLY";
          break;
        case "readOnly":
          this[_shared._handlerFn] = this.columnReadonly();
          this.type = "COLUMN_READONLY";
          break;
      }
      console.log(this[_shared._viewRule].ruleName, "ViewRule", this);
      this[_shared._view].$on('destroyed', function () {
        // 销毁数据
        delete _this[_shared._viewRule];
        delete _this[_shared._view];
        delete _this[_shared._bindColumns];
        delete _this[_shared._handlerFn];
      });
    }
  }, {
    key: "columnOptDataFilter",
    value: function columnOptDataFilter() {
      var _this2 = this;

      var ruleConditions = {};
      (this[_shared._viewRule].viewRuleConditions || []).forEach(function (conditionItem) {
        if (_this2[_shared._bindColumns].indexOf(conditionItem.conditionValue) < 0) {
          _this2[_shared._bindColumns].push(conditionItem.conditionValue);
        }
        var ruleCondition = ruleConditions[conditionItem.conditionValue] ? ruleConditions[conditionItem.conditionValue] : ruleConditions[conditionItem.conditionValue] = [];
        ruleCondition.push({
          screenVal: undefined,
          columnId: conditionItem.customVal,
          searchType: conditionItem.conditionType
        });
      });
      var viewRule = this[_shared._viewRule];
      var view = this[_shared._view];
      return function COLUMN_OPT_DATA_FILTER(column, formModel, type) {
        var columnMap = column.view.columnMap;
        // 影响字段
        var affectColumn = columnMap[viewRule.affectColumns];
        var value = formModel[column.valKey];
        var searchList = affectColumn.datasource.searchList;
        var columnConditions = ruleConditions[column.$id];
        columnConditions.forEach(function (element) {
          if (value) {
            element.screenVal = value;
            if (searchList.indexOf(element) < 0) {
              searchList.push(element);
            }
          } else {
            element.screenVal = value;
            view.$delete(searchList, searchList.indexOf(element));
          }
        });
        if (Boolean(viewRule.isLinkage) && type !== "created") {
          // 清空数据
          setTimeout(function () {
            view.$set(formModel, affectColumn.valKey, undefined);
          });
        }
        // 字典才实时刷新数据
        if (affectColumn.isDict) {
          view.$set(affectColumn.datasource, "reload", true);
        }
      };
    }
  }, {
    key: "columnHidden",
    value: function columnHidden() {
      var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var handlers = this.baseHandler();
      var view = this[_shared._view];
      var affectColumns = (this[_shared._viewRule].affectColumns || "").split(",");
      return function COLUMN_HIDDEN(column, formModel) {
        var promises = [];
        handlers.forEach(function (handler) {
          var value = formModel[column.valKey];
          if ((0, _shared.validateCondition)(value, handler.conditionType, handler.conditionValue)) {
            promises.push(Promise.resolve(true));
          } else {
            promises.push(Promise.reject(false));
          }
        });
        Promise.all(promises).then(function () {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = affectColumns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var affectColumnId = _step.value;

              // true
              if (!view.columnMap[affectColumnId]) continue;
              view.$set(view.columnMap[affectColumnId], "hidden", status);
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
        }, function () {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = affectColumns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var affectColumnId = _step2.value;

              // false
              if (!view.columnMap[affectColumnId]) continue;
              view.$set(view.columnMap[affectColumnId], "hidden", !status);
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
        });
      };
    }
  }, {
    key: "columnReadonly",
    value: function columnReadonly() {
      var handlers = this.baseHandler();
      var view = this[_shared._view];
      var affectColumns = (this[_shared._viewRule].affectColumns || "").split(",");
      return function COLUMN_READONLY(column, formModel) {
        var promises = [];
        handlers.forEach(function (handler) {
          var value = formModel[column.valKey];
          if ((0, _shared.validateCondition)(value, handler.conditionType, handler.conditionValue)) {
            promises.push(Promise.resolve(true));
          } else {
            promises.push(Promise.reject(false));
          }
        });
        Promise.all(promises).then(function () {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = affectColumns[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var affectColumnId = _step3.value;

              // true
              if (!view.columnMap[affectColumnId]) continue;
              view.$set(view.columnMap[affectColumnId], "readonly", true);
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
        }, function () {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = affectColumns[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var affectColumnId = _step4.value;

              // false
              if (!view.columnMap[affectColumnId]) continue;
              view.$set(view.columnMap[affectColumnId], "readonly", false);
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
        });
      };
    }
  }, {
    key: "baseHandler",
    value: function baseHandler() {
      var _this3 = this;

      var handlers = [];
      (this[_shared._viewRule].viewRuleConditions || []).forEach(function (conditionItem) {
        if (_this3[_shared._bindColumns].indexOf(conditionItem.sourceColumnId) < 0) {
          _this3[_shared._bindColumns].push(conditionItem.sourceColumnId);
        }
        handlers.push({
          sourceColumnId: conditionItem.sourceColumnId,
          conditionType: conditionItem.conditionType,
          conditionValue: conditionItem.conditionValue
        });
      });
      return handlers;
    }
  }, {
    key: "bindEventToViewColumn",
    value: function bindEventToViewColumn(columnMap) {
      var _this4 = this;

      this[_shared._bindColumns].forEach(function (columnId) {
        var column = columnMap[columnId];
        if (!column) return;
        if (_this4.type !== "COLUMN_OPT_DATA_FILTER") {
          column.addEventListener("created", _this4[_shared._handlerFn]);
        }
        column.addEventListener("update", _this4[_shared._handlerFn]);
      });
    }
  }]);

  return ViewRule;
}();

exports.default = ViewRule;