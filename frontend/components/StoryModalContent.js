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
import {optimiseCloudinary, convertRichText} from '../lib/utils';
import { Query, Mutation } from 'react-apollo';
import { MODAL_STORY_QUERY, ADD_STORY_COMMENT, CURRENT_USER_QUERY, MAP_STORIES_QUERY } from './Apollo'
import StoryModalUpvote from './StoryModalUpvote'
import Comment from './Comment'
import Cookies from 'universal-cookie';

const cookies = new Cookies()


const Container = styled.div`
    font-family: ${props => props.theme.serif};
    overflow: scroll;
    max-height: 70vh;
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
    .storyModalHeader {
        display: flex;
        justify-content: space-between;
        .title {
            margin: 0;
        }
        .author {
            opacity: 0.5;
            margin: 0;
            margin-bottom: 4px;
            font-size: 1rem;
        }
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
`;

class StoryShow extends Component {
    state = {
        commentContent: ""
    }
    handleChange = (e) => {
        this.setState({commentContent: e.target.value})
    } 
    render() {
        return (
            <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}>
            {({data, loading, error}) => {
                if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                const me = data.me === null ? null : data.me
                return (                        
                        <Query query={MODAL_STORY_QUERY} variables={{id: this.props.id}}>
                            {({data, loading, error}) => {
                                if (loading) return <><p style={{margin: "1rem", textAlign: "center"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{margin: "auto", display: "block"}}/></>;
                                if (error) return <p>Error: {error.message}</p>;
                                const story = data.story
                                return (
                                    <Container>
                                        <div className="storyModalHeader">
                                            <div className="left">
                                                <h3 className="title">{story.title}</h3>
                                                <h3 className="author">{story.author}</h3>
                                            </div>
                                            <StoryModalUpvote story={story}/>
                                        </div>
                                        {story.image && <img className="image" src={optimiseCloudinary(story.image, 600)} alt={story.title} />}
                                        <div className="content">
                                            {convertRichText(story.content, story.title)}
                                        </div>
                                        <div className="comments">
                                            <hr/>
                                            {story.comments.filter(c => c.approved).length > 0 &&
                                                <h4>Comments</h4>
                                            }
                                            {story.comments.filter(c => c.approved ).map(c => {
                                                return <Comment key={c.id} comment={c}/>
                                            })}
                                            {/* {story.comments.filter(c => c.approved ).length === 0 && 
                                                <p><em>No comments yet. Start the conversation: </em></p>
                                            } */}
                                            <div className="addComment">

                                                <Mutation mutation={ADD_STORY_COMMENT} refetchQueries={[{ query: MAP_STORIES_QUERY }]}>
                                                    {(addStoryComment, { loading, error }) => (
                                                        <form
                                                        data-test="form"
                                                        onSubmit={async e => {
                                                            e.preventDefault();
                                                            if (me) {
                                                                await addStoryComment({variables: {
                                                                    content: this.state.commentContent,
                                                                    authorId: me.id,
                                                                    storyId: story.id
                                                                }});
                                                                this.setState({commentContent: ""})
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
                    )   
                }}
            </Query>
        );
    }
}

export default StoryShow;