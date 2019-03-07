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
        let requireContext = require.context('app/', true, /\.js$/);
        let App = this.props.App;
        App.requireContext = requireContext;
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
