import React, { Component } from 'react';
import { Query } from 'react-apollo';
import StoryShow from '../components/StoryShow';
import { SINGLE_STORY_QUERY } from '../components/Apollo';

class story extends Component {
    render() {
        return (
            <Query
                query={SINGLE_STORY_QUERY}
                variables={{
                    id: this.props.query.id,
                }}
            >
            {({ error, loading, data }) => {
                if (error) return <p>error</p>;
                if (loading) return <p>Loading...</p>;
                return (
                    <StoryShow id={this.props.query.id} story={data.story}/>
                )
            }}
            </Query>
        );
    }
}

export default story;