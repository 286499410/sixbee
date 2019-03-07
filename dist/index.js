'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.connect = exports.Router = exports.Provider = exports.Form = exports.Model = undefined;

var _index = require('./lib/index');

var _index2 = _interopRequireDefault(_index);

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

var _form = require('./form');

var _form2 = _interopRequireDefault(_form);

var _provider = require('./provider');

var _provider2 = _interopRequireDefault(_provider);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sixbee = {
    cache: {
        libs: {},
        models: {},
        middleware: {},
        forms: {}
    },
    lib: function lib(name) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (typeof name !== 'string') {
            return name;
        }
        if (!sixbee.cache.libs[name]) {
            var Class = void 0;
            var path = name.replace(/\./g, '/');
            try {
                Class = require('lib/' + path).default;
                if (!Class) {
                    throw 'lib not found';
                }
                sixbee.cache.libs[name] = new Class(data);
            } catch (e) {
                if ((0, _index2.default)(name)) {
                    sixbee.cache.libs[name] = (0, _index2.default)(name);
                }
            }
        }
        return sixbee.cache.libs[name];
    },
    form: function form(name, cache) {
        if (typeof name !== 'string') {
            return name;
        }
        var names = name.split('.'),
            file = void 0;
        if (names.length == 2) {
            file = names[0] + '/form/' + names[1];
        } else {
            file = 'form/' + names[0];
        }
        if (cache === false) {
            var Class = require('app/' + file).default;
            return new Class(name);
        }
        if (!sixbee.cache.forms[name]) {
            try {
                var _Class = require('app/' + file).default;
                if (!_Class) {
                    throw 'form not found';
                }
                sixbee.cache.forms[name] = new _Class(name);
            } catch (e) {
                console.log('error', e);
            }
        }
        return sixbee.cache.forms[name];
    },
    model: function model(name, cache) {
        if (typeof name !== 'string') {
            return name;
        }
        var names = name.split('.'),
            file = void 0;
        if (names.length == 2) {
            file = names[0] + '/model/' + names[1];
        } else {
            file = 'model/' + names[0];
        }
        if (cache === false) {
            var Class = require('app/' + file).default;
            return new Class(name);
        }
        if (!sixbee.cache.models[name]) {
            try {
                var _Class2 = require('app/' + file).default;
                if (!_Class2) {
                    throw 'model not found';
                }
                sixbee.cache.models[name] = new _Class2(name);
            } catch (e) {
                console.log('error', e);
                sixbee.cache.models[name] = new _model2.default(name);
            }
        }
        return sixbee.cache.models[name];
    },
    config: function config(name) {
        var config = require('app/common/config').default || {};
        return name ? _lodash2.default.get(config, name) : config;
    },
    middleware: function middleware(name) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (typeof name !== 'string') {
            return name;
        }
        if (!sixbee.cache.middleware[name]) {
            try {
                sixbee.cache.middleware[name] = require('middleware/' + name).default;
                if (!sixbee.cache.middleware[name]) {
                    throw 'middleware not find';
                }
            } catch (e) {
                console.log('error', e);
                return null;
            }
        }
        return sixbee.cache.middleware[name];
    }
};
exports.Model = _model2.default;
exports.Form = _form2.default;
exports.Provider = _provider2.default;
exports.Router = _router2.default;
exports.connect = _connect2.default;
exports.default = sixbee;