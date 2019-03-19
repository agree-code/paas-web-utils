import axios from "axios"
import viewCache from "./view-cache";
import url from "../common/url";
import {
  _view,
  _handlerFn,
} from "./shared";
import GlobalUid from "./global-uid";

const noob = new Function();
const createView = function (ViewClass, viewId, recordId = undefined) {
  return new ViewClass().render(viewId, recordId);
};
const _operationData = Symbol("OperationData");
/**
 * ------测试记录------
 * 批量测试：350
 * 多个操作：61
 */
class Operation {
  constructor(view, operationData) {
    this['_puid'] = GlobalUid.get();
    this[_handlerFn] = noob;
    this[_view] = view;
    this[_operationData] = operationData;
    this.forwardView = undefined;
    this.rules = [];
    this.loadingStatus = false; // 是否加载中
    this.hidden = false; // 默认当前状态只有在top时可用
  }

  get $id() {
    return this[_operationData].id;
  }

  get lable() {
    return this[_operationData].operationName;
  }

  get sort() {
    return this[_operationData].sort;
  }

  get isTop() {
    return (
      this[_view].type !== "list" || this[_operationData].operationPosition === 0
    );
  }
  get isDetail() {
    return Number(this[_operationData].type) === 4;
  }
  get forwardViewId() {
    return Number(this[_operationData].forwardVid);
  }

  get batchViewId() {
    return Number(this[_operationData].batchUpdateViewId);
  }

  get description() {
    return this[_operationData].description;
  }

  get customSubmitData() {
    try {
      return url.toObject(this[_operationData].submitUrl);
    } catch (error) {
      return {};
    }
  }

  get type() {
    switch (Number(this[_operationData].type)) {
      case 0: // 提交
        return "SUBMIT";
      case 1: // 新增  直接跳转
        return "INSERT";
      case 2: // 修改
        return "UPDATE";
      case 3: // 删除
        return "DELETE";
      case 4: // 明细查询
        return "DETAIL";
      case 5: // 流程提交
        return "PROCESS_SUBMIT";
      case 6: // 数据导入
        return "DATA_IMPORT";
      case 7: // 批量操作
        return "BATCH";
      case 8: // 新增关联模块数据
        return "INSERT_MODULE";
      case 9: // 提交确认
        return "SUBMIT_CONFIRM";
      case 10: // 数据导出
        return "DATA_EXPORT";
    }
  }

  get submitType() {
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

  get submitDataType() {
    return (this[_operationData].submitDataType || "").toUpperCase();
  }

  get batchType() {
    return (this[_operationData].batchType || "").toUpperCase();
  }

  /**
   * 触发点击事件
   * @param vm 当前vue组件实例
   * @param renders 当前视图操作数据数组
   */
  triggerClick(vm, rowDatas = [], tableDatas = []) {
    if (this.hidden) return;
    if (rowDatas) {
      rowDatas = rowDatas instanceof Array ? rowDatas : [rowDatas];
    }
    this[_view].$set(this, "loadingStatus", true);
    let promise = this[_handlerFn](vm, rowDatas, tableDatas);
    if (promise && promise.then) {
      promise.then(res => {
          if (res !== false) {
            // 处理该操作点击后的事件
            this.flushTypeHandler(vm);
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
          this[_view].$set(this, "loadingStatus", false);
        },
        (error) => {
          console.error(error);
          this[_view].$set(this, "loadingStatus", false);
        }
      );
    }
  }
  /**
   * 当前属性在list行中使用
   */
  isHidden(rowDatas) {
    if (!(rowDatas instanceof Array)) {
      rowDatas = [rowDatas];
    }
    let status = false;
    for (const index in this.rules) {
      const rule = this.rules[index];
      status = rule(rowDatas);
      if (status) {
        break;
      }
    }
    return status;
  }

  handler() {
    return viewCache.get(this.forwardViewId).then(view => {
      this.forwardView = view;
      this.handlerOperation();
      // 视图更新 事件
      this[_view].$on("update", (view, rowDatas) => {
        if(!this[_view]) {
          this[_view] = view
        }
        this[_view].$set(this, "hidden", this.isHidden(rowDatas));
      });
      this[_view].$on("destroyed", () => {
        this[_handlerFn] = noob;
        delete this[_view];
        delete this[_operationData];
        this.forwardView = undefined;
        this.rules = [];
        this.loadingStatus = false; // 是否加载中
        this.hidden = false; // 默认当前状态只有在top时可用
      });
      return this;
    });
  }

  handlerOperation() {
    switch (this.type) {
      case "SUBMIT":
        this[_handlerFn] = this.handlerSubmit(this.submitType);
        break;
      case "SUBMIT_CONFIRM":
        this[_handlerFn] = this.handlerSubmitConfirm(this.submitType);
        break;
      case "INSERT":
        this[_handlerFn] = this.handlerFollow("INSERT");
        break;
      case "INSERT_MODULE":
        this[_handlerFn] = this.handlerFollow("INSERT_MODULE");
        break;
      case "UPDATE":
        this[_handlerFn] = this.handlerFollow("UPDATE");
        break;
      case "DELETE":
        this[_handlerFn] = this.handlerSubmitConfirm(this.type);
        break;
      case "DETAIL":
        this[_handlerFn] = this.handlerFollow("DETAIL");
        break;
      case "BATCH":
        this[_handlerFn] = this.handlerBatch();
        break;
      case "PROCESS_SUBMIT":
        break;
      case "DATA_IMPORT":
        break;
      case "DATA_EXPORT":
        this[_handlerFn] = vm => {
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
  handlerSubmit(submitType) {
    let args = [];
    switch (submitType) {
      case "INSERT":
      case "UPDATE":
        args.push(this.formSubmitValidate);
        break;
      case "DELETE":
        args.push(this.dataSubmitValidate, this.recordIds);
        break;
      case "CUSTOM":
        switch (this[_view].type) {
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
        return vm => {
          vm.$aui.message.show(
            `${this[_view].type}页面${this.lable}未实现,截图发送给前端人员!`
          );
        };
    }
    args.push(this.handlerSubmitData(submitType));
    return this.dataSubmit(...args);
  }

  static get submitFn() {
    return new Function('submitFn', 'vm', 'renders', 'tableDatas', 'return submitFn(vm, renders, tableDatas)');
  }
  /**
   * 提交提示处理
   * @param submitType 提交类型
   */
  handlerSubmitConfirm(submitType) {
    let submitFn = this.handlerSubmit(submitType);
    let ts = this;
    let msgType = this.submitDataType === "All" ? '全部' : '选中';
    let template = this[_operationData].description;
    return (vm, renders = undefined, tableDatas = undefined) => {
      // 数据校验
      switch (this.submitDataType) {
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
      let message = `确定操作${msgType}数据吗?`;
      return vm.$aui.confirm.show(template || message, ts.lable, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(
        () => {
          return Operation.submitFn(submitFn, vm, renders, tableDatas);
        },
        () => {
          return false;
        }
      );
    };
  }
  /**
   * 跳转处理
   * @param type 跳转类型
   */
  handlerFollow(type) {
    let args = [];
    switch (type) {
      case "INSERT_MODULE":
        if (this.isTop) {
          args = [this.mostOneCheck];
        }
        args.push(this.relationQuery);
        args.push(this.businessRedirect);
        break;
      case "INSERT":
        if (this[_view].type === "detail" || (this[_view].type === "list" && !this.isTop)) {
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
        return vm => {
          vm.$aui.message.show(
            `${this[_view].type}页面${this.lable}未实现,截图发送给前端人员!`
          );
        };
    }
    return this.followTypeHandler(args);
  }

  handlerBatch() {
    switch (this.batchType) {
      case "UPDATE":
        return this.handlerFollow("BATCH");
      case "CUSTOM":
        return this.handlerFollow("BATCH");
      case "DELETE":
        return this.handlerSubmitConfirm("BATCH_DELETE");
      default:
        return vm => {
          vm.$aui.message.show(
            `${this[_view].type}页面${this.lable}未实现,截图发送给前端人员!`
          );
        };
    }
  }

  /**
   * 处理刷新类型
   */
  flushTypeHandler(vm) {
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
        !this[_view].datasource ||
          vm.$set(this[_view].datasource, "reload", true);
        break;
      case "NO":
      default:
        break;
    }
  }
  /**
   * 跳转类型
   */
  followTypeHandler(args) {
    switch (this[_operationData].followType) {
      case "DIALOG":
        return this.openDialog(...args);
      case "FOLLOW":
      default:
        return this.redirect(...args);
    }
  }
  /**
   * 处理提交数据
   * @param submitType 提交类型
   */
  handlerSubmitData(submitType) {
    const batchUriFn = (renders) => {
      if (this.submitDataType === "ALL") {
        return "platform://custom/C12015";
      } else {
        return "platform://custom/C12013";
      }
    }
    return (vm, renders, tableDatas, config) => {
      let url = "";
      let submitData = {};
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
          submitData = this[_operationData].appendSubmitData;
          break;
        case "BATCH_CUSTOM":
        case "CUSTOM":
          url = this[_operationData].submitUrl;
          submitData = Object["assign"]({}, this.customSubmitData, this[_operationData].appendSubmitData);
          break;
      }
      config.url = url;
      config.data || (config.data = {});
      config.data = Object["assign"](config.data, submitData);
      return {
        vm,
        renders,
        tableDatas,
        config
      };
    };
  }
  /**
   * 表单校验
   */
  formSubmitValidate(vm, renders, tableDatas, config) {
    if (vm.validate) {
      return vm.validate().then(
        bool => {
          config.data = this[_view].submitModel;
          return {
            vm,
            renders,
            tableDatas,
            config
          };
        },
        () => Promise.reject(`表单校验未通过.`)
      );
    }
    return {
      vm,
      renders,
      tableDatas,
      config
    };
  }

  /**
   * 数据提交校验
   */
  dataSubmitValidate(vm, renders, tableDatas, config) {
    config.data || (config.data = {});
    config.data["viewId"] = this[_view].$id;
    config.data["moduleId"] = this[_view].moduleId;
    return {
      vm,
      renders,
      tableDatas,
      config
    };
  }

  /**
   * 最多一条数据的校验
   */
  mostOneCheck(vm, renders, tableDatas, config) {
    if (!renders || renders.length !== 1) {
      vm.$aui.notify.show.error({
        title: this.lable,
        message: "最多只能选择一条数据"
      });
      return Promise.reject(`[${this.lable}]: 最多只能选择一条数据`);
    } else {
      return {
        vm,
        renders,
        tableDatas,
        config
      };
    }
  }
  /**
   * 至少一条数据的校验
   */
  leastOneCheck(vm, renders, tableDatas, config) {
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
            return Promise.resolve(`[${this.lable}]: 请选择至少一条数据`);
          }
          break;
      }
    }
    return {
      vm,
      renders,
      tableDatas,
      config
    };
  }

  /**
   * 设置批量写操作配置
   */
  batchWrite() {
    // 强制性 使用弹框来更新数据
    this[_operationData].followType = "DIALOG";
    let datasource = this[_view].datasource;
    let submitData = {
      viewId: datasource.viewId,
      fuzzyQueryVal: datasource.fuzzyQueryVal,
      tagId: datasource.tagId,
      searchList: datasource.searchList,
    };
    return (vm, renders, tableDatas, config) => {
      config["params"] || (config["params"] = {});
      config["params"]["viewId"] = this.batchViewId;
      config.data || (config.data = {});
      if (!renders || renders.length < 1) {
        Object.assign(config.data, submitData);
      }
      return {
        vm,
        renders,
        tableDatas,
        config
      };
    };
  }

  relationQuery(vm, renders, tableDatas, config) {
    config["query"] || (config["query"] = {});
    config["query"]["relationId"] = renders[0]["ID"] || renders[0]["id"];
    config["query"]["relationModuleId"] = this[_view].moduleId;
    config["query"]["relationViewId"] = this[_view].$id;
    return {
      vm,
      renders,
      tableDatas,
      config
    };
  }

  /**
   * 获取第一条真实数据Id
   * @param vm 当前视图
   * @param renders 真实数据集合
   * @param config 处理配置
   */
  recordId(vm, renders, tableDatas, config) {
    config["query"] || (config["query"] = {});
    config["query"]["recordId"] = renders[0]["ID"] || renders[0]["id"];
    return {
      vm,
      renders,
      tableDatas,
      config
    };
  }

  /**
   * 获取所有真实数据Id集合(主要用于自定义提交到后台)
   * @param vm 当前视图
   * @param renders 真实数据集合
   * @param config 处理配置
   */
  customRecordIds(vm, renders, tableDatas, config) {
    config.data || (config.data = {});
    config.data["recordIds"] = [];
    renders = renders || [];
    if (renders.length === 1) {
      config.data["recordIds"] = renders[0]["ID"] || renders[0]["id"];
    } else {
      renders.forEach(render => {
        config.data["recordIds"].push(render["ID"] || render["id"]);
      });
    }
    return {
      vm,
      renders,
      tableDatas,
      config
    };
  }

  /**
   * 获取所有真实数据Id集合(主要用于提交到后台)
   * @param vm 当前视图
   * @param renders 真实数据集合
   * @param config 处理配置
   */
  recordIds(vm, renders, tableDatas, config) {
    config.data || (config.data = {});
    config.data["recordIds"] = [];
    renders = renders || [];
    renders.forEach(render => {
      config.data["recordIds"].push(render["ID"] || render["id"]);
    });
    return {
      vm,
      renders,
      tableDatas,
      config
    };
  }

  /**
   * 跳转数据格式化
   * @param vm 当前组件实例
   * @param renders 真实数据集合
   */
  businessRedirect(vm, renders, tableDatas, config) {
    config["name"] = "business";
    config["params"] || (config["params"] = {});
    config["params"]["viewId"] = this.forwardViewId;
    return {
      vm,
      renders,
      tableDatas,
      config
    };
  }

  /**
   * 页面跳转
   */
  redirect(...args) {
    let ts = this;
    return function REDIRECT(vm, renders = undefined, tableDatas = undefined) {
      let promise = Promise.resolve({
        vm,
        renders,
        tableDatas,
        config: {}
      });
      args.forEach(fn => {
        promise = promise.then(({
          vm,
          renders,
          tableDatas,
          config
        }) => {
          return fn.call(ts, vm, renders, tableDatas, config);
        });
      });
      return promise.then(({
        vm,
        renders,
        tableDatas,
        config
      }) => {
        vm.$router.push(config);
        return false;
      });
    };
  }
  /**
   * 编译视图默认操作
   * @param view 视图信息
   */
  buildSubmit(view, data, submitDataType) {
    if (view.operations.length < 1) {
      let operationData = Object["assign"]({}, this[_operationData], {
        type: 0,
        submitType: this.batchType === "UPDATE" ? 4 : 5,
        submitDataType: submitDataType,
        operationName: "提交",
        appendSubmitData: data // 附加提交数据
      });
      let operation = new Operation(view, operationData);
      view.$set(view.operations, view.operations.length, operation);
      operation.handler();
    }
  }

  /**
   * 添加弹框内容
   */
  openDialog(...args) {
    let ts = this;
    return function OPEN_DIALOG(vm, renders = undefined, tableDatas = undefined) {
      let submitDataType = (!renders || renders.length < 1) ? "ALL" : "CHECKDATA";
      let promise = Promise.resolve({
        vm,
        renders,
        tableDatas,
        config: {}
      });
      args.forEach(fn => {
        promise = promise.then(({
          vm,
          renders,
          tableDatas,
          config
        }) => {
          return fn.call(ts, vm, renders, tableDatas, config);
        });
      });
      return promise.then(({
        vm,
        renders,
        tableDatas,
        config
      }) => {
        if (config["params"] && config["params"]["viewId"]) {
          let viewId = config["params"]["viewId"];
          viewCache.getViewType(viewId).then(viewEnum => {
            return createView(viewEnum.class, viewId);
          }).then(view => {
            ts.buildSubmit(view, config["data"], submitDataType);
            vm.openBatchDialog(view, config["data"]);
            return false;
          });
        } else {
          vm.$aui.alert.show(`【${ts.lable}】请配置批量视图`, '配置错误', {
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
  dataSubmit(...args) {
    let ts = this;
    return function DATA_SUBMIT(vm, renders = undefined, tableDatas = undefined) {
      let config = {
        url: undefined,
        data: {}
      };
      let promise = Promise.resolve({
        vm,
        renders,
        tableDatas,
        config
      });
      args.forEach(fn => {
        promise = promise.then(({
          vm,
          renders,
          tableDatas,
          config
        }) => {
          return fn.call(ts, vm, renders, tableDatas, config);
        });
      });
      return promise.then(({
        vm,
        renders,
        tableDatas,
        config
      }) => {
        return axios.post(config.url, config.data);
      });
    };
  }
}

export default Operation;
