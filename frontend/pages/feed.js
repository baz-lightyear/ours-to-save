import React, { Component } from 'react';
import styled from 'styled-components';
import Feed from '../components/Feed';
import { MORE_STORIES_QUERY, FEATURES_QUERY } from '../lib/Apollo';
import Map from '../components/Map';

import {Query} from 'react-apollo';

const Container = styled.div`

`;

class feed extends Component {
    render() {
        return (
            <>
                <Map/>
                <Query query={FEATURES_QUERY}>
                    {({data, error, loading}) => {
                        if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                        if (error) return <p>Error: {error.message}</p>;
                        const features = data.features
                        return (
                            <Query query={MORE_STORIES_QUERY}>
                                {({data, error, loading, fetchMore }) => {
                                    if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                                    if (error) return <p>Error: {error.message}</p>;
                                    const stories = data.moreStories.map((story, i) => {
                                        story.storyIndex = i
                                        return story
                                    })
                                    return (
                                        <Feed 
                                            features={features}
                                            stories={data.moreStories} 
                                            onLoadMore={(cursor) =>
                                                fetchMore({
                                                    query: MORE_STORIES_QUERY,
                                                    variables: { cursor: cursor },
                                                    updateQuery: (previousResult, { fetchMoreResult }) => {
                                                        const moreStories = fetchMoreResult.moreStories 
                                                        return {
                                                            moreStories: [...previousResult.moreStories, ...moreStories]
                                                        }
                                                    }
                                                })
                                            }
                                        />
                                    )
                                }}
                            </Query>
                        )
                    }}
                </Query>
            </>
        )
    }
}

export default feed;