import axios from "axios"
import { object } from "../common";
import EventBus from "./event-bus";

let DICT_MAPS = {}; // 字典Map
let DICT_MAPPING = undefined; // 字典类型映射
let _DICT_CACHE = {}; // 字典缓存
let isInit = false; // 是否初始化
let initPromise = undefined; // 初始化异步函数

EventBus.$on('RootView', "PUI_CLEAR_CACHE", () => {
  for (const key in DICT_MAPPING) {
    delete DICT_MAPPING[key];
    //console.log("清空字典数据", key);
  }
  initDict();
});

const initDict = function() {
  return axios.post("platform://base/B03008", { isFindAll: 1 }).then(res => {
    DICT_MAPPING = {};
    let dictsTmp = [];
    (res.data || []).forEach(dict => {
      if (dict.dictType === "" || dict.dictType === null || !dict.dictType) {
        DICT_MAPPING[dict.dictCode] = dict;
        dict["children"] = [];
      } else {
        dictsTmp.push(dict);
      }
    });
    dictsTmp.forEach(dict => {
      let parent = DICT_MAPPING[dict.dictType];
      if (parent) {
        parent["children"] || (parent["children"] = []);
        parent["children"].push(dict);
      }
    });
    // 对字典子集进行排序
    for (let key in DICT_MAPPING) {
      let dictArray = DICT_MAPPING[key];
      dictArray["children"] = dictArray["children"].sort(function(a, b) {
        return b.sort - a.sort;
      });
    }
    console.log("加载完成字典数据", DICT_MAPPING);
    isInit = false;
    // 释放资源
    initPromise = undefined;
    return DICT_MAPPING;
  });
};
const _loadVal = function(dictType, value) {
  let parent = DICT_MAPPING[dictType];
  let dictVal = undefined;
  parent["children"].forEach(dict => {
    if(dict.dictCode === value){
      dictVal = dict;
    }
  });
  return dictVal;
};
function DictManage() {
  this.loading = function(dictType) {
    let promise = Promise.resolve({ state: true });
    if (isInit) {
      promise = initPromise;
    } else if (!Boolean(DICT_MAPPING)) {
      promise = initDict();
      isInit = true;
      initPromise = promise;
    }
    return promise.then(() => {
      return object.deepClone(
        DICT_MAPPING[dictType] ? DICT_MAPPING[dictType]["children"] : []
      );
    });
  };
  this.loadVal = function(dictType, value) {
    if(!Boolean(DICT_MAPPING)){
      if(!isInit){
        this.loading('');
      }
      return initPromise.then(() => {
        return _loadVal(dictType, value);
      });
    }
    return Promise.resolve(_loadVal(dictType, value));
  };
  this.loadAll = function(dictType = "", value = "") {
    if(!Boolean(DICT_MAPPING)){
      if(!isInit){
        this.loading('');
      }
      return initPromise.then(() => {
        return _loadVal(dictType, value);
      });
    }
    return Promise.resolve(_loadVal(dictType, value));
  };
}
export default new DictManage();
