/**
 * Created by xiyuan on 17-5-29.
 */

'use strict';
//消息在粗粒度级别上突出强调应用程序的运行过程。
const info=(msg)=> {
    console.info(msg);
}

//警告出现潜在错误的情形
const warn=(msg)=> {
    console.warn(msg);
}

//虽然发生错误事件，但仍然不影响系统的继续运行。
const error=(msg)=> {
    console.error(msg);
}

//与DEBUG 相比更细致化的记录事件消息。
const trace=(msg)=> {
    console.dir(msg)
}

//调试日志
const debug=(msg)=> {
    console.log(msg)
}

//致命的错误
const fatal=(msg)=> {
    throw msg;
}

export default{
    info,
    warn,
    error,
    trace,
    debug,
    fatal
}