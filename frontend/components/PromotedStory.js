import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    width: 31%;
    border-top: solid 2px ${props => props.theme.lightgreen};
    h4 {
        margin: 0.5rem 0;
    }
    @media (max-width: 700px) {
        width: 100%;
    }
`;

class PromotedStory extends Component {
    render() {
        return (
            <Container>
                <h4>{this.props.story.title}</h4>
                <p>{JSON.parse(this.props.story.content)[0].children[0].text.substring(0, 120)}{JSON.parse(this.props.story.content)[0].children[0].text.length > 120 ? "..." : ""}</p>
            </Container>
        );
    }
}

export default PromotedStory;