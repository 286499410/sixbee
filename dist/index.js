'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lib2 = require('./lib');

var _lib3 = _interopRequireDefault(_lib2);

var _model = require('./lib/model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sixbee = {
    cache: {
        libs: {},
        models: {}
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
                if ((0, _lib3.default)(name)) {
                    sixbee.cache.libs[name] = (0, _lib3.default)(name);
                }
            }
        }
        return sixbee.cache.libs[name];
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
                var _Class = require('app/' + file).default;
                if (!_Class) {
                    throw 'model not found';
                }
                sixbee.cache.models[name] = new _Class(name);
            } catch (e) {
                console.log('error', e);
                sixbee.cache.models[name] = new _model2.default(name);
            }
        }
        return sixbee.cache.models[name];
    }
};

exports.default = sixbee;