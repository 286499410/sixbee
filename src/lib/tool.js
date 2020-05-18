/**
 * Created by zhengzhaowei on 16/9/6.
 */

import _ from 'lodash';
import object from '../instance/object';

let md5 = require('crypto-js/md5');
let uuid = require('node-uuid');

export default class Tool {

    /**
     * 当前时间戳
     * @returns {Number}
     */
    time = () => {
        let timestamp = new Date().getTime();
        return parseInt(timestamp / 1000);
    };

    /**
     * 日期转时间戳
     * @param str
     * @returns {number}
     */
    strToTime = (str) => {
        return parseInt(this.strToDate(str).getTime() / 1000);
    };

    /**
     * 转成常见日期格式
     * @param date
     */
    dateToStr = (date) => {
        let year = date.getFullYear().toString();
        let month = (date.getMonth() + 1).toString();
        date = date.getDate().toString();
        return year + '-' + month.padStart(2, '0') + '-' + date.padStart(2, '0');
    };

    /**
     * 字符串转Date类型
     * @param str
     * @returns {*}
     */
    strToDate = (str) => {
        if (_.isDate(str)) {
            return str;
        } else if (str === '') {
            return undefined;
        } else if (_.isString(str)) {
            str = str.replace(/-/g, '/');
            return new Date(str);
        } else {
            return undefined;
        }
    };

    /**
     * 日期格式化
     * @param format
     * @param time
     * @returns {*}
     */
    date = (format = 'Y-m-d H:i:s', time = this.time()) => {
        let myDate;
        if (_.isDate(time)) {
            myDate = time;
        } else {
            myDate = new Date();
            myDate.setTime(time * 1000);
        }
        let year = myDate.getFullYear().toString();
        let month = (myDate.getMonth() + 1).toString();
        let date = myDate.getDate().toString();
        let hour = myDate.getHours().toString();
        let minute = myDate.getMinutes().toString();
        let second = myDate.getSeconds().toString();
        let datetime = format;
        datetime = datetime.replace('Y', year);
        datetime = datetime.replace('m', month.padStart(2, '0'));
        datetime = datetime.replace('d', date.padStart(2, '0'));
        datetime = datetime.replace('H', hour.padStart(2, '0'));
        datetime = datetime.replace('i', minute.padStart(2, '0'));
        datetime = datetime.replace('s', second.padStart(2, '0'));
        return datetime;
    };

    /**
     * 字符串,金额转数值
     * @param str
     * @returns {Number}
     */
    parseNumber = (str) => {
        str = (str + '').toString().replace(/,/g, '');
        if (/^-?\d*((\.\d*)?)$/.test(str)) {
            if (str.indexOf('.') == 0) {
                str = 0 + str;
            }
            if (str.indexOf('.') > 0) {
                return parseFloat(str);
            } else {
                return parseInt(str);
            }
        } else {
            return 0;
        }
    };

    /**
     * 数值转千分位格式
     * @param number
     * @param float
     * @returns {*}
     */
    parseMoney = (number, float = 2) => {
        float = parseInt(float);
        if (number === undefined || number === null) {
            return '';
        }
        if (number !== '') {
            number = this.round(this.parseNumber(number), float);
            let groups = (/([\-\+]?)(\d*)(\.\d+)?/g).exec(number.toString()),
                mask = groups[1],            //符号位
                integers = (groups[2] || "").split(""), //整数部分
                decimal = groups[3] || "",       //小数部分
                remain = integers.length % 3;
            let temp = integers.reduce((previousValue, currentValue, index) => {
                if (index + 1 === remain || (index + 1 - remain) % 3 === 0) {
                    return previousValue + currentValue + ",";
                } else {
                    return previousValue + currentValue;
                }
            }, "").replace(/\,$/g, "");
            return mask + temp + (decimal ? (!isNaN(float) ? decimal.padEnd(float + 1, '0') : '') : (float ? '.' + ''.padEnd(float, '0') : ''));
        }
        return number;
    };

    /**
     * 数值,金额转大写中文
     * @param number
     * @returns {*}
     */
    parseChinese = (number) => {
        number = this.parseNumber(number);
        if (isNaN(number) || number >= Math.pow(10, 12)) return '';
        let symbol = number < 0 ? '负' : '';
        let words = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        let units = [
            ['分', '角'],
            ['', '拾', '佰', '仟'],
            ['元', '万', '亿']
        ];
        let splits = number.toString().split(".");
        let [integer, decimal] = splits;
        let chinese = '';
        for (let i = 0; i < 3 && integer; i++) {
            let str = '';
            let length = integer.toString().length;
            for (let j = 0; j < 4 && j < length; j++) {
                let digit = integer % 10;
                integer = parseInt(integer / 10);
                str = words[digit] + (digit > 0 ? units[1][j] : '') + str;
                str = str.replace('零零', '零');
            }
            if (str.lastIndexOf('零') == str.length - 1) {
                str = str.substr(0, str.length - 1);
            }
            if (str) {
                chinese = str + units[2][i] + chinese;
            }
        }
        if (decimal) {
            for (let i = 0; i < 2; i++) {
                if (decimal[i] > 0) {
                    chinese += words[decimal[i]] + units[0][1 - i];
                }
            }
        } else {
            chinese += '整';
        }
        return chinese;
    };

    /**
     * MD5
     * @param str
     */
    md5 = (str) => {
        return md5(str).toString();
    };

    /**
     * 获取鼠标坐标
     * @param event
     * @returns {{x: (Number|number), y: (Number|number)}}
     */
    getMousePosition = (event) => {
        let e = event || window.event;
        let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        let x = e.pageX || e.clientX + scrollX;
        let y = e.pageY || e.clientY + scrollY;
        return {x: x, y: y};
    };

    /**
     * 去除左边空格
     */
    ltrim = (s) => {
        return s.replace(/^[" "|"　"]*/, "");
    };

    /**
     * 去除右边空格
     * @param s
     * @returns {void|XML|string|*}
     */
    rtrim = (s) => {
        return s.replace(/[" "|"　"]*$/, "");
    };

    /**
     * 去除左右空格
     * @param s
     */
    trim = (s) => {
        return this.rtrim(this.ltrim(s));
    };

    /**
     * 随机数
     * @param min
     * @param max
     * @returns {*}
     */
    rand = (min, max) => {
        return min + parseInt(Math.random() * (max - min));
    };

    hash = (data, key, multi = false) => {
        let hash = {};
        data.map((row) => {
            if (row[key] !== undefined) {
                let dataKey = row[key];
                if (multi) {
                    if (!hash[dataKey]) {
                        hash[dataKey] = [];
                    }
                    hash[dataKey].push(row);
                } else {
                    hash[dataKey] = row;
                }
            }
        });
        return hash;
    };

    toTree = (data) => {
        data = _.cloneDeep(data);
        let tree = [];
        let dataHash = this.hash(data, 'id');
        let childrenHash = this.hash(data, 'parent_id', true);
        data.map((row) => {
            if (!dataHash[row.parent_id]) {
                tree.push(row);
            }
        });
        let getChildNodes = (parent) => {
            let childNodes = childrenHash[parent.id] || [];
            childNodes.map((node) => {
                node.children = getChildNodes(node);
            });
            return childNodes;
        };
        tree.map((parent) => {
            parent.children = getChildNodes(parent);
        });
        return tree;
    };

    replaceText = (replaceText, data) => {
        let text = _.get(data, replaceText);
        if (text !== undefined) {
            return text;
        }
        let reg = /\[(\w*)\]/g;
        let textFields = replaceText.match(reg);
        if (_.isArray(textFields)) {
            let ret = undefined;
            textFields.map((field) => {
                let key = field.substr(1, field.length - 2);
                let value = _.get(data, key);
                if (value !== undefined) {
                    ret = replaceText.replace(`[${key}]`, value);
                    replaceText = ret;
                }
            });
            return ret;
        } else {
            return undefined;
        }
    };

    render = (data, column, defaultValue = '') => {
        let key = column.dataKey || column.key;
        let value = _.get(data, key, defaultValue);
        switch (column.type) {
            case 'date':
                return /^\d+$/.test(value) ? this.date(column.format || 'Y-m-d', value) : value;
            case 'time':
                return /^\d+$/.test(value) ? this.date(column.format || 'H:i', value) : value;
            case 'datetime':
                return /^\d+$/.test(value) ? this.date(column.format || 'Y-m-d H:i', value) : value;
            case 'money':
                let float = column.float;
                if (_.isFunction(float)) {
                    float = float();
                }
                return value == 0 && column.showZero !== true ? '' : this.parseMoney(value, float);
            case 'select':
            case 'radio':
                if (_.isArray(column.dataSource)) {
                    let dataSource = column.dataSource;
                    let dataSourceConfig = column.dataSourceConfig || {text: 'text', value: 'value'};
                    let map = {};
                    dataSource.map((data) => {
                        map[data[dataSourceConfig.value]] = data[dataSourceConfig.text];
                    });
                    return map[value];
                } else {
                    return value;
                }
            case 'checkbox':
                if (column.multiple) {
                    let dataSourceConfig = column.dataSourceConfig || {text: 'text', value: 'value'};
                    let texts = [];
                    if (_.isArray(value)) {
                        value.map(row => {
                            return texts.push(row[dataSourceConfig.text]);
                        })
                    }
                    return texts.join(' ');
                } else if (_.isArray(column.dataSource) && column.dataSource.length > 0) {

                } else {
                    return value ? '是' : '否';
                }
            case 'auto':
                if (column.withKey) {
                    let withData = _.get(data, column.withKey, {});
                    let dataSourceConfig = column.dataSourceConfig || {text: 'text', value: 'value'};
                    return this.replaceText(dataSourceConfig.text, withData);
                } else {
                    return value;
                }
            case 'editor':
                return _.isString(value) ? value.replace(/<[^<>]+>/g, "") : '';
            default:
                return value;
        }
    };

    uuid = () => {
        return uuid.v4();
    };

    /**
     * 数字精度
     * @param number
     * @param float
     * @returns {number}
     */
    round = (number, float) => {
        let times = Math.pow(10, float);
        return Math.round(number * times) / times;
    };

    /**
     *
     * @param number
     * @param float
     * @returns {string}
     */
    toFixed = (number, float) => {
        return this.round(number, float).toFixed(float);
    };

    /**
     * 金额计算
     * @param a
     * @param op
     * @param b
     * @returns {number}
     */
    moneyCalc = (a, op, b) => {
        a = this.parseNumber(a);
        b = this.parseNumber(b);
        a = Math.round(a * 100);
        b = Math.round(b * 100);
        return eval(`${a} ${op} ${b}`) / 100;
    };

    /**
     * 数值计算
     * @param a
     * @param op
     * @param b
     * @param float
     * @returns {number}
     */
    numberCalc = (a, op, b, float) => {
        a = Math.round(a);
        b = Math.round(b);
        let value = eval(`${a} ${op} ${b}`);
        return float ? this.round(value, float) : value;
    };

    /**
     * 下一个编码
     * @param code
     * @returns {*}
     */
    nextCode(code) {
        if (code) {
            let match = code.match(/\d*$/);
            if (match) {
                return code.substr(0, match['index']) + (parseInt(match[0]) + 1 + '').padStart(match[0].length, '0');
            }
        }
        return '';
    }

    /**
     * 数据类型
     * @param obj
     * @returns {*}
     */
    objectType(obj) {
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
    }

    objectToKeyValue(obj, namespace, method) {
        let keyValue = {};
        let formKey;
        if (_.isArray(obj)) {
            if (obj.length == 0) {
                keyValue[namespace] = '';
            } else {
                obj.map((item, index) => {
                    if (_.isObject(item) && !(item instanceof File)) {
                        Object.assign(keyValue, this.objectToKeyValue(item, namespace + '[' + index + ']', method));
                    } else {
                        // 若是数组则在关键字后面加上[]
                        keyValue[namespace + '[' + index + ']'] = item;
                    }
                })
            }
        } else {
            for (let property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (namespace) {
                        // 若是对象，则这样
                        formKey = namespace + '[' + property + ']';
                    } else {
                        formKey = property;
                    }
                    // if the property is an object, but not a File,
                    // use recursivity.
                    if (typeof obj[property] === 'object' && obj[property] !== null && !(obj[property] instanceof File)) {
                        // 此处将formKey递归下去很重要，因为数据结构会出现嵌套的情况
                        Object.assign(keyValue, this.objectToKeyValue(obj[property], formKey, method));
                    } else {

                        if ((method || '').toUpperCase() === 'GET') {
                            keyValue[formKey] = (obj[property] === undefined || obj[property] === null) ? '' : obj[property];
                        } else if (obj[property] !== undefined) {
                            keyValue[formKey] = (obj[property] === null) ? '' : obj[property];
                        }

                        // if it's a string or a File object
                        keyValue[formKey] = obj[property];
                    }

                }
            }
        }
        return keyValue;
    }

    objectToFormData(obj, form, namespace) {
        let fd = form || new FormData();
        let formKey;
        if (_.isArray(obj)) {
            if (obj.length == 0) {
                fd.append(namespace, '');
            } else {
                obj.map((item, index) => {
                    if (_.isObject(item) && !(item instanceof File)) {
                        this.objectToFormData(item, fd, namespace + '[' + index + ']');
                    } else {
                        // 若是数组则在关键字后面加上[]
                        fd.append(namespace + '[]', item)
                    }
                })
            }
        } else {
            for (let property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (namespace) {
                        // 若是对象，则这样
                        formKey = namespace + '[' + property + ']';
                    } else {
                        formKey = property;
                    }
                    // if the property is an object, but not a File,
                    // use recursivity.
                    if (typeof obj[property] === 'object' && obj[property] !== null && !(obj[property] instanceof File)) {
                        // 此处将formKey递归下去很重要，因为数据结构会出现嵌套的情况
                        this.objectToFormData(obj[property], fd, formKey);
                    } else {
                        if (obj[property] !== undefined) {
                            fd.append(formKey, (obj[property] === undefined || obj[property] === null) ? '' : obj[property]);
                        }
                        // if it's a string or a File object
                    }
                }
            }
        }
        return fd;
    }

    keySort(data) {
        let entries = Object.entries(data);
        entries.sort((a, b) => {
            return (a[0] + '') > (b[0] + '') ? 1 : -1;
        });
        return entries;
    }

    signStr(data) {
        let signStr = '';
        for (let [key, value] of data) {
            signStr += signStr ? '&' : '';
            signStr += key + '=' + value;
        }
        return signStr;
    }

    isEmpty(value) {
        return object.isEmpty(value);
    }

    /**
     * 合计
     * @param data
     * @param key
     * @param float
     * @param type = money | number
     * @returns {string}
     */
    count = (data, key, float, type = 'money') => {
        let count = 0;
        data.map(row => {
            count += parseFloat(_.get(row, key) || 0);
        });
        return count == 0 ? '' : (type === 'money' ? this.parseMoney(count, float) : this.toFixed(count, float));
    };

    /**
     * 树形转列表
     * @param dataSource
     * @returns {Array}
     */
    treeToList = (dataSource) => {
        let list = [];
        dataSource.map((data) => {
            let current = data;
            let children = [];
            if (data.children && data.children.length > 0) {
                children = this.treeToList(data.children);
            }
            list.push({...current});
            list = list.concat(children);
        });
        return list;
    };

    /**
     * 删除数组中所有对象属性
     * @param arr
     * @returns {Array}
     */
    removeArrObjectProperties = (arr) => {
        let newArr = [];
        arr.map(data => {
            newArr.push(this.removeObjectProperties(data));
        });
        return newArr;
    };

    /**
     * 删除所有对象属性
     * @param data
     */
    removeObjectProperties(data) {
        let newData = _.cloneDeep(data);
        for(let [key, value] of Object.entries(newData)) {
            if(value === null || _.isObject(value)) {
                delete newData[key];
            }
        }
        return newData;
    }

    /**
     * 获取过滤数据
     * @returns {Array}
     */
    getFilteredData(data, ignoreKeys = ['_key']) {
        let filteredData = [];
        data.map(row => {
            let flag = false;
            Object.entries(row).map(([key, val]) => {
                if(ignoreKeys.indexOf(key) < 0) {
                    if(val !== '' && val !== undefined && val !== null && (!_.isArray(val) || val.length > 0)) {
                        flag = true;
                    }
                }
            });
            if(flag) {
                filteredData.push(row);
            }
        });
        return filteredData;
    }

}