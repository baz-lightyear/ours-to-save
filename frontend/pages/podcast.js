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
        margin-top: 4rem;
    }
`;



class podcast extends Component {
    render() {
        return (
            <Container>
                <h1>We're really excited to launch our podcast</h1> 
                <p>But it isn't <em>quite</em> ready yet.</p>
                <p>If you'd like to be involved in some way, please email <a href="mailto: harry@ourstosave.com">harry@ourstosave.com</a>.</p>
                <Link href="/">
                    <a><button>back home</button></a>
                </Link>
            </Container>
        );
    }
}

export default podcast;