import React, { Component } from 'react';
import styled from 'styled-components';
import StoryShow from './StoryShow';

const Container = styled.div`

`;

class Feed extends Component {
    render() {
        return (
            <Container>
                {this.props.stories.map(story => {
                    return <StoryShow story={story}/>
                })}

            </Container>
        );
    }
}

export default Feed;