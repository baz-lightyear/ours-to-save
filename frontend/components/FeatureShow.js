import React, { Component, Fragment } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Query, Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY, ADD_FEATURE_COMMENT } from './Apollo'
import Moment from 'react-moment';
import Comment from './Comment';
import Router from 'next/router';

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
import Map from './Map';
import FeedPreview from './FeedPreview';
import CategorySuggestions from './CategorySuggestions';

import {optimiseCloudinary} from '../lib/utils';
import Link from 'next/link';
import Paywall from './Paywall'
import Swal from 'sweetalert2';

const Container = styled.div`
    min-height: calc(100vh - 125px);
    font-family: ${props => props.theme.serif};
    padding: 1rem;
    .banner {
        height: 50vh;
        position: absolute;
        left: 0;
        top: 40px;
        width: 100vw;
        background-position: 50% 20%;
        background-size: cover;
        /* background-attachment: fixed; */
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
    @media (max-width: 500px) {
        .banner, .filler {
            height: 80vh;
        }
    }
    #content {
        width: 95%;
        max-width: 800px;
        margin: auto;
        .explanation {
            font-family: ${props => props.theme.sansSerif};
            padding: 0.5rem;
            background-color: ${props => props.theme.yellow};
            border-radius: 4px;
            text-align: center;
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
        .comments {
            border-top: solid 2px ${props => props.theme.green};
            .addComment {
                form {
                    margin: 4rem 0;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    textarea {
                        width: 100%;
                        font-family: ${props => props.theme.sansSerif};
                        padding: 0.5rem;
                        border: solid 1px ${props => props.theme.lightgreen};
                    }
                    button {
                        margin: 1rem 0;
                        /* width: 200px; */
                        padding: 0.5rem 1rem;
                        
                        border: none;
                        background-color: ${props => props.theme.green};
                        color: ${props => props.theme.offWhite};
                        font-weight: normal;
                        &:hover {
                            background-color: ${props => props.theme.black};
                        }
                    }
                }
            }
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
                    margin: 0;
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
    }
    #moreInfo {
        #homepage {
            margin: 1rem auto;
            text-align: center;
        }
        #feedPreview {
            max-width: 1000px;
            margin: auto;
            display: flex;
            #previewWrapper {
                height: 100%;
                margin-left: 0.5rem;

            }
            @media (max-width: 800px) {
                flex-direction: column;
                #previewWrapper {
                    margin: 1rem 0;
                }
            }
        }
    }
`;


class FeatureShow extends Component {
    state = {
        commentContent: ""
    }
    handleChange = (e) => {
        this.setState({commentContent: e.target.value})
    } 
    render() {
        return (
            <Query query={CURRENT_USER_QUERY}>
                {({data, loading, error}) => {
                    if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                    if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                    const me = data.me === null ? null : data.me
                    return (
                        <Container>
                            <div className="banner" style={{backgroundImage: `url(${optimiseCloudinary(this.props.feature.featuredImage, 1200)})`}}>
                                <div className="opacityBanner">
                                    <h1>{this.props.feature.title}</h1>
                                    <h3 className="subtitle"><em>{this.props.feature.subtitle}</em></h3>
                                </div>
                            </div>
                            <div className="filler"></div>
                            <div id="content">
                                <p className="explanation">New to <em>Ours to Save</em>? Find out how we're taking a different approach to reporting the climate crisis <Link href="/"><a>here</a></Link>.</p>
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
                                {JSON.parse(this.props.feature.content).slice(0, 3).map((element, index) => {
                                    if (element.type === "paragraph") {
                                        return (
                                            <p key={index} className="paragraph">
                                                {element.children.map((leaf, index) => {
                                                    if (leaf.type === "link") {
                                                        return (<a href={leaf.url} target="_blank" className="link" key={index}>{leaf.children[0].text}</a>)
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
                                            <blockquote key={index}>
                                                {element.children.map((leaf, index) => {
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
                                            </blockquote>
                                        )
                                    }
                                    if (element.type === "image") {
                                        return (
                                            <img key={index} src={optimiseCloudinary(element.url, 800)} className="image" alt={`an image about ${this.props.feature.title}`}/>
                                        )
                                    }
                                })}

                                {/* if the user is logged in, show the rest of the paragraphs */}

                                {JSON.parse(this.props.feature.content).slice(3, this.props.feature.content.length).map((element, index) => {
                                    if (element.type === "paragraph") {
                                        return (
                                            <p key={index} className="paragraph">
                                                {element.children.map((leaf, index) => {
                                                    if (leaf.type === "link") {
                                                        return (<a href={leaf.url} target="_blank" className="link" key={index}>{leaf.children[0].text}</a>)
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
                                            <blockquote key={index}>
                                                {element.children.map((leaf, index) => {
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
                                            </blockquote>
                                        )
                                    }
                                    if (element.type === "image") {
                                        return (
                                            <img key={index} src={optimiseCloudinary(element.url, 800)} className="image" alt={`an image about ${this.props.feature.title}`}/>
                                        )
                                    }
                                })}

                                {/* if the user is not logged in, don't show the rest of the paragraphs */}
                                
                                {/* {!me && 
                                    <Paywall/>
                                } */}

                                <p className="bio"><em>{this.props.feature.bio}</em></p>
                                <div className="comments">
                                    <h4 style={{textAlign: "center"}}>Comments</h4>
                                    {this.props.feature.comments.filter(c => c.approved ).map(c => {
                                        return <Comment key={c.id} comment={c}/>
                                    })}
                                    {this.props.feature.comments.filter(c => c.approved ).length === 0 && 
                                        <p><em>No comments yet. Start the conversation: </em></p>
                                    }
                                    <div className="addComment">
                                        <Mutation mutation={ADD_FEATURE_COMMENT} >
                                            {(addFeatureComment, { loading, error }) => (
                                                <form
                                                    data-test="form"
                                                    onSubmit={async e => {
                                                        e.preventDefault();
                                                        if (me) {
                                                            await addFeatureComment({variables: {
                                                                content: this.state.commentContent,
                                                                authorId: me.id,
                                                                featureId: this.props.feature.id
                                                            }});
                                                            Router.reload();
                                                        } else {
                                                            Swal.fire({
                                                                title: `Join us`,
                                                                text: `Log in or sign up and you can comment, upvote and gain access to special content.`,
                                                                icon: 'warning',
                                                                confirmButtonColor: '#4B4C53',
                                                            })
                                                        }
                                                    }}
                                                >
                                                    <label htmlFor="comment"><strong>Add comment</strong> <br/>{!me && <small>Log in or sign up to comment</small>}</label>
                                                    <textarea name="comment" type="text" placeholder="Keep it respectful" value={this.state.commentContent} onChange={this.handleChange}/>
                                                    <button>submit</button>
                                                </form>
                                            )}
                                        </Mutation>
                                    </div>
                                </div>
                                <div className="sharing" id="bottomSharing">
                                    <p>Share this article: </p>
                                    <div className="icons">
                                        <EmailShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><EmailIcon round={true}></EmailIcon></EmailShareButton>
                                        <FacebookShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><FacebookIcon round={true}></FacebookIcon></FacebookShareButton>
                                        <TwitterShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><TwitterIcon round={true}></TwitterIcon></TwitterShareButton>
                                    </div>
                                </div>
                            </div>

                            <div id="moreInfo">
                                <p id="homepage">New to <em>Ours to Save</em>? Find out how we're taking a different approach to reporting the climate crisis <Link href="/"><a>here</a></Link>.</p>
                                <CategorySuggestions category={this.props.feature.category} feature={this.props.feature}/>
                                <h2 style={{textAlign: "center", margin: "2rem auto"}}>Crowdsourced map</h2>
                                <div id="feedPreview">
                                    <Map/>
                                    <div id="previewWrapper">
                                        <FeedPreview/>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    )
                }}
            </Query>
        );
    }
}

export default FeatureShow;