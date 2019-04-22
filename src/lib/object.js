/**
 * Created by zhengzhaowei on 2018/4/24.
 */
import _ from 'lodash';

export default class object {
    isEqual = (a, b) => {
        return _.isEqual(a, b);
    };

    isEmpty = (obj) => {
        let type = this.type(obj);
        return obj === '' || type == 'null' || type == 'undefined' || this.isEqual(obj, {});
    };

    isNull = (obj) => {
        return this.type(obj) == 'null';
    };

    isUndefined = (obj) => {
        return this.type(obj) == 'undefined';
    };

    isArray = (obj) => {
        return this.type(obj) == 'array';
    };

    isObject = (obj) => {
        return this.type(obj) == 'object';
    };

    isBoolean = (obj) => {
        return this.type(obj) == 'boolean';
    };

    isNumber = (obj) => {
        return this.type(obj) == 'number';
    };

    isString = (obj) => {
        return this.type(obj) == 'string';
    };

    isFunction = (obj) => {
        return this.type(obj) == 'function';
    };

    isDate = (obj) => {
        return this.type(obj) == 'date';
    };

    isRegExp = (obj) => {
        return this.type(obj) == 'regExp';
    };

    isElement = (obj) => {
        return this.type(obj) == 'element';
    };

    type = (obj) => {
        //tostring会返回对应不同的标签的构造函数
        let toString = Object.prototype.toString;
        let map = {
            '[object Boolean]': 'boolean',
            '[object Number]': 'number',
            '[object String]': 'string',
            '[object Function]': 'function',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object RegExp]': 'regExp',
            '[object Undefined]': 'undefined',
            '[object Null]': 'null',
            '[object Object]': 'object'
        };
        if (typeof Element != 'undefined' && obj instanceof Element) {
            return 'element';
        }
        return map[toString.call(obj)];
    };

    deepCopy = (obj) => {
        return JSON.parse(JSON.stringify(obj));
    };

    get = (obj, key, defaultValue = undefined) => {
        let keys = key.split('.');
        let value = obj;
        for (let key of keys) {
            if (value[key]) {
                value = value[key];
            } else {
                return defaultValue;
            }
        }
        return Object.is(value, obj) ? defaultValue : value;
    };

    set = (obj, key, value) => {
        let keys = key.split('.');
        for (let i = 0; i < keys.length - 1; i++) {
            if (obj[keys[i]]) {
                obj = obj[keys[i]];
            } else {
                obj = obj[keys[i]] = {};
            }
        }
        obj[keys[keys.length - 1]] = value;
    };
}