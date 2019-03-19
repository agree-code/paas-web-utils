/**
 * Created by xiyuan on 17-5-29.
 */

'use strict';
//消息在粗粒度级别上突出强调应用程序的运行过程。

Object.defineProperty(exports, "__esModule", {
    value: true
});
var info = function info(msg) {
    console.info(msg);
};

//警告出现潜在错误的情形
var warn = function warn(msg) {
    console.warn(msg);
};

//虽然发生错误事件，但仍然不影响系统的继续运行。
var error = function error(msg) {
    console.error(msg);
};

//与DEBUG 相比更细致化的记录事件消息。
var trace = function trace(msg) {
    console.dir(msg);
};

//调试日志
var debug = function debug(msg) {
    console.log(msg);
};

//致命的错误
var fatal = function fatal(msg) {
    throw msg;
};

exports.default = {
    info: info,
    warn: warn,
    error: error,
    trace: trace,
    debug: debug,
    fatal: fatal
};