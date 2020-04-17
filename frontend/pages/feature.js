import React, { Component } from 'react';
import FeatureShow from '../components/FeatureShow';

class feature extends Component {
    render() {
        return (
            <FeatureShow id={this.props.query.id} title={this.props.query.title} subtitle={this.props.query.subtitle} image={this.props.query.image}/>
        );
    }
}

export default feature;