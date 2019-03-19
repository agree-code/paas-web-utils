"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _common = require("../common");

var _eventBus = require("./event-bus");

var _eventBus2 = _interopRequireDefault(_eventBus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DICT_MAPS = {}; // 字典Map
var DICT_MAPPING = undefined; // 字典类型映射
var _DICT_CACHE = {}; // 字典缓存
var isInit = false; // 是否初始化
var initPromise = undefined; // 初始化异步函数

_eventBus2.default.$on('RootView', "PUI_CLEAR_CACHE", function () {
  for (var key in DICT_MAPPING) {
    delete DICT_MAPPING[key];
    //console.log("清空字典数据", key);
  }
  initDict();
});

var initDict = function initDict() {
  return _axios2.default.post("platform://base/B03008", { isFindAll: 1 }).then(function (res) {
    DICT_MAPPING = {};
    var dictsTmp = [];
    (res.data || []).forEach(function (dict) {
      if (dict.dictType === "" || dict.dictType === null || !dict.dictType) {
        DICT_MAPPING[dict.dictCode] = dict;
        dict["children"] = [];
      } else {
        dictsTmp.push(dict);
      }
    });
    dictsTmp.forEach(function (dict) {
      var parent = DICT_MAPPING[dict.dictType];
      if (parent) {
        parent["children"] || (parent["children"] = []);
        parent["children"].push(dict);
      }
    });
    // 对字典子集进行排序
    for (var key in DICT_MAPPING) {
      var dictArray = DICT_MAPPING[key];
      dictArray["children"] = dictArray["children"].sort(function (a, b) {
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
var _loadVal = function _loadVal(dictType, value) {
  var parent = DICT_MAPPING[dictType];
  var dictVal = undefined;
  parent["children"].forEach(function (dict) {
    if (dict.dictCode === value) {
      dictVal = dict;
    }
  });
  return dictVal;
};
function DictManage() {
  this.loading = function (dictType) {
    var promise = Promise.resolve({ state: true });
    if (isInit) {
      promise = initPromise;
    } else if (!Boolean(DICT_MAPPING)) {
      promise = initDict();
      isInit = true;
      initPromise = promise;
    }
    return promise.then(function () {
      return _common.object.deepClone(DICT_MAPPING[dictType] ? DICT_MAPPING[dictType]["children"] : []);
    });
  };
  this.loadVal = function (dictType, value) {
    if (!Boolean(DICT_MAPPING)) {
      if (!isInit) {
        this.loading('');
      }
      return initPromise.then(function () {
        return _loadVal(dictType, value);
      });
    }
    return Promise.resolve(_loadVal(dictType, value));
  };
  this.loadAll = function () {
    var dictType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

    if (!Boolean(DICT_MAPPING)) {
      if (!isInit) {
        this.loading('');
      }
      return initPromise.then(function () {
        return _loadVal(dictType, value);
      });
    }
    return Promise.resolve(_loadVal(dictType, value));
  };
}
exports.default = new DictManage();