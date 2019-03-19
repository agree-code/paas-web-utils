"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DetailViewMobile = exports.ListViewMobile = exports.EditViewMobile = exports.InsertViewMobile = exports.Dict = exports.Organization = exports.Operation = exports.Column = exports.BatchRowView = exports.BatchView = exports.ViewGroup = exports.DetailView = exports.EditView = exports.InsertView = exports.ListView = exports.viewCache = exports.View = undefined;

var _viewCache = require("./view-cache");

var _viewCache2 = _interopRequireDefault(_viewCache);

var _view = require("./view");

var _view2 = _interopRequireDefault(_view);

var _listView = require("./list-view");

var _listView2 = _interopRequireDefault(_listView);

var _insertView = require("./insert-view");

var _insertView2 = _interopRequireDefault(_insertView);

var _editView = require("./edit-view");

var _editView2 = _interopRequireDefault(_editView);

var _detailView = require("./detail-view");

var _detailView2 = _interopRequireDefault(_detailView);

var _viewGroup = require("./view-group");

var _viewGroup2 = _interopRequireDefault(_viewGroup);

var _batchView = require("./batch-view");

var _batchView2 = _interopRequireDefault(_batchView);

var _batchRowView = require("./batch-row-view");

var _batchRowView2 = _interopRequireDefault(_batchRowView);

var _column = require("./column");

var _column2 = _interopRequireDefault(_column);

var _operation = require("./operation");

var _operation2 = _interopRequireDefault(_operation);

var _organization = require("./organization");

var _organization2 = _interopRequireDefault(_organization);

var _dict = require("./dict");

var _dict2 = _interopRequireDefault(_dict);

var _insertViewMobile = require("./insert-view-mobile");

var _insertViewMobile2 = _interopRequireDefault(_insertViewMobile);

var _editViewMobile = require("./edit-view-mobile");

var _editViewMobile2 = _interopRequireDefault(_editViewMobile);

var _listViewMobile = require("./list-view-mobile");

var _listViewMobile2 = _interopRequireDefault(_listViewMobile);

var _detailViewMobile = require("./detail-view-mobile");

var _detailViewMobile2 = _interopRequireDefault(_detailViewMobile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.View = _view2.default;
exports.viewCache = _viewCache2.default;
exports.ListView = _listView2.default;
exports.InsertView = _insertView2.default;
exports.EditView = _editView2.default;
exports.DetailView = _detailView2.default;
exports.ViewGroup = _viewGroup2.default;
exports.BatchView = _batchView2.default;
exports.BatchRowView = _batchRowView2.default;
exports.Column = _column2.default;
exports.Operation = _operation2.default;
exports.Organization = _organization2.default;
exports.Dict = _dict2.default;
exports.InsertViewMobile = _insertViewMobile2.default;
exports.EditViewMobile = _editViewMobile2.default;
exports.ListViewMobile = _listViewMobile2.default;
exports.DetailViewMobile = _detailViewMobile2.default;
exports.default = {
  loading: function loading() {
    return Promise.all([_dict2.default.loading("test"), _organization2.default.loading("test")]);
  }
};