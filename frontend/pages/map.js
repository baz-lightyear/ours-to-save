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
    h2 {
        margin-top: 56px;
    }
    text-align: left;
    width: 90%;
    max-width: 800px;
    margin: auto;
    .mapContainer {
    }
`;

class map extends Component {
    render() {
        return (
            <Container>
                <h1>Tell us what's happening</h1>
                <p>We made this for everyone. By crowdsourcing information on the climate crisis we can create a completely new kind of visual experience - a map that shows how widespread, local and current the climate crisis is.</p>
                <p>So we ask you - yes, you! - to contribute and tell us what's been happening near you. It can be good news, bad news, or somewhere inbetween, just as long as it's focused on climate change.</p>
                <CreateStoryModal/>
                <div className="mapContainer">
                    <Map/>
                </div>
                <h2>Recent posts</h2>
                <Stories/>
                <CreateStoryModal/>
                <br/>
            </Container>
        )
    }
}

export default map;