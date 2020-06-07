import React, { Component } from 'react';
import styled from 'styled-components';
import Feed from '../components/Feed';
import HighlightedStory from '../components/HighlightedStory';
import { STORIES_QUERY } from '../components/Apollo';
import {Query} from 'react-apollo';


const Container = styled.div`

`;

class feed extends Component {
    render() {
        return (
            <Query query={STORIES_QUERY}>
                {({data, error, loading}) => {
                    if (error) return <p style={{textAlign: "center", margin: "1rem"}}>Error</p>
                    if (loading) return <p style={{textAlign: "center", margin: "1rem"}}>Loading</p>
                    if (data) {
                        const stories = data.stories
                        return (
                            <Container>
                                <Feed stories={stories}/>
                            </Container>
                        )
                    }
                }}
            </Query>
        );
    }
}

export default feed;