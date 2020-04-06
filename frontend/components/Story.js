import React, { Component } from 'react';
import styled from 'styled-components';
import Moment from 'react-moment';

const Container = styled.div`
    text-align: left;
    font-family: ${props => props.theme.serif};
    /* border-bottom: solid 1px ${props => props.theme.lightgreen}; */
    border-top: solid 1px ${props => props.theme.lightgreen};
    h4 {
        margin-bottom: 0;
    }
    small {
        font-family: ${props => props.theme.sansSerif};
        color: ${props => props.theme.darkgreen}
    }
`;

class Story extends Component {
    render() {
        return (
            <Container>
                <h4>{this.props.story.title}</h4>
                <small>Posted <Moment date={this.props.story.createdAt} format="Do MMM"/></small> 
                <p>{this.props.story.content}</p>
            </Container>
        );
    }
}

export default Story;