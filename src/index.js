import lib from './lib/index';
import Model from './model';
import Form from './form';
import Provider from './provider';
import Router from './router';
import _ from 'lodash';
import connect from './connect';

window.__requireContext__ = {
    app: require.context('app', true, /\.js$/),
    lib: require.context('lib', true, /\.js$/),
    middleware: require.context('middleware', true, /\.js$/),
};

let sixbee = {
    cache: {
        libs: {},
        models: {},
        middleware: {},
        forms: {}
    },
    getRequireContext: (name) => {
        return typeof name !== 'string' ? name : window.__requireContext__[name];
    },
    getPath: (name, dirName = '') => {
        let names = name.split('.');
        if (dirName !== '') names.splice(names.length - 1, 0, dirName);
        return names.join('/');
    },
    getModule: (name, requireContext, dirName = '') => {
        let path = sixbee.getPath(name, dirName);
        try {
            return sixbee.getRequireContext(requireContext)('./' + path + '.js');
        } catch (e) {
            return undefined;
        }
    },
    getLib: (name, data = null, requireContext = 'lib') => {
        if (typeof name !== 'string') {
            return name;
        }
        if (!sixbee.cache.libs[name]) {
            let Class;
            try {
                //自定义优先
                let module = sixbee.getModule(name, requireContext);
                Class = module.default;
                if (!Class) {
                    throw 'lib not found';
                }
                sixbee.cache.libs[name] = new Class(data);
            } catch (e) {
                if (lib(name)) {
                    sixbee.cache.libs[name] = lib(name);
                }
            }
        }
        return sixbee.cache.libs[name];
    },
    getModel: (name, cache = true, requireContext = 'app') => {
        if (typeof name !== 'string') {
            return name;
        }
        if (cache && sixbee.cache.models[name]) {
            return sixbee.cache.models[name];
        }
        let module = sixbee.getModule(name, requireContext, 'model');
        let instance;
        try {
            let Class = module.default;
            if (!Class) {
                throw 'model not found';
            }
            instance = new Class(name);
        } catch (e) {
            console.log('error', e);
            instance = new Model(name);
        }
        if (cache) {
            sixbee.cache.models[name] = instance;
        }
        return instance;
    },
    getForm: (name, cache = true, requireContext = 'app') => {
        if (typeof name !== 'string') {
            return name;
        }
        if (cache && sixbee.cache.forms[name]) {
            return sixbee.cache.forms[name];
        }
        let module = sixbee.getModule(name, requireContext, 'form');
        let instance;
        try {
            let Class = module.default;
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
    getMiddleware: (name, data = null, requireContext = 'middleware') => {
        if (typeof name !== 'string') {
            return name;
        }
        let module = sixbee.getModule(name, 'middleware');
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
    lib: (name, data = null, requireContext = 'lib') => {
        return sixbee.getLib(name, data, requireContext);
    },
    form: (name, cache, requireContext = 'app') => {
        return sixbee.getForm(name, cache, requireContext);
    },
    model: (name, cache = true, requireContext = 'app') => {
        return sixbee.getModel(name, cache, requireContext);
    },
    config: (name, requireContext = 'app') => {
        let module = sixbee.getModule('common.config', requireContext);
        let config = module.default || {};
        return name ? _.get(config, name) : config;
    },
    middleware: (name, data = null, requireContext = 'middleware') => {
        return sixbee.getMiddleware(name, data, requireContext);
    },

};
const tool = sixbee.lib('tool');
const storage = sixbee.lib('storage');
const request = sixbee.lib('request');
const object = sixbee.lib('object');
export {
    Model,
    Form,
    Provider,
    Router,
    connect,
    tool,
    storage,
    request,
    object,
}
export default sixbee;