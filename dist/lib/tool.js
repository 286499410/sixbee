'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _object = require('../instance/object');

var _object2 = _interopRequireDefault(_object);

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

            float = parseInt(float);
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
            data = _lodash2.default.cloneDeep(data);
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

        this.render = function (data, column) {
            var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

            var key = column.dataKey || column.key;
            var value = _lodash2.default.get(data, key, defaultValue);
            switch (column.type) {
                case 'date':
                    return (/^\d+$/.test(value) ? _this.date(column.format || 'Y-m-d', value) : value
                    );
                case 'time':
                    return (/^\d+$/.test(value) ? _this.date(column.format || 'H:i', value) : value
                    );
                case 'datetime':
                    return (/^\d+$/.test(value) ? _this.date(column.format || 'Y-m-d H:i', value) : value
                    );
                case 'money':
                    var float = column.float;
                    if (_lodash2.default.isFunction(float)) {
                        float = float();
                    }
                    return value == 0 && column.showZero !== true ? '' : _this.parseMoney(value, float);
                case 'select':
                case 'radio':
                    if (_lodash2.default.isArray(column.dataSource)) {
                        var dataSource = column.dataSource;
                        var dataSourceConfig = column.dataSourceConfig || { text: 'text', value: 'value' };
                        var map = {};
                        dataSource.map(function (data) {
                            map[data[dataSourceConfig.value]] = data[dataSourceConfig.text];
                        });
                        return map[value];
                    } else {
                        return value;
                    }
                case 'checkbox':
                    if (column.multiple) {
                        var _dataSourceConfig = column.dataSourceConfig || { text: 'text', value: 'value' };
                        var texts = [];
                        if (_lodash2.default.isArray(value)) {
                            value.map(function (row) {
                                return texts.push(row[_dataSourceConfig.text]);
                            });
                        }
                        return texts.join(' ');
                    } else if (_lodash2.default.isArray(column.dataSource) && column.dataSource.length > 0) {} else {
                        return value ? '是' : '否';
                    }
                case 'auto':
                    if (column.withKey) {
                        var withData = _lodash2.default.get(data, column.withKey, {});
                        var _dataSourceConfig2 = column.dataSourceConfig || { text: 'text', value: 'value' };
                        return _this.replaceText(_dataSourceConfig2.text, withData);
                    } else {
                        return value;
                    }
                case 'editor':
                    return _lodash2.default.isString(value) ? value.replace(/<[^<>]+>/g, "") : '';
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

        this.numberCalc = function (a, op, b, float) {
            a = Math.round(a);
            b = Math.round(b);
            var value = eval(a + ' ' + op + ' ' + b);
            return float ? _this.round(value, float) : value;
        };

        this.count = function (data, key) {
            var float = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
            var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'money';

            var count = 0;
            data.map(function (row) {
                count += parseFloat(_lodash2.default.get(row, key) || 0);
            });
            return count == 0 ? '' : type === 'money' ? _this.parseMoney(count, float) : _this.toFixed(count, float);
        };

        this.treeToList = function (dataSource) {
            var list = [];
            dataSource.map(function (data) {
                var current = data;
                var children = [];
                if (data.children && data.children.length > 0) {
                    children = _this.treeToList(data.children);
                }
                list.push((0, _extends3.default)({}, current));
                list = list.concat(children);
            });
            return list;
        };

        this.removeArrObjectProperties = function (arr) {
            var newArr = [];
            arr.map(function (data) {
                newArr.push(_this.removeObjectProperties(data));
            });
            return newArr;
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
        key: 'objectToKeyValue',
        value: function objectToKeyValue(obj, namespace, method) {
            var _this2 = this;

            var keyValue = {};
            var formKey = void 0;
            if (_lodash2.default.isArray(obj)) {
                if (obj.length == 0) {
                    keyValue[namespace] = '';
                } else {
                    obj.map(function (item, index) {
                        if (_lodash2.default.isObject(item) && !(item instanceof File)) {
                            (0, _assign2.default)(keyValue, _this2.objectToKeyValue(item, namespace + '[' + index + ']', method));
                        } else {
                            keyValue[namespace + '[' + index + ']'] = item;
                        }
                    });
                }
            } else {
                for (var property in obj) {
                    if (obj.hasOwnProperty(property)) {
                        if (namespace) {
                            formKey = namespace + '[' + property + ']';
                        } else {
                            formKey = property;
                        }

                        if ((0, _typeof3.default)(obj[property]) === 'object' && obj[property] !== null && !(obj[property] instanceof File)) {
                            (0, _assign2.default)(keyValue, this.objectToKeyValue(obj[property], formKey, method));
                        } else {

                            if ((method || '').toUpperCase() === 'GET') {
                                keyValue[formKey] = obj[property] === undefined || obj[property] === null ? '' : obj[property];
                            } else if (obj[property] !== undefined) {
                                keyValue[formKey] = obj[property] === null ? '' : obj[property];
                            }

                            keyValue[formKey] = obj[property];
                        }
                    }
                }
            }
            return keyValue;
        }
    }, {
        key: 'objectToFormData',
        value: function objectToFormData(obj, form, namespace) {
            var _this3 = this;

            var fd = form || new FormData();
            var formKey = void 0;
            if (_lodash2.default.isArray(obj)) {
                if (obj.length == 0) {
                    fd.append(namespace, '');
                } else {
                    obj.map(function (item, index) {
                        if (_lodash2.default.isObject(item) && !(item instanceof File)) {
                            _this3.objectToFormData(item, fd, namespace + '[' + index + ']');
                        } else {
                            fd.append(namespace + '[]', item);
                        }
                    });
                }
            } else {
                for (var property in obj) {
                    if (obj.hasOwnProperty(property)) {
                        if (namespace) {
                            formKey = namespace + '[' + property + ']';
                        } else {
                            formKey = property;
                        }

                        if ((0, _typeof3.default)(obj[property]) === 'object' && obj[property] !== null && !(obj[property] instanceof File)) {
                            this.objectToFormData(obj[property], fd, formKey);
                        } else {
                            if (obj[property] !== undefined) {
                                fd.append(formKey, obj[property] === undefined || obj[property] === null ? '' : obj[property]);
                            }
                        }
                    }
                }
            }
            return fd;
        }
    }, {
        key: 'keySort',
        value: function keySort(data) {
            var entries = (0, _entries2.default)(data);
            entries.sort(function (a, b) {
                return a[0] + '' > b[0] + '' ? 1 : -1;
            });
            return entries;
        }
    }, {
        key: 'signStr',
        value: function signStr(data) {
            var signStr = '';
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(data), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

                    var key = _ref2[0];
                    var value = _ref2[1];

                    signStr += signStr ? '&' : '';
                    signStr += key + '=' + value;
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

            return signStr;
        }
    }, {
        key: 'isEmpty',
        value: function isEmpty(value) {
            return _object2.default.isEmpty(value);
        }
    }, {
        key: 'removeObjectProperties',
        value: function removeObjectProperties(data) {
            var newData = _lodash2.default.cloneDeep(data);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)((0, _entries2.default)(newData)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _ref3 = _step2.value;

                    var _ref4 = (0, _slicedToArray3.default)(_ref3, 2);

                    var key = _ref4[0];
                    var value = _ref4[1];

                    if (value === null || _lodash2.default.isObject(value)) {
                        delete newData[key];
                    }
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

            return newData;
        }
    }, {
        key: 'getFilteredData',
        value: function getFilteredData(data) {
            var ignoreKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['_key'];

            var filteredData = [];
            data.map(function (row) {
                var flag = false;
                (0, _entries2.default)(row).map(function (_ref5) {
                    var _ref6 = (0, _slicedToArray3.default)(_ref5, 2),
                        key = _ref6[0],
                        val = _ref6[1];

                    if (ignoreKeys.indexOf(key) < 0) {
                        if (val !== '' && val !== undefined && val !== null && (!_lodash2.default.isArray(val) || val.length > 0)) {
                            flag = true;
                        }
                    }
                });
                if (flag) {
                    filteredData.push(row);
                }
            });
            return filteredData;
        }
    }, {
        key: 'eachTreeNode',
        value: function eachTreeNode(tree, callback) {
            var _this4 = this;

            var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            tree.map(function (node) {
                if (_lodash2.default.isFunction(callback)) {
                    callback(node, parent);
                    if (node.children) {
                        _this4.eachTreeNode(node.children, callback, node);
                    }
                }
            });
        }
    }]);
    return Tool;
}();

exports.default = Tool;