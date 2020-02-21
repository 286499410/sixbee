'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _validator2 = require('./validator');

var _validator3 = _interopRequireDefault(_validator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Form = function () {
    function Form() {
        (0, _classCallCheck3.default)(this, Form);
        this._scene = {};
        this._validate = {
            rule: {},
            message: {},
            scene: {}
        };
        this._state = {
            scene: false,
            component: undefined,
            validator: undefined,
            model: undefined
        };
    }

    (0, _createClass3.default)(Form, [{
        key: '_initialize',
        value: function _initialize(key) {
            this.model(_index2.default.model(key));
            this.validator(new _validator3.default(this._validate));
            this.validator().setLabel(this.model().getLabels());
        }
    }, {
        key: 'component',
        value: function component() {
            var Component = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

            if (Component === undefined) return this._state.component;else {
                this._state.component = Component;
                return this;
            }
        }
    }, {
        key: 'scene',
        value: function scene() {
            var _scene = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

            if (_scene === undefined) return this._state.scene;else {
                this._state.scene = _scene;
                return this;
            }
        }
    }, {
        key: 'validator',
        value: function validator() {
            var _validator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

            if (_validator === undefined) return this._state.validator;else {
                this._state.validator = _validator;
            }
        }
    }, {
        key: 'model',
        value: function model() {
            var _model = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

            if (_model === undefined) return this._state.model;else {
                this._state.model = _model;
            }
        }
    }, {
        key: 'getScene',
        value: function getScene() {
            var scene = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._state.scene;

            console.log(scene, 'teststes');
            for (var key in this._scene) {
                var keys = key.split('|');
                if (keys.indexOf(scene) >= 0) {
                    return this._scene[key];
                }
            }
            return undefined;
        }
    }, {
        key: 'getTabs',
        value: function getTabs() {
            var scene = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._state.scene;

            return this._scene[this._state.scene].tabs;
        }
    }, {
        key: 'getFields',
        value: function getFields() {
            var scene = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._state.scene;

            var fields = this._scene[this._state.scene].fields;
            return this.model().getFields(fields);
        }
    }, {
        key: 'getProps',
        value: function getProps() {
            var scene = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._state.scene;

            return this._scene[this._state.scene].props;
        }
    }, {
        key: 'check',
        value: function check(data) {
            var scene = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._state.scene;

            if (this.validator().check(data, scene)) {
                return true;
            } else {
                return this.validator().getError();
            }
        }
    }]);
    return Form;
}();

exports.default = Form;