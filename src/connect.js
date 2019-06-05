/**
 * Created by zhengzhaowei on 2018/4/23.
 */
import React, {Component} from 'react';
import _ from 'lodash';
import PubSub from 'pubsub-js';

class Connect extends Component {

    models = [];
    state = {};
    subscribes = [];

    constructor(props) {
        super(props);
        this.models = _.isFunction(props.mapToProps.models) ? props.mapToProps.models(props) : (props.mapToProps.models || []);
        this.initData(props);
        this.models.map((model) => {
            if(model.subscribe) {
                this.subscribes.push(model.subscribe(() => {
                    if(this._isMounted) {
                        this.setState(_.cloneDeep(props.mapToProps.data(this.props, this.models) || {}));
                    }
                }));
            }
        });
    }

    initData(props) {
        Object.assign(this.state, props.mapToProps.data(props, this.models) || {});
    }

    componentWillReceiveProps(nextProps) {
        this.initData(nextProps);
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
        return !(_.isEqual(nextState, this.state) && _.isEqual(nextProps, this.props))
    }

    render() {
        let Component = this.props.component;
        return <Component {...{...this.props, models: this.models, data: this.state}} key={window.location.href} />
    }
}

export default (Component, mapToProps) => (props) => {
    return <Connect {...props} component={Component} mapToProps={mapToProps}/>
};