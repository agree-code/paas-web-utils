"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _index = Symbol("Global_UID");
/**
 * 全局唯一标识
 */

var GlobalUid = function () {
  function GlobalUid() {
    _classCallCheck(this, GlobalUid);

    this[_index] = 0;
  }
  /**
   * 获取唯一标识
   */


  _createClass(GlobalUid, [{
    key: "get",
    value: function get() {
      this[_index] += 1;
      return this[_index];
    }
  }]);

  return GlobalUid;
}();

exports.default = new GlobalUid();