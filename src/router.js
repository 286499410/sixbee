/**
 * Created by zhengzhaowei on 2018/5/8.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {BrowserRouter, Route, Link, Redirect, Switch, Prompt} from 'react-router-dom';

export default class Router extends Component {

    static contextTypes = {
        App: PropTypes.object,
    };

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
                                <Gateway {...props} switch={route} route={this.props.route}/>
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

    static contextTypes = {
        App: PropTypes.object,
    };

    getLayout(route) {
        return route.layout !== false ? route.layout || this.props.route.layout : false;
    }

    setDocumentTitle(props) {
        if (props.route.titles) {
            if (props.route.titles[location.pathname]) {
                document.title = props.route.titles[location.pathname];
            } else if (props.route.titles['_default']) {
                document.title = props.route.titles['_default'];
            }
        }
    }

    setQuery(props) {
        let match = {};
        let query = {};
        props.location.search.substr(1).split('&').map((row) => {
            let [key, value] = row.split('=');
            if (value !== undefined) {
                query[key] = value;
            }
        });
        match.query = query;
        props.match = {...props.match, ...match};
    }

    render() {
        let props = {...this.props};
        let App = this.context.App;
        App.history = props.history;
        let middleware = props.switch && props.switch.middleware ? props.switch.middleware : (props.route ? props.route.middleware : []);
        //中间件处理
        if (middleware && middleware.length > 0) {
            for (let name of middleware) {
                let res = App.middleware(name)(props);
                if (res !== true) {
                    return res;
                }
            }
        }

        this.setDocumentTitle(props);

        this.setQuery(props);

        if (props.switch) {
            //自定义的路由匹配
            let Layout = this.getLayout(props.switch);
            if (Layout) {
                return <Layout {...props}>
                    <props.switch.component {...props}/>
                </Layout>;
            }
            return <props.switch.component {...props}/>;
        } else if (props.route) {
            if (props.route.autoMatch) {
                //按路径规则自动匹配
                let pathname = props.location.pathname;
                let paths;
                let match = {};
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
                    let Layout = props.route.layout;
                    if (Layout) {
                        return <Layout {...props}><Component {...props}/></Layout>
                    } else {
                        return <Component {...props}/>
                    }
                } catch (e) {
                    console.log('route not found:' + props.location.pathname, e);
                }
            }
            return <Switch>
                {
                    this.props.route.noMatch.map((route, index) => (
                        <Route key={index} exact={route.exact} path={route.path} render={(nextProps) => {
                            let Component = route.component;
                            nextProps.route = props.route;
                            let Layout = this.getLayout(route);
                            if (Layout) {
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