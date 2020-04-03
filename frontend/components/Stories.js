import React, { Component } from 'react';
import {Query} from 'react-apollo';
import {STORIES_QUERY} from './Apollo';
import Story from './Story';

class Stories extends Component {
    render() {
        return (
            <Query query={STORIES_QUERY}>
                {({ data, error, loading }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error: {error.message}</p>;
                    return (
                        <div>
                            {data.stories.map(story => <Story story={story} key={story.id}/>)}
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default Stories;