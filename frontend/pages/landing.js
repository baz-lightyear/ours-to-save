import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    text-align: center;
`;

class landing extends Component {
    render() {
        return (
            <Container>
                <h1>It's ours to save.</h1>
                <p>The planet is at breaking point. But there is hope.</p>
                <p><em>ours to save</em> is a new journalism initiative to keep track of climate-related news from across the globe.</p>
            </Container>
        );
    }
}

export default landing;