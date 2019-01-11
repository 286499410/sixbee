/**
 * Created by zhengzhaowei on 16/9/6.
 */

import _ from 'lodash';
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
            if(str) {
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

    render = (field, value, data) => {
        switch (field.type) {
            case 'select':
            case 'radio':
                if (_.isArray(field.dataSource)) {
                    let dataSource = field.dataSource;
                    let dataSourceConfig = field.dataSourceConfig || {text: 'text', value: 'value'};
                    let map = {};
                    dataSource.map((data) => {
                        map[data[dataSourceConfig.value]] = data[dataSourceConfig.text];
                    });
                    return map[value];
                } else {
                    return value;
                }
            case 'date':
                if (parseInt(value) > 100000) {
                    return this.date('Y-m-d', value);
                } else {
                    return value;
                }
            case 'time':
                return this.date('H:i', value);
            case 'money':
                return value == 0 ? '' : this.parseMoney(value);
            case 'auto':
                let withData = _.get(data, field.withKey, {});
                let dataSourceConfig = field.dataSourceConfig || {text: 'text', value: 'value'};
                return this.replaceText(dataSourceConfig.text, withData);
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

}