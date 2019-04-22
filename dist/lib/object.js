'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _is = require('babel-runtime/core-js/object/is');

var _is2 = _interopRequireDefault(_is);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var object = function object() {
    var _this = this;

    (0, _classCallCheck3.default)(this, object);

    this.isEqual = function (a, b) {
        return _lodash2.default.isEqual(a, b);
    };

    this.isEmpty = function (obj) {
        var type = _this.type(obj);
        return obj === '' || type == 'null' || type == 'undefined' || _this.isEqual(obj, {});
    };

    this.isNull = function (obj) {
        return _this.type(obj) == 'null';
    };

    this.isUndefined = function (obj) {
        return _this.type(obj) == 'undefined';
    };

    this.isArray = function (obj) {
        return _this.type(obj) == 'array';
    };

    this.isObject = function (obj) {
        return _this.type(obj) == 'object';
    };

    this.isBoolean = function (obj) {
        return _this.type(obj) == 'boolean';
    };

    this.isNumber = function (obj) {
        return _this.type(obj) == 'number';
    };

    this.isString = function (obj) {
        return _this.type(obj) == 'string';
    };

    this.isFunction = function (obj) {
        return _this.type(obj) == 'function';
    };

    this.isDate = function (obj) {
        return _this.type(obj) == 'date';
    };

    this.isRegExp = function (obj) {
        return _this.type(obj) == 'regExp';
    };

    this.isElement = function (obj) {
        return _this.type(obj) == 'element';
    };

    this.type = function (obj) {
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
    };

    this.deepCopy = function (obj) {
        return JSON.parse((0, _stringify2.default)(obj));
    };

    this.get = function (obj, key) {
        var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

        var keys = key.split('.');
        var value = obj;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(keys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _key = _step.value;

                if (value[_key]) {
                    value = value[_key];
                } else {
                    return defaultValue;
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

        return (0, _is2.default)(value, obj) ? defaultValue : value;
    };

    this.set = function (obj, key, value) {
        var keys = key.split('.');
        for (var i = 0; i < keys.length - 1; i++) {
            if (obj[keys[i]]) {
                obj = obj[keys[i]];
            } else {
                obj = obj[keys[i]] = {};
            }
        }
        obj[keys[keys.length - 1]] = value;
    };
};

exports.default = object;