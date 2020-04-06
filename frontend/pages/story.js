import React, { Component } from 'react';
import StoryShow from '../components/StoryShow';

class story extends Component {
    render() {
        return (
            <StoryShow id={this.props.query.id}/>
        );
    }
}

export default story;