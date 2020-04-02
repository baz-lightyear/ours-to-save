import React, { Component } from 'react';
import {Query} from 'react-apollo';
import {STORIES_QUERY} from './Apollo';

class Stories extends Component {
    render() {
        return (
            <Query query={STORIES_QUERY}>
                {({ data, error, loading }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error: {error.message}</p>;
                    console.log('here is the data')
                    return (
                        <div>
                            {data.stories.map(story => <p>{story.title} - {story.content}</p>)}
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default Stories;