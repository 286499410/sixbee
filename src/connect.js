/**
 * Created by zhengzhaowei on 2018/4/23.
 */
import React, {Component} from 'react';
import _ from 'lodash';
import PubSub from 'pubsub-js';
import storage from './instance/storage';

class Connect extends Component {

    models = [];
    state = {};
    subscribes = [];
    cacheKey = 'pageCache';

    constructor(props) {
        super(props);
        this.models = _.isFunction(props.mapToProps.models) ? props.mapToProps.models(props) : (props.mapToProps.models || []);
        this.state = _.cloneDeep(props.mapToProps.data(props, this.models) || {});
        this.models.map((model) => {
            if (model.subscribe) {
                this.subscribes.push(model.subscribe(() => {
                    if (this._isMounted) {
                        this.setState(_.cloneDeep(props.mapToProps.data(this.props, this.models) || {}));
                    }
                }));
            }
        });
    }

    initData(props) {
        this.state = Object.assign({}, _.cloneDeep(props.mapToProps.data(props, this.models) || {}));
    }

    componentWillReceiveProps(nextProps) {
        this.setState(_.cloneDeep(nextProps.mapToProps.data(nextProps, this.models) || {}));
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this.subscribes.map((subscribe) => {
            PubSub.unsubscribe(subscribe);
        });
        this._isMounted = false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        //数据不变则不重新渲染
        return !(_.isEqual(nextState, this.state) && _.isEqual(nextProps, this.props));
    }

    getCurrentUrl() {
        return window.location.pathname + window.location.search;
    }

    /**
     * 设置页面缓存
     * @param state
     */
    setCacheState = (state, update = true) => {
        if(this.refs.component) {
            let componentState = _.get(this.refs.component, 'state', {});
            let newState = Object.assign({}, componentState, state);
            Object.assign(this.refs.component.state, newState);
            if(update) {
                this.refs.component.forceUpdate();
            }
            let pageCache = storage.session(this.cacheKey) || {};
            let currentUrl = this.getCurrentUrl();
            pageCache[currentUrl] = newState;
            storage.session(this.cacheKey, pageCache);
        }
    };

    /**
     * 获取页面缓存
     * @returns {*|{}}
     */
    getCacheState = (defaultState = {}) => {
        let pageCache = storage.session(this.cacheKey) || {};
        let currentUrl = this.getCurrentUrl();
        return Object.assign(defaultState, pageCache[currentUrl] || {});
    };

    render() {
        let Component = this.props.component;
        return <Component ref="component" {...{...this.props, models: this.models, data: this.state}}
                          setCacheState={this.setCacheState}
                          getCacheState={this.getCacheState}
                          key={window.location.href + Component.toString().split('(')[0]}/>
    }
}

export default (Component, mapToProps) => React.forwardRef((props, ref) => {
    return <Connect ref={ref} {...props} component={Component} mapToProps={mapToProps}/>
});