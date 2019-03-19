'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function getType(value) {
    if (isElement(value)) return 'element';
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    if (type == 'object') {
        type = {}.toString.call(value).match(/object\s+(\w*)/)[1].toLocaleLowerCase();
    }
    return type;
};

function isType(type) {
    return function (obj) {
        return {}.toString.call(obj) == "[object " + type + "]";
    };
};

/*判断一个变量是否定义*/
function isDefined(value) {
    return typeof value !== 'undefined';
}

function isElement(node) {
    return !!(node && (node.nodeName || node.prop && node.attr && node.find));
}

/*判断对象是空值*/
var isEmpty = function isEmpty(obj) {
    switch (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) {
        case 'object':
            for (var n in obj) {
                return false;
            }
            return true;
        default:
            if (!obj) {
                return true;
            }
            return false;
    }
};

var isObject = function isObject(data) {
    return data instanceof Object;
};

var isArray = function isArray(data) {
    return data instanceof Array;
};
var isString = function isString(data) {
    return typeof data === 'string';
};
var isNumber = function isNumber(data) {
    return typeof data === 'number';
};
var isFunction = function isFunction(data) {
    return data instanceof Function;
};
var isDate = function isDate(data) {
    return data instanceof Date;
};
var isBoolean = function isBoolean(data) {
    return typeof data === 'boolean';
};
var isRegExp = function isRegExp(data) {
    return data instanceof RegExp;
};
var isFile = function isFile(data) {
    return data instanceof File;
};
var isFormData = function isFormData(data) {
    return data instanceof FormData;
};
var isBlob = function isBlob(data) {
    return data instanceof Blob;
};
var isWindow = function isWindow(data) {
    return data instanceof Window;
};
var isHTMLDocument = function isHTMLDocument(data) {
    return data instanceof HTMLDocument;
};

var TYPED_ARRAY_REGEXP = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/;

//是否其他类型数组
function isTypedArray(value) {
    return value && isNumber(value.length) && TYPED_ARRAY_REGEXP.test(toString.call(value));
}

//对比两个数据
function equals(o1, o2) {
    if (o1 === o2) return true;
    if (o1 === null || o2 === null) return false;
    if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
    var t1 = typeof o1 === 'undefined' ? 'undefined' : _typeof(o1),
        t2 = typeof o2 === 'undefined' ? 'undefined' : _typeof(o2),
        length,
        key,
        keySet;
    if (t1 === t2) {
        if (t1 === 'object') {
            if (isArray(o1)) {
                if (!isArray(o2)) return false;
                if ((length = o1.length) == o2.length) {
                    for (key = 0; key < length; key++) {
                        if (!equals(o1[key], o2[key])) return false;
                    }
                    return true;
                }
            } else if (isDate(o1)) {
                if (!isDate(o2)) return false;
                return equals(o1.getTime(), o2.getTime());
            } else if (isRegExp(o1)) {
                return isRegExp(o2) ? o1.toString() === o2.toString() : false;
            } else {
                if (isWindow(o1) || isWindow(o2) || isArray(o2) || isDate(o2) || isRegExp(o2)) return false;
                keySet = Object.create(null);
                for (key in o1) {
                    if (key.charAt(0) === '$' || isFunction(o1[key])) continue;
                    if (!equals(o1[key], o2[key])) return false;
                    keySet[key] = true;
                }
                for (key in o2) {
                    if (!(key in keySet) && key.charAt(0) !== '$' && isDefined(o2[key]) && !isFunction(o2[key])) return false;
                }
                return true;
            }
        }
    }

    /*检查两个变量是否是function*/
    if (getType(o1) === getType(o2)) {
        switch (getType(o1)) {
            case 'function':
                if (o1.toString() !== o2.toString()) {
                    return false;
                }
                var keys = {},
                    key;
                for (key in o1) {
                    keys[key] = key;
                }
                for (key in o2) {
                    keys[key] = key;
                }
                for (key in keys) {
                    if (o1.propertyIsEnumerable(key) && o2.propertyIsEnumerable(key)) {} else {
                        return false;
                    }
                }

                keys = {};
                for (key in o1.prototype) {
                    keys[key] = key;
                }
                for (key in o2.prototype) {
                    keys[key] = key;
                }
                for (key in keys) {
                    if (o1.prototype.propertyIsEnumerable(key) && o2.prototype.propertyIsEnumerable(key)) {} else {
                        return false;
                    }
                }
                return true;
        }
    }
    return false;
};

exports.default = {
    isType: isType,
    isObject: isObject,
    isArray: isArray,
    isString: isString,
    isNumber: isNumber,
    isFunction: isFunction,
    isDate: isDate,
    isBoolean: isBoolean,
    isRegExp: isRegExp,
    isFile: isFile,
    isFormData: isFormData,
    isBlob: isBlob,
    isWindow: isWindow,
    isHTMLDocument: isHTMLDocument,
    isDefined: isDefined,
    isElement: isElement,
    isEmpty: isEmpty,
    isTypedArray: isTypedArray,
    equals: equals
};