import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Provider extends Component {

    static childContextTypes = {
        App: PropTypes.object,
    };

    constructor(props) {
        super(props);
    }

    getChildContext() {
        let App = this.props.App;
        App.requireContext = window.__requireContext__.app;
        return {
            App: App,
        }
    }

    render() {
        return <div>
            {this.props.children}
        </div>
    }

}
