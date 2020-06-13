import React, { Component } from 'react';
import styled from 'styled-components';
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
import {optimiseCloudinary} from '../lib/utils';
import { Query } from 'react-apollo';
import { MODAL_STORY_QUERY } from './Apollo'


const Container = styled.div`
    font-family: ${props => props.theme.serif};
    overflow: scroll;
    max-height: 80vh;
    .breaking {
        padding: 0.5rem;
        margin-bottom: 1rem;
        background-color: ${props => props.theme.green};
        display: inline-block;
        color: ${props => props.theme.offWhite};
        font-family: ${props => props.theme.sansSerif};
        font-weight: bolder;
        letter-spacing: 2px;
    }
    .date {
        font-family: ${props => props.theme.sansSerif};
        opacity: 0.5;
        display: flex;
        justify-content: space-between;
    }
    .title {
        margin: 0;
    }
    .author {
        opacity: 0.5;
        margin: 0;
        margin-bottom: 4px;
        font-size: 1rem;
    }
    .sharing {
        text-align: left;
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
                margin-right: 4px;
                &:focus {
                    outline: none;
                }
            }
        }
    }
    .image {
        display: block;
        margin: 2rem auto;
        width: 100%;
        max-height: 70vh;
        object-fit: contain;
        background-color: white;
        padding: 1rem;
    }
    .content {
        margin: 1rem 0;
        font-size: 0.9rem;
    }
`;

class StoryShow extends Component {
    render() {
        return (
            <Query query={MODAL_STORY_QUERY} variables={{id: this.props.id}}>
                {({data, loading, error}) => {
                    if (loading) return <><p style={{margin: "1rem", textAlign: "center"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{margin: "auto", display: "block"}}/></>;
                    if (error) return <p>Error: {error.message}</p>;
                    const story = data.story
                    return (
                        <Container>
                            <h3 className="title">{story.title}</h3>
                            <h3 className="author">{story.author}</h3>
                            {story.image && <img className="image" src={optimiseCloudinary(story.image, 600)} alt={story.title} />}
                            <div className="content">
                                {JSON.parse(story.content).map((element, index) => {
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
                                    <EmailShareButton url={`https://www.ourstosave.com/story?id=${story.id}`}><EmailIcon round={true}></EmailIcon></EmailShareButton>
                                    <FacebookShareButton url={`https://www.ourstosave.com/story?id=${story.id}`}><FacebookIcon round={true}></FacebookIcon></FacebookShareButton>
                                    <TwitterShareButton url={`https://www.ourstosave.com/story?id=${story.id}`}><TwitterIcon round={true}></TwitterIcon></TwitterShareButton>
                                </div>
                            </div>
                        </Container>
                    )
                }}
            </Query>
        );
    }
}

export default StoryShow;