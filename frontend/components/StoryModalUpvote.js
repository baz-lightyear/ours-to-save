import React, { Component } from 'react';
import styled from 'styled-components';
import { Query, Mutation } from 'react-apollo';
import Swal from 'sweetalert2';
import { CURRENT_USER_QUERY, UPVOTE_STORY } from './Apollo';
import Cookies from 'universal-cookie';

const cookies = new Cookies()

const Container = styled.div`
    width: 10%;
    max-width: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    top: -8px;
    span {
        line-height: 1;
        opacity: 0.7;
    }
    .vote {
        font-size: 2rem;
        cursor: pointer;
        &:hover {
            opacity: 1;
        }
    }
    .voteCount {
        font-size: 1rem;
        font-family: ${props => props.theme.sansSerif};
    }
`;

class StoryModalUpvote extends Component {
    state = {
        countUpvotes: this.props.story.countUpvotes
    }
    upvote = async (me, story, upvoteStory) => {
        if (me) {
            if (me.upvotedStories.map(s => s.id).includes(story.id)) {
                Swal.fire({
                    title: `Already upvoted`,
                    text: `You can only upvote a post once`,
                    icon: 'warning',
                    confirmButtonColor: '#4B4C53',
                })
            } else {
                await upvoteStory({ variables: { storyId: story.id, userId: me.id } });
                const newScore = this.props.story.countUpvotes + 1
                this.setState({countUpvotes: newScore })
            }
        } else {
            Swal.fire({
                title: `Join us`,
                text: `Log in or sign up and you can vote, comment and gain access to special content.`,
                icon: 'warning',
                confirmButtonColor: '#4B4C53',
            })
        }
    }

    render() {
        return (
            <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}>
            {({data, loading, error}) => {
                if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                const me = data.me === null ? null : data.me
                return (
                    <Container>
                        <Mutation mutation={UPVOTE_STORY}>
                            {(upvoteStory, { error, loading }) => (
                            <span className="vote" onClick={() => this.upvote(me, this.props.story, upvoteStory)}>▴</span>
                            )}
                        </Mutation>
                        <span className="voteCount">{this.state.countUpvotes || 0}</span>
                    </Container>
                )   
            }}
            </Query>
        );
    }
}

export default StoryModalUpvote;