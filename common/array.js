"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function arrayToTree(array) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "id";
  var pid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "pid";

  array = array.deepClone();
  var tempMap = {};
  array.forEach(function (value) {
    tempMap[value[id]] = value;
  });
  var treeData = [];
  tempMap.forEach(function (value) {
    var p = tempMap[value[pid]];
    if (p) {
      if (!p.child) p.child = [];
      p.child.push(value);
    } else {
      treeData.push(value);
    }
  });

  return sort(treeData);
}

function sort(arr) {
  //升序
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i].menuOrder > arr[j].menuOrder) {
        var tem = arr[i];
        arr[i] = arr[j];
        arr[j] = tem;
      }
    }
  }
  return arr;
}

exports.default = {
  arrayToTree: arrayToTree,
  sort: sort
};