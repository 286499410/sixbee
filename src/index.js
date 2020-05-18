import lib from './lib/index';
import Model from './model';
import Form from './form';
import Provider from './provider';
import Router from './router';
import _ from 'lodash';
import connect from './connect';

let sixbee = {
    cache: {
        libs: {},
        models: {},
        middleware: {},
        forms: {}
    },
    lib: (name, data = null) => {
        if (typeof name !== 'string') {
            return name;
        }
        if (!sixbee.cache.libs[name]) {
            let Class;
            let path = name.replace(/\./g, '/');
            try {
                //自定义优先
                Class = require(`lib/${path}`).default;
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
    form: (name, cache) => {
        if (typeof name !== 'string') {
            return name;
        }
        let names = name.split('.'), file;
        if (names.length == 2) {
            file = `${names[0]}/form/${names[1]}`;
        } else {
            file = `form/${names[0]}`;
        }
        if (cache === false) {
            let Class = require(`app/${file}`).default;
            return new Class(name);
        }
        if (!sixbee.cache.forms[name]) {
            try {
                let Class = require(`app/${file}`).default;
                if (!Class) {
                    throw 'form not found';
                }
                sixbee.cache.forms[name] = new Class(name);
            } catch (e) {
                console.log('error', e);
            }
        }
        return sixbee.cache.forms[name]
    },
    model: (name, cache) => {
        if (typeof name !== 'string') {
            return name;
        }
        let names = name.split('.'), file;
        if (names.length == 2) {
            file = `${names[0]}/model/${names[1]}`;
        } else {
            file = `model/${names[0]}`;
        }
        if (cache === false) {
            let Class = require(`app/${file}`).default;
            return new Class(name);
        }
        if (!sixbee.cache.models[name]) {
            try {
                let Class = require(`app/${file}`).default;
                if (!Class) {
                    throw 'model not found';
                }
                sixbee.cache.models[name] = new Class(name);
            } catch (e) {
                console.log('error', e);
                sixbee.cache.models[name] = new Model(name);
            }
        }
        return sixbee.cache.models[name];
    },
    config: (name) => {
        let config = require('app/common/config').default || {};
        return name ? _.get(config, name) : config;
    },
    middleware: (name, data = null) => {
        if (typeof name !== 'string') {
            return name;
        }
        if (!sixbee.cache.middleware[name]) {
            try {
                sixbee.cache.middleware[name] = require(`middleware/${name}`).default;
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