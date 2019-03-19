let _index = Symbol("Global_UID");
/**
 * 全局唯一标识
 */
class GlobalUid {
  constructor() {
    this[_index] = 0;
  }
  /**
   * 获取唯一标识
   */
  get() {
    this[_index] += 1;
    return this[_index];
  }
}

export default new GlobalUid();
