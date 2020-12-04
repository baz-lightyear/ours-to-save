import React, { Component } from 'react';
import Products from './Products.js';
import styled from 'styled-components';

const Container = styled.div`
`

class Subscribe extends Component {
    render() {
        return (
            <Container>
                <h1>Subscribe!</h1>
                <h2>The pitch and the promise</h2>
                <p>yadda</p>
                <Products me={this.props.me} referred={this.props.referred} referrerId={this.props.referrerId}/>
                <h2>The sample</h2>
                <p>yadda</p>
                <Products me={this.props.me} referred={this.props.referred} referrerId={this.props.referrerId}/>
            </Container>
        );
    }
}

export default Subscribe;
