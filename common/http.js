"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTTP_CONFIG = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _md = require("md5");

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _config = Symbol('HTTP_CONFIG');
var authTokenKey = 'paas:cloud:platform:toekn';

_axios2.default.defaults.headers.post["Content-Type"] = "application/json";
_axios2.default.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

var HTTP_CONFIG = {};

var Http = function () {
  function Http() {
    _classCallCheck(this, Http);

    if (window.sessionStorage) {
      var jsonStr = window.sessionStorage.getItem(authTokenKey);
      if (Boolean(jsonStr)) {
        this.create(JSON.parse(jsonStr));
      }
    }
  }

  _createClass(Http, [{
    key: "_initAxios",
    value: function _initAxios() {
      var _this = this;

      // 注册登录
      _axios2.default.login = function (data) {
        return _this.login(data);
      };
      _axios2.default.logout = function () {
        return _this.logout();
      };
      _axios2.default.getEntApp = function () {
        return _this.getEntApp();
      };

      _axios2.default.interceptors.request.use(function (config) {
        // 设置鉴权header
        var jsonStr = window.sessionStorage.getItem(authTokenKey);
        if (Boolean(jsonStr)) {
          var authToken = JSON.parse(jsonStr);
          config.headers['Authorization'] = authToken.token_type + " " + authToken.access_token;
        } else if (!config.auth) {
          var error = new Error("\u7528\u6237\u672A\u767B\u5F55\u6216\u4F1A\u8BDD\u8D85\u65F6");
          error.config = config;
          error.response = {
            status: 401,
            message: '用户未登录或会话超时'
          };
          return Promise.reject(error);
        }
        return _this.convertConfig(config);
      }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
      });
      _axios2.default.interceptors.response.use(function (resp) {
        return _this.handlerRequestStatus(resp);
      }, function (error) {
        return _this.handlerRequestStatus(error.response);
      });
    }
  }, {
    key: "_handlerHttpMapping",
    value: function _handlerHttpMapping(baseURL, _profile, _mapping) {
      var mapping = {};
      for (var key in _mapping) {
        if (_mapping.hasOwnProperty(key)) {
          var element = _mapping[key];
          // 判断
          if (key.indexOf("." + _profile) > 0) {
            mapping[key.substr(0, key.indexOf("." + _profile))] = this.baseURLHandler(baseURL, element);
          }
          if (key.indexOf(".development") < 0 && key.indexOf(".production") < 0) {
            mapping[key] = this.baseURLHandler(baseURL, element);
          }
        }
      }
      console.log("mapping", mapping);
      return mapping;
    }
  }, {
    key: "reinstall",
    value: function reinstall(config) {
      this[_config] = Object.assign(HTTP_CONFIG, {});
      if (config) {
        HTTP_CONFIG.profile = config.profile || process.env.NODE_ENV;
        HTTP_CONFIG.label = "master";
        HTTP_CONFIG.statusCode = config.statusCode;
        HTTP_CONFIG.baseURL = config.baseURL;

        if (config.remote) {
          HTTP_CONFIG["mapping"] = {};
          HTTP_CONFIG.remote = true;
          HTTP_CONFIG.installed = false;
          // 初始化配置
          this.loadServerConfig();
        } else {
          // 本地配置
          HTTP_CONFIG.remote = false;
          HTTP_CONFIG.installed = true;
          HTTP_CONFIG["mapping"] = this._handlerHttpMapping(HTTP_CONFIG.baseURL, HTTP_CONFIG.profile, config.mapping);
        }
      }
    }
  }, {
    key: "install",
    value: function install(Vue, config) {
      this.reinstall(config);

      Vue.axios = _axios2.default;
      Object.defineProperties(Vue.prototype, {
        axios: {
          get: function get() {
            return _axios2.default;
          }
        },
        $http: {
          get: function get() {
            return _axios2.default;
          }
        }
      });
      this._initAxios();
    }
  }, {
    key: "loadServerConfig",


    //TODO: 集成配置中心，从配置中心读取配置数据
    value: function loadServerConfig() {}
  }, {
    key: "handlerRequestStatus",
    value: function handlerRequestStatus(resp) {
      var status = resp.status;
      if (resp.data && resp.data.status) {
        status = resp.data.status;
      }
      var isSuccess = false;
      switch (Number(status)) {
        case 200: // OK - [GET]：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。
        case 201: // CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。
        case 202: // Accepted - [*]：表示一个请求已经进入后台排队（异步任务）
        case 204:
          // NO CONTENT - [DELETE]：用户删除数据成功。
          isSuccess = true;
          break;
        case 400:
          // INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
          break;
        case 401:
          // Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
          break;
        case 403:
          // Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
          break;
        case 404:
          // NOT FOUND - [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
          break;
        case 406:
          // Not Acceptable - [GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
          break;
        case 410:
          // Gone -[GET]：用户请求的资源被永久删除，且不会再得到的。
          break;
        case 422:
          // Unprocesable entity - [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。
          break;
        case 500:
          // INTERNAL SERVER ERROR - [*]：服务器发生错误，用户将无法判断发出的请求是否成功。
          break;
      }

      if (this.config.statusCode[status]) {
        this.config.statusCode[status](resp);
      }

      if (isSuccess) {
        return Promise.resolve(resp.data);
      } else {
        return Promise.reject(resp);
      }
    }

    /**
     * 根据token创建新的Http访问
     * @param {*} token 登录token
     */

  }, {
    key: "create",
    value: function create(token) {
      window.sessionStorage.setItem(authTokenKey, JSON.stringify(token));
    }
  }, {
    key: "judgeAgreement",
    value: function judgeAgreement(url) {
      var pattern = /http(s)?:\/\//g;
      var pattern1 = /(.*?):\/\//g;
      return pattern.test(String(url)) || !pattern1.test(String(url));
    }
  }, {
    key: "getURL",
    value: function getURL(url) {
      var config = {
        url: url
      };
      return this.convertConfig(config).then(function (c) {
        return c.url;
      });
    }
  }, {
    key: "urlHandler",
    value: function urlHandler(baseUrl, url) {
      if (!url) {
        return baseUrl;
      } else if (!baseUrl) {
        return url;
      }
      if (baseUrl.charAt(baseUrl.length - 1) === "/") {
        baseUrl = baseUrl.substr(0, baseUrl.length - 1);
      }
      if (url.charAt(0) === "/") {
        url = url.substr(1);
      }
      return baseUrl + "/" + url;
    }
  }, {
    key: "baseURLHandler",
    value: function baseURLHandler(baseURL, url) {
      var pattern = /http(s)?:\/\//g;
      if (baseURL && !pattern.test(url)) {
        return this.urlHandler(baseURL, url);
      }
      return url;
    }

    /**
     * 转换请求配置
     */

  }, {
    key: "convertConfig",
    value: function convertConfig(reqConfig) {
      var _this2 = this;

      var promise = Promise.resolve({
        state: true
      });
      if (!HTTP_CONFIG.installed) {
        if (!this.judgeAgreement(reqConfig.url) && HTTP_CONFIG.remote) {
          promise = this.loadServerConfig();
        }
      }
      return promise.then(function () {
        if (_this2.judgeAgreement(reqConfig.url)) {
          return reqConfig;
        }
        // 解析数据
        var pattern = /(.*?):\/\//;
        var appName = reqConfig.url.split(pattern)[1];
        var mapping = HTTP_CONFIG.mapping;
        if (mapping[appName]) {
          reqConfig.url = _this2.urlHandler(mapping[appName], reqConfig.url.replace(pattern, ""));
        } else {
          reqConfig.url = reqConfig.url.replace(pattern, "");
        }
        return reqConfig;
      });
    }
  }, {
    key: "login",
    value: function login(_ref) {
      var _this3 = this;

      var entAccount = _ref.entAccount,
          username = _ref.username,
          password = _ref.password;

      var params = new URLSearchParams();
      params.append("grant_type", "password");
      params.append("username", username + "@" + entAccount);
      params.append("password", (0, _md2.default)(password));
      return _axios2.default.request({
        url: this.urlHandler(HTTP_CONFIG.baseURL, 'uaa/oauth/token'),
        method: "post",
        auth: {
          username: "webapp",
          password: "webapp"
        },
        data: params
      }).then(function (res) {
        _this3.create(res);
        return res;
      });
    }
  }, {
    key: "logout",
    value: function logout() {
      return _axios2.default.request({
        url: this.urlHandler(HTTP_CONFIG.baseURL, 'uaa/oauth/logout'),
        method: "delete"
      }).finally(function () {
        window.sessionStorage.removeItem(authTokenKey);
      });
    }
  }, {
    key: "getEntApp",
    value: function getEntApp() {
      return _axios2.default.request({
        url: this.urlHandler(HTTP_CONFIG.baseURL, 'res/app/currentEntApp'),
        method: "get"
      });
    }
  }, {
    key: "get",
    value: function get(url, config) {
      return _axios2.default.get(url, config);
    }
  }, {
    key: "delete",
    value: function _delete(url, config) {
      return _axios2.default.delete(url, config);
    }
  }, {
    key: "post",
    value: function post(url, data, config) {
      return _axios2.default.post(url, data, config);
    }
  }, {
    key: "put",
    value: function put(url, data, config) {
      return _axios2.default.put(url, data, config);
    }
  }, {
    key: "patch",
    value: function patch(url, data, config) {
      return _axios2.default.patch(url, data, config);
    }
  }, {
    key: "getToken",
    value: function getToken() {
      var jsonStr = window.sessionStorage.getItem(authTokenKey);
      if (Boolean(jsonStr)) {
        var authToken = JSON.parse(jsonStr);
        return authToken.access_token;
      }
      return false;
    }
  }, {
    key: "confirm",
    value: function confirm() {
      return this.config.statusCode[401]();
    }
  }, {
    key: "config",
    get: function get() {
      return this[_config];
    }
  }]);

  return Http;
}();

exports.HTTP_CONFIG = HTTP_CONFIG;
exports.default = new Http();