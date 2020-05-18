'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var md5 = require('crypto-js/md5');
var a = 'a',
    b = 'b',
    c = 'c',
    d = 'd',
    e = 'e',
    f = 'f',
    g = 'g';
var h = 'h',
    i = 'i',
    j = 'j',
    k = 'k',
    l = 'l',
    m = 'm',
    n = 'n';
var o = 'o',
    p = 'p',
    q = 'q',
    r = 'r',
    s = 's',
    t = 't';
var u = 'u',
    v = 'v',
    w = 'w',
    x = 'x',
    y = 'y',
    z = 'z';

var app = ['5967257d40355d66b', 'c1a980a24ddec339c35e0e78fa7d999a'];
var appid = a + p + p + i + d;
var appkey = a + p + p + k + e + y;
var sign = s + i + g + n;
var timestamp = t + i + m + e + s + t + a + m + p;

var objectToKeyValue = function objectToKeyValue(obj, namespace, method) {
    var dataType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'json';

    var keyValue = {};
    var formKey = void 0;
    if (obj instanceof File) {} else if (_lodash2.default.isArray(obj)) {
        if (obj.length == 0) {
            if ((method || '').toUpperCase() !== 'GET') {
                keyValue[namespace] = dataType === 'json' ? '[]' : '';
            }
        } else {
            obj.map(function (item, index) {
                if ((typeof item === 'undefined' ? 'undefined' : (0, _typeof3.default)(item)) === 'object') {
                    (0, _assign2.default)(keyValue, objectToKeyValue(item, namespace + '[' + index + ']', method, dataType));
                } else {
                    keyValue[namespace + '[' + index + ']'] = item;
                }
            });
        }
    } else {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                formKey = namespace ? namespace + '[' + property + ']' : property;
                if (obj[property] === undefined) {} else if (obj[property] === null || _lodash2.default.isNaN(obj[property])) {
                    keyValue[formKey] = '';
                } else if ((0, _typeof3.default)(obj[property]) === 'object') {
                    (0, _assign2.default)(keyValue, objectToKeyValue(obj[property], formKey, method));
                } else {
                    keyValue[formKey] = obj[property];
                }
            }
        }
    }
    return keyValue;
};

var time = function time() {
    var timestamp = new Date().getTime();
    return parseInt(timestamp / 1000);
};

var keySort = function keySort(data) {
    var entries = (0, _entries2.default)(data);
    entries.sort(function (a, b) {
        return a[0] + '' > b[0] + '' ? 1 : -1;
    });
    return entries;
};

var getSignStr = function getSignStr(data) {
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
            signStr += key + '=' + _lodash2.default.trim(value);
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
};

var myMd5 = function myMd5(signStr) {
    return md5(signStr).toString();
};

exports.default = function () {
    var attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!attr[appid] && !attr[appkey]) {
        attr[appid] = app[0];
        attr[appkey] = app[1];
    } else if (!attr[appid] || !attr[appkey]) {
        console.log('缺少appid或appkey');
        return function () {};
    }
    return function (data, uri, method, dataType) {
        delete data[sign];
        data[timestamp] = time();
        data[appid] = attr[appid];
        var signData = keySort(objectToKeyValue(data, undefined, method, dataType));
        var signStr = getSignStr(signData);
        data[sign] = myMd5(myMd5(myMd5(signStr) + attr[appkey]) + uri);
        if (attr.debug) {
            var logData = {};
            logData[appid] = appid;
            logData[appkey] = appkey;
            logData[s + i + g + n + 'D' + a + t + a] = signData;
            logData[u + r + i] = uri;
            logData[d + a + t + a] = data;
            console.log(logData);
        }
        return data;
    };
};