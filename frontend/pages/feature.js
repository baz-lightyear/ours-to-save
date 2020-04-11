import React, { Component } from 'react';
import FeatureShow from '../components/FeatureShow';

class feature extends Component {
    render() {
        return (
            <FeatureShow id={this.props.query.id}/>
        );
    }
}

export default feature;