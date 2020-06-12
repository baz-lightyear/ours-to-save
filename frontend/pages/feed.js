import React, { Component } from 'react';
import styled from 'styled-components';
import Feed from '../components/Feed';
import HighlightedStory from '../components/HighlightedStory';
import { STORIES_QUERY, MORE_STORIES_QUERY } from '../components/Apollo';
import {Query} from 'react-apollo';

const Container = styled.div`

`;

class feed extends Component {
    render() {
        return (
            <Query query={MORE_STORIES_QUERY}>
                {({data, error, loading, fetchMore }) => {
                    if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                    if (error) return <p>Error: {error.message}</p>;
                    return (
                        <Feed 
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
    }
}

export default feed;