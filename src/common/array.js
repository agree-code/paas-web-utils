function arrayToTree(array, id = "id", pid = "pid") {
  array = array.deepClone();
  let tempMap = {};
  array.forEach(function (value) {
    tempMap[value[id]] = value;
  });
  let treeData = [];
  tempMap.forEach(function (value) {
    let p = tempMap[value[pid]];
    if (p) {
      if (!p.child) p.child = [];
      p.child.push(value);
    } else {
      treeData.push(value);
    }
  });

  return sort(treeData)
}

function sort(arr) { //升序
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i].menuOrder > arr[j].menuOrder) {
        var tem = arr[i]
        arr[i] = arr[j]
        arr[j] = tem
      }
    }
  }
  return arr
}

export default {
  arrayToTree,
  sort
}
