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
            <>
                <Head>
                    <meta property="og:url"                content={`https://www.ourstosave.com/story?id=${this.props.story.id}/`} key="url"/>
                    <meta property="og:title"              content={this.props.story.title} key="title"/>
                    <meta property="og:description"        content={this.props.story.subtitle} key="description"/>
                    <meta property="og:image"              content={this.props.story.image} key="image"/>
                    <meta property="og:type"              content="article" key="type"/>
                </Head>
                <Container>
                    <h1>{this.props.story.title}</h1>
                    <small>Posted <Moment date={this.props.story.createdAt} format="Do MMM YYYY"/> by {this.props.story.author}</small>
                    <br/>
                    {this.props.story.image && <img id="image" src={this.props.story.image} alt={this.props.story.title} />}
                    <p>{this.props.story.content}</p>
                    <div className="sharing">
                        <p>Share: </p>
                        <div className="icons">
                        <EmailShareButton url={window.location.href}><EmailIcon round={true}></EmailIcon></EmailShareButton>
                        <FacebookShareButton url={window.location.href}><FacebookIcon round={true}></FacebookIcon></FacebookShareButton>
                        <TwitterShareButton url={window.location.href}><TwitterIcon round={true}></TwitterIcon></TwitterShareButton>
                        </div>
                    </div>
                    <div className="mapContainer">
                        <MapStoryShow story={this.props.story}/>
                    </div>
                    <OtherArticles story={this.props.story}/>
                </Container>
            </>
        );
    }
}

export default StoryShow;