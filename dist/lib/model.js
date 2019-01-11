'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _pubsubJs = require('pubsub-js');

var _pubsubJs2 = _interopRequireDefault(_pubsubJs);

var _tool = require('../instance/tool');

var _tool2 = _interopRequireDefault(_tool);

var _curd = require('./curd');

var _curd2 = _interopRequireDefault(_curd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = (0, _symbol2.default)();
var observerKey = (0, _symbol2.default)();
var observers = (0, _symbol2.default)();

var Model = function () {
    function Model(key) {
        (0, _classCallCheck3.default)(this, Model);

        _initialiseProps.call(this);

        this.key = key;

        var _key$split = key.split('.');

        var _key$split2 = (0, _slicedToArray3.default)(_key$split, 2);

        this.group = _key$split2[0];
        this.name = _key$split2[1];

        this[state] = this.getInitialState();
        this[observerKey] = _tool2.default.uuid();
        this[observers] = [];
        this.Curd = new _curd2.default(key);
    }

    (0, _createClass3.default)(Model, [{
        key: 'getStateSymbol',
        value: function getStateSymbol() {
            return state;
        }
    }, {
        key: 'getInitialState',
        value: function getInitialState() {
            return {
                field: '*',
                page: 1,
                pages: 0,
                rows: 0,
                limit: 50,
                order: 'id desc',
                cond: {},
                filter: {},
                data: {},
                list: [],
                sums: {}
            };
        }
    }, {
        key: 'getState',
        value: function getState(key) {
            if (key === undefined) {
                return (0, _assign2.default)({}, this[state]);
            } else {
                return _lodash2.default.get(this[state], key);
            }
        }
    }, {
        key: 'setState',
        value: function setState(nextState) {
            var publish = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            (0, _assign2.default)(this[state], nextState);
            if (publish) {
                this.publish(this[state]);
            }
        }
    }, {
        key: 'subscribe',
        value: function subscribe(fn) {
            var token = _pubsubJs2.default.subscribe(this[observerKey], fn);
            this[observers].push(token);
            return token;
        }
    }, {
        key: 'publish',
        value: function publish() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (this[observers] && this[observers].length > 0) {
                _pubsubJs2.default.publish(this[observerKey], data);
            }
        }
    }, {
        key: 'unsubscribe',
        value: function unsubscribe() {
            var token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (token) {
                _pubsubJs2.default.unsubscribe(token);
            } else {
                this[observers].map(function (token) {
                    _pubsubJs2.default.unsubscribe(token);
                });
            }
        }
    }, {
        key: 'create',
        value: function create(data) {
            var _this = this;

            return new _promise2.default(function (resolve, reject) {
                _this.Curd.create(data).then(function (res) {
                    if (res.requestId && res.createId) {
                        resolve(res);
                    } else if (res.errCode) {
                        reject(res);
                    }
                }, function (res) {
                    reject(res);
                });
            });
        }
    }, {
        key: 'update',
        value: function update(id, data) {
            var _this2 = this;

            return new _promise2.default(function (resolve, reject) {
                _this2.Curd.update(id, data).then(function (res) {
                    if (res.errCode) {
                        reject(res);
                    } else if (res.requestId) {
                        resolve(res);
                    }
                }, function (res) {
                    reject(res);
                });
            });
        }
    }, {
        key: 'delete',
        value: function _delete(params) {
            var _this3 = this;

            return new _promise2.default(function (resolve, reject) {
                _this3.Curd.delete(params).then(function (res) {
                    if (res.errCode) {
                        reject(res);
                    } else if (res.requestId) {
                        resolve(res);
                    }
                }, function (res) {
                    reject(res);
                });
            });
        }
    }, {
        key: 'read',
        value: function read(id) {
            var _this4 = this;

            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var currentState = this.getState();
            if (currentState.detailWith && !params.with) {
                params.with = currentState.detailWith;
            }
            return new _promise2.default(function (resolve, reject) {
                _this4.Curd.read(id, params).then(function (res) {
                    if (res.single && res.single.id) {
                        _this4[state].data[res.single.id] = res.single;
                        _this4.setState({});
                        resolve(res);
                    } else if (res.errCode) {
                        reject(res);
                    }
                }, function (res) {
                    reject(res);
                });
            });
        }
    }, {
        key: 'single',
        value: function single(params) {
            var _this5 = this;

            return new _promise2.default(function (resolve, reject) {
                _this5.Curd.single(params).then(function (res) {
                    if (res.id) {
                        _this5[state].data[res.id] = res;
                        _this5.setState({});
                        resolve(res);
                    } else if (res.errCode) {
                        reject(res);
                    }
                }, function (res) {
                    reject(res);
                });
            });
        }
    }, {
        key: 'list',
        value: function list() {
            var _this6 = this;

            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var currentState = this.getState();
            params = (0, _assign2.default)({
                field: currentState.field,
                page: currentState.page,
                limit: currentState.limit,
                order: currentState.order,
                with: currentState.with,
                cond: _lodash2.default.merge({}, currentState.cond, this.filterToCond())
            }, params);
            if (currentState.sum) {
                params.sum = currentState.sum;
            }
            return new _promise2.default(function (resolve, reject) {
                _this6.Curd.list(params).then(function (res) {
                    if (res.list) {
                        if (res.page) _this6[state].page = res.page;
                        if (res.rows) _this6[state].rows = res.rows;
                        if (res.pages) _this6[state].pages = res.pages;
                        if (params.limit) _this6[state].limit = params.limit;
                        if (res.sums) _this6[state].sums = res.sums;
                        _this6.setState({ list: res.list });
                        resolve(res);
                    } else if (res.errCode) {
                        reject(res);
                    }
                }, function (res) {
                    reject(res);
                });
            });
        }
    }, {
        key: 'getAll',
        value: function getAll() {
            var _this7 = this;

            var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var list = this.getState('list');
            if (list.length > 0 && !refresh) {
                return new _promise2.default(function (resolve, reject) {
                    resolve(list);
                });
            } else {
                return new _promise2.default(function (resolve, reject) {
                    if (!_this7.allPromise || refresh) {
                        _this7.allPromise = _this7.list({ limit: 1000 });
                    }
                    _this7.allPromise.then(function (res) {
                        resolve(res.list);
                    });
                });
            }
        }
    }, {
        key: 'filterToCond',
        value: function filterToCond() {
            var filterData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this[state].filter;

            var cond = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)((0, _entries2.default)(filterData)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
                        key = _step$value[0],
                        value = _step$value[1];

                    var field = this.fields[key] || {};
                    if (field.filterCondKey === false) {
                        continue;
                    }
                    var filterKey = field.filterKey || key;
                    var filterCondKey = field.filterCondKey || '=';
                    if (value !== undefined && value !== '' && value !== null) {
                        _lodash2.default.set(cond, filterKey, {});
                        if (filterCondKey == 'between') {
                            var _value$toString$split = value.toString().split(','),
                                _value$toString$split2 = (0, _slicedToArray3.default)(_value$toString$split, 2),
                                start = _value$toString$split2[0],
                                end = _value$toString$split2[1];

                            if (start === '' && end !== '') {
                                _lodash2.default.set(cond, filterKey + '.<=', end);
                            } else if (start !== '' && end === '') {
                                _lodash2.default.set(cond, filterKey + '.>=', start);
                            } else {
                                _lodash2.default.set(cond, filterKey + '.' + filterCondKey, value);
                            }
                        } else {
                            _lodash2.default.set(cond, filterKey + '.' + filterCondKey, value);
                        }
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

            return cond;
        }
    }]);
    return Model;
}();

var _initialiseProps = function _initialiseProps() {
    var _this8 = this;

    this.symbols = {
        state: state,
        observerKey: observerKey,
        observers: observers
    };
    this.fields = {};

    this.setData = function (data) {
        if (!_this8[state].data) {
            _this8[state].data = {};
        }
        (0, _assign2.default)(_this8[state].data, data);
        _this8.setState({});
    };

    this.getData = function (key) {
        return _this8[state].data[key];
    };

    this.getValidator = function () {
        return App.validate(_this8.key);
    };

    this.getField = function (key) {
        return _this8.fields[key] || {};
    };

    this.getFields = function (columns) {
        var fields = [];
        columns.map(function (column) {
            if (_lodash2.default.isObject(column)) {
                if (column.fields) {
                    fields.push((0, _extends3.default)({}, column, {
                        fields: _this8.getFields(column.fields)
                    }));
                } else if (column.key) {
                    var field = column.model ? column.model.getField(column.key) : _this8.getField(column.key);
                    fields.push((0, _extends3.default)({
                        dataKey: column.key
                    }, field, column));
                }
            } else if (_this8.fields[column]) {
                fields.push((0, _extends3.default)({
                    key: column,
                    dataKey: column
                }, _this8.fields[column]));
            } else {
                console.log(column, 'not found');
            }
        });
        return fields;
    };
};

exports.default = Model;