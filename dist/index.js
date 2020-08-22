'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.object = exports.request = exports.storage = exports.tool = exports.connect = exports.Router = exports.Provider = exports.Form = exports.Model = undefined;

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

window.__requireContext__ = {
    app: require.context('app', true, /\.js$/),
    lib: require.context('lib', true, /\.js$/),
    middleware: require.context('middleware', true, /\.js$/)
};

var sixbee = {
    cache: {
        libs: {},
        models: {},
        middleware: {},
        forms: {}
    },
    getRequireContext: function getRequireContext(name) {
        return typeof name !== 'string' ? name : window.__requireContext__[name];
    },
    getPath: function getPath(name) {
        var dirName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        var names = name.split('.');
        if (dirName !== '') names.splice(names.length - 1, 0, dirName);
        return names.join('/');
    },
    getModule: function getModule(name, requireContext) {
        var dirName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        var path = sixbee.getPath(name, dirName);
        try {
            return sixbee.getRequireContext(requireContext)('./' + path + '.js');
        } catch (e) {
            return undefined;
        }
    },
    getLib: function getLib(name) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var requireContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'lib';

        if (typeof name !== 'string') {
            return name;
        }
        if (!sixbee.cache.libs[name]) {
            var Class = void 0;
            try {
                var module = sixbee.getModule(name, requireContext);
                Class = module.default;
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
    getModel: function getModel(name) {
        var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var requireContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'app';

        if (typeof name !== 'string') {
            return name;
        }
        if (cache && sixbee.cache.models[name]) {
            return sixbee.cache.models[name];
        }
        var module = sixbee.getModule(name, requireContext, 'model');
        var instance = void 0;
        try {
            var Class = module.default;
            if (!Class) {
                throw 'model not found';
            }
            instance = new Class(name);
        } catch (e) {
            console.log('error', e);
            instance = new _model2.default(name);
        }
        if (cache) {
            sixbee.cache.models[name] = instance;
        }
        return instance;
    },
    getForm: function getForm(name) {
        var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var requireContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'app';

        if (typeof name !== 'string') {
            return name;
        }
        if (cache && sixbee.cache.forms[name]) {
            return sixbee.cache.forms[name];
        }
        var module = sixbee.getModule(name, requireContext, 'form');
        var instance = void 0;
        try {
            var Class = module.default;
            if (!Class) {
                throw 'form not found';
            }
            instance = new Class(name);
        } catch (e) {
            console.log('error', e);
        }
        if (cache) {
            sixbee.cache.forms[name] = instance;
        }
        return instance;
    },
    getMiddleware: function getMiddleware(name) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var requireContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'middleware';

        if (typeof name !== 'string') {
            return name;
        }
        var module = sixbee.getModule(name, 'middleware');
        if (!sixbee.cache.middleware[name]) {
            try {
                sixbee.cache.middleware[name] = module.default;
                if (!sixbee.cache.middleware[name]) {
                    throw 'middleware not find';
                }
            } catch (e) {
                console.log('error', e);
                return null;
            }
        }
        return sixbee.cache.middleware[name];
    },
    lib: function lib(name) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var requireContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'lib';

        return sixbee.getLib(name, data, requireContext);
    },
    form: function form(name, cache) {
        var requireContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'app';

        return sixbee.getForm(name, cache, requireContext);
    },
    model: function model(name) {
        var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var requireContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'app';

        return sixbee.getModel(name, cache, requireContext);
    },
    config: function config(name) {
        var requireContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'app';

        var module = sixbee.getModule('common.config', requireContext);
        var config = module.default || {};
        return name ? _lodash2.default.get(config, name) : config;
    },
    middleware: function middleware(name) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var requireContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'middleware';

        return sixbee.getMiddleware(name, data, requireContext);
    }

};
var tool = sixbee.lib('tool');
var storage = sixbee.lib('storage');
var request = sixbee.lib('request');
var object = sixbee.lib('object');
exports.Model = _model2.default;
exports.Form = _form2.default;
exports.Provider = _provider2.default;
exports.Router = _router2.default;
exports.connect = _connect2.default;
exports.tool = tool;
exports.storage = storage;
exports.request = request;
exports.object = object;
exports.default = sixbee;