import React, { Component } from 'react';
import styled from 'styled-components';
import CreateStory from '../components/CreateStory';
import Stories from '../components/Stories';


const Container = styled.div`
    text-align: center;
    width: 90%;
    max-width: 1000px;
    margin: auto;
    padding-bottom: 1rem;
`;

class stories extends Component {
    render() {
        return (
            <Container>
               <Stories/>
               <CreateStory/>
            </Container>
        )
    }
}


export default stories;