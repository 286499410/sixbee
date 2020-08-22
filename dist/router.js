'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Router = function (_Component) {
    (0, _inherits3.default)(Router, _Component);

    function Router(props) {
        (0, _classCallCheck3.default)(this, Router);
        return (0, _possibleConstructorReturn3.default)(this, (Router.__proto__ || (0, _getPrototypeOf2.default)(Router)).call(this, props));
    }

    (0, _createClass3.default)(Router, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _reactRouterDom.BrowserRouter,
                    null,
                    _react2.default.createElement(
                        _reactRouterDom.Switch,
                        null,
                        this.props.route.switch.map(function (route, index) {
                            return _react2.default.createElement(_reactRouterDom.Route, { key: index, exact: route.exact, path: route.path, render: function render(props) {
                                    return _react2.default.createElement(Gateway, (0, _extends3.default)({}, props, { 'switch': route, route: _this2.props.route }));
                                } });
                        }),
                        _react2.default.createElement(_reactRouterDom.Route, { path: '/', render: function render(props) {
                                return _react2.default.createElement(Gateway, (0, _extends3.default)({}, props, { route: _this2.props.route }));
                            } })
                    )
                )
            );
        }
    }]);
    return Router;
}(_react.Component);

Router.contextTypes = {
    App: _propTypes2.default.object
};
exports.default = Router;

var Gateway = function (_Component2) {
    (0, _inherits3.default)(Gateway, _Component2);

    function Gateway() {
        (0, _classCallCheck3.default)(this, Gateway);
        return (0, _possibleConstructorReturn3.default)(this, (Gateway.__proto__ || (0, _getPrototypeOf2.default)(Gateway)).apply(this, arguments));
    }

    (0, _createClass3.default)(Gateway, [{
        key: 'getLayout',
        value: function getLayout(route) {
            return route.layout !== false ? route.layout || this.props.route.layout : false;
        }
    }, {
        key: 'setDocumentTitle',
        value: function setDocumentTitle(props) {
            if (props.route.titles) {
                if (props.route.titles[location.pathname]) {
                    document.title = props.route.titles[location.pathname];
                } else if (props.route.titles['_default']) {
                    document.title = props.route.titles['_default'];
                }
            }
        }
    }, {
        key: 'setQuery',
        value: function setQuery(props) {
            var match = {};
            var query = {};
            props.location.search.substr(1).split('&').map(function (row) {
                var _row$split = row.split('='),
                    _row$split2 = (0, _slicedToArray3.default)(_row$split, 2),
                    key = _row$split2[0],
                    value = _row$split2[1];

                if (value !== undefined) {
                    query[key] = value;
                }
            });
            match.query = query;
            props.match = (0, _extends3.default)({}, props.match, match);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var props = (0, _extends3.default)({}, this.props);
            var App = this.context.App;
            App.history = props.history;
            var middleware = props.switch && props.switch.middleware ? props.switch.middleware : props.route ? props.route.middleware : [];

            if (middleware && middleware.length > 0) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = (0, _getIterator3.default)(middleware), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var name = _step.value;

                        var res = App.middleware(name)(props);
                        if (res !== true) {
                            return res;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }

            this.setDocumentTitle(props);

            this.setQuery(props);

            if (props.switch) {
                var Layout = this.getLayout(props.switch);
                if (Layout) {
                    return _react2.default.createElement(
                        Layout,
                        props,
                        _react2.default.createElement(props.switch.component, props)
                    );
                }
                return _react2.default.createElement(props.switch.component, props);
            } else if (props.route) {
                if (props.route.autoMatch) {
                    var pathname = props.location.pathname;
                    var paths = void 0;
                    var match = {};
                    pathname = pathname.replace(/\/*/, '');
                    pathname = pathname.replace(/\/*$/, '');
                    paths = pathname.split('/');
                    match.params = {
                        group: paths[0],
                        model: paths[1],
                        action: paths[2]
                    };
                    paths.splice(0, 1);
                    match.params.view = paths.join('/');
                    props.match = (0, _extends3.default)({}, props.match, match);
                    try {
                        var context = void 0;
                        if (App.requireContext[match.params.group]) {
                            context = App.requireContext[match.params.group];
                        } else {
                            context = App.requireContext;
                        }
                        var filename = './' + match.params.group + '/view/' + match.params.view;

                        if (context.keys().indexOf(filename + '.js') >= 0) {
                            filename += '.js';
                        } else {
                            filename += '/index.js';
                        }
                        var _Component3 = context(filename).default;
                        var _Layout = props.route.layout;
                        if (_Layout) {
                            return _react2.default.createElement(
                                _Layout,
                                props,
                                _react2.default.createElement(_Component3, props)
                            );
                        } else {
                            return _react2.default.createElement(_Component3, props);
                        }
                    } catch (e) {
                        console.log('route not found:' + props.location.pathname);
                    }
                }
                return _react2.default.createElement(
                    _reactRouterDom.Switch,
                    null,
                    this.props.route.noMatch.map(function (route, index) {
                        return _react2.default.createElement(_reactRouterDom.Route, { key: index, exact: route.exact, path: route.path, render: function render(nextProps) {
                                var Component = route.component;
                                nextProps.route = props.route;
                                var Layout = _this4.getLayout(route);
                                if (Layout) {
                                    return _react2.default.createElement(
                                        Layout,
                                        nextProps,
                                        _react2.default.createElement(Component, nextProps)
                                    );
                                } else {
                                    return _react2.default.createElement(Component, nextProps);
                                }
                            } });
                    })
                );
            }
        }
    }]);
    return Gateway;
}(_react.Component);

Gateway.contextTypes = {
    App: _propTypes2.default.object
};