/**
 * Created by zhengzhaowei on 2018/4/23.
 */

import _ from 'lodash';
import PubSub from 'pubsub-js';
import tool from './instance/tool';
import Curd from './lib/curd';

let state = Symbol();
let observerKey = Symbol();
let observers = Symbol();

export default class Model {

    symbols = {
        state: state,
        observerKey: observerKey,
        observers: observers
    };

    key;
    fields = {};

    constructor(key) {
        this.key = key;
        [this.group, this.name] = key.split('.');
        this[state] = this.getInitialState();
        this[observerKey] = tool.uuid();
        this[observers] = [];
        this.Curd = new Curd(key);
    }

    getStateSymbol() {
        return state;
    }

    getInitialState() {
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
        }
    }

    getState(key) {
        if (key === undefined) {
            return Object.assign({}, this[state]);
        } else {
            return _.get(this[state], key);
        }
    }

    setState(nextState, publish = true) {
        Object.assign(this[state], nextState);
        if (publish) {
            this.publish(this[state]);
        }
    }

    /**
     * 订阅事件
     * @param fn
     * @returns {Function}
     */
    subscribe(fn) {
        let token = PubSub.subscribe(this[observerKey], fn);
        this[observers].push(token);
        return () => {
            this.unsubscribe(token);
        };
    };

    /**
     * 触发订阅事件
     * @param data
     */
    publish(data = {}) {
        if (this[observers] && this[observers].length > 0) {
            PubSub.publish(this[observerKey], data);
        }
    };

    /**
     * 取消订阅
     * @param token
     */
    unsubscribe(token = null) {
        if (token) {
            PubSub.unsubscribe(token);
        } else {
            this[observers].map((token) => {
                PubSub.unsubscribe(token);
            });
        }
    };

    /**
     * 新增数据
     * @param data
     * @returns {Promise<any>}
     */
    create(data) {
        return new Promise((resolve, reject) => {
            this.Curd.create(data).then((res) => {
                if (res.requestId && res.createId) {
                    resolve(res);
                } else if (res.errCode) {
                    reject(res);
                }
            }, (res) => {
                reject(res);
            });
        });
    };

    /**
     * 更新数据
     * @param id
     * @param data
     * @returns {Promise<any>}
     */
    update(id, data) {
        return new Promise((resolve, reject) => {
            this.Curd.update(id, data).then((res) => {
                if (res.errCode) {
                    reject(res);
                } else if (res.requestId) {
                    resolve(res);
                }
            }, (res) => {
                reject(res);
            });
        });
    };

    /**
     * 删除数据
     * @param params
     * @returns {Promise<any>}
     */
    delete(params) {
        return new Promise((resolve, reject) => {
            this.Curd.delete(params).then((res) => {
                if (res.errCode) {
                    reject(res);
                } else if (res.requestId) {
                    resolve(res);
                }
            }, (res) => {
                reject(res);
            });
        });
    };

    /**
     * 读指定ID的单条数据
     * @param id
     * @param params
     * @returns {Promise<any>}
     */
    read(id, params = {}) {
        let currentState = this.getState();
        if (currentState.detailWith && !params.with) {
            params.with = currentState.detailWith
        }
        return new Promise((resolve, reject) => {
            this.Curd.read(id, params).then((res) => {
                if (res.single && res.single.id) {
                    this[state].data[res.single.id] = res.single;
                    this.setState({});
                    resolve(res);
                } else if (res.errCode) {
                    reject(res);
                }
            }, (res) => {
                reject(res);
            });
        });
    };

    /**
     * 读单条数据
     * @param params
     * @returns {Promise<any>}
     */
    single(params) {
        return new Promise((resolve, reject) => {
            this.Curd.single(params).then((res) => {
                if (res.id) {
                    this[state].data[res.id] = res;
                    this.setState({});
                    resolve(res);
                } else if (res.errCode) {
                    reject(res);
                }
            }, (res) => {
                reject(res);
            });
        });
    };

    /**
     * 读多条数据
     * @param params
     * @returns {Promise<any>}
     */
    list(params = {}) {
        let currentState = this.getState();
        params = Object.assign({
            field: currentState.field,
            page: currentState.page,
            limit: currentState.limit,
            order: currentState.order,
            with: currentState.with,
            cond: _.merge({}, currentState.cond, this.filterToCond())
        }, params);
        if (currentState.sum) {
            params.sum = currentState.sum
        }
        return new Promise((resolve, reject) => {
            this.Curd.list(params).then((res) => {
                if (res.list) {
                    if (res.page) this[state].page = res.page;
                    if (res.rows) this[state].rows = res.rows;
                    if (res.pages) this[state].pages = res.pages;
                    if (params.limit) this[state].limit = params.limit;
                    if (res.sums) this[state].sums = res.sums;
                    this.setState({list: res.list});
                    resolve(res);
                } else if (res.errCode) {
                    reject(res);
                }
            }, (res) => {
                reject(res);
            });
        });
    };

    /**
     * 读全部数据
     * @param refresh
     * @returns {Promise<any>}
     */
    getAll(refresh = false) {
        let list = this.getState('list');
        if (list.length > 0 && !refresh) {
            return new Promise((resolve, reject) => {
                resolve(list)
            });
        } else {
            return new Promise((resolve, reject) => {
                if (!this.allPromise || refresh) {
                    this.allPromise = this.list({limit: 1000});
                }
                this.allPromise.then((res) => {
                    resolve(res.list)
                });
            });
        }
    }

    setData = (data) => {
        if (!this[state].data) {
            this[state].data = {};
        }
        Object.assign(this[state].data, data);
        this.setState({});
    };

    getData = (key) => {
        return this[state].data[key];
    };

    getValidator = () => {
        return App.validate(this.key);
    };

    getField = (key) => {
        return this.fields[key] || {}
    };

    getFields = (columns) => {
        let fields = [];
        columns.map((column) => {
            if (_.isObject(column)) {
                if (column.fields) {
                    fields.push({
                        ...column,
                        fields: this.getFields(column.fields)
                    });
                } else if (column.key) {
                    let field = column.model ? column.model.getField(column.key) : this.getField(column.key);
                    fields.push({
                        dataKey: column.key,
                        ...field,
                        ...column
                    });
                }
            } else if (this.fields[column]) {
                fields.push({
                    key: column,
                    dataKey: column,
                    ...this.fields[column]
                });
            } else {
                console.log(column, 'not found')
            }
        });
        return fields;
    };

    /**
     * 过滤数据转查询条件
     * @param filterData
     */
    filterToCond(filterData = this[state].filter) {
        let cond = {};
        for (let [key, value] of Object.entries(filterData)) {
            let field = this.fields[key] || {};
            if (field.filterCondKey === false) {
                continue;
            }
            let filterKey = field.filterKey || key;
            let filterCondKey = field.filterCondKey || '=';
            if (value !== undefined && value !== '' && value !== null) {
                _.set(cond, filterKey, {});
                if (filterCondKey == 'between') {
                    let [start, end] = value.toString().split(',');
                    if (start === '' && end !== '') {
                        _.set(cond, filterKey + '.<=', end);
                    } else if (start !== '' && end === '') {
                        _.set(cond, filterKey + '.>=', start);
                    } else {
                        _.set(cond, filterKey + '.' + filterCondKey, value);
                    }
                } else {
                    _.set(cond, filterKey + '.' + filterCondKey, value);
                }
            }
        }
        return cond;
    }

}