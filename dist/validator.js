'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _lib = require('./lib');

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _state = (0, _symbol2.default)();
var _scene = (0, _symbol2.default)();

var Validator = function () {
    function Validator() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, Validator);

        _initialiseProps.call(this);

        this[_state] = {
            rule: {},
            message: {},
            scene: {}
        };
        this.config(config);
        this[_scene] = false;
    }

    (0, _createClass3.default)(Validator, [{
        key: 'config',
        value: function config(_config) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)((0, _entries2.default)(_config)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

                    var key = _ref2[0];
                    var value = _ref2[1];

                    this[key] = value;
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
        }
    }, {
        key: 'setState',
        value: function setState(state) {
            (0, _assign2.default)(this[_state], state);
            return this;
        }
    }, {
        key: 'setScene',
        value: function setScene(scene) {
            this[_scene] = scene;
            return this;
        }
    }, {
        key: 'setLabel',
        value: function setLabel(key, value) {
            if (_lodash2.default.isObject(key)) {
                this.label = (0, _extends3.default)({}, this.label, key);
            } else {
                this.label[key] = value;
            }
            return this;
        }
    }, {
        key: 'parseRule',
        value: function parseRule(config) {
            var _this = this;

            if (!(0, _lib2.default)('object').isEmpty(this[_state].rule)) {
                return this[_state].rule;
            }
            var rule = {};

            var _loop = function _loop(key, value) {
                var _key$split = key.split('|'),
                    _key$split2 = (0, _slicedToArray3.default)(_key$split, 2),
                    name = _key$split2[0],
                    label = _key$split2[1];

                rule[name] = {
                    label: label || _this.label[name] || name,
                    validates: []
                };
                var values = void 0;
                if ((0, _lib2.default)('object').isArray(value)) {
                    values = value;
                } else {
                    values = value.split('|');
                }
                values.map(function (value) {
                    var type = void 0,
                        extend = void 0;
                    if ((0, _lib2.default)('object').isObject(value)) {
                        type = (0, _keys2.default)(value)[0];
                        extend = value[type];
                    } else {
                        var _value$split = value.split(':');

                        var _value$split2 = (0, _slicedToArray3.default)(_value$split, 2);

                        type = _value$split2[0];
                        extend = _value$split2[1];
                    }
                    rule[name].validates.push({ type: type, extend: extend });
                });
            };

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)((0, _entries2.default)(config)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _ref3 = _step2.value;

                    var _ref4 = (0, _slicedToArray3.default)(_ref3, 2);

                    var key = _ref4[0];
                    var value = _ref4[1];

                    _loop(key, value);
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

            this.setState({ rule: rule });
            return rule;
        }
    }, {
        key: 'getErrorMsg',
        value: function getErrorMsg(key, label, validate) {
            var errorMsg = void 0;
            var message = this.parseMessage(this.message);
            if (message[key] && message[key][validate.type]) {
                errorMsg = message[key][validate.type];
            } else {
                errorMsg = this.defaultMsg[validate.type] || '';
                errorMsg = errorMsg.replace('[label]', label);
                if (validate.extend) {
                    errorMsg = errorMsg.replace('[extend]', validate.extend);
                }
            }
            return errorMsg;
        }
    }, {
        key: 'setErrorMsg',
        value: function setErrorMsg(name, errorMsg) {
            this.errorMsg[name] = errorMsg;
        }
    }, {
        key: 'getError',
        value: function getError() {
            return (0, _assign2.default)({}, this.errorMsg);
        }
    }, {
        key: 'isEmpty',
        value: function isEmpty(value) {
            return value === '' || value === undefined || value === null;
        }
    }]);
    return Validator;
}();

var _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.rule = {};
    this.message = {};
    this.scene = {};
    this.label = {};
    this.errorMsg = {};
    this.defaultMsg = {
        required: '[label]不能为空',
        integer: '[label]必须是整数',
        number: '[label]必须是数字',
        length: '[label]长度必须是[extend]位',
        min: '[label]长度至少[extend]位',
        max: '[label]长度不能超过[extend]位',
        between: '[label]必须在[extend]之间',
        email: '[label]必须是邮箱',
        url: '[label]必须是网址',
        confirm: '[label]不一致',
        ip: '[label]必须是IP地址',
        '>': '[label]必须大于[extend]',
        '>=': '[label]必须大于等于[extend]',
        '<': '[label]必须小于[extend]',
        '<=': '[label]必须小于等于[extend]',
        '==': '[label]必须等于[extend]',
        '!=': '[label]不能等于[extend]',
        'regex': '[label]正则匹配错误'
    };

    this.parseMessage = function (config) {
        if (!(0, _lib2.default)('object').isEmpty(_this2[_state].message)) {
            return _this2[_state].message;
        }
        var message = {};

        var _loop2 = function _loop2(key, value) {
            var keys = key.split('|');
            keys.map(function (k) {
                message[k] = value;
            });
        };

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = (0, _getIterator3.default)((0, _entries2.default)(config)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _ref5 = _step3.value;

                var _ref6 = (0, _slicedToArray3.default)(_ref5, 2);

                var key = _ref6[0];
                var value = _ref6[1];

                _loop2(key, value);
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        _this2.setState({ message: message });
        return message;
    };

    this.parseScene = function (config) {
        if (!(0, _lib2.default)('object').isEmpty(_this2[_state].scene)) {
            return _this2[_state].scene;
        }
        var scene = {};

        var _loop3 = function _loop3(key, value) {
            var keys = key.split('|');
            keys.map(function (k) {
                scene[k] = value;
            });
        };

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = (0, _getIterator3.default)((0, _entries2.default)(config)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var _ref7 = _step4.value;

                var _ref8 = (0, _slicedToArray3.default)(_ref7, 2);

                var key = _ref8[0];
                var value = _ref8[1];

                _loop3(key, value);
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }

        _this2.setState({ scene: scene });
        return scene;
    };

    this.getRule = function (key) {
        var rule = _this2.parseRule(_this2.rule);
        return rule[key];
    };

    this.check = function (data) {
        var scene = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this2[_scene];

        var keys = void 0,
            flag = true;
        if (scene === false || !_this2.scene[scene]) {
            keys = (0, _keys2.default)(data);
        } else {
            keys = _this2.scene[scene];
        }
        var rule = _this2.parseRule(_this2.rule);
        _this2.errorMsg = {};
        keys.map(function (key) {
            var dataKey = key;
            if (_lodash2.default.isObject(key)) {
                if (key.isCheck && !key.isCheck(data)) {
                    return;
                }
                dataKey = key.dataKey || key.key;
                key = key.key;
            }
            var validates = rule[key] ? rule[key].validates : [];
            var label = rule[key] ? rule[key].label : '';
            var ret = _this2.validates(data, dataKey, validates, label);
            if (ret !== true) {
                _this2.setErrorMsg(key, ret);
                flag = false;
            }
        });
        return flag;
    };

    this.validates = function (data, key, validates, label) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = (0, _getIterator3.default)(validates), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var validate = _step5.value;

                var ret = _this2.validate(data, key, validate, label);
                if (ret !== true) {
                    return ret;
                }
            }
        } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                    _iterator5.return();
                }
            } finally {
                if (_didIteratorError5) {
                    throw _iteratorError5;
                }
            }
        }

        return true;
    };

    this.validate = function (data, key, validate, label) {
        var value = _lodash2.default.get(data, key);
        var isEmpty = _this2.isEmpty(value);
        var valid = true;
        if (validate.type === 'required' && isEmpty) {
            valid = false;
        } else if (!isEmpty) {
            switch (validate.type) {
                case 'length':
                    valid = value.length == validate.extend;
                    break;
                case 'min':
                    valid = value.length >= validate.extend;
                    break;
                case 'max':
                    valid = value.length <= validate.extend;
                    break;
                case 'email':
                    valid = (0, _lib2.default)('validate').isEmail(value);
                    break;
                case 'url':
                    valid = (0, _lib2.default)('validate').isUrl(value);
                    break;
                case 'ip':
                    valid = (0, _lib2.default)('validate').isIp(value);
                    break;
                case 'integer':
                    valid = (0, _lib2.default)('validate').isInteger(value);
                    break;
                case 'number':
                    valid = (0, _lib2.default)('validate').isNumber(value);
                    break;
                case 'regex':
                    var regex = void 0;
                    if ((0, _lib2.default)('object').isRegExp(validate.extend)) {
                        regex = validate.extend;
                    } else {
                        regex = eval(validate.extend);
                    }
                    if ((0, _lib2.default)('object').isRegExp(regex)) {
                        valid = regex.test(value);
                    }
                    break;
                case 'between':
                    var _validate$extend$spli = validate.extend.split(','),
                        _validate$extend$spli2 = (0, _slicedToArray3.default)(_validate$extend$spli, 2),
                        min = _validate$extend$spli2[0],
                        max = _validate$extend$spli2[1];

                    if (value < min || value > max) {
                        valid = false;
                    }
                    break;
                case 'confirm':
                    var confirm = data[validate.extend];
                    valid = value === confirm;
                    break;
                case '>':
                case '>=':
                case '<':
                case '<=':
                case '==':
                case '!=':
                    valid = eval(value + validate.type + validate.extend);
                    break;
                default:
                    if ((0, _lib2.default)('object').isFunction(_this2[validate.type])) {
                        var errorMsg = _this2[validate.type](value, validate.extend, data, key);
                        if (errorMsg !== true) {
                            return errorMsg;
                        }
                    }
            }
        } else if (validate.type.indexOf('check') == 0) {
            if ((0, _lib2.default)('object').isFunction(_this2[validate.type])) {
                var _errorMsg = _this2[validate.type](value, validate.extend, data, key);
                if (_errorMsg !== true) {
                    return _errorMsg;
                }
            }
        }
        if (!valid) {
            return _this2.getErrorMsg(key, label, validate);
        }
        return valid;
    };
};

exports.default = Validator;