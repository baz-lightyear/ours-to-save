import React, { Component } from 'react';
import styled from 'styled-components';
import CreateStory from '../components/CreateStory';
import Stories from '../components/Stories';


const Container = styled.div`
    text-align: center;
    width: 90%;
    max-width: 800px;
    margin: auto;
    padding-bottom: 1rem;
`;

class featured extends Component {
    render() {
        return (
            <Container>
               <Stories/>
            </Container>
        )
    }
}


export default featured;