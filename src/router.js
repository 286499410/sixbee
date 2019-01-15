/**
 * Created by zhengzhaowei on 2018/5/8.
 */
import React, {Component} from 'react';
import {BrowserRouter, Route, Link, Redirect, Switch, Prompt} from 'react-router-dom';

export default class Router extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return <div>
            <BrowserRouter>
                <Switch>
                    {
                        this.props.route.switch.map((route, index) => (
                            <Route key={index} exact={route.exact} path={route.path} render={(props) => (
                                <Gateway {...props} switch={route}/>
                            )}/>))
                    }
                    <Route path="/" render={(props) => (
                        <Gateway {...props} route={this.props.route}/>
                    )}/>
                </Switch>
            </BrowserRouter>
        </div>
    }
}


class Gateway extends Component {


    render() {
        let props = {...this.props};
        App.history = props.history;
        let middleware = props.switch ? props.switch.middleware : (props.route ? props.route.middleware : []);
        //中间件处理
        if (middleware && middleware.length > 0) {
            for (let name of middleware) {
                let res = App.middleware(name)(props);
                if (res !== true) {
                    return res;
                }
            }
        }
        if (props.switch) {
            if (props.switch.layout) {
                return <props.switch.layout {...props}>
                    <props.switch.component {...props}/>
                </props.switch.layout>;
            }
            return <props.switch.component {...props}/>;
        } else if (props.route) {
            if (props.route.autoMatch) {
                let pathname = props.location.pathname;
                let paths;
                let match = {};
                let query = {};
                pathname = pathname.replace(App.request.getRoot(), '');
                pathname = pathname.replace(/\/*/, '');
                pathname = pathname.replace(/\/*$/, '');
                paths = pathname.split('/');
                match.params = {
                    group: paths[0],
                    model: paths[1],
                    action: paths[2]
                };
                paths.splice(0, 1);
                match.params.view = paths.join('/');
                props.location.search.substr(1).split('&').map((row) => {
                    let [key, value] = row.split('=');
                    if (value !== undefined) {
                        query[key] = value;
                    }
                });
                match.query = query;
                props.match = {...props.match, ...match};
                try {
                    let context;
                    if (App.requireContext[match.params.group]) {
                        context = App.requireContext[match.params.group];
                    } else {
                        context = App.requireContext;
                    }
                    let filename = './' + match.params.group + '/view/' + match.params.view;

                    if (context.keys().indexOf(filename + '.js') >= 0) {
                        filename += '.js';
                    } else {
                        filename += '/index.js';
                    }
                    let Component = context(filename).default;
                    if (props.route.component) {
                        return <props.route.component {...props}>
                            <Component {...props}/>
                        </props.route.component>
                    } else {
                        if (props.route.layout) {
                            let Layout = props.route.layout;
                            return <Layout {...props}><Component {...props}/></Layout>
                        } else {
                            return <Component {...props}/>
                        }
                    }
                } catch (e) {
                    console.log('router error', e);
                    return <Switch>
                        {
                            this.props.route.noMatch.map((route, index) => (
                                <Route key={index} exact={route.exact} path={route.path} render={(nextProps) => {
                                    let Component = route.component;
                                    nextProps.route = props.route;
                                    if (props.route.layout) {
                                        let Layout = props.route.layout;
                                        return <Layout {...nextProps}><Component {...nextProps}/></Layout>
                                    } else {
                                        return <Component {...nextProps}/>
                                    }
                                }}/>)
                            )
                        }
                    </Switch>
                }
            }

        }
    }
}