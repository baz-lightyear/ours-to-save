import React, { Component } from 'react';
import styled from 'styled-components';
import Stories from '../components/Stories';
import Map from '../components/Map';
import CreateStory from '../components/CreateStory';


const Container = styled.div`
    text-align: left;
    width: 90%;
    max-width: 800px;
    margin: auto;
    .mapContainer {
        margin: 2rem 0;
    }
`;

class map extends Component {
    render() {
        return (
            <Container>
                <div className="mapContainer">
                    <Map/>
                </div>
                <CreateStory/>
                <h2>Recent posts</h2>
                <Stories/>
            </Container>
        )
    }
}

export default map;