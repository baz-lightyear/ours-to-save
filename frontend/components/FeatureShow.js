import React, { Component } from 'react';
import styled from 'styled-components';
import { Query, Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY, ADD_FEATURE_COMMENT, RECOMMENDED_FEATURES_QUERY } from '../lib/Apollo'
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

import {optimiseCloudinary, convertRichText } from '../lib/utils';
import Link from 'next/link';
import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';
import * as gtag from '../lib/gtag'


const cookies = new Cookies()

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
        .recommendationLinkWrap {
            color: ${props => props.theme.black};
            .recommendationCard {
                &:hover {
                    box-shadow: 0px 0px 4px rgba(50,50,50,0.3);
                }
                background-color: ${props => props.theme.yellow};
                margin-bottom: 2rem;
                display: flex;
                height: min-content;
                .left {
                    padding: 0rem 1rem;
                    width: 70%;
                    .recommendationHeader {
                        margin-top: 1rem;
                        font-family: ${props => props.theme.sansSerif};
                        opacity: 0.8;
                    }
                    .recommendationTitle {
                        font-size: 1.5rem;
                    }
                    .recommendationAuthor {
                        font-family: ${props => props.theme.sansSerif};
                        color: ${props => props.theme.green};
                        font-weight: bold;
                    }
                }
                .right {
                    width: 30%;
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
                @media (max-width: 600px) {
                    .left {
                        width: 100%;
                    }
                    .right {
                        display: none;
                    }
                }
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
            <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}>
                {({data, loading, error}) => {
                    if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                    if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                    const me = data.me === null ? null : data.me

                    // We didn't fire a user id request to Analytics at the Page component to allow Open Graph crawlers to hit the feature fetch request, so we have to manually do it here.
                    if (me) {
                        gtag.setUserId(me.id)
                    }
                    return (
                        // We need to generate a list of recommended articles. We only take as many articles as the feature needs, based on how many article recommendations it has
                        <Query query={RECOMMENDED_FEATURES_QUERY} variables={{featureId: this.props.feature.id, count: JSON.parse(this.props.feature.content).filter(e => e.type === "recommended-article").length}}>
                            {({data, loading, error}) => {
                                if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                                if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                                let recommendedFeatures = []
                                if (data) {
                                    recommendedFeatures = data.recommendedFeatures
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
                                                {me && me.permissions.includes("EDITOR") && <Link href={{pathname: '/editFeature', query: { id: this.props.feature.id }}}><p style={{textAlign: "right"}}><a style={{cursor: "pointer"}}>Edit feature ✏️ </a></p></Link>}
                                                <p className="explanation">New to <em>Ours to Save</em>? Find out how we're taking a different approach to reporting the climate crisis <Link href="/account"><a>here</a></Link>.</p>
                                                <p className="date"><Moment date={this.props.feature.createdAt} format="Do MMM YYYY"/></p>
                                                <p className="author">{this.props.feature.author}</p>
                                                <div className="sharing" id="topSharing">
                                                    <p>No paywalls when you share this <strong>Ours to Save</strong> feature:</p>
                                                    <div className="icons">
                                                        <EmailShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><EmailIcon round={true}></EmailIcon></EmailShareButton>
                                                        <FacebookShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><FacebookIcon round={true}></FacebookIcon></FacebookShareButton>
                                                        <TwitterShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><TwitterIcon round={true}></TwitterIcon></TwitterShareButton>
                                                    </div>
                                                </div>
        
                                                {convertRichText(this.props.feature.content, this.props.feature.title, recommendedFeatures)}
        
                                                <p className="bio endOfArticle"><em>{this.props.feature.bio}</em></p>
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
                                                    <p>No paywalls when you share this <strong>Ours to Save</strong> feature:</p>
                                                    <div className="icons">
                                                        <EmailShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><EmailIcon round={true}></EmailIcon></EmailShareButton>
                                                        <FacebookShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><FacebookIcon round={true}></FacebookIcon></FacebookShareButton>
                                                        <TwitterShareButton url={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`}><TwitterIcon round={true}></TwitterIcon></TwitterShareButton>
                                                    </div>
                                                </div>
                                            </div>
        
                                            <div id="moreInfo">
                                                <p id="homepage">If you found that interesting, you'll love everything else we have to offer. <br/>Find out how we're taking a different approach to reporting the climate crisis <Link href="/account"><a>here</a></Link>.</p>
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
                                }
                            }}
                        </Query>
                    )
                }}
            </Query>
        );
    }
}

export default FeatureShow;