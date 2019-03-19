import Vue from "vue";
/**
 * 消息中心
 */
const BUS = new Vue();
const _dataSpace = Symbol("DataSpace");
/**
 * 事件总线
 */
class EventBus {
  constructor() {
    this[_dataSpace] = {};
  }
  get $space() {
    return this[_dataSpace];
  }
  /**
   * 监听事件
   * @param {string} event 事件名称
   * @param {function} eventCallback 事件回调参数
   */
  $on(uid, event, eventCallback) {
    this.$space[uid] || (this.$space[uid] = []);
    this.$space[uid].push(event);
    BUS.$on(event, eventCallback);
  }
  /**
   * 监听事件，但是只触发一次，在第一次触发之后移除监听器。
   * @param {string} event 事件名称
   * @param {function} eventCallback 事件回调参数
   */
  $once(event, eventCallback) {
    BUS.$once(event, eventCallback);
  }
  /**
   * 移除事件监听器
   *  1、如果没有提供参数，则移除所有的事件监听器
   *  2、如果只提供了事件，则移除该事件所有的监听器；
   *  3、如果同时提供了事件与回调，则只移除这个回调的监听器。
   * @param {string} event 事件名称
   * @param {function} eventCallback 事件回调参数
   */
  $off(event, eventCallback) {
    BUS.$off(event, eventCallback);
  }
  /**
   * 移除某空间所有监听器
   * @param {*} uid 某空间
   */
  $offAll(uid) {
    this.$space[uid] || (this.$space[uid] = []);
    for (const iterator of this.$space[uid]) {
      this.$off(iterator);
    }
    delete this.$space[uid];
  }

  /**
   * 触发当前实例上的事件。附加参数都会传给监听器回调
   * @param {string} event 事件名称
   * @param {array} args 附加参数
   */
  $emit(event, ...args) {
    BUS.$emit(event, ...args);
  }
}

export default new EventBus();
