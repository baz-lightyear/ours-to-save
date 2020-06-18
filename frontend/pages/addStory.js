import React, { Component } from 'react';
import CreateStory from '../components/CreateStory'
import styled from 'styled-components'

const Container = styled.div`
    max-width: 1000px;
    width: 95%;
    margin: 1rem auto;

`;

class addStory extends Component {
    render() {
        return (
            <Container>
                <CreateStory/>
            </Container>
        );
    }
}

export default addStory;