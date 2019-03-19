"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = require("../common");

var _index = require("../services/index");

var _eventBus = require("./event-bus");

var _eventBus2 = _interopRequireDefault(_eventBus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ORG_ARRAY = [];
var _ORG_CACHE = {};
var isInit = false;
var initPromise = undefined;

_eventBus2.default.$on('RootView', "PUI_CLEAR_CACHE", function () {
  for (var key in _ORG_CACHE) {
    delete _ORG_CACHE[key];
    //console.log("清空组织架构数据", key);
  }
  _orgLoading();
});

var _arrayToTree = function _arrayToTree(array) {
  _ORG_ARRAY = [];
  _ORG_CACHE = {};
  if (!array) return;
  for (var index in array) {
    var item = array[index];
    if (Boolean(item["orgCode"]) && item["orgCode"] != 0) {
      _ORG_CACHE[item["orgCode"]] = item;
    }
  }
  for (var key in _ORG_CACHE) {
    var _item = _ORG_CACHE[key];
    var parent = _ORG_CACHE[_item["orgParentCode"]];
    if (Boolean(parent)) {
      Boolean(parent["children"]) || (parent["children"] = []);
      parent["children"].push(_item);
      _item["#parent"] = parent;
    } else {
      _ORG_ARRAY.push(_item);
    }
  }
};

var _orgLoading = function _orgLoading() {
  return _index.orgService.findOrgList().then(function (res) {
    var organzationList = res.organzationList;
    console.log("加载系统所有组织架构", organzationList);
    _arrayToTree(organzationList);
    // 初始化结束
    isInit = false;
    // 释放资源
    initPromise = undefined;
    return res;
  });
};

var _loadFullPath = function _loadFullPath(value) {
  var item = _ORG_CACHE[value];
  if (!Boolean(item)) return [];
  var valueArray = [item["orgCode"]];
  var parent = item["#parent"];
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
  this.loading = function (orgParentCode) {
    var promise = Promise.resolve({ state: true });
    if (isInit) {
      promise = initPromise;
    } else if (_ORG_ARRAY.length === 0 || Object.keys(_ORG_CACHE).length === 0) {
      promise = _orgLoading();
      // 正在初始化
      isInit = true;
      initPromise = promise;
    }
    return promise.then(function () {
      return _common.object.deepClone(Boolean(orgParentCode) ? _ORG_CACHE[orgParentCode] || [] : _ORG_ARRAY);
    });
  };

  this.findByCode = function (orgCode) {
    if (isInit) {
      return initPromise.then(function () {
        return _common.object.deepClone(_ORG_CACHE[orgCode]);
      });
    }
    return Promise.resolve(_common.object.deepClone(_ORG_CACHE[orgCode]));
  };

  this.loadVal = function (value) {
    if (isInit) {
      return initPromise.then(function () {
        return _loadFullPath(value);
      });
    }
    return Promise.resolve(_loadFullPath(value));
  };

  this.loadSycnShowVal = function (value) {
    var item = _ORG_CACHE[value];
    if (!Boolean(item)) return [];
    var valueArray = [item["orgName"]];
    var parent = item["#parent"];
    while (Boolean(parent)) {
      valueArray.push(parent["orgName"]);
      parent = parent["#parent"];
    }
    return valueArray.reverse();
  };
}

/**
 * 全局单例模式
 */
exports.default = new Organization();