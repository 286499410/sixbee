'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _session = require('./storage/session');

var _session2 = _interopRequireDefault(_session);

var _local = require('./storage/local');

var _local2 = _interopRequireDefault(_local);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Storage = function () {
    function Storage() {
        var _this = this;

        (0, _classCallCheck3.default)(this, Storage);
        this.drivers = {
            session: new _session2.default(),
            local: new _local2.default()
        };

        this.driver = function (name) {
            return _this.drivers[name];
        };

        this.session = function () {
            var session = _this.driver('session');
            switch (arguments.length) {
                case 0:
                    return session;
                case 1:
                    return session.get.apply(session, arguments);
                case 2:
                case 3:
                    session.set.apply(session, arguments);
                    break;
            }
        };

        this.local = function () {
            var local = _this.driver('local');
            switch (arguments.length) {
                case 0:
                    return local;
                case 1:
                    return local.get.apply(local, arguments);
                case 2:
                case 3:
                    local.set.apply(local, arguments);
                    break;
            }
        };
    }

    (0, _createClass3.default)(Storage, [{
        key: 'setServerTime',
        value: function setServerTime(time) {
            var localTime = parseInt(new Date().getTime() / 1000);
            this.session('server_time', {
                value: time,
                localTime: localTime
            });
        }
    }, {
        key: 'getServerTime',
        value: function getServerTime() {
            var newTime = parseInt(new Date().getTime() / 1000);
            var serverTime = this.session('server_time');
            return serverTime ? serverTime.value + (newTime - serverTime.localTime) : newTime;
        }
    }]);
    return Storage;
}();

exports.default = Storage;