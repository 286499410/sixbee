import App from './index';
import Validator from './validator';

export default class Form {

    /**
     * 场景定义
     */
    _scene = {};

    /**
     * 验证定义
     * @type {{rule: {}, message: {}, scene: {}}}
     */
    _validate = {
        rule: {},
        message: {},
        scene: {}
    };

    _state = {
        scene: false,
        component: undefined,
        validator: undefined,
        model: undefined
    };

    constructor() {}

    _initialize(key) {
        this.model(App.model(key));
        this.validator(new Validator(this._validate));
        this.validator().setLabel(this.model().getLabels());
    }

    /**
     * 绑定UI组件
     * @param Component
     * @returns {*}
     */
    component(Component = undefined) {
        if (Component === undefined)
            return this._state.component;
        else {
            this._state.component = Component;
            return this;
        }
    }

    /**
     * 设置场景
     * @param scene
     * @returns {Form}
     */
    scene(scene = undefined) {
        if (scene === undefined)
            return this._state.scene;
        else {
            this._state.scene = scene;
            return this;
        }
    }

    /**
     * 获取验证器
     * @returns {Validator}
     */
    validator(validator = undefined) {
        if (validator === undefined)
            return this._state.validator;
        else {
            this._state.validator = validator;
        }
    }

    /**
     * 获取model
     * @returns {*}
     */
    model(model = undefined) {
        if (model === undefined)
            return this._state.model;
        else {
            this._state.model = model;
        }
    }

    /**
     * 获取指定场景的定义
     * @param scene
     * @returns {undefined|Array}
     */
    getScene(scene = this._state.scene) {
        console.log(scene, 'teststes');
        for (let key in this._scene) {
            let keys = key.split('|');
            if (keys.indexOf(scene) >= 0) {
                return this._scene[key];
            }
        }
        return undefined;
    }

    /**
     * 表单分组
     * @param scene
     * @returns {*}
     */
    getTabs(scene = this._state.scene) {
        return this._scene[this._state.scene].tabs;
    }

    /**
     * 获取指定场景的字段定义
     * @param scene
     * @returns {Array}
     */
    getFields(scene = this._state.scene) {
        let fields = this._scene[this._state.scene].fields;
        return this.model().getFields(fields);
    }

    /**
     * 获取指定场景的属性
     * @param scene
     * @returns {*}
     */
    getProps(scene = this._state.scene) {
        return this._scene[this._state.scene].props;
    }

    /**
     * 验证数据，正确返回true，错误返回Object错误信息
     * @param data
     * @param scene
     * @returns {boolean|Object}
     */
    check(data, scene = this._state.scene) {
        if (this.validator().check(data, scene)) {
            return true;
        } else {
            return this.validator().getError();
        }
    }

}