"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TaskService = function () {
  function TaskService() {
    _classCallCheck(this, TaskService);
  }

  _createClass(TaskService, [{
    key: "findAllInPage",

    /**
     * 1.获取任务分页
     * @param {int} moduleId 关联模块ID 可选
     * @param {int} name 任务名称 可选
     * @param {int} status 任务状态 可选
     * @param {int} pageNow 当前页 
     * @param {int} pageSize 每页条数 
     */
    value: function findAllInPage(_ref) {
      var _ref$moduleId = _ref.moduleId,
          moduleId = _ref$moduleId === undefined ? null : _ref$moduleId,
          _ref$name = _ref.name,
          name = _ref$name === undefined ? null : _ref$name,
          _ref$status = _ref.status,
          status = _ref$status === undefined ? null : _ref$status,
          _ref$order = _ref.order,
          order = _ref$order === undefined ? null : _ref$order,
          _ref$sidx = _ref.sidx,
          sidx = _ref$sidx === undefined ? null : _ref$sidx,
          _ref$pageNow = _ref.pageNow,
          pageNow = _ref$pageNow === undefined ? 1 : _ref$pageNow,
          _ref$pageSize = _ref.pageSize,
          pageSize = _ref$pageSize === undefined ? 20 : _ref$pageSize;

      return _axios2.default.post("platform://qrtz/Q01002", {
        moduleId: moduleId,
        name: name,
        status: status,
        order: order,
        sidx: sidx,
        pageNow: pageNow,
        pageSize: pageSize
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 2.新增定时任务
     */

  }, {
    key: "save",
    value: function save(param) {
      return _axios2.default.post("platform://qrtz/Q01001", param).then(function (res) {
        return res.data;
      });
    }

    /**
     * 3.获取任务详情
     * @param {int} taskId 任务ID 
     */

  }, {
    key: "findOne",
    value: function findOne(_ref2) {
      var taskId = _ref2.taskId;

      return _axios2.default.post("platform://qrtz/Q01005", {
        taskId: taskId
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 4.删除定时任务
     * @param {int} taskId 任务ID 
     */

  }, {
    key: "delete",
    value: function _delete(param) {
      return _axios2.default.post("platform://qrtz/Q01006", param).then(function (res) {
        return res.data;
      });
    }

    /**
     * 5.启用/禁用定时任务
     * @param {int} taskIds 任务ID集合 
     * @param {String} status 状态：ENABLE-启用；DISABLE-禁用
     */

  }, {
    key: "changeStatusByTaskIds",
    value: function changeStatusByTaskIds(_ref3) {
      var taskIds = _ref3.taskIds,
          status = _ref3.status;

      return _axios2.default.post("platform://qrtz/Q01004", {
        taskIds: taskIds,
        status: status
      }).then(function (res) {
        return res.data;
      });
    }

    /**
     * 6.编辑定时任务
     */

  }, {
    key: "update",
    value: function update(param) {
      return _axios2.default.post("platform://qrtz/Q01003", param).then(function (res) {
        return res.data;
      });
    }
  }]);

  return TaskService;
}();

exports.default = new TaskService();