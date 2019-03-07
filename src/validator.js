/**
 * Created by zhengzhaowei on 2017/9/7.
 */
import _ from 'lodash';
import lib from './lib';

let _state = Symbol();
let _scene = Symbol();
export default class Validator {

    rule = {};
    message = {};
    scene = {};
    label = {};
    errorMsg = {};

    defaultMsg = {
        required: '[label]不能为空',
        integer: '[label]必须是整数',
        number: '[label]必须是数字',
        length: '[label]长度必须是[extend]位',
        min: '[label]长度至少[extend]位',
        max: '[label]长度不能超过[extend]位',
        between: '[label]必须在[extend]之间',
        email: '[label]必须是邮箱',
        url: '[label]必须是网址',
        confirm: '[label]不一致',
        ip: '[label]必须是IP地址',
        '>': '[label]必须大于[extend]',
        '>=': '[label]必须大于等于[extend]',
        '<': '[label]必须小于[extend]',
        '<=': '[label]必须小于等于[extend]',
        '==': '[label]不等于[extend]',
        'regex': '[label]正则匹配错误'
    };

    constructor(config = {}) {
        this[_state] = {
            rule: {},
            message: {},
            scene: {}
        };
        this.config(config);
        this[_scene] = false;
    }

    config(config) {
        if (config.rule)
            this.rule = config.rule;
        if (config.message)
            this.message = config.message;
        if (config.scene)
            this.scene = config.scene;
        if (config.label)
            this.label = config.label;
    }

    setState(state) {
        Object.assign(this[_state], state);
        return this;
    }

    setScene(scene) {
        this[_scene] = scene;
        return this;
    }

    setLabel(key, value) {
        if (_.isObject(key)) {
            this.label = {...this.label, ...key};
        } else {
            this.label[key] = value;
        }
        return this;
    }

    /**
     * 解析规则
     * @param config
     * @returns {{}}
     */
    parseRule(config) {
        if (!lib('object').isEmpty(this[_state].rule)) {
            return this[_state].rule;
        }
        let rule = {};
        for (let [key, value] of Object.entries(config)) {
            let [name, label] = key.split('|');
            rule[name] = {
                label: label || this.label[name] || name,
                validates: []
            };
            let values;
            if (lib('object').isArray(value)) {
                values = value;
            } else {
                values = value.split('|');
            }
            values.map((value) => {
                let type, extend;
                if (lib('object').isObject(value)) {
                    type = Object.keys(value)[0];
                    extend = value[type];
                } else {
                    [type, extend] = value.split(':');
                }
                rule[name].validates.push({type: type, extend: extend});
            })
        }
        this.setState({rule: rule});
        return rule;
    }

    /**
     * 解析错误消息
     * @param config
     */
    parseMessage = (config) => {
        if (!lib('object').isEmpty(this[_state].message)) {
            return this[_state].message;
        }
        let message = {};
        for (let [key, value] of Object.entries(config)) {
            let keys = key.split('|');
            keys.map((k) => {
                message[k] = value;
            })
        }
        this.setState({message: message});
        return message;
    };

    /**
     * 解析场景
     * @param config
     */
    parseScene = (config) => {
        if (!lib('object').isEmpty(this[_state].scene)) {
            return this[_state].scene;
        }
        let scene = {};
        for (let [key, value] of Object.entries(config)) {
            let keys = key.split('|');
            keys.map((k) => {
                scene[k] = value;
            })
        }
        this.setState({scene: scene});
        return scene;
    };

    getRule = (key) => {
        let rule = this.parseRule(this.rule);
        return rule[key];
    };

    /**
     * 验证数据
     * @param data
     * @returns {boolean}
     */
    check = (data, scene = this[_scene]) => {
        let keys, flag = true;
        if (scene === false || !this.scene[scene]) {
            keys = Object.keys(data);
        } else {
            keys = this.scene[scene];
        }
        let rule = this.parseRule(this.rule);
        this.errorMsg = {};
        keys.map((key) => {
            if (_.isObject(key)) {
                if (key.isCheck && !key.isCheck(data)) {
                    return;
                }
                key = key.key;
            }
            let validates = rule[key] ? rule[key].validates : [];
            let label = rule[key] ? rule[key].label : '';
            let ret = this.validates(data, key, validates, label);
            if (ret !== true) {
                this.setErrorMsg(key, ret);
                flag = false;
            }
        });
        return flag;
    };

    /**
     * 校验单个值多个规则
     * @param data
     * @param key
     * @param validates
     * @param label
     * @returns {*}
     */
    validates = (data, key, validates, label) => {
        for (let validate of validates) {
            let ret = this.validate(data, key, validate, label);
            if (ret !== true) {
                return ret;
            }
        }
        return true;
    };

    /**
     * 校验单个值单个规则
     * @param data
     * @param key
     * @param validate
     * @returns {*}
     */
    validate = (data, key, validate, label) => {
        let value = _.get(data, key);
        let isEmpty = this.isEmpty(value);
        let valid = true;
        if (validate.type === 'required' && isEmpty) {
            valid = false;
        } else if (!isEmpty) {
            switch (validate.type) {
                case 'length':
                    valid = value.length == validate.extend;
                    break;
                case 'min':
                    valid = value.length < validate.extend;
                    break;
                case 'max':
                    valid = value.length > validate.extend;
                    break;
                case 'email':
                    valid = lib('validate').isEmail(value);
                    break;
                case 'url':
                    valid = lib('validate').isUrl(value);
                    break;
                case 'ip':
                    valid = lib('validate').isIp(value);
                    break;
                case 'integer':
                    valid = lib('validate').isInteger(value);
                    break;
                case 'number':
                    valid = lib('validate').isNumber(value);
                    break;
                case 'regex':
                    let regex;
                    if (lib('object').isRegExp(validate.extend)) {
                        regex = validate.extend;
                    } else {
                        regex = eval(validate.extend);
                    }
                    if (lib('object').isRegExp(regex)) {
                        valid = regex.test(value);
                    }
                    break;
                case 'between':
                    let [min, max] = validate.extend.split(',');
                    if (value < min || value > max) {
                        valid = false;
                    }
                    break;
                case 'confirm':
                    let confirm = data[validate.extend];
                    valid = value === confirm;
                    break;
                case '>':
                case '>=':
                case '<':
                case '<=':
                case '==':
                    valid = eval(value + validate.type + validate.extend);
                    break;
                default:
                    if (lib('object').isFunction(this[validate.type])) {
                        let errorMsg = this[validate.type](value, validate.extend, data, key);
                        if (errorMsg !== true) {
                            return errorMsg;
                        }
                    }
            }
        }
        if (!valid) {
            return this.getErrorMsg(key, label, validate);
        }
        return valid;
    };

    getErrorMsg(key, label, validate) {
        let errorMsg;
        let message = this.parseMessage(this.message);
        if (message[key] && message[key][validate.type]) {
            errorMsg = message[key][validate.type];
        } else {
            errorMsg = this.defaultMsg[validate.type] || '';
            errorMsg = errorMsg.replace('[label]', label);
            if (validate.extend) {
                errorMsg = errorMsg.replace('[extend]', validate.extend);
            }
        }
        return errorMsg;
    }

    setErrorMsg(name, errorMsg) {
        this.errorMsg[name] = errorMsg;
    }

    getError() {
        return Object.assign({}, this.errorMsg);
    }

    isEmpty(value) {
        return value === '' || value === undefined
    }
}
