import axios from "axios"
import {
  VIEW_ENUM
} from "./enum";
import EventBus from "./event-bus";

class ViewCache {
  constructor() {
    this.VIEW_CACHE_MAP = {};
    EventBus.$on('RootView', "PUI_CLEAR_CACHE", () => {
      for (const key in this.VIEW_CACHE_MAP) {
        delete this.VIEW_CACHE_MAP[key];
        //console.log("清空数据", key);
      }
      this.initData = false;
      this.get();
    });
  }

  get(viewId) {
    if (this.initData) {
      return Promise.resolve(Object.assign({}, this.VIEW_CACHE_MAP[viewId]));
    }
    if (!this.initPromise) {
      this.initPromise = axios.post("platform://custom/C11008", {
          viewFlag: 0
        }).then(res => {
          for (const view of res.data) {
            this.VIEW_CACHE_MAP[view.id] = view;
          }
          this.initData = true;
          console.log("成功加载所有视图信息", res.data.length);
          // 释放资源
          delete this.initPromise;
          return Object.assign({}, this.VIEW_CACHE_MAP[viewId]);
        });
    }
    return this.initPromise;
  }

  cleanAll() {
    Object.keys(this.VIEW_CACHE_MAP).forEach(key => {
      delete this.VIEW_CACHE_MAP[key];
    });
  }

  remove(viewId) {
    delete this.VIEW_CACHE_MAP[viewId];
  }

  getViewType(viewId) {
    return this.get(viewId).then(view => {
      switch (view.viewType) {
        case 2:
        case 7:
          return VIEW_ENUM.INSERT;
        case 3:
        case 8:
          return VIEW_ENUM.EDIT;
        case 4:
          return VIEW_ENUM.DETAIL;
        case 5:
          return VIEW_ENUM.CUSTOM;
        case 6:
          return VIEW_ENUM.INSERT;
        default:
          return VIEW_ENUM.LIST;
      }
    });
  }
}

export default new ViewCache();
