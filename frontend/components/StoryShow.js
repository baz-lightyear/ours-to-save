import React, { Component } from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import Moment from 'react-moment';
import { SINGLE_STORY_QUERY } from './Apollo';
import MapStoryShow from './MapStoryShow';
import OtherArticles from './OtherArticles';

const Container = styled.div`
    width: 90%;
    max-width: 700px;
    margin: auto;
    min-height: calc(100vh - 125px);
    font-family: ${props => props.theme.serif};
    small {
        font-family: ${props => props.theme.sansSerif};
    }
    padding: 1rem;
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
                            <h1>{story.title}</h1>
                            <small>Posted <Moment date={story.createdAt} format="Do MMM"/></small> 
                            <p>{story.content}</p>
                            <div className="mapContainer">
                                <MapStoryShow story={story}/>
                            </div>
                            <OtherArticles story={story}/>
                        </Container>
                    );
                }}
            </Query>
        );
    }
}

export default StoryShow;