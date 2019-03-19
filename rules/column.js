"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _loginUser = require("../services/login-user");

var _loginUser2 = _interopRequireDefault(_loginUser);

var _view2 = require("./view");

var _view3 = _interopRequireDefault(_view2);

var _listView = require("./list-view");

var _listView2 = _interopRequireDefault(_listView);

var _services = require("../services");

var _dict = require("./dict");

var _dict2 = _interopRequireDefault(_dict);

var _shared = require("./shared");

var _enum = require("./enum");

var _http = require("../common/http.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getDate = function getDate(val, type) {
  var value = new Date(val);
  var seconds = value.getSeconds();
  var minutes = value.getMinutes();
  var hours = value.getHours();
  var months = value.getMonth() + 1;
  var days = value.getDate();
  var second = void 0,
      minute = void 0,
      hour = void 0,
      month = void 0,
      day = void 0;
  if (seconds < 10) {
    second = "0" + seconds;
  } else {
    second = seconds;
  }
  if (minutes < 10) {
    minute = "0" + minutes;
  } else {
    minute = minutes;
  }
  if (hours < 10) {
    hour = "0" + hours;
  } else {
    hour = hours;
  }
  if (months < 10) {
    month = "0" + months;
  } else {
    month = months;
  }
  if (days < 10) {
    day = "0" + days;
  } else {
    day = days;
  }
  switch (type) {
    case 1:
      return value.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute;
    case 2:
      return value.getFullYear() + "-" + month + "-" + day;
    case 3:
      return value.getFullYear() + "-" + month;
    case 4:
      return value.getFullYear() + "-01";
  }
};

var _dataRelationColumn = Symbol("DataRelationColumn");
var _dataShowColumn = Symbol("DataShowColumn");
var _foreignKeyView = Symbol("ForeignKeyView");
var _columnData = Symbol("ColumnData");
var _moduleRelated = Symbol("ModuleRelated");

var Column = function () {
  function Column() {
    _classCallCheck(this, Column);
  }

  _createClass(Column, [{
    key: "dataRelationColumn",


    /**
     * 获取字段依赖关系字段
     */
    value: function dataRelationColumn() {
      return this.handlerDataRelationColumn();
    }
    /**
     * 数据显示字段
     */

  }, {
    key: "dataShowColumn",
    value: function dataShowColumn() {
      var _this = this;

      // TODO: 数据显示字段
      if (this[_dataShowColumn]) return Promise.resolve(this[_dataShowColumn]);
      if (!this.isOtherModuleRelated) return this.dataRelationColumn();
      var moduleId = undefined;
      var columnId = undefined;
      if (this.isForeignKey) {
        moduleId = this.relatedData.relModuleId;
        columnId = this.relatedData.showColumnId;
      } else if (this.isChosenData) {
        moduleId = this.columnData.selectModuleId;
        columnId = this.columnData.selectShowColId;
      }
      if (!moduleId) return Promise.reject();
      if (this['[[DataShowColumnPromise]]']) return this['[[DataShowColumnPromise]]'];
      this['[[DataShowColumnPromise]]'] = _services.columnService.findById({
        columnId: columnId,
        moduleId: moduleId
      }).then(function (columnData) {
        _this[_dataShowColumn] = new Column();
        _this[_dataShowColumn].render(columnData);
        delete _this['[[DataShowColumnPromise]]'];
        return _this[_dataShowColumn];
      });
      return this['[[DataShowColumnPromise]]'];
    }
  }, {
    key: "triggerChange",


    /**
     * 触发改变事件
     */
    value: function triggerChange(formModel) {
      var _this2 = this;

      if (this.isForeignKey) {
        var foreignKeyView = this.foreignKeyView();
        foreignKeyView.then(function (listView) {
          var currentModuleIds = listView['currentModuleIds']();
          var relationViewId = !_this2.view.flag ? _this2.relatedData.showViewId : _this2.relatedData.showMobileViewId;
          _this2.view.triggerRelation({
            sourceColumn: _this2.label,
            sourceColumnId: _this2.$id,
            // relationViewId: this.relatedData.showViewId,
            relationViewId: relationViewId,
            relationId: formModel[_this2.valKey],
            relationModuleId: "," + currentModuleIds.join(",") + ","
          });
        });
      } else if (this.columnCode === _shared.OWNER_ID && this.type === _enum.COLUMN_ENUM.USER_SELECT) {
        this.view.triggerRelation({
          sourceColumn: this.label,
          sourceColumnId: this.$id,
          relationViewId: _shared.SYS_ORG_LIST,
          relationId: formModel[this.valKey],
          relationModuleId: _shared.SYS_ORG + "_" + this.moduleId
        });
      }
      this.view.$emit(this.updateEventName, this, formModel);
    }

    /**
     * 添加触发事件
     * @param type 事件类型
     * @param fn 事件回调函数
     */

  }, {
    key: "addEventListener",
    value: function addEventListener(type, fn) {
      var _this3 = this;

      if (type === "change") type = "update";
      if (type === "created" || type === "destroyed") {
        this.view.addEventListener(type, function (view) {
          // 求当前字段分组
          fn(_this3, view.findViewGroupByColumnId(_this3.$id).formModel);
        });
      } else {
        this.view.$on(this.valKey + "." + type, fn);
      }
    }

    /**
     * 删除触发事件
     * @param type 事件类型
     * @param fn 事件回调函数
     */

  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, fn) {
      if (type === "change") type = "update";
      if (type === "created" || type === "destroyed") {
        this.view.removeEventListener(type, fn);
      } else {
        this.view.$off(this.view.eventKey + "." + this.valKey + "." + type, fn);
      }
    }
  }, {
    key: "triggerShowValueChanage",
    value: function triggerShowValueChanage(value) {
      if (this.view) {
        this.view.findViewGroupByColumnId(this.$id).formModel[this.showValKey] = value;
      }
    }
  }, {
    key: "render",
    value: function render(columnData) {
      var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      this.handlerBashColumn(columnData, view);
      // 处理字段类型
      this.handlerColumnType();
      // 处理字段信息
      this.handlerColumnDataKey();
      // 处理字段数据源
      this.handlerColumnDatasource();
    }
  }, {
    key: "handlerBashColumn",
    value: function handlerBashColumn(columnData, view) {
      this[_columnData] = columnData;
      this[_shared._view] = view;
      // 公共属性
      this.type = undefined;
      this.placeholder = undefined;

      this.fromSubmitKey = undefined;
      this.valKey = undefined;
      this.showValKey = undefined;
      this.rules = [];
      this.datasource = {};
      this.full = false;

      this.isRequired = false; // 是否必填
      this.isMultiple = false; // 是否多选
      this.isMoney = false; // 金额字段
      this.isNumber = false; // 数字字段
      this.isForeignKey = false; // 外键选择
      this.isDict = false; // 是否为字典字段
      this.isRelated = false; // 字段依赖
      this.isOtherModuleRelated = false; // 其他模块字段依赖
      this.isChosenData = false; // 数据选择
      this.readonly = false;
      this.hidden = false;
      this.componentRender = false; // 委派组件渲染函数

      this.isHighlight = false; // 是否高亮
      // 其他属性
      if (this[_foreignKeyView] && this[_foreignKeyView].$destroy) {
        this[_foreignKeyView].$destroy();
      }
      delete this[_foreignKeyView];
      delete this[_dataRelationColumn];
      delete this[_moduleRelated];
    }
  }, {
    key: "foreignKeyView",
    value: function foreignKeyView() {
      var _this4 = this;

      if (this[_foreignKeyView] instanceof _listView2.default) {
        return Promise.resolve(this[_foreignKeyView]);
      } else if (this['_loadingForeignKeyView()']) {
        return this['_loadingForeignKeyView()'];
      } else if (this.isForeignKey || this.isChosenData) {
        // let viewId = this.isForeignKey ? this.relatedData.showViewId : this.columnData.selectViewId;
        var viewId = undefined;
        // 移动端获取数据
        if (this.view.flag === 1) {
          viewId = this.isForeignKey ? this.relatedData.showMobileViewId : this.columnData.mobileSelectViewId;
        } else {
          viewId = this.isForeignKey ? this.relatedData.showViewId : this.columnData.selectViewId;
        }
        if (viewId == -1) {
          this[_foreignKeyView] = {};
          return Promise.resolve(this[_foreignKeyView]);
        }
        var foreignKeyView = new _listView2.default();
        this['_loadingForeignKeyView()'] = foreignKeyView.dialogRender(viewId).then(function (view) {
          _this4[_foreignKeyView] = view;
          // 替换view 数据源 信息
          var datasource = view.datasource;
          delete datasource.searchList;
          delete _this4['_loadingForeignKeyView()'];
          view.datasource = Object.assign(_this4.datasource, datasource);
          return view;
        });
        return this['_loadingForeignKeyView()'];
      }
      return Promise.resolve({});
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
     * 处理字段数据Key
     */

  }, {
    key: "handlerColumnDataKey",
    value: function handlerColumnDataKey() {
      var column = this;
      var columnData = column.columnData;
      var suffix = "";
      if (this.isForeignKey) {
        suffix = "_RNAME";
      } else if (this.isChosenData) {
        suffix = "_SDNAME";
      } else if (this.isDict) {
        suffix = "_DNAME";
      } else if (columnData.colMark == "DEPARTMENT") {
        if (columnData.showColValSet == 3) {
          // 部门
          suffix = "_ONAME";
        } else if (columnData.showColValSet == 4) {
          // 用户
          suffix = "_UNAME";
        } else if (columnData.showColValSet == 5) {
          //TODO: 角色信息未完善
        }
      }
      // 表单数据Key
      column.fromSubmitKey = "obj." + columnData.phyColumnName;
      if (this.view && columnData.moduleId != this.view.moduleId) {
        column.fromSubmitKey = columnData.moduleCode + "." + columnData.phyColumnName;
      }
      // 数据值Key
      column.valKey = columnData.moduleCode + "_" + columnData.phyColumnName;
      // 可读数据值Key
      column.showValKey = columnData.moduleCode + "_" + columnData.phyColumnName + suffix;
    }
    /**
     * 处理字段类型
     */

  }, {
    key: "handlerColumnType",
    value: function handlerColumnType() {
      var column = this;
      var columnData = column.columnData;
      var type = _enum.COLUMN_ENUM.TEXT_INPUT;
      switch (Number(columnData.showType)) {
        case 1:
          switch (columnData.colMark) {
            case "AUTOCODE":
              type = _enum.COLUMN_ENUM.TEXT_INPUT;
              column.readonly = true;
              break;
            case "MONEY":
              type = _enum.COLUMN_ENUM.TEXT_INPUT;
              column.isMoney = true;
              break;
            case "NUMBER":
              type = _enum.COLUMN_ENUM.TEXT_INPUT;
              column.isNumber = true;
              break;
            case "FOREIGNKEY":
              type = _enum.COLUMN_ENUM.FOREIGNKEY;
              column.isForeignKey = true;
              break;
            case "RELATED":
              type = _enum.COLUMN_ENUM.RELATED_SELECT;
              column.isRelated = true;
              break;
            default:
              type = _enum.COLUMN_ENUM.TEXT_INPUT;
              break;
          }
          break;
        case 2:
          type = _enum.COLUMN_ENUM.RADIO_GROUP;
          this.isDict = true;
          break;
        case 3:
          type = _enum.COLUMN_ENUM.CHECKBOX_GROUP;
          column.isMultiple = true;
          this.isDict = true;
          break;
        case 4:
          type = _enum.COLUMN_ENUM.SELECT;
          this.isDict = true;
          break;
        case 5:
          type = _enum.COLUMN_ENUM.TEXT_AREA;
          break;
        case 6:
          switch (String(columnData.dateType).toUpperCase()) {
            case "DATE":
              type = _enum.COLUMN_ENUM.DATE;
              break;
            case "TIME":
              type = _enum.COLUMN_ENUM.TIME;
              break;
            case "YEAR":
              type = _enum.COLUMN_ENUM.YEAR;
              break;
            case "YEAR_MONTH":
              type = _enum.COLUMN_ENUM.YEAR_MONTH;
              break;
            case "MONTH":
              type = _enum.COLUMN_ENUM.MONTH;
              break;
            case "MONTH_DAY":
              type = _enum.COLUMN_ENUM.MONTH_DAY;
              break;
            case "DATETIME":
            default:
              type = _enum.COLUMN_ENUM.DATETIME;
              break;
          }
          break;
        case 7:
          switch (columnData.colMark) {
            case "CHOSENDATA":
              type = _enum.COLUMN_ENUM.DATA_SELECT;
              column.isChosenData = true;
              column.isMultiple = Boolean(columnData.isMoreData);
              break;
            case "DEPARTMENT":
              switch (Number(columnData.showColValSet)) {
                case 3:
                  type = _enum.COLUMN_ENUM.DEPT_SELECT;
                  break;
                case 4:
                  type = _enum.COLUMN_ENUM.USER_SELECT;
                  column.isMultiple = Boolean(columnData.isMoreData);
                  break;
                case 5:
                  break;
              }
              break;
          }

          break;
        case 8:
          type = _enum.COLUMN_ENUM.FILE;
          break;
        case 9:
          type = _enum.COLUMN_ENUM.IMAGE;
          break;
        case 10:
          type = _enum.COLUMN_ENUM.TEXT_AREA;
          break;
        case 50:
          type = _enum.COLUMN_ENUM.TEXT_LONG_INPUT;
          break;
      }
      column.placeholder = columnData.fieldIptPrompt || type.placeholder(columnData.columnName);
      var viewData = (column.view || {}).viewData;
      if (viewData && column.moduleId !== viewData.moduleId) {
        column.isOtherModuleRelated = true;
      }
      // 判断是否为依赖字段
      column.isRelated = Boolean(columnData.relyModuleId);
      column.full = type.full;
      return column.type = type;
    }
    /**
     * 添加字段默认事件
     */

  }, {
    key: "handlerColumnDefaultEvent",
    value: function handlerColumnDefaultEvent() {
      var _this5 = this;

      // 添加字段创建事件
      this.addEventListener("created", function (column, formModel) {
        //详情页不进行默认值的赋值
        if (_this5.view && _this5.view.type === 'detail') {
          return;
        }
        if (Boolean(_this5.columnData.defaultVal) && _this5.columnData.defaultVal !== null && _this5.columnData.colMark == "DATE") {
          var date = void 0;
          switch (_this5.columnData.defaultVal) {
            case "$YY-$MN-$DD $HH:$MM":
              date = getDate(new Date(), 1);
              date = new Date(Date.parse(date.replace(/-/g, "/")));
              date = date.getTime();
              break;
            case "$YY-$MN-$DD":
              date = getDate(new Date(), 2);
              date = new Date(Date.parse(date.replace(/-/g, "/")));
              date = date.getTime();
              break;
            case "$YY-$MN":
            case "$MN":
              date = getDate(new Date(), 3);
              date = new Date(Date.parse(date.replace(/-/g, "/")));
              date = date.getTime();
              break;
            case "$YY":
              date = getDate(new Date(), 4);
              date = new Date(Date.parse(date.replace(/-/g, "/")));
              date = date.getTime();
              break;
            default:
              date = new Date().getTime();
          }
          _view3.default.$set(formModel, column.valKey, date);
        } else if (Boolean(_this5.columnData.defaultVal) && _this5.columnData.defaultVal !== null) {
          _view3.default.$set(formModel, column.valKey, _this5.columnData.defaultVal);
        }
        // 判断如果是 部门选择 默认值为当前用户部门
        if (_this5.columnCode === _shared.ORG_CODE && _this5.type === _enum.COLUMN_ENUM.DEPT_SELECT) {
          _loginUser2.default.get().then(function (user) {
            if (!formModel[column.valKey]) {
              _view3.default.$set(formModel, column.valKey, user.orgCode);
            }
          });
        }
        // 如果为负责人则默认为当前用户
        if (_this5.columnCode === _shared.OWNER_ID && _this5.type === _enum.COLUMN_ENUM.USER_SELECT) {
          _loginUser2.default.get().then(function (user) {
            if (!formModel[column.valKey]) {
              _view3.default.$set(formModel, column.valKey, user.userId);
            }
          });
        }
      });
    }

    /**
     * 处理字段只读配置
     */

  }, {
    key: "handlerColumnReadonly",
    value: function handlerColumnReadonly() {
      var columnData = this.columnData;
      var view = this.view;
      var readonly = false;
      if (this.readonlyScope.indexOf("," + view.typeNum + ",") >= 0) {
        readonly = true;
      } else if (columnData.moduleId !== view.moduleId) {
        readonly = ("," + view.viewData.editRelatedModule + ",").indexOf("," + this.moduleId + ",") < 0;
      }
      _view3.default.$set(this, "readonly", readonly);
    }
    /**
     * 处理字段默认隐藏信息
     */

  }, {
    key: "handlerColumnHidden",
    value: function handlerColumnHidden() {
      var column = this;
      var viewData = column.view.viewData;
      var showColumns = "," + viewData.showColumns + ",";
      if (viewData.showColumns === "ALL" || !Boolean(viewData.showColumns)) {
        _view3.default.$set(this, "hidden", false);
      } else if (showColumns.indexOf("," + column.$id + ",") < 0) {
        _view3.default.$set(this, "hidden", true);
      }
    }
    /**
     * 处理字段校验规则
     */

  }, {
    key: "handlerColumnValidRule",
    value: function handlerColumnValidRule() {
      var _this6 = this;

      var column = this;
      // 视图相关的字段校验规则
      var viewData = column.view.viewData;
      var renderData = column.view.renderData;
      var columnData = column.columnData;

      var requiredCols = "," + viewData.requiredCols + ",";
      if (requiredCols.indexOf("," + column.$id + ",") >= 0) {
        column.rules.push({
          required: true,
          validator: function validator(rule, value, callback) {
            if ((Boolean(value) || value === 0) && String(value).trim().length > 0 || _this6.hidden) {
              callback();
            } else {
              callback(new Error(rule.message));
            }
          },
          message: column.placeholder,
          trigger: "blur"
        });
        this.isRequired = true;
      }
      // 长度校验
      var lenRule = {
        validator: function validator(rule, value, callback) {
          var _value = value || value === 0 ? String(value) : "";
          var bool = true;
          if (rule.min) {
            _value.length < rule.min && (bool = false);
          }
          if (rule.max) {
            _value.length > rule.max && (bool = false);
          }
          if (bool || _this6.hidden) {
            callback();
          } else {
            callback(new Error(rule.message));
          }
        }
      };
      if (parseInt(columnData.minLen) > 0) {
        lenRule.min = parseInt(columnData.minLen);
      }
      if (parseInt(columnData.maxLen) > 0) {
        lenRule.max = parseInt(columnData.maxLen);
      }
      if (lenRule.min || lenRule.max) {
        column.rules.push(lenRule);
        if (lenRule.min && !lenRule.max) {
          lenRule.message = "\u81F3\u5C11" + lenRule.min + "\u4E2A\u5B57\u7B26";
        } else if (!lenRule.min && lenRule.max) {
          lenRule.message = "\u6700\u957F" + lenRule.max + "\u4E2A\u5B57\u7B26";
        } else {
          lenRule.message = "\u957F\u5EA6\u5728 " + lenRule.min + " \u5230 " + lenRule.max + " \u4E2A\u5B57\u7B26";
        }
      }

      // 金额字段校验
      if (this.isMoney) {
        column.rules.push({
          validator: function validator(rule, value, callback) {
            if (!value || String(value).match(/^(\-?)\d+(\.\d+)?$/g) !== null) {
              callback();
            } else {
              callback(new Error(rule.message));
            }
          },
          message: "数据格式有误"
        });
      }

      // 数字字段校验
      if (this.isNumber) {
        column.rules.push({
          validator: function validator(rule, value, callback) {
            if (!value || !isNaN(Number(value))) {
              callback();
            } else {
              callback(new Error(rule.message));
            }
          },
          message: "数据格式有误"
        });
      }

      // 唯一校验
      if (columnData.isUnique == 1) {
        column.rules.push({
          validator: function validator(rule, value, callback) {
            // 其他模块依赖字段不触发唯一校验
            if (!Boolean(value) || column.isOtherModuleRelated && column.readonly) {
              callback();
              return;
            }
            _axios2.default.post("platform://custom/C12009", {
              moduleId: viewData.moduleId,
              columnName: columnData.phyColumnName,
              recordId: column.view.recordId,
              columnValue: value
            }).then(function (result) {
              if (result.data === "NOTEXIST") {
                callback();
              } else {
                callback(new Error(columnData.columnName + "\u5DF2\u5B58\u5728"));
              }
            });
          }
        });
      }
      // beginDateColumnId
      if (columnData.beginDateColumnId && columnData.beginDateColumnId !== null) {
        column.rules.push({
          validator: function validator(rule, value, callback) {
            var beginDateColumn = _this6.view.columnMap[columnData.beginDateColumnId];
            var beginDate = _this6.view.formModel[beginDateColumn.valKey];
            if (value >= beginDate) {
              callback();
            } else {
              callback(new Error(column.label + "\u9700\u8981\u5927\u4E8E\u7B49\u4E8E" + beginDateColumn.label));
            }
          }
        });
      }
      // 其他约束
      if (columnData.colConstraint && columnData.colConstraint != -1 && columnData.colConstraint != "") {
        for (var index in renderData.constraintList) {
          var constraint = renderData.constraintList[index];
          if (columnData.colConstraint == constraint.id) {
            column.rules.push({
              expression: constraint.regularExpression,
              message: constraint.promptContent,
              validator: function validator(rule, value, callback) {
                if (!value || String(value).match(rule.expression) !== null) {
                  callback();
                } else {
                  callback(new Error(rule.message));
                }
              }
            });
          }
        }
      }
    }
    /**
     * 处理字段数据源
     */

  }, {
    key: "handlerColumnDatasource",
    value: function handlerColumnDatasource() {
      var columnData = this.columnData;
      var view = this.view;
      switch (this.type) {
        case _enum.COLUMN_ENUM.FILE:
        case _enum.COLUMN_ENUM.IMAGE:
          this.datasource = {
            multiple: columnData.isMoreData === 1,
            action: "saveFile/" + columnData.entCode + "/file",
            accept: columnData.fileType || "*"
          };
          var fileUri = _http.HTTP_CONFIG.mapping.file;
          var newUri = _loginUser2.default.newUri(fileUri, this.datasource['action']);
          _view3.default.$set(this.datasource, "action", newUri);
          // loginUser.get().then((user) => {
          //   View.$set(this.datasource, "action", loginUser.newUri(user.fileUri, this.datasource['action']));
          // });
          break;
        case _enum.COLUMN_ENUM.RADIO_GROUP:
        case _enum.COLUMN_ENUM.CHECKBOX_GROUP:
        case _enum.COLUMN_ENUM.SELECT:
          this.datasource = {
            reload: false, // 特殊状态(是否重新刷新数据内容)
            searchList: [], // 条件内容
            loading: function loading() {
              var _this7 = this;

              return _dict2.default.loading(columnData.showColVal).then(function (res) {
                var options = [];
                res.forEach(function (dictObj) {
                  options.push({
                    label: dictObj.dictName,
                    value: dictObj.dictCode
                  });
                });
                // 过滤结果
                options = options.filter(function (opt) {
                  var result = true;
                  for (var key in _this7.searchList) {
                    if (!result) break;
                    var element = _this7.searchList[key];
                    if (!element.screenVal) break;
                    result = (0, _shared.validateCondition)(opt.value, element.searchType, element.screenVal);
                  }
                  return result;
                });
                return options;
              });
            },
            loadVal: function loadVal(value) {
              return _dict2.default.loadVal(columnData.showColVal, value);
            }
          };
          break;
        case _enum.COLUMN_ENUM.FOREIGNKEY:
          // 外键选择数据源
          this.datasource = {
            viewId: this.relatedData.showViewId, // 加载视图Id
            reload: false, // 特殊状态(是否重新刷新数据内容)
            searchList: [] // 条件内容
          };
          break;
        case _enum.COLUMN_ENUM.DATA_SELECT:
          // 数据选择数据源
          this.datasource = {
            viewId: this.columnData.selectViewId, // 加载视图Id
            reload: false, // 特殊状态(是否重新刷新数据内容)
            searchList: [] // 条件内容
          };
          break;
      }
    }
    /**
     * 处理关联字段数据
     */

  }, {
    key: "handlerDataRelationColumn",
    value: function handlerDataRelationColumn() {
      var _this8 = this;

      var moduleId = undefined;
      var columnId = undefined;
      if (this.isOtherModuleRelated) {
        // 其他模块依赖字段
        this[_dataRelationColumn] = this;
        return Promise.resolve(this[_dataRelationColumn]);
      } else if (this.isRelated) {
        moduleId = this.columnData.relyModuleId;
        columnId = this.columnData.relyColumnId;
      } else if (this.isForeignKey) {
        moduleId = this.relatedData.relModuleId;
        columnId = this.relatedData.showColumnId;
      } else if (this.isChosenData) {
        moduleId = this.columnData.selectModuleId;
        columnId = this.columnData.selectShowColId;
      }
      if (!moduleId) return;

      if (this.view) {
        var cacheKey = "columnService.findById({" + moduleId + ", " + columnId + "})";
        var promise = undefined;
        if (this.view.$space[cacheKey]) {
          promise = this.view.$space[cacheKey];
        } else {
          promise = _services.columnService.findById({
            columnId: columnId,
            moduleId: moduleId
          }).then(function (columnData) {
            _this8.view.$space[cacheKey] = Promise.resolve(columnData);
            return columnData;
          });
        }
        this.view.$space[cacheKey] = promise;
        return promise.then(function (columnData) {
          _this8[_dataRelationColumn] = new Column();
          _this8[_dataRelationColumn].render(columnData);
          return _this8[_dataRelationColumn];
        });
      } else {
        if (!this['initPromise()']) {
          this['initPromise()'] = _services.columnService.findById({
            columnId: columnId,
            moduleId: moduleId
          }).then(function (columnData) {
            _this8[_dataRelationColumn] = new Column();
            _this8[_dataRelationColumn].render(columnData);
            return _this8[_dataRelationColumn];
          });
        }
        return this['initPromise()'];
      }
    }
  }, {
    key: "$id",
    get: function get() {
      return this.columnData.id;
    }
  }, {
    key: "label",
    get: function get() {
      return this.columnData.columnName;
    }
  }, {
    key: "moduleId",
    get: function get() {
      return this.columnData.moduleId;
    }
  }, {
    key: "moduleCode",
    get: function get() {
      return this.columnData.moduleCode;
    }
    /**
     * 所属视图信息
     */

  }, {
    key: "view",
    get: function get() {
      return this[_shared._view];
    }
    /**
     * 字段接口返回数据
     */

  }, {
    key: "columnData",
    get: function get() {
      return this[_columnData] || {};
    }
  }, {
    key: "columnCode",
    get: function get() {
      return this.columnData.columnCode;
    }
    /**
     * 转换只读数据
     */

  }, {
    key: "readonlyScope",
    get: function get() {
      var _readonlyScope = "," + (this.columnData.readonlyScope || "") + ",";
      var readonlyScope = [];
      if (_readonlyScope.indexOf(",0,") >= 0) {
        // 新增页面
        readonlyScope.push(2);
        readonlyScope.push(7);
      }
      if (_readonlyScope.indexOf(",1,") >= 0) {
        // 修改页面
        readonlyScope.push(3);
        readonlyScope.push(8);
      }
      return "," + readonlyScope.join(",") + ",";
    }

    /**
     * 外键字段信息
     */

  }, {
    key: "relatedData",
    get: function get() {
      if (this.view && this.view.renderData.moduleRelateds) {
        return this.view.renderData.moduleRelateds[this.columnCode];
      } else {
        return this[_moduleRelated] || {};
      }
    }
    /**
     * 其他调用时数据配置
     */

  }, {
    key: "conditionTypes",


    /**
     * 字段条件类型集合
     * TODO: 需要优化选项
     */
    get: function get() {
      var conditionTypes = [];
      switch (this.type) {
        case _enum.COLUMN_ENUM.TEXT_INPUT:
        case _enum.COLUMN_ENUM.TEXT_LONG_INPUT:
        case _enum.COLUMN_ENUM.TEXT_AREA:
          conditionTypes.push(_enum.CONDITION_TYPE.EQ);
          conditionTypes.push(_enum.CONDITION_TYPE.NEQ);
          if (this.isMoney || this.isNumber) {
            conditionTypes.push(_enum.CONDITION_TYPE.GT);
            conditionTypes.push(_enum.CONDITION_TYPE.GTE);
            conditionTypes.push(_enum.CONDITION_TYPE.LT);
            conditionTypes.push(_enum.CONDITION_TYPE.LTE);
          } else {
            conditionTypes.push(_enum.CONDITION_TYPE.LIKE);
          }
          break;
        case _enum.COLUMN_ENUM.FILE:
        case _enum.COLUMN_ENUM.IMAGE:
          conditionTypes.push(_enum.CONDITION_TYPE.EQ);
          conditionTypes.push(_enum.CONDITION_TYPE.NEQ);
          break;
        case _enum.COLUMN_ENUM.RADIO:
        case _enum.COLUMN_ENUM.RADIO_GROUP:
        case _enum.COLUMN_ENUM.CHECKBOX:
        case _enum.COLUMN_ENUM.CHECKBOX_GROUP:
        case _enum.COLUMN_ENUM.SELECT:
          conditionTypes.push(_enum.CONDITION_TYPE.EQ);
          conditionTypes.push(_enum.CONDITION_TYPE.NEQ);
          conditionTypes.push(_enum.CONDITION_TYPE.LIKE);
          break;
        case _enum.COLUMN_ENUM.TIME:
        case _enum.COLUMN_ENUM.DATE:
        case _enum.COLUMN_ENUM.DATETIME:
          conditionTypes.push(_enum.CONDITION_TYPE.EQ);
          conditionTypes.push(_enum.CONDITION_TYPE.NEQ);
          conditionTypes.push(_enum.CONDITION_TYPE.GTE);
          conditionTypes.push(_enum.CONDITION_TYPE.LTE);
          conditionTypes.push(_enum.CONDITION_TYPE.BETWEEN);
          conditionTypes.push(_enum.CONDITION_TYPE.CUSTOM);
          break;
        case _enum.COLUMN_ENUM.RELATED_SELECT:
        case _enum.COLUMN_ENUM.FOREIGNKEY:
        case _enum.COLUMN_ENUM.DATA_SELECT:
        case _enum.COLUMN_ENUM.USER_SELECT:
        case _enum.COLUMN_ENUM.DEPT_SELECT:
          conditionTypes.push(_enum.CONDITION_TYPE.EQ);
          conditionTypes.push(_enum.CONDITION_TYPE.NEQ);
          conditionTypes.push(_enum.CONDITION_TYPE.LIKE);
          break;
      }
      return conditionTypes;
    }

    /**
     * 数据依赖模块Id
     */

  }, {
    key: "dataRelationModuleId",
    get: function get() {
      if (this.isOtherModuleRelated) {
        return this.moduleId;
      } else if (this.isRelated) {
        return this.columnData.relyModuleId;
      } else if (this.columnCode === _shared.ORG_CODE && this.type === _enum.COLUMN_ENUM.DEPT_SELECT) {
        return _shared.SYS_ORG + "_" + this.moduleId;
      }
      return undefined;
    }
    /**
     * 新增关联模块数据依赖模块Id(其他视图跳转调用)
     */

  }, {
    key: "insertDataRelationModuleId",
    get: function get() {
      var dataRelationModuleId = this.dataRelationModuleId;
      if (!dataRelationModuleId && this.isForeignKey) {
        dataRelationModuleId = this.relatedData.relModuleId;
      }
      return dataRelationModuleId;
    }
  }, {
    key: "createdEventName",
    get: function get() {
      return "created";
    }
  }, {
    key: "updateEventName",
    get: function get() {
      return this.valKey + ".update";
    }
  }, {
    key: "destroyedEventName",
    get: function get() {
      return "destroyed";
    }
  }, {
    key: "unit",
    get: function get() {
      return this.columnData.columnUnit;
    }
  }, {
    key: "gridLabel",
    get: function get() {
      if (this.unit) {
        return this.label + "(" + this.unit + ")";
      }
      return this.label;
    }
  }, {
    key: "gridKey",
    get: function get() {
      return this.moduleCode + "." + this.columnData.phyColumnName;
    }
  }], [{
    key: "relatedDataKey",
    get: function get() {
      return _moduleRelated;
    }
  }]);

  return Column;
}();

exports.default = Column;