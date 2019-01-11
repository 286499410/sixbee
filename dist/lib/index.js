'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _request = require('../instance/request');

var _request2 = _interopRequireDefault(_request);

var _storage = require('../instance/storage');

var _storage2 = _interopRequireDefault(_storage);

var _tool = require('../instance/tool');

var _tool2 = _interopRequireDefault(_tool);

var _object = require('../instance/object');

var _object2 = _interopRequireDefault(_object);

var _validate = require('../instance/validate');

var _validate2 = _interopRequireDefault(_validate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var libs = {
    request: _request2.default,
    storage: _storage2.default,
    tool: _tool2.default,
    object: _object2.default,
    validate: _validate2.default
};

exports.default = function (name) {
    return libs[name];
};