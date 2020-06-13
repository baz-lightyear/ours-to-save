import React, { Component } from 'react';
import styled from 'styled-components';
import StoryShow from './StoryShow';
import { InView } from 'react-intersection-observer'


const Container = styled.div`
    margin: auto;
    max-width: 800px;
    width: 95%;
    /* position: relative;
    top: -3rem;
    background-color: ${props => props.theme.offWhite};
    padding: 1rem; */
    #feedHeader {
        text-align: center;
    }

`;

class Feed extends Component {
    render() {
        return (
            <Container>
                <div id="feedHeader">
                    <h2>Live, crowdsourced news feed</h2>
                    <p>The front page of climate change, in real time.</p>
                    <p>Add here</p>
                </div>
                {this.props.stories.map((story, i) => {
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