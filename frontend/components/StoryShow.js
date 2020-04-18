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
            <Container>
                <h1>{this.props.story.title}</h1>
                <small>Posted <Moment date={this.props.story.createdAt} format="Do MMM YYYY"/> by {this.props.story.author}</small>
                <br/>
                {this.props.story.image && <img id="image" src={this.props.story.image} alt={this.props.story.title} />}
                <p>{this.props.story.content}</p>
                <div className="sharing">
                    <p>Share: </p>
                    <div className="icons">
                    <EmailShareButton url={`https://www.ourstosave.com/story?id=${this.props.story.id}`}><EmailIcon round={true}></EmailIcon></EmailShareButton>
                    <FacebookShareButton url={`https://www.ourstosave.com/story?id=${this.props.story.id}`}><FacebookIcon round={true}></FacebookIcon></FacebookShareButton>
                    <TwitterShareButton url={`https://www.ourstosave.com/story?id=${this.props.story.id}`}><TwitterIcon round={true}></TwitterIcon></TwitterShareButton>
                    </div>
                </div>
                <div className="mapContainer">
                    <MapStoryShow story={this.props.story}/>
                </div>
                <OtherArticles story={this.props.story}/>
            </Container>
        );
    }
}

export default StoryShow;