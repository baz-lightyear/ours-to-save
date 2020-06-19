import React, { Component } from 'react';
import styled from 'styled-components'
import { timeFromNow } from '../lib/utils'

const Container = styled.div`
    font-family: ${props => props.theme.sansSerif};
    opacity: 0.8;
    .commentHeader {
        display: flex;
        justify-content: space-between;
        p {
            width: 50%;
        }
        .time {
            text-align: right;
        }
    }
    .content {
        padding-left: 1rem;
    }
`;

class Comment extends Component {
    render() {
        return (
            <Container>
                <div className="commentHeader">
                    <p><strong>{this.props.comment.author.name.split(' ')[0]}</strong></p>
                    <p className="time">{timeFromNow(this.props.comment.createdAt)}</p>
                </div>
                <p className="content">{this.props.comment.content}</p>
            </Container>
        );
    }
}

export default Comment;