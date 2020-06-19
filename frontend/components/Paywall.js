import React, { Component } from 'react';
import styled from 'styled-components';
import LoginModal from './LoginModal'

const Container = styled.div`
    font-family: ${props => props.theme.sansSerif};
    background-color: ${props => props.theme.yellow};
    border-radius: 4px;
    padding: 0.5rem;
    padding-bottom: 1.5rem;
    text-align: center;
    h3 {
        font-weight: normal;
        margin: 1rem;
    }
`;

class Paywall extends Component {
    render() {
        return (
            <>
            <p>...</p>
            <Container>
                <h3>To read the rest of this article, log in or create a free account - it only takes a moment.</h3>
                <LoginModal>log in / sign up</LoginModal>
            </Container>
            </>
        );
    }
}

export default Paywall;