/**
 * Created by xiyuan on 17-3-7.
 */
"use strict";

//把对象转换成json字符串

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var stringify = function stringify(obj) {
    var TmpArray = [];
    for (var i in obj) {
        obj[i] = typeof obj[i] === 'string' ? '"' + obj[i].replace(/"/g, '\\"') + '"' : _typeof(obj[i]) === 'object' ? stringify(obj[i]) : obj[i];
        TmpArray.push(i + ':' + obj[i]);
    }
    return '{' + TmpArray.join(',') + '}';
};

//把字符串解析成对象
var parse = function parse(str) {
    if ((typeof str === 'undefined' ? 'undefined' : _typeof(str)) === 'object') {
        return str;
    } else {
        try {
            var json = new Function("return " + str)();
        } catch (e) {
            return str;
        }
        return json;
    }
};

exports.default = {
    stringify: stringify,
    parse: parse
};