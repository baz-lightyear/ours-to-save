import React, { Component } from 'react';
import {Query} from 'react-apollo';
import styled from 'styled-components';
import {STORIES_QUERY} from './Apollo';
import Story from './Story';
import PromotedStory from './PromotedStory';

const Container = styled.div`
    .break {
        padding: 1rem;
        border-top: solid 1px ${props => props.theme.lightgreen};
        background-color: ${props => props.theme.yellow};
        font-family: ${props => props.theme.serif};
        h3 {
            margin: 0 0 0.5rem 0;
        }
        .boxes {
            display: flex;
            justify-content: space-between;
            min-height: 10rem;
            .box {
                width: 31%;
                border-top: solid 2px ${props => props.theme.lightgreen};
                h4 {
                    margin: 0.5rem 0;
                }
            }
            @media (max-width: 700px) {
                flex-direction: column;
                .box {
                    width: 100%;
                }
            }
        }
    }
    .bottomBreak {
        margin-bottom: 1rem;
    }
    .hide {
        display: none;
    }
`;

class Stories extends Component {
    render() {
        return (
            <Query query={STORIES_QUERY}>
                {({ data, error, loading }) => {
                    if (loading) return <><p>Loading...</p><img src="loading.gif" alt="loading" height="50"/></>;
                    if (error) return <p>Error: {error.message}</p>;
                    return (
                        <Container>
                            {data.stories.slice(0, 3).map(story => <Story story={story} key={story.id}/>)}
                            <div className="topBreak break hide">
                                <h3>Our picks</h3>
                                <div className="boxes">
                                    {data.stories.filter(story => story.ourPick).map(story => <PromotedStory story={story} key={story.id}/>)}
                                </div>
                            </div>
                            {data.stories.slice(3, 6).map(story => <Story story={story} key={story.id}/>)}
                            <div className="midBreak break hide">
                                <h3>Opinion & analysis</h3>
                                <div className="boxes">
                                    {data.stories.filter(story => story.feature).map(story => <PromotedStory story={story} key={story.id}/>)}
                                </div>
                            </div>
                            {data.stories.slice(6, 9).map(story => <Story story={story} key={story.id}/>)}
                            <div className="bottomBreak break hide">
                                <h3>Featured content</h3>
                                <small><em>sponsored</em></small>
                                <div className="boxes">
                                    {data.stories.filter(story => story.sponsored).map(story => <PromotedStory story={story} key={story.id}/>)}
                                </div>
                            </div>
                            {data.stories.slice(9, data.stories.length).map(story => <Story story={story} key={story.id}/>)}
                        </Container>
                    );
                }}
            </Query>
        );
    }
}

export default Stories;