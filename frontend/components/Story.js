import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    text-align: left;
    font-family: ${props => props.theme.serif}
`;
class Story extends Component {
    render() {
        return (
            <Container>
                <h4>{this.props.story.title}</h4>
                <p>{this.props.story.content}</p>
            </Container>
        );
    }
}

export default Story;