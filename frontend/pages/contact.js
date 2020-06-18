import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link'

const Container = styled.div`
    font-family: ${props => props.theme.serif};
    text-align: center;
    margin: 2rem;
    button {
        margin-top: 4rem;
    }
`;



class contact extends Component {
    render() {
        return (
            <Container>
                <h1>Get in touch</h1> 
                <p>For any press enquiries, to suggest content or to pitch a feature, please email Florence at <a href="mailto: florence@ourstosave.com">florence@ourstosave.com</a>.</p>
                <p>For advertising enquiries or business queries please email Harry at <a href="mailto: harry@ourstosave.com">harry@ourstosave.com</a>.</p>
                <p>We're generally really responsive on Ours to Save's social media too. Harry never checks his Instagram as much as he should.</p>
            </Container>
        );
    }
}

export default contact;