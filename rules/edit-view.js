"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _render = require("../services/render");

var _render2 = _interopRequireDefault(_render);

var _insertView = require("./insert-view");

var _insertView2 = _interopRequireDefault(_insertView);

var _viewGroup = require("./view-group");

var _viewGroup2 = _interopRequireDefault(_viewGroup);

var _batchView = require("./batch-view");

var _batchView2 = _interopRequireDefault(_batchView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditView = function (_InsertView) {
  _inherits(EditView, _InsertView);

  function EditView() {
    _classCallCheck(this, EditView);

    return _possibleConstructorReturn(this, (EditView.__proto__ || Object.getPrototypeOf(EditView)).call(this));
  }

  /**
   * 获取改变字段内容
   */


  _createClass(EditView, [{
    key: "getChangeContent",
    value: function getChangeContent() {
      var record = this.record || {};

      var changeContent = {
        viewId: this.$id,
        record: Object.assign({}, record),
        changeRecord: Object.assign({}, record),
        highlightColumns: [],
        batchViews: []
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.groups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var group = _step.value;

          if (group instanceof _viewGroup2.default) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = group.columns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var column = _step2.value;

                var oldValue = Boolean(record[column.valKey]) ? record[column.valKey] : undefined;
                var value = Boolean(group.formModel[column.valKey]) ? group.formModel[column.valKey] : undefined;
                if (oldValue != value) {
                  changeContent.highlightColumns.push(column.$id);
                  var oldShowVal = EditView.format(record, column);
                  var showVal = EditView.format(group.formModel, column);
                  if (!oldShowVal) {
                    oldShowVal = "Null";
                  }
                  if (!showVal) {
                    showVal = "Null";
                  }
                  changeContent.changeRecord[column.showValKey + '_ALTERATION'] = oldShowVal + " => " + showVal;
                }
                changeContent.changeRecord[column.showValKey] = group.formModel[column.showValKey];
                changeContent.changeRecord[column.valKey] = group.formModel[column.valKey];
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          } else if (group instanceof _batchView2.default) {
            changeContent.batchViews.push(group.getChangeContent());
          }
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

      return changeContent;
    }

    /**
     * 获取视图类型(可以重写该方法)
     */

  }, {
    key: "_axios",

    /**
     * 获取视图渲染数据(可以重写该方法)
     * @param {Integer} viewId 视图Id
     * @param {Integer} recordId 真实数据Id
     */
    value: function _axios(viewId, recordId) {
      return _render2.default.findUpdateViewRender(viewId, recordId);
    }
  }, {
    key: "viewType",
    get: function get() {
      return "update";
    }
  }]);

  return EditView;
}(_insertView2.default);

exports.default = EditView;