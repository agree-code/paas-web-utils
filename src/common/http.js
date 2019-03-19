import axios from "axios"
import MD5 from "md5";

const _config = Symbol('HTTP_CONFIG');
const authTokenKey = 'paas:cloud:platform:toekn'

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

const HTTP_CONFIG = {};


class Http {

  constructor() {
    if (window.sessionStorage) {
      let jsonStr = window.sessionStorage.getItem(authTokenKey)
      if (Boolean(jsonStr)) {
        this.create(JSON.parse(jsonStr))
      }
    }
  }

  _initAxios() {
    // 注册登录
    axios.login = (data) => {
      return this.login(data)
    }
    axios.logout = () => {
      return this.logout()
    }
    axios.getEntApp = () => {
      return this.getEntApp()
    }

    axios.interceptors.request.use((config) => {
      // 设置鉴权header
      let jsonStr = window.sessionStorage.getItem(authTokenKey)
      if (Boolean(jsonStr)) {
        let authToken = JSON.parse(jsonStr)
        config.headers['Authorization'] = `${authToken.token_type} ${authToken.access_token}`
      } else if (!config.auth) {
        let error = new Error(`用户未登录或会话超时`);
        error.config = config
        error.response = {
          status: 401,
          message: '用户未登录或会话超时'
        }
        return Promise.reject(error);
      }
      return this.convertConfig(config)
    }, function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    });
    axios.interceptors.response.use((resp) => {
      return this.handlerRequestStatus(resp);
    }, (error) => {
      return this.handlerRequestStatus(error.response);
    })
  }


  _handlerHttpMapping(baseURL, _profile, _mapping) {
    let mapping = {};
    for (const key in _mapping) {
      if (_mapping.hasOwnProperty(key)) {
        const element = _mapping[key];
        // 判断
        if (key.indexOf(`.${_profile}`) > 0) {
          mapping[key.substr(0, key.indexOf(`.${_profile}`))] = this.baseURLHandler(baseURL, element);
        }
        if (key.indexOf(".development") < 0 && key.indexOf(".production") < 0) {
          mapping[key] = this.baseURLHandler(baseURL, element);
        }
      }
    }
    console.log("mapping", mapping);
    return mapping;
  }

  reinstall(config) {
    this[_config] = Object.assign(HTTP_CONFIG, {})
    if (config) {
      HTTP_CONFIG.profile = config.profile || process.env.NODE_ENV;
      HTTP_CONFIG.label = "master";
      HTTP_CONFIG.statusCode = config.statusCode
      HTTP_CONFIG.baseURL = config.baseURL

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

  install(Vue, config) {
    this.reinstall(config)

    Vue.axios = axios;
    Object.defineProperties(Vue.prototype, {
      axios: {
        get: function get() {
          return axios;
        }
      },
      $http: {
        get: function get() {
          return axios;
        }
      }
    });
    this._initAxios()
  }



  get config() {
    return this[_config]
  }


  //TODO: 集成配置中心，从配置中心读取配置数据
  loadServerConfig() {

  }

  handlerRequestStatus(resp) {
    let status = resp.status;
    if (resp.data && resp.data.status) {
      status = resp.data.status
    }
    let isSuccess = false
    switch (Number(status)) {
      case 200: // OK - [GET]：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。
      case 201: // CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。
      case 202: // Accepted - [*]：表示一个请求已经进入后台排队（异步任务）
      case 204: // NO CONTENT - [DELETE]：用户删除数据成功。
        isSuccess = true
        break;
      case 400: // INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
        break;
      case 401: // Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
        break;
      case 403: // Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
        break;
      case 404: // NOT FOUND - [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
        break;
      case 406: // Not Acceptable - [GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
        break;
      case 410: // Gone -[GET]：用户请求的资源被永久删除，且不会再得到的。
        break;
      case 422: // Unprocesable entity - [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。
        break;
      case 500: // INTERNAL SERVER ERROR - [*]：服务器发生错误，用户将无法判断发出的请求是否成功。
        break;
    }

    if (this.config.statusCode[status]) {
      this.config.statusCode[status](resp);
    }

    if (isSuccess) {
      return Promise.resolve(resp.data)
    } else {
      return Promise.reject(resp);
    }
  }

  /**
   * 根据token创建新的Http访问
   * @param {*} token 登录token
   */
  create(token) {
    window.sessionStorage.setItem(authTokenKey, JSON.stringify(token))
  }

  judgeAgreement(url) {
    var pattern = /http(s)?:\/\//g;
    var pattern1 = /(.*?):\/\//g;
    return pattern.test(String(url)) || !pattern1.test(String(url));
  }

  getURL(url) {
    let config = {
      url: url
    }
    return this.convertConfig(config).then((c) => {
      return c.url
    })
  }


  urlHandler(baseUrl, url) {
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
    return `${baseUrl}/${url}`;
  }

  baseURLHandler(baseURL, url) {
    var pattern = /http(s)?:\/\//g;
    if (baseURL && !pattern.test(url)) {
      return this.urlHandler(baseURL, url)
    }
    return url
  }

  /**
   * 转换请求配置
   */
  convertConfig(reqConfig) {
    let promise = Promise.resolve({
      state: true
    });
    if (!HTTP_CONFIG.installed) {
      if (!this.judgeAgreement(reqConfig.url) && HTTP_CONFIG.remote) {
        promise = this.loadServerConfig();
      }
    }
    return promise.then(() => {
      if (this.judgeAgreement(reqConfig.url)) {
        return reqConfig;
      }
      // 解析数据
      let pattern = /(.*?):\/\//;
      let appName = reqConfig.url.split(pattern)[1];
      let mapping = HTTP_CONFIG.mapping;
      if (mapping[appName]) {
        reqConfig.url = this.urlHandler(
          mapping[appName],
          reqConfig.url.replace(pattern, "")
        );
      } else {
        reqConfig.url = reqConfig.url.replace(pattern, "");
      }
      return reqConfig;
    })
  };

  login({
    entAccount: entAccount,
    username: username,
    password: password
  }) {
    let params = new URLSearchParams()
    params.append("grant_type", "password")
    params.append("username", `${username}@${entAccount}`)
    params.append("password", MD5(password))
    return axios.request({
      url: this.urlHandler(HTTP_CONFIG.baseURL, 'uaa/oauth/token'),
      method: "post",
      auth: {
        username: "webapp",
        password: "webapp"
      },
      data: params
    }).then((res) => {
      this.create(res);
      return res;
    })
  }

  logout() {
    return axios.request({
      url: this.urlHandler(HTTP_CONFIG.baseURL, 'uaa/oauth/logout'),
      method: "delete"
    }).finally(function () {
      window.sessionStorage.removeItem(authTokenKey)
    })
  }

  getEntApp() {
    return axios.request({
      url: this.urlHandler(HTTP_CONFIG.baseURL, 'res/app/currentEntApp'),
      method: "get"
    })
  }

  get(url, config) {
    return axios.get(url, config);
  }

  delete(url, config) {
    return axios.delete(url, config);
  }


  post(url, data, config) {
    return axios.post(url, data, config);
  }

  put(url, data, config) {
    return axios.put(url, data, config);
  }

  patch(url, data, config) {
    return axios.patch(url, data, config);
  }

  getToken() {
    let jsonStr = window.sessionStorage.getItem(authTokenKey)
    if (Boolean(jsonStr)) {
      let authToken = JSON.parse(jsonStr)
      return authToken.access_token
    }
    return false
  }

  confirm() {
    return this.config.statusCode[401]()
  }
}

export {
  HTTP_CONFIG
}

export default new Http();