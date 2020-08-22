import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import Founders from '../components/Founders';

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
                <p>For any press enquiries, please email Florence at <a href="mailto: florence@ourstosave.com">florence@ourstosave.com</a>.</p>
                <p>To suggest content or to pitch a feature, please email <a href="mailto: hello@ourstosave.com">hello@ourstosave.com</a>.</p>
                <p>For advertising, business or technology enquiries please email Harry at <a href="mailto: harry@ourstosave.com">harry@ourstosave.com</a>.</p>
                <p>We're generally really responsive on Ours to Save's social media too. Harry never checks his Instagram as much as he should.</p>
                {/* <Founders/> */}
            </Container>
        );
    }
}

export default contact;