import lib from './lib';
import Model from './lib/model';
let sixbee = {
    cache: {
        libs: {},
        models: {}
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
                if(!Class) {
                    throw 'lib not found';
                }
                sixbee.cache.libs[name] = new Class(data);
            } catch (e) {
                if(lib(name)) {
                    sixbee.cache.libs[name] = lib(name);
                }
            }
        }
        return sixbee.cache.libs[name];
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
                if(!Class) {
                    throw 'model not found';
                }
                sixbee.cache.models[name] = new Class(name);
            } catch (e) {
                console.log('error', e);
                sixbee.cache.models[name] = new Model(name);
            }
        }
        return sixbee.cache.models[name];
    }
};

export default sixbee;