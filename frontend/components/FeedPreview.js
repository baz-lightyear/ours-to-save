import React, { Component } from 'react';
import { FEED_PREVIEW_QUERY } from '../components/Apollo';
import {Query} from 'react-apollo';
import styled from 'styled-components';
import Moment from 'react-moment';
import Link from 'next/link';

const Container = styled.div`
    width: 40%;
    background-color: #fbfbfb;
    border: solid 1px ${props => props.theme.lightgreen};
    max-height: 70vh;
    position: relative;
    overflow: hidden;
    margin-left: 0.5rem;
    &:hover {
        box-shadow: 0px 0px 4px rgba(100,100,100,0.3);
    }
    a {
        text-decoration: none;
        color: ${props => props.theme.black};
    }
    .title {
        margin: 0.5rem;
        margin-bottom: 1rem;
        color: ${props => props.theme.green}
    }
    .stories {
        border-left: solid 4px ${props => props.theme.green};
        padding: 0 1rem;
        margin-left: 1rem;
        .story {
            margin-bottom: 1rem;
            position: relative;
            top: -4px;
            img {
                position: absolute;
                left: -28px;
                top: 3px;
                height: 20px;
            }
            .date {
                opacity: 0.5;
                display: flex;
                justify-content: space-between;
            }
            .storyTitle {
                font-family: ${props => props.theme.serif};
            }
        }
    }
    .link {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #fbfbfb;
        box-shadow: 0px -4px 10px rgba(100,100,100,0.3);
        margin: 0;
        text-align: center;
        padding: 0.5rem;
        color: ${props => props.theme.green}
    }
`

class FeedPreview extends Component {
    render() {
        return (
            <Query query={FEED_PREVIEW_QUERY}>
                {({data, error, loading}) => {
                    if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                    if (error) return <p>Error: {error.message}</p>;
                    const stories = data.feedPreview
                    return (
                        <Container>
                            <Link href="/feed">
                                <a>
                                    <p className="title"><strong>LATEST FROM THE FEED</strong></p>
                                    <div className="stories">
                                        {stories.map(story => {
                                            return (
                                                <div key={story.id} className="story">
                                                    <img src="previewCircle.svg" alt="red circle"/>
                                                    <p className="date">
                                                        <Moment date={story.createdAt} format="hh:mm"/>
                                                        <Moment date={story.createdAt} format="DD MMM"/>
                                                    </p>
                                                    <p className="storyTitle">{story.title}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <p className="link"><strong>SEE ALL ON FEED</strong></p>
                                </a>
                            </Link>
                        </Container>
                    )
                }}
            </Query>
        );
    }
}

export default FeedPreview;