import React, { Component } from 'react';
import styled from 'styled-components';
import Stories from '../components/Stories';
import Map from '../components/Map';
import CreateStoryModal from '../components/CreateStoryModal';

const Container = styled.div`
    h1 {
        font-family: ${props => props.theme.serif};
        text-align: center;
        margin: 1rem 0;
    }
    text-align: left;
    width: 90%;
    max-width: 800px;
    margin: auto;
    .mapContainer {
        margin-bottom: 2rem;
    }
`;

class map extends Component {
    render() {
        return (
            <Container>
                <h1>What in the world is happening?</h1>
                <div className="mapContainer">
                    <Map/>
                </div>
                <CreateStoryModal/>
                <h2>Recent posts</h2>
                <Stories/>
                <CreateStoryModal/>
                <br/>
            </Container>
        )
    }
}

export default map;