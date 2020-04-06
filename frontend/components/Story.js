import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
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
        color: ${props => props.theme.green}
    }
    a {
        &:hover {
            color: ${props => props.theme.green};
            cursor: pointer;
        }
    }
`;

class Story extends Component {
    render() {
        return (
            <Container>
                <Link href={{pathname: '/story', query: { id: this.props.story.id }}}><h4><a>{this.props.story.title}</a></h4></Link>    
                <small>Posted <Moment date={this.props.story.createdAt} format="Do MMM"/></small> 
                <p>{this.props.story.content}</p>
            </Container>
        );
    }
}

export default Story;