import React, { Component } from 'react';
import styled from 'styled-components';
import CreateStory from '../components/CreateStory';
import Stories from '../components/Stories';
import Features from '../components/Features';
import Kickstarter from '../components/Kickstarter';


const Container = styled.div`
    text-align: center;
    width: 90%;
    max-width: 840px;
    margin: auto;
    padding-bottom: 1rem;
    h1 {
        font-family: ${props => props.theme.serif};
    }
`;

class featured extends Component {
    render() {
        return (
            <>
            <Kickstarter/>
            <Container>
               <h1>The latest analysis & opinion on the climate crisis</h1>
               <Features/>
            </Container>
            </>
        )
    }
}


export default featured;