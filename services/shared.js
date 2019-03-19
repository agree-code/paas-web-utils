"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CRUD = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../common/index.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CRUD = exports.CRUD = function () {
  function CRUD() {
    var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var types = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var formTpl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, CRUD);

    this.booleanFields = fields;
    this.types = types;
    this.formTpl = formTpl;
  }
  /**
   * 将编辑的数据转换成更新接口需要的参数对象
   */


  _createClass(CRUD, [{
    key: "transData2UpdateParams",
    value: function transData2UpdateParams(data) {
      var newObj = { id: data.id };
      Object.keys(this.formTpl).forEach(function (key) {
        newObj[key] = data[key];
      });
      return _index.object.boolean2Type(newObj, this.booleanFields, this.types);
    }

    /**
     * 将添加的表单数据转换成新增接口需要的参数对象
     */

  }, {
    key: "transData2AddParams",
    value: function transData2AddParams(data) {
      return _index.object.boolean2Type(data, this.booleanFields, this.types);
    }
  }]);

  return CRUD;
}();