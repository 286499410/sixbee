'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _tool = require('../../instance/tool');

var _tool2 = _interopRequireDefault(_tool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Local = function () {
    function Local() {
        (0, _classCallCheck3.default)(this, Local);
        this.key = 'sixbeeLocalStorage_';
    }

    (0, _createClass3.default)(Local, [{
        key: 'all',
        value: function all() {
            var data = {};
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                var value = this.get(key);
                if (value !== undefined) {
                    data[key] = value;
                }
            }
            return data;
        }
    }, {
        key: 'getStorageKey',
        value: function getStorageKey(key) {
            return this.key + key;
        }
    }, {
        key: 'parse',
        value: function parse(key) {
            key = this.getStorageKey(key);
            var value = localStorage.getItem(key);
            var json = void 0;
            try {
                json = JSON.parse(value);
                return json;
            } catch (e) {}
            return {};
        }
    }, {
        key: 'get',
        value: function get(key) {
            var json = this.parse(key);
            return json ? json.value : undefined;
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            var expire_time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            if (value === undefined) {
                this.remove(key);
            } else {
                var type = _tool2.default.objectType(value);
                localStorage.setItem(this.key + key, (0, _stringify2.default)({
                    type: type,
                    value: value,
                    expire_time: expire_time
                }));
            }
        }
    }, {
        key: 'remove',
        value: function remove(key) {
            key = this.getStorageKey(key);
            localStorage.removeItem(key);
        }
    }, {
        key: 'clear',
        value: function clear() {
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                this.remove(key);
            }
        }
    }]);
    return Local;
}();

exports.default = Local;