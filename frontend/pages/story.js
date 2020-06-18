import React, { Component } from 'react';
import Head from 'next/head'
import { endpoint, prodEndpoint } from '../config.js';
import {optimiseCloudinary, timeFromNow} from '../lib/utils';
import styled from 'styled-components';
import Link from 'next/link';
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
import Map from '../components/Map'
import FeatureCard from '../components/FeatureCard'
import FeedPreview from '../components/FeedPreview'
import { Query } from 'react-apollo';
import { RECENT_FEATURES_QUERY } from '../components/Apollo'

const Container = styled.div`
    font-family: ${props => props.theme.serif};
    overflow: hidden;
    padding-top: 1rem;
    #story {
        margin: auto;
        max-width: 800px;
        width: 95%;
    }
    .explanation {
        font-family: ${props => props.theme.sansSerif};
        padding: 0.5rem;
        background-color: ${props => props.theme.yellow};
        border-radius: 4px;
        text-align: center;
    }
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
    #latestFeatures {
        .recentFeatures {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
        }
    }
`;




class story extends Component {
    static async getInitialProps(ctx) {
        const id = ctx.query.id;
        const url = process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint
        const res = await fetch(`${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `{ story(id: "${id}") { id title content longitude latitude createdAt author image }}` }),
        })
        
        const payload = await res.json()
        const story = payload.data.story
        return { story };
    }
    render() {
        const today = new Date()
        const formattedToday = `${today.getFullYear()}-${today.getMonth() + 1 < 10 ? "0" : ""}${today.getMonth()+1}-${today.getDate() < 10 ? "0" : ""}${today.getDate()}`
        return (
            <>
                <Head>
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:site" content="@ourstosave" />
                    <meta property="og:url"                content={`https://www.ourstosave.com/story?id=${this.props.story.id}`} key='og:url'/>
                    <meta property="og:title"              content={this.props.story.title} key='og:title'/>
                    {/* <meta property="og:description"        content={this.props.story.content} key='og:description'/> */}
                    <meta property="og:image"              content={optimiseCloudinary(this.props.story.image, 500)} key='og:image'/>
                    <meta property="og:type"               content="article" key='og:type'/>
                </Head>
                <Container>
                    <div id="story">
                        <p className="explanation">New to <em>Ours to Save</em>? Find out how we're taking a different approach to reporting the climate crisis <Link href="/"><a>here</a></Link>. We're not just a crowdsourced news feed - we also run <Link href="/features"><a>full-length features</a></Link> digging deeper into the stories under the headlines from a world-class team of journalists.</p>
                        {this.props.story.createdAt.substring(0, 10) === formattedToday && <span className="breaking">BREAKING</span>}
                        <div className="date">
                            {/* <Moment date={this.props.story.createdAt} format="HH:mm"/>
                            <Moment date={this.props.story.createdAt} format="Do MMM YYYY"/> */}
                            {timeFromNow(this.props.story.createdAt)}

                        </div>
                        <h3 className="title">{this.props.story.title}</h3>
                        <h3 className="author">{this.props.story.author} ﹒ {this.props.story.country}</h3>
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
                    </div>
                    <hr/>
                    <div id="moreInfo">
                        {/* <CategorySuggestions category={this.props.feature.category} feature={this.props.feature}/> */}
                        <h2 style={{textAlign: "center", margin: "2rem auto"}}>More from the feed</h2>
                        <div id="feedPreview">
                            <Map/>
                            <div id="previewWrapper">
                                <FeedPreview/>
                            </div>
                        </div>
                    </div>
                    <div id="latestFeatures">
                        <h3 style={{textAlign: "center", margin: "3rem auto 2rem auto"}}>Latest features</h3>
                        <Query query={RECENT_FEATURES_QUERY}>
                            {({data, loading, error}) => {
                                if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                                if (error) return <p>Error: {error.message}</p>;
                                return (
                                    <div className="recentFeatures">
                                        {data.recentFeatures.map(feature => {
                                            return (
                                                <FeatureCard feature={feature}/>
                                            )
                                        })}
                                    </div>
                                )
                            }}
                        </Query>
                    </div>
                </Container>
            </>  
        );
    }
}

export default story;