import React, { Component } from 'react';
import styled from 'styled-components';
import CreateStory from '../components/CreateStory';
import Stories from '../components/Stories';


const Container = styled.div`
    text-align: center;
`;

class stories extends Component {
    render() {
        return (
            <Container>
               here are the stories
               <Stories/>
               <CreateStory/>
            </Container>
        )
    }
}


export default stories;