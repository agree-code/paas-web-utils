import { object } from "../common";
import { orgService } from "../services/index";
let _ORG_ARRAY = [];
let _ORG_CACHE = {};
let isInit = false;
let initPromise = undefined;

import EventBus from "./event-bus";
EventBus.$on('RootView', "PUI_CLEAR_CACHE", () => {
  for (const key in _ORG_CACHE) {
    delete _ORG_CACHE[key];
    //console.log("清空组织架构数据", key);
  }
  _orgLoading();
});

const _arrayToTree = function(array) {
  _ORG_ARRAY = [];
  _ORG_CACHE = {};
  if (!array) return;
  for (var index in array) {
    let item = array[index];
    if (Boolean(item["orgCode"]) && item["orgCode"] != 0) {
      _ORG_CACHE[item["orgCode"]] = item;
    }
  }
  for (var key in _ORG_CACHE) {
    let item = _ORG_CACHE[key];
    let parent = _ORG_CACHE[item["orgParentCode"]];
    if (Boolean(parent)) {
      Boolean(parent["children"]) || (parent["children"] = []);
      parent["children"].push(item);
      item["#parent"] = parent;
    } else {
      _ORG_ARRAY.push(item);
    }
  }
};

const _orgLoading = function() {
  return orgService.findOrgList().then(res => {
    let organzationList = res.organzationList;
    console.log("加载系统所有组织架构", organzationList);
    _arrayToTree(organzationList);
    // 初始化结束
    isInit = false;
    // 释放资源
    initPromise = undefined;
    return res;
  });
};

const _loadFullPath = function(value) {
  let item = _ORG_CACHE[value];
  if (!Boolean(item)) return [];
  let valueArray = [item["orgCode"]];
  let parent = item["#parent"];
  while (Boolean(parent)) {
    valueArray.push(parent["orgCode"]);
    parent = parent["#parent"];
  }
  return valueArray.reverse();
};

/**
 * 组织架构
 */
function Organization() {
  this.loading = function(orgParentCode) {
    let promise = Promise.resolve({ state: true });
    if (isInit) {
      promise = initPromise;
    } else if (
      _ORG_ARRAY.length === 0 ||
      Object.keys(_ORG_CACHE).length === 0
    ) {
      promise = _orgLoading();
      // 正在初始化
      isInit = true;
      initPromise = promise;
    }
    return promise.then(() => {
      return object.deepClone( Boolean(orgParentCode) ? _ORG_CACHE[orgParentCode] || [] : _ORG_ARRAY );
    });
  };

  this.findByCode = function(orgCode){
    if(isInit){
      return initPromise.then(() => {
        return object.deepClone(_ORG_CACHE[orgCode]);
      });
    }
    return Promise.resolve(object.deepClone(_ORG_CACHE[orgCode]));
  }

  this.loadVal = function(value) {
    if (isInit) {
      return initPromise.then(() => {
        return _loadFullPath(value);
      });
    }
    return Promise.resolve(_loadFullPath(value));
  };

  this.loadSycnShowVal = function(value){
    let item = _ORG_CACHE[value];
  if (!Boolean(item)) return [];
  let valueArray = [item["orgName"]];
  let parent = item["#parent"];
  while (Boolean(parent)) {
    valueArray.push(parent["orgName"]);
    parent = parent["#parent"];
  }
  return valueArray.reverse();
  }
}

/**
 * 全局单例模式
 */
export default new Organization();
