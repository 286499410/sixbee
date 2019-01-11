"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validate = function () {
    function validate() {
        (0, _classCallCheck3.default)(this, validate);
    }

    (0, _createClass3.default)(validate, [{
        key: "isEmail",
        value: function isEmail(value) {
            var reg = /^[A-Za-z0-9._-\u4e00-\u9fff]+@[a-zA-Z0-9_-\u4e00-\u9fff]+(\.[a-zA-Z0-9_-\u4e00-\u9fff]+)+$/;
            return reg.test(value);
        }
    }, {
        key: "isMobile",
        value: function isMobile(value) {
            var reg = /^\d{11}$/;
            return reg.test(value);
        }
    }, {
        key: "isUrl",
        value: function isUrl(value) {
            var reg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            return reg.test(value);
        }
    }, {
        key: "isIp",
        value: function isIp(value) {
            var reg = /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/;
            return reg.test(value);
        }
    }, {
        key: "isInteger",
        value: function isInteger(value) {
            var reg = /^\d+$/;
            return reg.test(value);
        }
    }, {
        key: "isNumber",
        value: function isNumber(value) {
            var reg = /^\d+(\.\d+)?$/;
            return reg.test(value);
        }
    }, {
        key: "cmpDateTime",
        value: function cmpDateTime(datetime1, datetime2) {
            var diff = new Date(Date.parse(datetime1)).getTime() - new Date(Date.parse(datetime2)).getTime();
            if (diff > 0) {
                return 1;
            } else if (diff == 0) {
                return 0;
            } else {
                return -1;
            }
        }
    }]);
    return validate;
}();

exports.default = validate;