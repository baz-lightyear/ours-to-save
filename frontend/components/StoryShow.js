import React, { Component } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import Moment from 'react-moment';
import {
    EmailShareButton,
    FacebookShareButton,
    InstapaperShareButton,
    LinkedinShareButton,
    RedditShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from "react-share";
import {
    EmailIcon,
    FacebookIcon,
    InstapaperIcon,
    LinkedinIcon,
    RedditIcon,
    TwitterIcon,
    WhatsappIcon,
} from "react-share";
import { SINGLE_STORY_QUERY } from './Apollo';
import MapStoryShow from './MapStoryShow';
import OtherArticles from './OtherArticles';

const Container = styled.div`
    width: 90%;
    max-width: 700px;
    margin: auto;
    min-height: calc(100vh - 125px);
    font-family: ${props => props.theme.serif};
    small {
        font-family: ${props => props.theme.sansSerif};
    }
    .sharing {
        text-align: center;
        .icons {
            margin-bottom: 1rem;
            button {
                &:focus {
                    outline: none;
                }
            }
            svg {
                height: 2rem;
                width: 2rem;
                margin: 4px;
                &:focus {
                    outline: none;
                }
            }
        }
    }
    #image {
        display: block;
        margin: 2rem auto;
        height: 200px;
    }
`;

class StoryShow extends Component {
    render() {
        return (
            <Query
                query={SINGLE_STORY_QUERY}
                variables={{
                id: this.props.id,
                }}
            >
                {({ error, loading, data }) => {
                    if (error) return <p>error</p>;
                    if (loading) return <p>Loading...</p>;
                    const story = data.story;
                    return (
                        <Container>
                            <Head>
                                <meta property="og:url"                content={`${window.location.href}/`} key="url"/>
                                <meta property="og:title"              content={story.title} key="title"/>
                                <meta property="og:description"        content={story.subtitle} key="description"/>
                                <meta property="og:image"              content={story.image} key="image"/>
                                <meta property="og:type"              content="article" key="type"/>

                            </Head>
                            <h1>{story.title}</h1>
                            <small>Posted <Moment date={story.createdAt} format="Do MMM YYYY"/> by {story.author}</small>
                            <br/>
                            {story.image && <img id="image" src={story.image} alt={story.title} />}
                            <p>{story.content}</p>
                            <div className="sharing">
                                <p>Share: </p>
                                <div className="icons">
                                    <EmailShareButton url={window.location.href}><EmailIcon></EmailIcon></EmailShareButton>
                                    <FacebookShareButton url={window.location.href}><FacebookIcon></FacebookIcon></FacebookShareButton>
                                    <TwitterShareButton url={window.location.href}><TwitterIcon></TwitterIcon></TwitterShareButton>
                                </div>
                            </div>
                            <div className="mapContainer">
                                <MapStoryShow story={story}/>
                            </div>
                            <OtherArticles story={story}/>
                        </Container>
                    );
                }}
            </Query>
        );
    }
}

export default StoryShow;