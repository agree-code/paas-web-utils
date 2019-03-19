import axios from "axios"

function LoginUser() {
  let isInit = false;
  let initPromise = undefined; // 初始化异步函数
  let $loginUser = {
    userId: 1,
    realName: "匿名用户",
    entCode: "AOS",
    entName: "AOS",
    orgCode: "0001",
    orgName: "AOS",
    userHeadPhoto: "",
    isAdmin: true,
    isWorkflow: true,
    fileUri: "http://192.168.30.30:8099/",
    workflowUri: ""
  };

  this.get = function () {
    if (!isInit) {
      if (initPromise) {
        return initPromise;
      } else {
        initPromise = axios.get("user://").then(res => {
          console.log("加载当前用户数据", res);
          if (res) {
            Object.assign($loginUser, res)
            // 登录成功
            let userHeadPhoto =
              res.userHeadPhoto &&
              res.userHeadPhoto !== null &&
              res.userHeadPhoto !== "" ? res.userHeadPhoto : "./public/img/comm/head.png";
            $loginUser.userHeadPhoto = userHeadPhoto;
            $loginUser.isAdmin = res.isAdmin === 1 || res.isAdmin === "1";
            $loginUser.isWorkflow = res.entProps["process.enable"] === "true";
            $loginUser.fileUri = res.entProps["file.url"] || "";
            $loginUser.workflowUri = res.entProps["process.modeler.url"] || "";
            isInit = true;
            initPromise = undefined;
            return $loginUser;
          }
          return Promise.reject(res)
        }, (res) => {
          isInit = false;
          initPromise = undefined;
          return Promise.reject(res)
        })
      }
      return initPromise;
    }
    return Promise.resolve(Object.assign({}, $loginUser));
  };

  this.isResetPassword = function(){
    return $loginUser.resetPwd || false
  }

  this.disableResetPwd = function(){
    $loginUser.resetPwd = false
  }

  this.clearData = function(){
    isInit = false;
    initPromise = undefined;
  }

  this.newUri = function (parent, path) {
    if (!parent || !path) {
      return path;
    }
    if (parent.charAt(parent.length - 1) === "/") {
      parent = parent.substr(0, parent.length - 1);
    }
    if (path.charAt(0) === "/") {
      path = path.substr(1);
    }
    return `${parent}/${path}`;
  }
}

export default new LoginUser();
