import React, { Component } from 'react';
import {Query} from 'react-apollo';
import {STORIES_QUERY} from './Apollo';
import Story from './Story';

class OtherArticles extends Component {
    removeStory = (stories) => {
        const formattedStories = []
        stories.forEach(story => {
            if (story.id !== this.props.story.id) {
                formattedStories.push(story)
            }
        })
        return formattedStories
    }
    render() {
        return (
            <div>
                <h2>Some other recent posts to explore</h2>
                <Query query={STORIES_QUERY}>
                {({ data, error, loading }) => {
                    if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                    if (error) return <p>Error: {error.message}</p>;
                    return (
                        <div>
                            {this.removeStory(data.stories).sort((a, b) => {a.createdAt-b.createdAt}).slice(0, 3).map(story => <Story story={story} key={story.id}/>)}
                        </div>
                    );
                }}
            </Query>
            </div>
        );
    }
}

export default OtherArticles;