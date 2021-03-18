import React, { Component } from 'react';
import styled from 'styled-components';
import { Query, Mutation } from 'react-apollo';
import Swal from 'sweetalert2';
import Comment from './Comment'
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
import {optimiseCloudinary, timeFromNow, convertRichText} from '../lib/utils';
import { CURRENT_USER_QUERY, UPVOTE_STORY, ADD_STORY_COMMENT } from '../lib/Apollo';
import Link from 'next/link'
import Moment from 'react-moment'
import Cookies from 'universal-cookie';

const cookies = new Cookies()

const SuggestedFeature = styled.div`
    padding-bottom: 1rem;
    border-top: solid 2px ${props => props.theme.green};
    border-radius: 2px;
    .featureDiv {

        a {
            background-color: ${props => props.theme.offWhite};
            background-image: url(littlePluses.png);
            position: relative;
            color: ${props => props.theme.black};
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            img {
                height: 300px;
                width: 100%;
                object-fit: cover;
            }
            .text {
                padding: 0.5rem;
                font-family: ${props => props.theme.serif};
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                h4 {
                    margin: 0;
                    margin-top: 0.5rem;
                }
                .category {
                    margin-top: 0;
                    margin-bottom: 1rem;
                    font-family: ${props => props.theme.sansSerif};
                    color: ${props => props.theme.green};
                    text-transform: capitalize;
                }
                .subtitle {
                    margin-bottom: 1rem;
                }
                small {
                    display: flex;
                    justify-content: space-between;
                    opacity: 0.5;
                }
            }
            &:hover {
                box-shadow: 0px 0px 4px rgba(50,50,50,0.3);
            }
            .membersOnly {
                position: absolute;
                right: 1rem;
                top: 1rem;
                margin: 0;
                background-color: rgba(0,0,0,0.3);
                padding: 0 4px;
                border-radius: 4px;
                font-family: ${props => props.theme.sansSerif};
                color: white;
            }
        }
    }
`;

const Container = styled.div`
    font-family: ${props => props.theme.serif};
    overflow: hidden;
    border-top: solid 2px ${props => props.theme.green};
    padding-top: 1rem;
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
    .storyHeader {
        display: flex;
        justify-content: space-between;
        .left {
            .date {
                font-family: ${props => props.theme.sansSerif};
                opacity: 0.5;
                /* display: flex;
                justify-content: space-between; */
            }
            .title {
                margin-top: 4px;
                margin-bottom: 0;
            }
            .author {
                opacity: 0.5;
                margin: 0;
                margin-bottom: 4px;
                font-size: 1rem;
            }
        }
        .votes {
            width: 10%;
            max-width: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            span {
                line-height: 1;
                opacity: 0.7;
            }
            .vote {
                font-size: 2rem;
                cursor: pointer;
                &:hover {
                    opacity: 1;
                }
            }
            .voteCount {
                font-size: 1rem;
                font-family: ${props => props.theme.sansSerif};
            }
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
                margin: 0;
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
        max-width: 70%;
        max-height: 70vh;
        object-fit: contain;
        background-color: white;
        padding: 1rem;
    }
    .content {
        margin: 1rem 0;
        font-size: 0.9rem;
    }
    .addComment {
        form {
            margin-top: 2rem;
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
    summary {
        margin: 1rem auto;
        display: block;
        :focus {
            outline: none;
        }
    }
`;

class StoryShow extends Component {
    state = {
        comments: this.props.story.comments,
        countUpvotes: this.props.story.countUpvotes,
        commentContent: ""
    }
    handleChange = (e) => {
        this.setState({commentContent: e.target.value})
    } 
    upvote = async (me, story, upvoteStory) => {
        if (me) {
            if (me.upvotedStories.map(s => s.id).includes(story.id)) {
                Swal.fire({
                    title: `Already upvoted`,
                    text: `You can only upvote a post once`,
                    icon: 'warning',
                    confirmButtonColor: '#4B4C53',
                })
            } else {
                await upvoteStory({ variables: { storyId: story.id, userId: me.id } });
                const newScore = this.props.story.countUpvotes + 1
                this.setState({countUpvotes: newScore })
            }
        } else {
            Swal.fire({
                title: `Join us`,
                text: `Log in or sign up and you can vote, comment and gain access to special content.`,
                icon: 'warning',
                confirmButtonColor: '#4B4C53',
            })
        }
    }



    render() {
        const today = new Date()
        const formattedToday = `${today.getFullYear()}-${today.getMonth() + 1 < 10 ? "0" : ""}${today.getMonth()+1}-${today.getDate() < 10 ? "0" : ""}${today.getDate()}`
        return (
            <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}> 
                 {({data, loading, error}) => {
                    if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                    if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                    const me = data.me === null ? null : data.me
                    return (
                        <Container>
                            {this.props.story.createdAt.substring(0, 10) === formattedToday && <span className="breaking">BREAKING</span>}
                            <div className="storyHeader">
                                <div className="left">
                                    <div className="date">
                                        {/* {timeFromNow(this.props.story.createdAt)} */}
                                    </div>
                                    <h3 className="title">{this.props.story.title}</h3>
                                    <h3 className="author">{this.props.story.author} ﹒ {this.props.story.country}</h3>
                                </div>
                                <div className="votes">
                                    <Mutation
                                        mutation={UPVOTE_STORY}
                                    >
                                     {(upvoteStory, { error, loading }) => (
                                        <span className="vote" onClick={() => this.upvote(me, this.props.story, upvoteStory)}>▴</span>
                                     )}
                                    </Mutation>
                                    <span className="voteCount">{this.state.countUpvotes || 0}</span>
                                </div>
                            </div>
                            {this.props.story.image && <img className="image" src={optimiseCloudinary(this.props.story.image, 600)} alt={this.props.story.title} />}
                            <div className="content">
                                {convertRichText(this.props.story.content, this.props.story.title)}
                            </div>
                            <div className="comments">
                                <hr/>
                                {this.state.comments.filter(c => c.approved).length > 0 &&
                                    <h4>Comments</h4>
                                }
                                {this.state.comments.filter(c => c.approved ).map(c => {
                                    return <Comment key={c.id} comment={c}/>
                                })}
                                {/* {this.props.story.comments.filter(c => c.approved ).length === 0 && 
                                    <p><em>No comments yet. Start the conversation: </em></p>
                                } */}
                                <div className="addComment">
                                    <details>
                                        <summary><strong>Add comment</strong></summary>
                                        <Mutation mutation={ADD_STORY_COMMENT} >
                                            {(addStoryComment, { loading, error }) => (
                                                <form
                                                data-test="form"
                                                onSubmit={async e => {
                                                    e.preventDefault();
                                                    if (me) {
                                                        await addStoryComment({variables: {
                                                            content: this.state.commentContent,
                                                            authorId: me.id,
                                                            storyId: this.props.story.id
                                                        }});
                                                        const comments = this.state.comments
                                                        comments.push({
                                                            id: Math.random(),
                                                            approved: true,
                                                            content: this.state.commentContent,
                                                            author: {
                                                                name: me.name
                                                            },
                                                            createdAt: new Date()
                                                        })
                                                        this.setState({comments: comments, commentContent: ""})
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
                                                    {/* <label htmlFor="comment"><strong>Add comment</strong> <br/>{!me && <small>Log in or sign up to comment</small>}</label> */}
                                                    {!me && <small>Log in or sign up to comment</small>}
                                                    <textarea name="comment" type="text" placeholder="Keep it respectful" value={this.state.commentContent} onChange={this.handleChange}/>
                                                    <button>submit</button>
                                                </form>
                                            )}
                                        </Mutation>
                                    </details>
                                </div>
                            </div>
                            <div className="sharing">
                                <div className="icons">
                                    <p>Share:</p>
                                    <EmailShareButton url={`https://www.ourstosave.com/story?id=${this.props.story.id}`}><EmailIcon round={true}></EmailIcon></EmailShareButton>
                                    <FacebookShareButton url={`https://www.ourstosave.com/story?id=${this.props.story.id}`}><FacebookIcon round={true}></FacebookIcon></FacebookShareButton>
                                    <TwitterShareButton url={`https://www.ourstosave.com/story?id=${this.props.story.id}`}><TwitterIcon round={true}></TwitterIcon></TwitterShareButton>
                                </div>
                            </div>
                            {this.props.feature && 
                                <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}>
                                    {({data, error, loading}) => {
                                        if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                                        if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                                        const me = data.me === null ? null : data.me
                                        return (
                                            <SuggestedFeature>
                                                <h4 style={{textAlign: "center"}}>Enjoying the crowdsourced map? Delve a little deeper:</h4>
                                                <div className="featureDiv">
                                                    <Link href={{pathname: '/feature', query: { id: this.props.feature.id, title: this.props.feature.title }}}>
                                                        <a>
                                                            <img src={optimiseCloudinary(this.props.feature.featuredImage, 600)} alt={this.props.feature.title}/>
                                                            <div className="text">
                                                                <div className="info">
                                                                    <h4>{this.props.feature.title}</h4>
                                                                    <p className="category">{this.props.feature.category}</p>
                                                                    <p className="subtitle">{this.props.feature.subtitle}</p>
                                                                </div>
                                                                <small><Moment date={this.props.feature.createdAt} format="Do MMM YYYY"/>﹒<span>{this.props.feature.author}</span></small>
                                                            </div>
                                                        </a>
                                                    </Link>
                                                </div>
                                            </SuggestedFeature>
                                        )
                                    }}
                                </Query>
                            }
                        </Container>
                    )
                 }}
            </Query>
        );
    }
}

export default StoryShow;