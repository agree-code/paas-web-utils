"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _enum = require("./enum");

var _eventBus = require("./event-bus");

var _eventBus2 = _interopRequireDefault(_eventBus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewCache = function () {
  function ViewCache() {
    var _this = this;

    _classCallCheck(this, ViewCache);

    this.VIEW_CACHE_MAP = {};
    _eventBus2.default.$on('RootView', "PUI_CLEAR_CACHE", function () {
      for (var key in _this.VIEW_CACHE_MAP) {
        delete _this.VIEW_CACHE_MAP[key];
        //console.log("清空数据", key);
      }
      _this.initData = false;
      _this.get();
    });
  }

  _createClass(ViewCache, [{
    key: "get",
    value: function get(viewId) {
      var _this2 = this;

      if (this.initData) {
        return Promise.resolve(Object.assign({}, this.VIEW_CACHE_MAP[viewId]));
      }
      if (!this.initPromise) {
        this.initPromise = _axios2.default.post("platform://custom/C11008", {
          viewFlag: 0
        }).then(function (res) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var view = _step.value;

              _this2.VIEW_CACHE_MAP[view.id] = view;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          _this2.initData = true;
          console.log("成功加载所有视图信息", res.data.length);
          // 释放资源
          delete _this2.initPromise;
          return Object.assign({}, _this2.VIEW_CACHE_MAP[viewId]);
        });
      }
      return this.initPromise;
    }
  }, {
    key: "cleanAll",
    value: function cleanAll() {
      var _this3 = this;

      Object.keys(this.VIEW_CACHE_MAP).forEach(function (key) {
        delete _this3.VIEW_CACHE_MAP[key];
      });
    }
  }, {
    key: "remove",
    value: function remove(viewId) {
      delete this.VIEW_CACHE_MAP[viewId];
    }
  }, {
    key: "getViewType",
    value: function getViewType(viewId) {
      return this.get(viewId).then(function (view) {
        switch (view.viewType) {
          case 2:
          case 7:
            return _enum.VIEW_ENUM.INSERT;
          case 3:
          case 8:
            return _enum.VIEW_ENUM.EDIT;
          case 4:
            return _enum.VIEW_ENUM.DETAIL;
          case 5:
            return _enum.VIEW_ENUM.CUSTOM;
          case 6:
            return _enum.VIEW_ENUM.INSERT;
          default:
            return _enum.VIEW_ENUM.LIST;
        }
      });
    }
  }]);

  return ViewCache;
}();

exports.default = new ViewCache();