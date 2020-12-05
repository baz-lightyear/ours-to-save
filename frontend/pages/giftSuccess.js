import React, { Component } from 'react';
import styled from 'styled-components'
import Link from 'next/link'

const Container = styled.div`
    font-family: ${props => props.theme.serif};
    margin: auto;
    max-width: 1000px;
    width: 95%;
`

class giftSuccess extends Component {
    render() {
        return (
            <Container>
                <h1>Great! We hope they'll love it.</h1>
                <p>Check your email - you should receive an email confirming the order, and another email with special instructions on setting up the gift subscription.</p>
                <p>If you ordered a print to accompany the gift, we'll mail it out to you presently.</p>
                <p><Link href="/">Back to home</Link></p>
            </Container>
        );
    }
}

export default giftSuccess;