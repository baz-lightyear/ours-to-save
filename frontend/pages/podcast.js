import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link'

const Container = styled.div`
    font-family: ${props => props.theme.serif};
    text-align: center;
    max-width: 1000px;
    width: 95%;
    margin: 2rem auto;
    button {
        margin: 1rem;
    }
`;



class podcast extends Component {
    render() {
        return (
            <Container>
                <h1>Listen to our podcast!</h1> 
                <p>It's informative, engaging and a little different. We've made our first episode and we've got loads more coming. Massive thanks to <a href="https://twitter.com/bennaflinn?lang=en">Benedict Flinn</a>, our outstanding host, <strong>Jack Baz</strong> for help with sound design and <a href="https://abigailannaswan.myportfolio.com/" target="_blank">Abigail Anna Swan</a> for beautiful cover art.</p>
                <p>If you'd like to be involved in some way, please email <a href="mailto: podcast@ourstosave.com">podcast@ourstosave.com</a>.</p>
                <a href="https://open.spotify.com/episode/1hSJnKfUAUh20ahWN4Oiba" target="_blank"><button>Listen on Spotify now</button></a>
            </Container>
        );
    }
}

export default podcast;