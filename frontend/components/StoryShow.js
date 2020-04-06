import React, { Component } from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { SINGLE_STORY_QUERY } from './Apollo';

const Container = styled.div`
    width: 90%;
    max-width: 700px;
    margin: auto;
`;

class StoryShow extends Component {
    render() {
        return (
            <Query
                query={SINGLE_STORY_QUERY}
                variables={{
                id: this.props.id,
                }}
            >
                {({ error, loading, data }) => {
                    if (error) return <p>error</p>;
                    if (loading) return <p>Loading...</p>;
                    const story = data.story;
                    return (
                        <Container>
                            <h4>{story.title}</h4>
                            <p>{story.content}</p>
                        </Container>
                    );
                }}
            </Query>
        );
    }
}

export default StoryShow;