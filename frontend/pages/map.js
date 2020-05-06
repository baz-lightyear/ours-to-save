import React, { Component } from 'react';
import styled from 'styled-components';
import Stories from '../components/Stories';
import Map from '../components/Map';
import CreateStoryModal from '../components/CreateStoryModal';
import Kickstarter from '../components/Kickstarter';


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
    }
    #explanation {
        margin-top: 1rem;
    }
`;

class map extends Component {
    render() {
        return (
            <>
            <Container>
                <h1>Tell us what's happening</h1>
                <div className="mapContainer">
                    <Map/>
                </div>
                <div id="explanation">
                    <p>We made this for everyone. By crowdsourcing information on the climate crisis we can create a completely new kind of visual experience - a map that shows how widespread, local and current the climate crisis is.</p>
                    <p>So we ask you - yes, you! - to contribute and tell us what's been happening. Maybe there's a farm near you that's experimenting with an innovative new way to produce food with less energy. Perhaps a law got passed in your area that will help (or hinder) the climate effort. Or maybe a new documentary has aired exposing another side of the crisis.</p>
                    <p>It can be good news, bad news, or somewhere inbetween, just as long as it's focused on climate change. The world wants to hear from you!</p>
                </div>
                
                <CreateStoryModal/>
                <h2>Latest international climate news:</h2>
                <Stories/>
                <CreateStoryModal/>
                <br/>
            </Container>
            </>
        )
    }
}

export default map;