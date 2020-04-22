import React, { Component } from 'react';
import {Query} from 'react-apollo';
import styled from 'styled-components';
import {STORIES_QUERY} from './Apollo';
import Story from './Story';

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
                            <div className="topBreak break">
                                <h3>Our picks</h3>
                                <div className="boxes">
                                    <div className="box">
                                        <h4>Title</h4>
                                        <p>description that is really quite long and goes into a bit of detail but not quite enough to tell you the whole...</p>
                                    </div>
                                    <div className="box">
                                        <h4>Title</h4>
                                        <p>description that is really quite long and goes into a bit of detail but not quite enough to tell you the whole...</p>
                                    </div>
                                    <div className="box">
                                        <h4>Title</h4>
                                        <p>description that is really quite long and goes into a bit of detail but not quite enough to tell you the whole...</p>
                                    </div>
                                </div>
                            </div>
                            {data.stories.slice(3, 6).map(story => <Story story={story} key={story.id}/>)}
                            <div className="midBreak break">
                                <h3>Opinion & analysis</h3>
                                <div className="boxes">
                                    <div className="box">
                                        <h4>Title</h4>
                                        <p>description that is really quite long and goes into a bit of detail but not quite enough to tell you the whole...</p>
                                    </div>
                                    <div className="box">
                                        <h4>Title</h4>
                                        <p>description that is really quite long and goes into a bit of detail but not quite enough to tell you the whole...</p>
                                    </div>
                                    <div className="box">
                                        <h4>Title</h4>
                                        <p>description that is really quite long and goes into a bit of detail but not quite enough to tell you the whole...</p>
                                        <small><em>sponsored content</em></small>
                                    </div>
                                </div>
                            </div>
                            {data.stories.slice(6, 9).map(story => <Story story={story} key={story.id}/>)}
                            <div className="bottombreak break">
                                <h3>Featured content</h3>
                                <small><em>sponsored</em></small>
                                <div className="boxes">
                                    <div className="box">
                                        <h4>Title</h4>
                                        <p>description that is really quite long and goes into a bit of detail but not quite enough to tell you the whole...</p>
                                    </div>
                                    <div className="box">
                                        <h4>Title</h4>
                                        <p>description that is really quite long and goes into a bit of detail but not quite enough to tell you the whole...</p>
                                    </div>
                                    <div className="box">
                                        <h4>Title</h4>
                                        <p>description that is really quite long and goes into a bit of detail but not quite enough to tell you the whole...</p>
                                    </div>
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