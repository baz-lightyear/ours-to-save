import React, { Component } from 'react';
import styled from 'styled-components';
import Stories from '../components/Stories';

const Container = styled.div`
    text-align: center;
`;

class map extends Component {
    render() {
        return (
            <Container>
               <h2>here is a map</h2>
               <h2>Here are some stories</h2>
               <Stories/>
            </Container>
        )
    }
}

export default map;