import React, { Component, Fragment } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import Moment from 'react-moment';
import {Helmet} from 'react-helmet';
import {
    EmailShareButton,
    FacebookShareButton,
    TwitterShareButton,
} from "react-share";
import {
    EmailIcon,
    FacebookIcon,
    TwitterIcon,
} from "react-share";
import OtherArticles from './OtherArticles';

const Container = styled.div`
    width: 95%;
    max-width: 700px;
    margin: auto;
    min-height: calc(100vh - 125px);
    font-family: ${props => props.theme.serif};
    padding: 1rem;
    .banner {
        height: 50vh;
        position: absolute;
        left: 0;
        top: 80px;
        width: 100vw;
        background-position: calc(50%) 50%;
        background-size: cover;
        background-attachment: fixed;
        .opacityBanner {
            width: 100%;
            height: 100%;
            background: linear-gradient(0deg, rgba(15,41,41,1) 0%, rgba(255,255,255,0) 70%);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 1rem 2rem;
        }
        h1, h3 {
            color: ${props => props.theme.offWhite};
        }
    }
    .filler {
        height: 50vh
    }
    .date {
        text-align: right;
        margin-bottom: 0;
    }
    .author {
        text-align: right;
        margin-bottom: 1rem;
    }
    .paragraph {
        text-align: justify;
        margin-bottom: 2rem;
    }
    .link {
        text-decoration: none;
        color: ${props => props.theme.green};
        opacity: 0.7;
        font-weight: 700;
        &:hover {
            opacity: 1;
        }
    }
    blockquote {
        margin: 1rem;
        padding: 1rem;
        font-size: 1.5rem;
        border-left: solid 4px ${props => props.theme.green};
        background-color: rgba(52, 144, 148, 0.2)
    }
    .bio {
        margin-top: 2rem;
        text-align: right;
    }
    #topSharing {
        border-bottom: solid 2px ${props => props.theme.green};
        margin-bottom: 2rem;
    }
    #bottomSharing {
        border-bottom: solid 2px ${props => props.theme.green};
        border-top: solid 2px ${props => props.theme.green};
        padding-top: 1rem;
        margin-top: 2rem;
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
    .image {
        display: block;
        margin: 2rem auto;
        width: 90%;
    }
    .otherArticles {
        margin-top: 2rem;
    }
`;


class FeatureShow extends Component {
    render() {
        return (
            <Container>
                <div className="banner" style={{backgroundImage: `url(${this.props.feature.featuredImage})`}}>
                    <div className="opacityBanner">
                        <h1>{this.props.feature.title}</h1>
                        <h3 className="subtitle"><em>{this.props.feature.subtitle}</em></h3>
                    </div>
                </div>
                <div className="filler"></div>
                <p className="date"><Moment date={this.props.feature.createdAt} format="Do MMM YYYY"/></p>
                <p className="author">{this.props.feature.author}</p>
                <div className="sharing" id="topSharing">
                    <p>Share this article: </p>
                    <div className="icons">
                        <EmailShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><EmailIcon round={true}></EmailIcon></EmailShareButton>
                        <FacebookShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><FacebookIcon round={true}></FacebookIcon></FacebookShareButton>
                        <TwitterShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><TwitterIcon round={true}></TwitterIcon></TwitterShareButton>
                    </div>
                </div>
                {JSON.parse(this.props.feature.content).map((element, index) => {
                    if (element.type === "paragraph") {
                        return (
                            <p key={index} className="paragraph">
                                {element.children.map((leaf, index) => {
                                    if (leaf.type === "link") {
                                        return (<a href={leaf.url} target="_blank" className="link">{leaf.children[0].text}</a>)
                                    }
                                    if (leaf.italic && leaf.bold) {
                                        return (<span key={index}><em><strong>{leaf.text}</strong></em></span>)
                                    }
                                    if (leaf.italic) {
                                        return (<span key={index}><em>{leaf.text}</em></span>)
                                    }
                                    if (leaf.bold) {
                                        return (<span key={index}><strong>{leaf.text}</strong></span>)
                                    }
                                    return (<span key={index}>{leaf.text}</span>)
                                    // links too
                                })}
                            </p>
                        )
                    }
                    if (element.type === "block-quote") {
                        return (
                            <blockquote key={index}>{element.children[0].text}</blockquote>
                        )
                    }
                    if (element.type === "image") {
                        return (
                            <img key={index} src={element.url} className="image" alt={`an image about ${this.props.feature.title}`}/>
                        )
                    }
                })}
                <p className="bio"><em>{this.props.feature.bio}</em></p>
                <div className="sharing" id="bottomSharing">
                    <p>Share this article: </p>
                    <div className="icons">
                        <EmailShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><EmailIcon round={true}></EmailIcon></EmailShareButton>
                        <FacebookShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><FacebookIcon round={true}></FacebookIcon></FacebookShareButton>
                        <TwitterShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><TwitterIcon round={true}></TwitterIcon></TwitterShareButton>
                    </div>
                </div>
                <OtherArticles story="1"/>
            </Container>
        );
    }
}

export default FeatureShow;