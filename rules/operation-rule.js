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

var _operationRuleData = Symbol("OperationRuleData");
/**
 * 操作条件
 */

var OperationRule = function () {
  function OperationRule(operationRuleData, view) {
    var _this = this;

    _classCallCheck(this, OperationRule);

    this['_puid'] = _globalUid2.default.get();
    this[_shared._view] = view;
    this[_operationRuleData] = operationRuleData;
    view.$on("destroyed", function () {
      delete _this[_shared._view];
      delete _this[_operationRuleData];
    });
    console.log(this[_operationRuleData].ruleName, "OperationRule", this);
  }

  _createClass(OperationRule, [{
    key: "handler",
    value: function handler(columnMap) {
      var ts = this;
      return function HANDLER(rowDatas) {
        var status = false;
        var ruleConditions = ts.operationRuleConditions;
        for (var index in rowDatas) {
          var rowData = rowDatas[index] || {};
          for (var i in ruleConditions) {
            var ruleCondition = ruleConditions[i];
            var column = columnMap[ruleCondition.sourceColumnId] || {};
            var value = rowData[column.valKey];
            // if(!value) {
            //   //若操作相关字段没有值，则将操作都隐藏
            //   status = true
            // }else {
            //   status = validateCondition(value, ruleCondition.conditionType, ruleCondition.conditionValue);
            // }
            if (!value && value !== 0) {
              value = '';
            }
            status = (0, _shared.validateCondition)(value, ruleCondition.conditionType, ruleCondition.conditionValue);
            // status = true 满足条件
            if (status) {
              break;
            }
          }
          if (status) {
            break;
          }
        }
        return status;
      };
    }
  }, {
    key: "bindEventToViewOperation",
    value: function bindEventToViewOperation(operationMap, columnMap) {
      var operation = operationMap[this.operationId];
      if (operation) {
        operation.rules || (operation.rules = []);
        operation.rules.push(this.handler(columnMap));
      }
    }
  }, {
    key: "$id",
    get: function get() {
      return this[_operationRuleData].id;
    }
  }, {
    key: "operationId",
    get: function get() {
      return this[_operationRuleData].affectOperationId;
    }
  }, {
    key: "operationRuleConditions",
    get: function get() {
      return this[_operationRuleData].operationRuleConditions || [];
    }
  }]);

  return OperationRule;
}();

exports.default = OperationRule;