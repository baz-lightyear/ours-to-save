import React, { Component } from 'react';
import styled from 'styled-components';
import Moment from 'react-moment';
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
import MapStoryShow from './MapStoryShow';
import OtherArticles from './OtherArticles';
import {optimiseCloudinary} from '../lib/utils';


const Container = styled.div`
    font-family: ${props => props.theme.serif};
    overflow: hidden;
    .date {
        font-family: ${props => props.theme.sansSerif};
        opacity: 0.5;
        display: flex;
        justify-content: space-between;
        padding-top: 2rem;
        border-top: solid 2px ${props => props.theme.green};
    }
    .author {
        font-family: ${props => props.theme.sansSerif};
        opacity: 0.5;
        text-align: right;
        margin: 0;
    }
    .title {
        margin-top: 4px;
        margin-bottom: 4px;
        span {
            opacity: 0.5;
        }
    }
    .sharing {
        text-align: left;
        margin-bottom: 2rem;
        .icons {
            p {
                margin: 0;
                margin-bottom: 4px;
                font-family: ${props => props.theme.sansSerif};
                opacity: 0.5;
            }
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
        max-width: 70%;
        max-height: 70vh;
        object-fit: contain;
        background-color: white;
        padding: 1rem;
    }
    .content {
        margin: 1rem 0;
    }
`;

class StoryShow extends Component {
    render() {
        return (
            <Container>
                <div className="date">
                    <Moment date={this.props.story.createdAt} format="HH:mm"/>
                    <Moment date={this.props.story.createdAt} format="Do MMM YYYY"/>
                </div>
                <h3 className="title">{this.props.story.title}<span> ﹒ {this.props.story.author}</span></h3>
                {this.props.story.image && <img className="image" src={optimiseCloudinary(this.props.story.image, 600)} alt={this.props.story.title} />}
                <div className="content">
                    {JSON.parse(this.props.story.content).map((element, index) => {
                        return (
                            <p key={index}>
                                {element.children.map((leaf, index) => {
                                    if (leaf.type === "link") {
                                        return <a href={leaf.url} target="_blank" key={index}>{leaf.children[0].text}</a>
                                    }
                                    return (
                                        <span key={index}>
                                            {leaf.text}
                                        </span>
                                    )
                                })}
                            </p>
                        )
                    })}
                </div>
                <div className="sharing">
                    <div className="icons">
                        <p>Share:</p>
                        <EmailShareButton url={`https://www.ourstosave.com/story?id=${this.props.story.id}`}><EmailIcon round={true}></EmailIcon></EmailShareButton>
                        <FacebookShareButton url={`https://www.ourstosave.com/story?id=${this.props.story.id}`}><FacebookIcon round={true}></FacebookIcon></FacebookShareButton>
                        <TwitterShareButton url={`https://www.ourstosave.com/story?id=${this.props.story.id}`}><TwitterIcon round={true}></TwitterIcon></TwitterShareButton>
                    </div>
                </div>
            </Container>
        );
    }
}

export default StoryShow;