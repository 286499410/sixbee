'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var md5 = require('crypto-js/md5');
var uuid = require('node-uuid');

var Tool = function () {
    function Tool() {
        var _this = this;

        (0, _classCallCheck3.default)(this, Tool);

        this.time = function () {
            var timestamp = new Date().getTime();
            return parseInt(timestamp / 1000);
        };

        this.strToTime = function (str) {
            return parseInt(_this.strToDate(str).getTime() / 1000);
        };

        this.dateToStr = function (date) {
            var year = date.getFullYear().toString();
            var month = (date.getMonth() + 1).toString();
            date = date.getDate().toString();
            return year + '-' + month.padStart(2, '0') + '-' + date.padStart(2, '0');
        };

        this.strToDate = function (str) {
            if (_lodash2.default.isDate(str)) {
                return str;
            } else if (str === '') {
                return undefined;
            } else if (_lodash2.default.isString(str)) {
                str = str.replace(/-/g, '/');
                return new Date(str);
            } else {
                return undefined;
            }
        };

        this.date = function () {
            var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Y-m-d H:i:s';
            var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.time();

            var myDate = void 0;
            if (_lodash2.default.isDate(time)) {
                myDate = time;
            } else {
                myDate = new Date();
                myDate.setTime(time * 1000);
            }
            var year = myDate.getFullYear().toString();
            var month = (myDate.getMonth() + 1).toString();
            var date = myDate.getDate().toString();
            var hour = myDate.getHours().toString();
            var minute = myDate.getMinutes().toString();
            var second = myDate.getSeconds().toString();
            var datetime = format;
            datetime = datetime.replace('Y', year);
            datetime = datetime.replace('m', month.padStart(2, '0'));
            datetime = datetime.replace('d', date.padStart(2, '0'));
            datetime = datetime.replace('H', hour.padStart(2, '0'));
            datetime = datetime.replace('i', minute.padStart(2, '0'));
            datetime = datetime.replace('s', second.padStart(2, '0'));
            return datetime;
        };

        this.parseNumber = function (str) {
            str = (str + '').toString().replace(/,/g, '');
            if (/^-?\d*((\.\d*)?)$/.test(str)) {
                if (str.indexOf('.') == 0) {
                    str = 0 + str;
                }
                if (str.indexOf('.') > 0) {
                    return parseFloat(str);
                } else {
                    return parseInt(str);
                }
            } else {
                return 0;
            }
        };

        this.parseMoney = function (number) {
            var float = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

            if (number === undefined || number === null) {
                return '';
            }
            if (number !== '') {
                number = _this.round(_this.parseNumber(number), float);
                var groups = /([\-\+]?)(\d*)(\.\d+)?/g.exec(number.toString()),
                    mask = groups[1],
                    integers = (groups[2] || "").split(""),
                    decimal = groups[3] || "",
                    remain = integers.length % 3;
                var temp = integers.reduce(function (previousValue, currentValue, index) {
                    if (index + 1 === remain || (index + 1 - remain) % 3 === 0) {
                        return previousValue + currentValue + ",";
                    } else {
                        return previousValue + currentValue;
                    }
                }, "").replace(/\,$/g, "");
                return mask + temp + (decimal ? !isNaN(float) ? decimal.padEnd(float + 1, '0') : '' : float ? '.' + ''.padEnd(float, '0') : '');
            }
            return number;
        };

        this.parseChinese = function (number) {
            number = _this.parseNumber(number);
            if (isNaN(number) || number >= Math.pow(10, 12)) return '';
            var symbol = number < 0 ? '负' : '';
            var words = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
            var units = [['分', '角'], ['', '拾', '佰', '仟'], ['元', '万', '亿']];
            var splits = number.toString().split(".");

            var _splits = (0, _slicedToArray3.default)(splits, 2),
                integer = _splits[0],
                decimal = _splits[1];

            var chinese = '';
            for (var i = 0; i < 3 && integer; i++) {
                var str = '';
                var length = integer.toString().length;
                for (var j = 0; j < 4 && j < length; j++) {
                    var digit = integer % 10;
                    integer = parseInt(integer / 10);
                    str = words[digit] + (digit > 0 ? units[1][j] : '') + str;
                    str = str.replace('零零', '零');
                }
                if (str.lastIndexOf('零') == str.length - 1) {
                    str = str.substr(0, str.length - 1);
                }
                if (str) {
                    chinese = str + units[2][i] + chinese;
                }
            }
            if (decimal) {
                for (var _i = 0; _i < 2; _i++) {
                    if (decimal[_i] > 0) {
                        chinese += words[decimal[_i]] + units[0][1 - _i];
                    }
                }
            } else {
                chinese += '整';
            }
            return chinese;
        };

        this.md5 = function (str) {
            return md5(str).toString();
        };

        this.getMousePosition = function (event) {
            var e = event || window.event;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            var x = e.pageX || e.clientX + scrollX;
            var y = e.pageY || e.clientY + scrollY;
            return { x: x, y: y };
        };

        this.ltrim = function (s) {
            return s.replace(/^[" "|"　"]*/, "");
        };

        this.rtrim = function (s) {
            return s.replace(/[" "|"　"]*$/, "");
        };

        this.trim = function (s) {
            return _this.rtrim(_this.ltrim(s));
        };

        this.rand = function (min, max) {
            return min + parseInt(Math.random() * (max - min));
        };

        this.hash = function (data, key) {
            var multi = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var hash = {};
            data.map(function (row) {
                if (row[key] !== undefined) {
                    var dataKey = row[key];
                    if (multi) {
                        if (!hash[dataKey]) {
                            hash[dataKey] = [];
                        }
                        hash[dataKey].push(row);
                    } else {
                        hash[dataKey] = row;
                    }
                }
            });
            return hash;
        };

        this.toTree = function (data) {
            var tree = [];
            var dataHash = _this.hash(data, 'id');
            var childrenHash = _this.hash(data, 'parent_id', true);
            data.map(function (row) {
                if (!dataHash[row.parent_id]) {
                    tree.push(row);
                }
            });
            var getChildNodes = function getChildNodes(parent) {
                var childNodes = childrenHash[parent.id] || [];
                childNodes.map(function (node) {
                    node.children = getChildNodes(node);
                });
                return childNodes;
            };
            tree.map(function (parent) {
                parent.children = getChildNodes(parent);
            });
            return tree;
        };

        this.replaceText = function (replaceText, data) {
            var text = _lodash2.default.get(data, replaceText);
            if (text !== undefined) {
                return text;
            }
            var reg = /\[(\w*)\]/g;
            var textFields = replaceText.match(reg);
            if (_lodash2.default.isArray(textFields)) {
                var ret = undefined;
                textFields.map(function (field) {
                    var key = field.substr(1, field.length - 2);
                    var value = _lodash2.default.get(data, key);
                    if (value !== undefined) {
                        ret = replaceText.replace('[' + key + ']', value);
                        replaceText = ret;
                    }
                });
                return ret;
            } else {
                return undefined;
            }
        };

        this.render = function (field, value, data) {
            switch (field.type) {
                case 'select':
                case 'radio':
                    if (_lodash2.default.isArray(field.dataSource)) {
                        var dataSource = field.dataSource;
                        var _dataSourceConfig = field.dataSourceConfig || { text: 'text', value: 'value' };
                        var map = {};
                        dataSource.map(function (data) {
                            map[data[_dataSourceConfig.value]] = data[_dataSourceConfig.text];
                        });
                        return map[value];
                    } else {
                        return value;
                    }
                case 'date':
                    if (parseInt(value) > 100000) {
                        return _this.date('Y-m-d', value);
                    } else {
                        return value;
                    }
                case 'time':
                    return _this.date('H:i', value);
                case 'money':
                    return value == 0 ? '' : _this.parseMoney(value);
                case 'auto':
                    var withData = _lodash2.default.get(data, field.withKey, {});
                    var dataSourceConfig = field.dataSourceConfig || { text: 'text', value: 'value' };
                    return _this.replaceText(dataSourceConfig.text, withData);
                default:
                    return value;
            }
        };

        this.uuid = function () {
            return uuid.v4();
        };

        this.round = function (number, float) {
            var times = Math.pow(10, float);
            return Math.round(number * times) / times;
        };

        this.toFixed = function (number, float) {
            return _this.round(number, float).toFixed(float);
        };

        this.moneyCalc = function (a, op, b) {
            a = _this.parseNumber(a);
            b = _this.parseNumber(b);
            a = Math.round(a * 100);
            b = Math.round(b * 100);
            return eval(a + ' ' + op + ' ' + b) / 100;
        };
    }

    (0, _createClass3.default)(Tool, [{
        key: 'nextCode',
        value: function nextCode(code) {
            if (code) {
                var match = code.match(/\d*$/);
                if (match) {
                    return code.substr(0, match['index']) + (parseInt(match[0]) + 1 + '').padStart(match[0].length, '0');
                }
            }
            return '';
        }
    }, {
        key: 'objectType',
        value: function objectType(obj) {
            var toString = Object.prototype.toString;
            var map = {
                '[object Boolean]': 'boolean',
                '[object Number]': 'number',
                '[object String]': 'string',
                '[object Function]': 'function',
                '[object Array]': 'array',
                '[object Date]': 'date',
                '[object RegExp]': 'regExp',
                '[object Undefined]': 'undefined',
                '[object Null]': 'null',
                '[object Object]': 'object'
            };
            if (typeof Element != 'undefined' && obj instanceof Element) {
                return 'element';
            }
            return map[toString.call(obj)];
        }
    }, {
        key: 'objectToFormData',
        value: function objectToFormData(obj, form, namespace) {
            var _this2 = this;

            var fd = form || new FormData();
            var formKey = void 0;
            if (_lodash2.default.isArray(obj)) {
                obj.map(function (item, index) {
                    if (_lodash2.default.isObject(item) && !(item instanceof File)) {
                        _this2.objectToFormData(item, fd, namespace + '[' + index + ']');
                    } else {
                        fd.append(namespace + '[]', item);
                    }
                });
            } else {
                for (var property in obj) {
                    if (obj.hasOwnProperty(property) && obj[property] !== undefined && obj[property] !== null) {

                        if (namespace) {
                            formKey = namespace + '[' + property + ']';
                        } else {
                            formKey = property;
                        }

                        if ((0, _typeof3.default)(obj[property]) === 'object' && !(obj[property] instanceof File)) {
                            this.objectToFormData(obj[property], fd, formKey);
                        } else {
                            fd.append(formKey, obj[property]);
                        }
                    }
                }
            }
            return fd;
        }
    }]);
    return Tool;
}();

exports.default = Tool;