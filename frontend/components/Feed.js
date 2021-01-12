import React, { Component } from 'react';
import styled from 'styled-components';
import StoryShow from './StoryShow';
import { InView } from 'react-intersection-observer'
import Link from 'next/link'


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
        const features = this.props.features
        return (
            <Container>
                <div id="feedHeader">
                    <h2>Crowdsourced climate news</h2>
                    <p>The front page of the climate crisis.</p>
                    <p>Add <Link href="/addStory"><a>here</a></Link>.</p>
                </div>
                {this.props.stories.map((element, i) => {
                    if (i % 3 === 0 && features.length > 1) {
                        const feature = features[0]
                        features.shift()
                        return <StoryShow key={element.id} story={element} feature={feature}/>
                    } else {
                        return <StoryShow key={element.id} story={element}/>
                    }
                })}
                <InView as="div" onChange={(inView, entry) => {
                    inView ? this.props.onLoadMore(this.props.stories[this.props.stories.length - 1].id) : ""
                }}/>
            </Container>
        );
    }
}

export default Feed;