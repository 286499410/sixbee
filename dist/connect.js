'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _pubsubJs = require('pubsub-js');

var _pubsubJs2 = _interopRequireDefault(_pubsubJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Connect = function (_Component) {
    (0, _inherits3.default)(Connect, _Component);

    function Connect(props) {
        (0, _classCallCheck3.default)(this, Connect);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Connect.__proto__ || (0, _getPrototypeOf2.default)(Connect)).call(this, props));

        _this.models = [];
        _this.state = {};
        _this.subscribes = [];

        _this.models = _lodash2.default.isFunction(props.mapToProps.models) ? props.mapToProps.models(props) : props.mapToProps.models || [];
        _this.initData(props);
        _this.models.map(function (model) {
            if (model.subscribe) {
                _this.subscribes.push(model.subscribe(function () {
                    if (_this._isMounted) {
                        _this.setState(_lodash2.default.cloneDeep(props.mapToProps.data(_this.props, _this.models) || {}));
                    }
                }));
            }
        });
        return _this;
    }

    (0, _createClass3.default)(Connect, [{
        key: 'initData',
        value: function initData(props) {
            (0, _assign2.default)(this.state, props.mapToProps.data(props, this.models) || {});
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.initData(nextProps);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._isMounted = true;
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.subscribes.map(function (subscribe) {
                _pubsubJs2.default.unsubscribe(subscribe);
            });
            this._isMounted = false;
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            return !(_lodash2.default.isEqual(nextState, this.state) && _lodash2.default.isEqual(nextProps, this.props));
        }
    }, {
        key: 'render',
        value: function render() {
            var Component = this.props.component;
            return _react2.default.createElement(Component, (0, _extends3.default)({}, (0, _extends3.default)({}, this.props, { models: this.models, data: this.state }), { key: window.location.href }));
        }
    }]);
    return Connect;
}(_react.Component);

exports.default = function (Component, mapToProps) {
    return function (props) {
        return _react2.default.createElement(Connect, (0, _extends3.default)({}, props, { component: Component, mapToProps: mapToProps }));
    };
};