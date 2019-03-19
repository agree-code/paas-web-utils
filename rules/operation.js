"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _viewCache = require("./view-cache");

var _viewCache2 = _interopRequireDefault(_viewCache);

var _url = require("../common/url");

var _url2 = _interopRequireDefault(_url);

var _shared = require("./shared");

var _globalUid = require("./global-uid");

var _globalUid2 = _interopRequireDefault(_globalUid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noob = new Function();
var createView = function createView(ViewClass, viewId) {
  var recordId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

  return new ViewClass().render(viewId, recordId);
};
var _operationData = Symbol("OperationData");
/**
 * ------测试记录------
 * 批量测试：350
 * 多个操作：61
 */

var Operation = function () {
  function Operation(view, operationData) {
    _classCallCheck(this, Operation);

    this['_puid'] = _globalUid2.default.get();
    this[_shared._handlerFn] = noob;
    this[_shared._view] = view;
    this[_operationData] = operationData;
    this.forwardView = undefined;
    this.rules = [];
    this.loadingStatus = false; // 是否加载中
    this.hidden = false; // 默认当前状态只有在top时可用
  }

  _createClass(Operation, [{
    key: "triggerClick",


    /**
     * 触发点击事件
     * @param vm 当前vue组件实例
     * @param renders 当前视图操作数据数组
     */
    value: function triggerClick(vm) {
      var _this = this;

      var rowDatas = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var tableDatas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      if (this.hidden) return;
      if (rowDatas) {
        rowDatas = rowDatas instanceof Array ? rowDatas : [rowDatas];
      }
      this[_shared._view].$set(this, "loadingStatus", true);
      var promise = this[_shared._handlerFn](vm, rowDatas, tableDatas);
      if (promise && promise.then) {
        promise.then(function (res) {
          if (res !== false) {
            // 处理该操作点击后的事件
            _this.flushTypeHandler(vm);
          }
          if (typeof res !== "boolean") {
            if (res.status === 200) {
              vm.$aui.notify.show({
                title: '操作',
                message: res.message || "数据操作成功",
                type: 'success'
              });
            }
          }
          _this[_shared._view].$set(_this, "loadingStatus", false);
        }, function (error) {
          console.error(error);
          _this[_shared._view].$set(_this, "loadingStatus", false);
        });
      }
    }
    /**
     * 当前属性在list行中使用
     */

  }, {
    key: "isHidden",
    value: function isHidden(rowDatas) {
      if (!(rowDatas instanceof Array)) {
        rowDatas = [rowDatas];
      }
      var status = false;
      for (var index in this.rules) {
        var rule = this.rules[index];
        status = rule(rowDatas);
        if (status) {
          break;
        }
      }
      return status;
    }
  }, {
    key: "handler",
    value: function handler() {
      var _this2 = this;

      return _viewCache2.default.get(this.forwardViewId).then(function (view) {
        _this2.forwardView = view;
        _this2.handlerOperation();
        // 视图更新 事件
        _this2[_shared._view].$on("update", function (view, rowDatas) {
          if (!_this2[_shared._view]) {
            _this2[_shared._view] = view;
          }
          _this2[_shared._view].$set(_this2, "hidden", _this2.isHidden(rowDatas));
        });
        _this2[_shared._view].$on("destroyed", function () {
          _this2[_shared._handlerFn] = noob;
          delete _this2[_shared._view];
          delete _this2[_operationData];
          _this2.forwardView = undefined;
          _this2.rules = [];
          _this2.loadingStatus = false; // 是否加载中
          _this2.hidden = false; // 默认当前状态只有在top时可用
        });
        return _this2;
      });
    }
  }, {
    key: "handlerOperation",
    value: function handlerOperation() {
      switch (this.type) {
        case "SUBMIT":
          this[_shared._handlerFn] = this.handlerSubmit(this.submitType);
          break;
        case "SUBMIT_CONFIRM":
          this[_shared._handlerFn] = this.handlerSubmitConfirm(this.submitType);
          break;
        case "INSERT":
          this[_shared._handlerFn] = this.handlerFollow("INSERT");
          break;
        case "INSERT_MODULE":
          this[_shared._handlerFn] = this.handlerFollow("INSERT_MODULE");
          break;
        case "UPDATE":
          this[_shared._handlerFn] = this.handlerFollow("UPDATE");
          break;
        case "DELETE":
          this[_shared._handlerFn] = this.handlerSubmitConfirm(this.type);
          break;
        case "DETAIL":
          this[_shared._handlerFn] = this.handlerFollow("DETAIL");
          break;
        case "BATCH":
          this[_shared._handlerFn] = this.handlerBatch();
          break;
        case "PROCESS_SUBMIT":
          break;
        case "DATA_IMPORT":
          break;
        case "DATA_EXPORT":
          this[_shared._handlerFn] = function (vm) {
            vm.openExportDialog();
            return Promise.resolve(false);
          };
          break;
      }
    }
    /**
     * 数据提交
     * @param submitType 提交类型
     */

  }, {
    key: "handlerSubmit",
    value: function handlerSubmit(submitType) {
      var _this3 = this;

      var args = [];
      switch (submitType) {
        case "INSERT":
        case "UPDATE":
          args.push(this.formSubmitValidate);
          break;
        case "DELETE":
          args.push(this.dataSubmitValidate, this.recordIds);
          break;
        case "CUSTOM":
          switch (this[_shared._view].type) {
            case "insert":
            case "update":
              args.push(this.formSubmitValidate);
              break;
            case "list":
            case "detail":
              args.push(this.dataSubmitValidate, this.customRecordIds);
              break;
          }
          break;
        case "BATCH_DELETE":
          args.push(this.dataSubmitValidate, this.recordIds);
          break;
        case "BATCH_UPDATE":
        case "BATCH_CUSTOM":
          args.push(this.formSubmitValidate);
          break;
        default:
          return function (vm) {
            vm.$aui.message.show(_this3[_shared._view].type + "\u9875\u9762" + _this3.lable + "\u672A\u5B9E\u73B0,\u622A\u56FE\u53D1\u9001\u7ED9\u524D\u7AEF\u4EBA\u5458!");
          };
      }
      args.push(this.handlerSubmitData(submitType));
      return this.dataSubmit.apply(this, args);
    }
  }, {
    key: "handlerSubmitConfirm",

    /**
     * 提交提示处理
     * @param submitType 提交类型
     */
    value: function handlerSubmitConfirm(submitType) {
      var _this4 = this;

      var submitFn = this.handlerSubmit(submitType);
      var ts = this;
      var msgType = this.submitDataType === "All" ? '全部' : '选中';
      var template = this[_operationData].description;
      return function (vm) {
        var renders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        var tableDatas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

        // 数据校验
        switch (_this4.submitDataType) {
          case 'All':
            break;
          case 'CHECKDATA':
          default:
            if (!renders || renders.length < 1) {
              vm.$aui.notify.show.error({
                title: ts.lable,
                message: "请选择至少一条数据"
              });
              return Promise.reject("请选择至少一条数据");
            }
            break;
        }
        (renders || []).length === 1 && (msgType = "当前");
        // 提示数据   确定删除该条数据吗？
        var message = "\u786E\u5B9A\u64CD\u4F5C" + msgType + "\u6570\u636E\u5417?";
        return vm.$aui.confirm.show(template || message, ts.lable, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return Operation.submitFn(submitFn, vm, renders, tableDatas);
        }, function () {
          return false;
        });
      };
    }
    /**
     * 跳转处理
     * @param type 跳转类型
     */

  }, {
    key: "handlerFollow",
    value: function handlerFollow(type) {
      var _this5 = this;

      var args = [];
      switch (type) {
        case "INSERT_MODULE":
          if (this.isTop) {
            args = [this.mostOneCheck];
          }
          args.push(this.relationQuery);
          args.push(this.businessRedirect);
          break;
        case "INSERT":
          if (this[_shared._view].type === "detail" || this[_shared._view].type === "list" && !this.isTop) {
            args.push(this.relationQuery);
          }
          args.push(this.businessRedirect);
          break;
        case "UPDATE":
          args.push(this.recordId, this.businessRedirect);
          break;
        case "DETAIL":
          args.push(this.recordId, this.businessRedirect);
          break;
        case "BATCH":
          args.push(this.leastOneCheck, this.recordIds, this.batchWrite());
          break;
        default:
          return function (vm) {
            vm.$aui.message.show(_this5[_shared._view].type + "\u9875\u9762" + _this5.lable + "\u672A\u5B9E\u73B0,\u622A\u56FE\u53D1\u9001\u7ED9\u524D\u7AEF\u4EBA\u5458!");
          };
      }
      return this.followTypeHandler(args);
    }
  }, {
    key: "handlerBatch",
    value: function handlerBatch() {
      var _this6 = this;

      switch (this.batchType) {
        case "UPDATE":
          return this.handlerFollow("BATCH");
        case "CUSTOM":
          return this.handlerFollow("BATCH");
        case "DELETE":
          return this.handlerSubmitConfirm("BATCH_DELETE");
        default:
          return function (vm) {
            vm.$aui.message.show(_this6[_shared._view].type + "\u9875\u9762" + _this6.lable + "\u672A\u5B9E\u73B0,\u622A\u56FE\u53D1\u9001\u7ED9\u524D\u7AEF\u4EBA\u5458!");
          };
      }
    }

    /**
     * 处理刷新类型
     */

  }, {
    key: "flushTypeHandler",
    value: function flushTypeHandler(vm) {
      console.log("flushType", this[_operationData].flushType);
      switch (this[_operationData].flushType) {
        case "REDIRECT":
          vm.$router.push({
            name: "business",
            params: {
              viewId: this.forwardViewId
            }
          });
          break;
        case "CURRENT":
          vm.$router.go(0);
          // 重新加载
          break;
        case "GOBACK":
          vm.$router.back();
          break;
        case "FLUSHLIST":
          !this[_shared._view].datasource || vm.$set(this[_shared._view].datasource, "reload", true);
          break;
        case "NO":
        default:
          break;
      }
    }
    /**
     * 跳转类型
     */

  }, {
    key: "followTypeHandler",
    value: function followTypeHandler(args) {
      switch (this[_operationData].followType) {
        case "DIALOG":
          return this.openDialog.apply(this, _toConsumableArray(args));
        case "FOLLOW":
        default:
          return this.redirect.apply(this, _toConsumableArray(args));
      }
    }
    /**
     * 处理提交数据
     * @param submitType 提交类型
     */

  }, {
    key: "handlerSubmitData",
    value: function handlerSubmitData(submitType) {
      var _this7 = this;

      var batchUriFn = function batchUriFn(renders) {
        if (_this7.submitDataType === "ALL") {
          return "platform://custom/C12015";
        } else {
          return "platform://custom/C12013";
        }
      };
      return function (vm, renders, tableDatas, config) {
        var url = "";
        var submitData = {};
        switch (submitType) {
          case "INSERT":
            url = "platform://custom/C12004";
            break;
          case "UPDATE":
            url = "platform://custom/C12005";
            break;
          case "BATCH_DELETE":
          case "DELETE":
            url = "platform://custom/C12003";
            break;
          case "BATCH_UPDATE":
            url = batchUriFn(renders);
            submitData = _this7[_operationData].appendSubmitData;
            break;
          case "BATCH_CUSTOM":
          case "CUSTOM":
            url = _this7[_operationData].submitUrl;
            submitData = Object["assign"]({}, _this7.customSubmitData, _this7[_operationData].appendSubmitData);
            break;
        }
        config.url = url;
        config.data || (config.data = {});
        config.data = Object["assign"](config.data, submitData);
        return {
          vm: vm,
          renders: renders,
          tableDatas: tableDatas,
          config: config
        };
      };
    }
    /**
     * 表单校验
     */

  }, {
    key: "formSubmitValidate",
    value: function formSubmitValidate(vm, renders, tableDatas, config) {
      var _this8 = this;

      if (vm.validate) {
        return vm.validate().then(function (bool) {
          config.data = _this8[_shared._view].submitModel;
          return {
            vm: vm,
            renders: renders,
            tableDatas: tableDatas,
            config: config
          };
        }, function () {
          return Promise.reject("\u8868\u5355\u6821\u9A8C\u672A\u901A\u8FC7.");
        });
      }
      return {
        vm: vm,
        renders: renders,
        tableDatas: tableDatas,
        config: config
      };
    }

    /**
     * 数据提交校验
     */

  }, {
    key: "dataSubmitValidate",
    value: function dataSubmitValidate(vm, renders, tableDatas, config) {
      config.data || (config.data = {});
      config.data["viewId"] = this[_shared._view].$id;
      config.data["moduleId"] = this[_shared._view].moduleId;
      return {
        vm: vm,
        renders: renders,
        tableDatas: tableDatas,
        config: config
      };
    }

    /**
     * 最多一条数据的校验
     */

  }, {
    key: "mostOneCheck",
    value: function mostOneCheck(vm, renders, tableDatas, config) {
      if (!renders || renders.length !== 1) {
        vm.$aui.notify.show.error({
          title: this.lable,
          message: "最多只能选择一条数据"
        });
        return Promise.reject("[" + this.lable + "]: \u6700\u591A\u53EA\u80FD\u9009\u62E9\u4E00\u6761\u6570\u636E");
      } else {
        return {
          vm: vm,
          renders: renders,
          tableDatas: tableDatas,
          config: config
        };
      }
    }
    /**
     * 至少一条数据的校验
     */

  }, {
    key: "leastOneCheck",
    value: function leastOneCheck(vm, renders, tableDatas, config) {
      // 只有批量操作并且提交数据类型为选择数据的时候才会有数据校验
      if (this.type === "BATCH") {
        // 数据校验
        switch (this.submitDataType) {
          case 'All':
            break;
          case 'CHECKDATA':
          default:
            if (!renders || renders.length < 1) {
              vm.$aui.notify.show.error({
                title: this.lable,
                message: "请选择至少一条数据"
              });
              return Promise.resolve("[" + this.lable + "]: \u8BF7\u9009\u62E9\u81F3\u5C11\u4E00\u6761\u6570\u636E");
            }
            break;
        }
      }
      return {
        vm: vm,
        renders: renders,
        tableDatas: tableDatas,
        config: config
      };
    }

    /**
     * 设置批量写操作配置
     */

  }, {
    key: "batchWrite",
    value: function batchWrite() {
      var _this9 = this;

      // 强制性 使用弹框来更新数据
      this[_operationData].followType = "DIALOG";
      var datasource = this[_shared._view].datasource;
      var submitData = {
        viewId: datasource.viewId,
        fuzzyQueryVal: datasource.fuzzyQueryVal,
        tagId: datasource.tagId,
        searchList: datasource.searchList
      };
      return function (vm, renders, tableDatas, config) {
        config["params"] || (config["params"] = {});
        config["params"]["viewId"] = _this9.batchViewId;
        config.data || (config.data = {});
        if (!renders || renders.length < 1) {
          Object.assign(config.data, submitData);
        }
        return {
          vm: vm,
          renders: renders,
          tableDatas: tableDatas,
          config: config
        };
      };
    }
  }, {
    key: "relationQuery",
    value: function relationQuery(vm, renders, tableDatas, config) {
      config["query"] || (config["query"] = {});
      config["query"]["relationId"] = renders[0]["ID"] || renders[0]["id"];
      config["query"]["relationModuleId"] = this[_shared._view].moduleId;
      config["query"]["relationViewId"] = this[_shared._view].$id;
      return {
        vm: vm,
        renders: renders,
        tableDatas: tableDatas,
        config: config
      };
    }

    /**
     * 获取第一条真实数据Id
     * @param vm 当前视图
     * @param renders 真实数据集合
     * @param config 处理配置
     */

  }, {
    key: "recordId",
    value: function recordId(vm, renders, tableDatas, config) {
      config["query"] || (config["query"] = {});
      config["query"]["recordId"] = renders[0]["ID"] || renders[0]["id"];
      return {
        vm: vm,
        renders: renders,
        tableDatas: tableDatas,
        config: config
      };
    }

    /**
     * 获取所有真实数据Id集合(主要用于自定义提交到后台)
     * @param vm 当前视图
     * @param renders 真实数据集合
     * @param config 处理配置
     */

  }, {
    key: "customRecordIds",
    value: function customRecordIds(vm, renders, tableDatas, config) {
      config.data || (config.data = {});
      config.data["recordIds"] = [];
      renders = renders || [];
      if (renders.length === 1) {
        config.data["recordIds"] = renders[0]["ID"] || renders[0]["id"];
      } else {
        renders.forEach(function (render) {
          config.data["recordIds"].push(render["ID"] || render["id"]);
        });
      }
      return {
        vm: vm,
        renders: renders,
        tableDatas: tableDatas,
        config: config
      };
    }

    /**
     * 获取所有真实数据Id集合(主要用于提交到后台)
     * @param vm 当前视图
     * @param renders 真实数据集合
     * @param config 处理配置
     */

  }, {
    key: "recordIds",
    value: function recordIds(vm, renders, tableDatas, config) {
      config.data || (config.data = {});
      config.data["recordIds"] = [];
      renders = renders || [];
      renders.forEach(function (render) {
        config.data["recordIds"].push(render["ID"] || render["id"]);
      });
      return {
        vm: vm,
        renders: renders,
        tableDatas: tableDatas,
        config: config
      };
    }

    /**
     * 跳转数据格式化
     * @param vm 当前组件实例
     * @param renders 真实数据集合
     */

  }, {
    key: "businessRedirect",
    value: function businessRedirect(vm, renders, tableDatas, config) {
      config["name"] = "business";
      config["params"] || (config["params"] = {});
      config["params"]["viewId"] = this.forwardViewId;
      return {
        vm: vm,
        renders: renders,
        tableDatas: tableDatas,
        config: config
      };
    }

    /**
     * 页面跳转
     */

  }, {
    key: "redirect",
    value: function redirect() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var ts = this;
      return function REDIRECT(vm) {
        var renders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        var tableDatas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

        var promise = Promise.resolve({
          vm: vm,
          renders: renders,
          tableDatas: tableDatas,
          config: {}
        });
        args.forEach(function (fn) {
          promise = promise.then(function (_ref) {
            var vm = _ref.vm,
                renders = _ref.renders,
                tableDatas = _ref.tableDatas,
                config = _ref.config;

            return fn.call(ts, vm, renders, tableDatas, config);
          });
        });
        return promise.then(function (_ref2) {
          var vm = _ref2.vm,
              renders = _ref2.renders,
              tableDatas = _ref2.tableDatas,
              config = _ref2.config;

          vm.$router.push(config);
          return false;
        });
      };
    }
    /**
     * 编译视图默认操作
     * @param view 视图信息
     */

  }, {
    key: "buildSubmit",
    value: function buildSubmit(view, data, submitDataType) {
      if (view.operations.length < 1) {
        var operationData = Object["assign"]({}, this[_operationData], {
          type: 0,
          submitType: this.batchType === "UPDATE" ? 4 : 5,
          submitDataType: submitDataType,
          operationName: "提交",
          appendSubmitData: data // 附加提交数据
        });
        var operation = new Operation(view, operationData);
        view.$set(view.operations, view.operations.length, operation);
        operation.handler();
      }
    }

    /**
     * 添加弹框内容
     */

  }, {
    key: "openDialog",
    value: function openDialog() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var ts = this;
      return function OPEN_DIALOG(vm) {
        var renders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        var tableDatas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

        var submitDataType = !renders || renders.length < 1 ? "ALL" : "CHECKDATA";
        var promise = Promise.resolve({
          vm: vm,
          renders: renders,
          tableDatas: tableDatas,
          config: {}
        });
        args.forEach(function (fn) {
          promise = promise.then(function (_ref3) {
            var vm = _ref3.vm,
                renders = _ref3.renders,
                tableDatas = _ref3.tableDatas,
                config = _ref3.config;

            return fn.call(ts, vm, renders, tableDatas, config);
          });
        });
        return promise.then(function (_ref4) {
          var vm = _ref4.vm,
              renders = _ref4.renders,
              tableDatas = _ref4.tableDatas,
              config = _ref4.config;

          if (config["params"] && config["params"]["viewId"]) {
            var viewId = config["params"]["viewId"];
            _viewCache2.default.getViewType(viewId).then(function (viewEnum) {
              return createView(viewEnum.class, viewId);
            }).then(function (view) {
              ts.buildSubmit(view, config["data"], submitDataType);
              vm.openBatchDialog(view, config["data"]);
              return false;
            });
          } else {
            vm.$aui.alert.show("\u3010" + ts.lable + "\u3011\u8BF7\u914D\u7F6E\u6279\u91CF\u89C6\u56FE", '配置错误', {
              type: "error",
              confirmButtonText: "取消"
            });
          }
          return false;
        });
      };
    }

    /**
     * 数据提交
     */

  }, {
    key: "dataSubmit",
    value: function dataSubmit() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var ts = this;
      return function DATA_SUBMIT(vm) {
        var renders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        var tableDatas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

        var config = {
          url: undefined,
          data: {}
        };
        var promise = Promise.resolve({
          vm: vm,
          renders: renders,
          tableDatas: tableDatas,
          config: config
        });
        args.forEach(function (fn) {
          promise = promise.then(function (_ref5) {
            var vm = _ref5.vm,
                renders = _ref5.renders,
                tableDatas = _ref5.tableDatas,
                config = _ref5.config;

            return fn.call(ts, vm, renders, tableDatas, config);
          });
        });
        return promise.then(function (_ref6) {
          var vm = _ref6.vm,
              renders = _ref6.renders,
              tableDatas = _ref6.tableDatas,
              config = _ref6.config;

          return _axios2.default.post(config.url, config.data);
        });
      };
    }
  }, {
    key: "$id",
    get: function get() {
      return this[_operationData].id;
    }
  }, {
    key: "lable",
    get: function get() {
      return this[_operationData].operationName;
    }
  }, {
    key: "sort",
    get: function get() {
      return this[_operationData].sort;
    }
  }, {
    key: "isTop",
    get: function get() {
      return this[_shared._view].type !== "list" || this[_operationData].operationPosition === 0;
    }
  }, {
    key: "isDetail",
    get: function get() {
      return Number(this[_operationData].type) === 4;
    }
  }, {
    key: "forwardViewId",
    get: function get() {
      return Number(this[_operationData].forwardVid);
    }
  }, {
    key: "batchViewId",
    get: function get() {
      return Number(this[_operationData].batchUpdateViewId);
    }
  }, {
    key: "description",
    get: function get() {
      return this[_operationData].description;
    }
  }, {
    key: "customSubmitData",
    get: function get() {
      try {
        return _url2.default.toObject(this[_operationData].submitUrl);
      } catch (error) {
        return {};
      }
    }
  }, {
    key: "type",
    get: function get() {
      switch (Number(this[_operationData].type)) {
        case 0:
          // 提交
          return "SUBMIT";
        case 1:
          // 新增  直接跳转
          return "INSERT";
        case 2:
          // 修改
          return "UPDATE";
        case 3:
          // 删除
          return "DELETE";
        case 4:
          // 明细查询
          return "DETAIL";
        case 5:
          // 流程提交
          return "PROCESS_SUBMIT";
        case 6:
          // 数据导入
          return "DATA_IMPORT";
        case 7:
          // 批量操作
          return "BATCH";
        case 8:
          // 新增关联模块数据
          return "INSERT_MODULE";
        case 9:
          // 提交确认
          return "SUBMIT_CONFIRM";
        case 10:
          // 数据导出
          return "DATA_EXPORT";
      }
    }
  }, {
    key: "submitType",
    get: function get() {
      switch (Number(this[_operationData].submitType)) {
        case 0:
          return "INSERT";
        case 1:
          return "UPDATE";
        case 2:
          return "CUSTOM";
        case 3:
          return "BATCH_DELETE";
        case 4:
          return "BATCH_UPDATE";
        case 5:
          return "BATCH_CUSTOM";
      }
    }
  }, {
    key: "submitDataType",
    get: function get() {
      return (this[_operationData].submitDataType || "").toUpperCase();
    }
  }, {
    key: "batchType",
    get: function get() {
      return (this[_operationData].batchType || "").toUpperCase();
    }
  }], [{
    key: "submitFn",
    get: function get() {
      return new Function('submitFn', 'vm', 'renders', 'tableDatas', 'return submitFn(vm, renders, tableDatas)');
    }
  }]);

  return Operation;
}();

exports.default = Operation;