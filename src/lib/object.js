/**
 * Created by zhengzhaowei on 2018/4/24.
 */

export default class object {
    isEqual = (a, b) => {
        //如果a和b本来就全等
        if (a === b) {
            //判断是否为0和-0
            return a !== 0 || 1 / a === 1 / b;
        }
        //判断是否为null和undefined
        if (a == null || b == null) {
            return a === b;
        }
        //接下来判断a和b的数据类型
        var classNameA = toString.call(a),
            classNameB = toString.call(b);
        //如果数据类型不相等，则返回false
        if (classNameA !== classNameB) {
            return false;
        }
        //如果数据类型相等，再根据不同数据类型分别判断
        switch (classNameA) {
            case '[object RegExp]':
            case '[object String]':
                //进行字符串转换比较
                return '' + a === '' + b;
            case '[object Number]':
                //进行数字转换比较,判断是否为NaN
                if (+a !== +a) {
                    return +b !== +b;
                }
                //判断是否为0或-0
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                return +a === +b;
        }
        //如果是对象类型
        if (classNameA == '[object Object]') {
            //获取a和b的属性长度
            var propsA = Object.getOwnPropertyNames(a),
                propsB = Object.getOwnPropertyNames(b);
            if (propsA.length != propsB.length) {
                return false;
            }
            for (var i = 0; i < propsA.length; i++) {
                var propName = propsA[i];
                //如果对应属性对应值不相等，则返回false
                if (a[propName] !== b[propName]) {
                    return false;
                }
            }
            return true;
        }
        //如果是数组类型
        if (classNameA == '[object Array]') {
            if (a.toString() == b.toString()) {
                return true;
            }
            return false;
        }
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