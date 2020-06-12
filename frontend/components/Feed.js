import React, { Component } from 'react';
import styled from 'styled-components';
import StoryShow from './StoryShow';
import { InView } from 'react-intersection-observer'


const Container = styled.div`
    margin: auto;
    width: 95%;
    max-width: 800px;
`;

class Feed extends Component {
    render() {
        return (
            <Container>
                <div id="banner">
                    
                </div>
                {this.props.stories.map(story => {
                    return <StoryShow key={story.id} story={story}/>
                })}
                <InView as="div" onChange={(inView, entry) => {
                    inView ? this.props.onLoadMore(this.props.stories[this.props.stories.length - 1].id) : ""
                }}/>
            </Container>
        );
    }
}

export default Feed;