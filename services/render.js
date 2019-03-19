"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RenderService = function () {
  function RenderService() {
    _classCallCheck(this, RenderService);
  }

  _createClass(RenderService, [{
    key: "findListViewRender",

    /**
     * 获取列表视图渲染
     * @param {String} viewId 视图Id
     */
    value: function findListViewRender(viewId) {
      return _axios2.default.post("platform://render/R01003", { viewId: viewId }).then(function (res) {
        return res.data;
      });
    }
    /**
     * 获取新增视图渲染
     * @param {*} viewId 视图Id
     */

  }, {
    key: "findInsertViewRender",
    value: function findInsertViewRender(viewId) {
      return _axios2.default.post("platform://render/R01001", {
        viewId: viewId,
        isPermission: true
      }).then(function (res) {
        return res.data;
      });
    }
    /**
     * 获取更新视图渲染
     * @param {*} viewId 视图Id
     * @param {*} recordId 真实数据Id
     */

  }, {
    key: "findUpdateViewRender",
    value: function findUpdateViewRender(viewId, recordId) {
      return _axios2.default.post("platform://render/R01002", {
        viewId: viewId,
        recordId: recordId,
        isPreview: 1
      }).then(function (res) {
        return res.data;
      });
    }
    /**
     * 获取详情视图渲染
     * @param {*} viewId 视图Id
     * @param {*} recordId 真实数据Id
     */

  }, {
    key: "findDetailViewRender",
    value: function findDetailViewRender(viewId, recordId) {
      return _axios2.default.post("platform://render/R01004", {
        viewId: viewId,
        recordId: recordId,
        isPreview: 1
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 获取新增视图渲染(移动端)
     * @param {*} viewId 视图Id
     */

  }, {
    key: "findInsertViewMobileRender",
    value: function findInsertViewMobileRender(viewId) {
      return _axios2.default.post("platform://render/R02001", {
        viewId: viewId,
        isPermission: true
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 获取更新视图渲染(移动端)
     * @param {*} viewId 视图Id
     * @param {*} recordId 真实数据Id
     */

  }, {
    key: "findUpdateViewMobileRender",
    value: function findUpdateViewMobileRender(viewId, recordId) {
      return _axios2.default.post("platform://render/R02002", {
        viewId: viewId,
        recordId: recordId,
        isPreview: 1
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 获取列表视图渲染(移动端)
     * @param {String} viewId 视图Id
     */

  }, {
    key: "findListViewMobileRender",
    value: function findListViewMobileRender(viewId) {
      return _axios2.default.post("platform://render/R02003", { viewId: viewId }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 获取详情视图渲染(移动端)
     * @param {*} viewId 视图Id
     * @param {*} recordId 真实数据Id
     */

  }, {
    key: "findDetailViewMobileRender",
    value: function findDetailViewMobileRender(viewId, recordId) {
      return _axios2.default.post("platform://render/R02004", {
        viewId: viewId,
        recordId: recordId,
        isPreview: 1
      }).then(function (res) {
        return res.data;
      });
    }
  }]);

  return RenderService;
}();

exports.default = new RenderService();