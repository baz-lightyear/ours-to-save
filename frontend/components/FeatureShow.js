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
    .links {
        font-family: ${props => props.theme.sansSerif};
        font-weight: 700;
    }
    .link {
        text-decoration: none;
        color: ${props => props.theme.black};
        &:hover {
            color: ${props => props.theme.green};
        }
    }
    .bio {
        margin-top: 2rem;
        text-align: right;
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
                <h1>{this.props.feature.title}</h1>
                <h3 className="subtitle"><em>{this.props.feature.subtitle}</em></h3>
                <p className="date"><Moment date={this.props.feature.createdAt} format="Do MMM YYYY"/></p>
                <p className="author">{this.props.feature.author}</p>
                <div className="sharing">
                    <p>Share this article: </p>
                    <div className="icons">
                        <EmailShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><EmailIcon round={true}></EmailIcon></EmailShareButton>
                        <FacebookShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><FacebookIcon round={true}></FacebookIcon></FacebookShareButton>
                        <TwitterShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><TwitterIcon round={true}></TwitterIcon></TwitterShareButton>
                    </div>
                </div>
                {this.props.feature.paragraphs.map(paragraph => {
                    return (
                        <Fragment key={paragraph.id}>
                            {paragraph.image && <img src={paragraph.image} alt="image" className="image"/>}
                            <p className="paragraph" >{paragraph.text}</p>
                        </Fragment>
                    )
                })}
                <p className="bio"><em>{this.props.feature.bio}</em></p>
                <p className="links">Links:</p>
                <ul>
                {this.props.feature.featureLinks.map(link => {
                    return (
                        <li key={link.id}><a href={link.ref} className="link">{link.title}</a></li>
                    )
                })}
                </ul>
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