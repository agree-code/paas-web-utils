'use strict';

/**
 * 数据属性设置
 * @param obj
 * @param key
 */
function def(obj, key, value) {
  Object.defineProperty(obj, key, {
    writable: true,
    enumerable: false,
    configurable: true,
    value: value || obj[key]
  });
}

//对象遍历
def(Object.prototype, 'forEach', function (fn) {
  var This = this;
  fn = typeof fn === 'function' ? fn : new Function;
  Object.keys(this).forEach(function (key) {
    fn(This[key], key);
  })
  fn = null;
});

//对象继承
def(Object.prototype, 'extend', function () {
  extend.apply(this, [this].concat([].slice.call(arguments)));
  return this;
});

//对象深度克隆
def(Object.prototype, 'deepClone', function () {
  return deepClone(this);
});

//对象深度继承
def(Object.prototype, 'deepExtend', function () {
  return deepExtend(arguments);
});

//对象属性设置
def(Object.prototype, 'setAttr', function (key, data) {
  return setAttr(this, key, data)
});

//对象属性读取
def(Object.prototype, 'getAttr', function (key) {
  return getAttr(this, key);
});

def(Object.prototype, 'handleProperty2Boolean', function (keys) {
  return handleProperty2Boolean(this, keys);
});
def(Object.prototype, 'findBoolanProperties', function () {
  return findBoolanProperties(this);
});
//浅继承
function extend() {
  var i = ~0,
    args = arguments,
    argLen = args.length;
  if (argLen < 2) return args[0];

  while (++i < argLen) {
    if (i === 0 || !arguments[i]) continue;
    Object.keys(args[i]).forEach(function (j) {
      args[0][j] = args[i][j];
    });
  }
  return args[0];
};

//深度克隆
function deepClone(obj, recordKey = undefined) {
  var result = obj,
    level,
    _toString = {}.toString;

  if (!recordKey) {
    recordKey = {};
    level = 1;
  }

  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true);
  }

  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime());
  }

  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    var flags = [];
    if (obj.global) {
      flags.push('g');
    }
    if (obj.multiline) {
      flags.push('m');
    }
    if (obj.ignoreCase) {
      flags.push('i');
    }

    return new RegExp(obj.source, flags.join(''));
  }


  if (typeof obj === 'object' && obj !== null) {

    result = obj instanceof Array ? [] : {};

    var keys = Object.keys(obj);

    keys.forEach(function (val) {

      //为防止数据绑定中的特殊数据导致无限循环
      if (recordKey[val] && recordKey[val].indexOf(obj[val]) !== -1 && typeof obj[val] === 'object' && obj[val] !== null) {
        return;
      }

      //记录值
      (recordKey[val] = recordKey[val] || []).push(obj[val]);

      result[val] = deepClone(obj[val], recordKey);
    });
  }

  //清除记录
  if (level) {
    recordKey = null;
  }
  return result;
};

//深度继承
const deepExtend = (...arg) => {
  if (arg.length < 2) {
    return false;
  }
  var i = ~0,
    s = 0,
    l = arg.length,
    argi;
  while (++i < l) {
    if (i === 0) {
      continue;
    }
    s = 0, argi = arg[i];
    Object.keys(argi).forEach(function (j) {
      //原型
      if (!argi.hasOwnProperty(j)) return;

      var oldValue = arg[0][j];
      var newValue = argi[j];

      if ((oldValue instanceof Array || oldValue instanceof Object) && (newValue instanceof Array || newValue instanceof Object)) {
        deepExtend.call(this, arg[0][j], argi[j]);
      } else {
        arg[0][j] = argi[j];
      }
    })
  }
  return arg[0];
};

//对象合并克隆
function concatClone() {
  var res = {},
    args = [].slice.call(arguments);

  args.forEach(function (arg) {
    Object.keys(arg).forEach(function (val) {
      res[val] = deepClone(arg[val]);
    });
  });

  return res;
};

//配置合并
function merge(now, def) {
  Object.keys(def).forEach(function (key) {
    typeof now[key] === "undefined" && (now[key] = def[key])
  })
  return now;
};

//arguments参数转为数组
function toArray(arg) {
  return [].slice.call(arg);
};

/**
 * 检查属性是否原型属性
 * @param obj
 * @param key
 * @returns {boolean}
 */
function hasPrototypeProperty(obj, key) {
  return !obj.hasOwnProperty(key) && key in obj;
};

/*数据配置解析*/
function parseStringData(keyString, data) {
  if (arguments.length < 2) {
    return arguments[0];
  }
  keyString = keyString.match(/^[\w+\.]+$/g);
  if (keyString) {
    keyString = keyString[0].replace(/\[([\S]+)\]/g, function (reg, $1) {
      return '.' + $1;
    });
    var attrs = keyString.split('.'),
      i = ~0,
      l = attrs.length;
    while (++i < l) {
      data = data[attrs[i]];
      if (typeof data === "undefined") {
        console.log(attrs[i] + '属性不存在！');
        return null;
      }
    }
    return data;
  } else {
    console.log('取值方法有误！');
    return false;
  }
};

/*数据配置设置*/
function setStringData(keyString, data, values) {
  if (arguments.length < 2) {
    return arguments[0];
  }

  keyString = keyString.match(/^[\w+\.]+$/g);
  if (keyString) {
    keyString = keyString[0].replace(/\[([\S]+)\]/g, function (reg, $1) {
      return '.' + $1;
    });

    var attrs = keyString.split('.'),
      i = ~0,
      l = attrs.length;
    while (++i < l) {
      if (i + 1 === l) {
        data[attrs[i]] = values;
        return values;
      }
      data = data[attrs[i]];
      if (typeof data === "undefined") {
        console.log(attrs[i] + '属性不存在！');
        return null;
      }
    }

  } else {
    console.log('取值方法有误！');
    return false;
  }
};

/**
 * model数据写入
 * @param obj
 * @param key
 * @param data
 */
function setAttr(obj, key, data) {

  (function getLevel(model, modelKey, writeKey) {

    if (!writeKey) {
      if (!modelKey) {
        return data;
      }
      model[modelKey] = data;
      return true;
    }

    var property;
    //提取key字符中对象所属的第一个属性
    writeKey = writeKey.replace(/^\[([^.\]]+)\]|^\.?([^.\[\]]+)/, function (str, arrKey, objKey) {
      //匹配提取[key]或.key 这两种形式的key 并去除key外部的单引号或双引号
      property = (arrKey || objKey).match(/^(['"]?)([\s\S]+)\1$/).pop();
      return '';
    });
    //检查对象
    if (typeof model[modelKey] !== 'object' || model[modelKey] === null) {
      modelKey && (model[modelKey] = {});
    }
    getLevel(modelKey ? model[modelKey] : model, property, writeKey);
  })(obj, '', key)

  return obj;
};

/**
 * 数据获取
 * @param obj
 * @param key
 */
function getAttr(obj, key) {
  return function getLevel(model, writeKey) {
    if (!writeKey) {
      return model;
    }

    var property;
    //提取key字符中对象所属的第一个属性
    writeKey = writeKey.replace(/^\[([^.\]]+)\]|^\.?([^.\[\]]+)/, function (str, arrKey, objKey) {
      //匹配提取[key]或.key 这两种形式的key 并去除key外部的单引号或双引号
      property = (arrKey || objKey).match(/^(['"]?)([\s\S]+)\1$/).pop();
      return '';
    });

    //检查对象
    if (!model) {
      model = {};
    }

    return getLevel(model[property], writeKey);
  }(obj, key);

};



const classExtends = (a, b) => {
  b.prototype = b.prototype || {};

  Object.keys(a).map(function (key) {
    b.prototype[key] = a[key]
  });

  Object.keys(a.prototype).map(function (key) {
    if (b.prototype[key] === undefined) {
      b.prototype[key] = a.prototype[key]
    }
  })
}
/**
 * 将指定对象内的所有boolean值转换为number
 * @param {Object} params 
 */
function handleFormData(params) {
  params.forEach((value, key) => {
    if (typeof value === "boolean") {
      params[key] = Number(value);
    }
  });
  return params;
}
/**
 * 将对象中指定的属性转换为boolean
 * @param {Object} obj 
 * @param {Array} keys 
 */
function handleProperty2Boolean(obj, keys) {
  keys.forEach(key => {
    obj[key] = Boolean(Number(obj[key]));
  });
  return obj;
}
/**
 * 将对象中指定的属性转换为number
 * @param {Object} obj 
 * @param {Array} keys 
 */
function handleProperty2Number(obj,keys){
  keys.forEach(key => {
    obj[key] = Number(obj[key]);
  });
  return obj;
}
/**
 * 
 * @param {Object} obj 
 */
function findBoolanProperties(obj) {
  var arr = new Array();
  obj.forEach((value, key) => {
    if (typeof value === "boolean") {
      arr.push(key);
    }
  });
  return arr;
}

export default {
  extend,
  deepClone,
  deepExtend,
  concatClone,
  merge,
  classExtends,
  toArray,
  hasPrototypeProperty,
  parseStringData,
  setStringData,
  setAttr,
  getAttr,
  handleFormData,
  findBoolanProperties
}
