'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _pubsubJs = require('pubsub-js');

var _pubsubJs2 = _interopRequireDefault(_pubsubJs);

var _tool = require('./instance/tool');

var _tool2 = _interopRequireDefault(_tool);

var _curd = require('./lib/curd');

var _curd2 = _interopRequireDefault(_curd);

var _storage = require('./instance/storage');

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Model = function () {
    function Model(key) {
        (0, _classCallCheck3.default)(this, Model);
        this._fields = {};
        this._state = {};
        this._observers = [];

        this.key = key;

        var _key$split = key.split('.');

        var _key$split2 = (0, _slicedToArray3.default)(_key$split, 2);

        this.group = _key$split2[0];
        this.name = _key$split2[1];

        this._state = this.getInitialState();
        this._observerKey = _tool2.default.uuid();
        this._observers = [];
        this.Curd = new _curd2.default(key);
    }

    (0, _createClass3.default)(Model, [{
        key: 'getInitialState',
        value: function getInitialState() {
            return {
                field: '*',
                page: 1,
                pages: 0,
                rows: 0,
                limit: 20,
                order: 'id desc',
                cond: {},
                filter: {},
                data: {},
                list: [],
                sums: {},
                all: [],
                with: ''
            };
        }
    }, {
        key: 'state',
        value: function state() {
            var _state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

            var publish = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (_state === undefined) return this._state;else {
                (0, _assign2.default)(this._state, _state);
                if (publish) {
                    this.publish(this._state);
                }
            }
        }
    }, {
        key: 'subscribe',
        value: function subscribe(fn) {
            var _this = this;

            var token = _pubsubJs2.default.subscribe(this._observerKey, fn);
            this._observers.push(token);
            return function () {
                _this.unsubscribe(token);
            };
        }
    }, {
        key: 'publish',
        value: function publish() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (this._observers && this._observers.length > 0) {
                _pubsubJs2.default.publish(this._observerKey, data);
            }
        }
    }, {
        key: 'unsubscribe',
        value: function unsubscribe() {
            var token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (token) {
                _pubsubJs2.default.unsubscribe(token);
            } else {
                this._observers.map(function (token) {
                    _pubsubJs2.default.unsubscribe(token);
                });
            }
        }
    }, {
        key: 'create',
        value: function create(data) {
            var _this2 = this;

            return new _promise2.default(function (resolve, reject) {
                _this2.Curd.create(data).then(function (res) {
                    if (res.requestId && (res.createId || res.id)) {
                        _this2.clearAll();
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
            var _this3 = this;

            return new _promise2.default(function (resolve, reject) {
                _this3.Curd.update(id, data).then(function (res) {
                    if (res.errCode) {
                        reject(res);
                    } else if (res.requestId) {
                        if (_this3._state.data[id]) {
                            delete _this3._state.data[id];
                        }
                        resolve(res);
                        _this3.clearAll();
                    }
                }, function (res) {
                    reject(res);
                });
            });
        }
    }, {
        key: 'delete',
        value: function _delete(params) {
            var _this4 = this;

            return new _promise2.default(function (resolve, reject) {
                _this4.Curd.delete(params).then(function (res) {
                    if (res.errCode) {
                        reject(res);
                    } else if (res.requestId) {
                        resolve(res);
                        _this4.clearAll();
                    }
                }, function (res) {
                    reject(res);
                });
            });
        }
    }, {
        key: 'read',
        value: function read(id) {
            var _this5 = this;

            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var currentState = this.state();
            if (currentState.detailWith && !params.hasOwnProperty('with')) {
                params.with = currentState.detailWith;
            }
            return new _promise2.default(function (resolve, reject) {
                _this5.Curd.read(id, params).then(function (res) {
                    if (res.single && res.single.id) {
                        _this5._state.data[res.single.id] = res.single;
                        _this5.publish(_this5._state);
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
            var _this6 = this;

            return new _promise2.default(function (resolve, reject) {
                _this6.Curd.single(params).then(function (res) {
                    if (res.id) {
                        _this6._state.data[res.id] = res;
                        _this6.publish(_this6._state);
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
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var _this7 = this;

            var autoUpdateState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var hasFilter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            params = _lodash2.default.merge({
                field: this._state.field,
                page: this._state.page,
                limit: this._state.limit,
                order: this._state.order,
                with: this._state.with,
                cond: _lodash2.default.merge({}, this._state.cond, hasFilter ? this.filterToCond() : {})
            }, params);
            if (this._state.sum) {
                params.sum = this._state.sum;
            }
            return new _promise2.default(function (resolve, reject) {
                _this7.Curd.list(params).then(function (res) {
                    if (res.list) {
                        var state = { list: res.list };
                        if (res.page !== undefined) state.page = res.page;
                        if (res.rows !== undefined) state.rows = res.rows;
                        if (res.pages !== undefined) state.pages = res.pages;
                        if (params.limit !== undefined) state.limit = params.limit;
                        if (res.sums !== undefined) state.sums = res.sums;
                        if (autoUpdateState) _this7.state(state);
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
            var _this8 = this;

            var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var list = this._state.all;
            if (list.length > 0 && !refresh) {
                return new _promise2.default(function (resolve, reject) {
                    resolve(list);
                });
            } else {
                return new _promise2.default(function (resolve, reject) {
                    if (!_this8._allPromise || refresh) {
                        _this8._allPromise = _this8.list((0, _extends3.default)({ limit: 10000 }, params), false, false);
                    }
                    _this8._allPromise.then(function (res) {
                        if (res.list) {
                            _this8.state({ all: res.list });
                            resolve(res.list);
                        } else if (res.errCode) {
                            reject(res);
                        }
                    });
                });
            }
        }
    }, {
        key: 'clearAll',
        value: function clearAll() {
            this._state.all = [];
            this._allPromise = undefined;
        }
    }, {
        key: 'getLabels',
        value: function getLabels() {
            var labels = {};
            for (var key in this._fields) {
                labels[key] = _lodash2.default.get(this._fields[key], 'label') || key;
            }
            return labels;
        }
    }, {
        key: 'field',
        value: function field(key) {
            var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            if (value === undefined) return this._fields[key];else {
                this._fields[key] = value;
                return this;
            }
        }
    }, {
        key: 'fields',
        value: function fields() {
            var _fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

            if (_fields === undefined) return this._fields;else {
                (0, _assign2.default)(this._fields, _fields);
                return this;
            }
        }
    }, {
        key: 'getField',
        value: function getField(key) {
            return (0, _extends3.default)({
                key: key
            }, this._fields[key]);
        }
    }, {
        key: 'getFields',
        value: function getFields(columns) {
            var _this9 = this;

            var fields = [];
            if (_lodash2.default.isArray(columns)) {
                columns.map(function (column) {
                    if (_lodash2.default.isString(column) && _this9._fields[column]) {
                        column = (0, _extends3.default)({
                            key: column
                        }, _this9._fields[column]);
                    }
                    if (_lodash2.default.isObject(column)) {
                        if (column.fields) {
                            fields.push((0, _extends3.default)({}, column, {
                                fields: (column.model || _this9).getFields(column.fields)
                            }));
                        } else if (column.key) {
                            var field = (column.model || _this9)._fields[column.key] || {};
                            fields.push((0, _extends3.default)({
                                dataKey: column.key
                            }, field, column));
                        }
                    } else {
                        console.log(column, 'not found');
                    }
                });
            }
            return fields;
        }
    }, {
        key: 'getListShowFields',
        value: function getListShowFields(columns, listFieldConfig) {
            var fields = this.getFields(columns);
            if (!listFieldConfig) {
                return fields;
            } else {
                var listFields = _lodash2.default.get(listFieldConfig, "fields") || [];
                var showFields = {};
                listFields.forEach(function (field) {
                    if (field.is_show) showFields[field.key] = true;
                });
                fields = fields.filter(function (field) {
                    return field.key === "action" || showFields[field.listFieldKey || field.dataKey || field.key];
                });
                fields.forEach(function (field) {
                    field.sort = _lodash2.default.get(showFields[field.listFieldKey || field.dataKey || field.key], "sort", 0);
                });
                fields.sort(function (a, b) {
                    return a.sort - b.sort;
                });
                return fields.length == 1 && fields[0].key === "action" ? [] : fields;
            }
        }
    }, {
        key: 'filterToCond',
        value: function filterToCond() {
            var filterData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._state.filter;

            var cond = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)((0, _entries2.default)(filterData)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

                    var key = _ref2[0];
                    var value = _ref2[1];

                    var field = this._fields[key] || {};
                    if (field.filterCondKey === false) {
                        continue;
                    }
                    var filterKey = field.filterKey || key;
                    var filterCondKey = field.filterCondKey;
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
                            if (filterCondKey && !_lodash2.default.isPlainObject(value)) {
                                _lodash2.default.set(cond, filterKey + '.' + filterCondKey, value);
                            } else {
                                _lodash2.default.set(cond, filterKey, value);
                            }
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
    }, {
        key: 'getData',
        value: function getData(id) {
            return this._state.data[id];
        }
    }, {
        key: 'setColumnWidths',
        value: function setColumnWidths(columnWidths) {
            _storage2.default.local(this.key + ".columnWidths", columnWidths);
        }
    }, {
        key: 'getColumnWidths',
        value: function getColumnWidths(initWidths) {
            return initWidths;
            var cacheWidths = _storage2.default.local(this.key + ".columnWidths") || {};
            if (initWidths === undefined) {
                return cacheWidths;
            }
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)((0, _entries2.default)(initWidths)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _ref3 = _step2.value;

                    var _ref4 = (0, _slicedToArray3.default)(_ref3, 2);

                    var key = _ref4[0];
                    var value = _ref4[1];

                    initWidths[key] = cacheWidths[key] || value;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return initWidths;
        }
    }, {
        key: 'getTree',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                var list, tree;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.getAll();

                            case 2:
                                list = _context.sent;
                                tree = _tool2.default.toTree(list);
                                return _context.abrupt('return', tree);

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getTree() {
                return _ref5.apply(this, arguments);
            }

            return getTree;
        }()
    }, {
        key: 'loadListField',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
                var uri, listFieldParams, res, json;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                uri = App.config().listFieldUri;
                                listFieldParams = this.state().listFieldParams;

                                if (!(uri && listFieldParams)) {
                                    _context2.next = 12;
                                    break;
                                }

                                _context2.next = 5;
                                return App.lib("request").get(uri, listFieldParams);

                            case 5:
                                res = _context2.sent;

                                if (!res.ok) {
                                    _context2.next = 12;
                                    break;
                                }

                                _context2.next = 9;
                                return res.json();

                            case 9:
                                json = _context2.sent;

                                this.state({ listField: json.list[0] });
                                return _context2.abrupt('return', json.list[0]);

                            case 12:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function loadListField() {
                return _ref6.apply(this, arguments);
            }

            return loadListField;
        }()
    }]);
    return Model;
}();

exports.default = Model;