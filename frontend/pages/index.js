import React, { Component } from 'react';
import styled from 'styled-components';
import Map from '../components/Map'
import FeedPreview from '../components/FeedPreview.js'
import LatestFeature from '../components/LatestFeature.js'
import FeatureCard from '../components/FeatureCard.js'
import LoginModal from '../components/LoginModal.js'

import Link from 'next/link';

import { Query } from 'react-apollo'
import { LATEST_FEATURE_QUERY, RECENT_FEATURES_QUERY, BOOSTED_FEATURES_QUERY } from '../components/Apollo'

const Container = styled.div`
    width: 95%;
    max-width: 1000px;
    margin: auto;
    h2, h3 {
        font-family: ${props => props.theme.serif};
    }
    #newsHeader {
        font-family: ${props => props.theme.serif};
        h1 {
            margin-bottom: 0;
        }
        h3 {
            margin-top: 2rem;
        }
        #contentModes {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            .mode {
                width: 180px;
                text-align: center;
                margin: 1rem 4px;
                padding: 1rem;
                height: 300px;
                background-color: ${props => props.theme.yellow};
                background-image: url(littlePluses.png);                
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                font-size: 0.75rem;
                .illustration {
                    height: 50%;
                    max-width: 95%;
                    margin-bottom: 2rem;
                    &#airpods {
                        padding: 1rem;
                    }
                }
                p {
                    height: 50%;
                    margin: 0;
                    font-family: ${props => props.theme.sansSerif};
                }
            }
        }
        .socialLinks {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            margin-bottom: 3rem;
            a {
                img {
                    width: 3rem;
                    margin: 0.75rem;
                }
                &:hover {
                    opacity: 0.8;
                }
            }
        }
        #socialProofs {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            .proof {
                img {
                    width: 280px;
                    margin: 2rem auto;
                }
            }
        }
        #CTAs {
            text-align: center;
            margin: 1rem;
        }
    }
    #feedPreview {
        display: flex;
    }
    #tabs {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        .category {
            width: 240px;
            margin: 1rem 4px;
            text-align: center;
            color: ${props => props.theme.black};
            border-radius: 2px;
            background-color: ${props => props.theme.yellow};
            font-family: ${props => props.theme.serif};
            background-image: url(littlePluses.png);
            h4 {
                font-size: 1.5rem;
            }
            p {
                margin: 1rem 8px;
                font-size: 0.8rem;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 3rem;
            }
            img {
                width: 95%;
                height: 200px;
                object-fit: contain;
            }
            &:hover {
                box-shadow: 0px 0px 4px rgba(50,50,50,0.3);
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
    .boostedFeatures {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }
`;

class index extends Component {
    render() {
        return (
            <Container>
                <div id="newsHeader">
                    <h1>The climate crisis is underway.</h1>
                    <p>Join us on our journey to better understand and respond to the defining challenge of the century.</p>
                    <hr/>
                    {/* If the person is not a member...show the following */}
                    <h3 style={{textAlign: "center"}}>We're a new kind of publication</h3>
                    <div id="contentModes">
                        <div id="feed" className="mode">
                            <img className="illustration" src="globe.svg" alt="black illustration of a globe"/>
                            <p>Our <strong>crowdsourced news feed</strong> exposes stories from all around the world. It's totally free and anyone can contribute.</p>
                        </div>
                        <div id="features" className="mode">
                            <img className="illustration" id="lightbulb" src="lightbulb.svg" alt="black illustration of a lightbulb"/>
                            <p>Members have access to a curated selection of <strong>full-length features</strong> from world-class journalists, to examine the facts beneath the headlines.</p>
                        </div>
                        <div id="podcast" className="mode">
                            <img className="illustration" id="airpods" src="airpods.svg" alt="black illustration of airpods"/>
                            <p>Make sense of the weekly stories and hear directly from climate movers-and-shakers with our weekly <strong>podcast</strong>.</p>
                        </div>
                        <div id="newsletter" className="mode">
                            <img className="illustration" src="mail.svg" alt="black illustration of letter"/>
                            <p>Our <strong>newsletter</strong> summarises the weekly events in a digestible, punchy format - no spammy emails from us.</p>
                        </div>
                        <div id="socialMedia" className="mode">
                            <div className="socialLinks">
                                <a href="https://www.instagram.com/ours.tosave/" target="_blank">
                                    <img className="social" src="instagramBlack.svg" alt="black instagram logo"/>
                                </a>
                                <a href="https://www.facebook.com/ourstosave/" target="_blank">
                                    <img className="social" src="facebookBlack.svg" alt="black facebook logo"/>
                                </a>
                                <a href="https://twitter.com/ourstosave?lang=en" target="_blank">
                                    <img className="social" src="twitterBlack.svg" alt="black twitter logo"/>
                                </a>
                            </div>
                            <p>See the stories as they come by following us on <strong>social media</strong>.</p>
                        </div>
                    </div>
                    <h3 style={{textAlign: "center"}}>As featured in</h3>
                    <div id="socialProofs">
                        <div className="proof">
                            <img src="TelegraphLogo.svg" alt="black logo of The Telegraph"/>
                        </div>
                        <div className="proof">
                            <img src="EuronewsLogo.svg" alt="black logo of EuroNews"/>
                        </div>
                    </div>
                    <div id="CTAs">
                        <LoginModal>get started</LoginModal>
                    </div>
                    <hr/>
                </div>
                <h2>Crowdsourced Feed</h2>
                <div id="feedPreview">
                    <Map/>
                    <FeedPreview/>
                </div>
                <h2>Analysis & opinion from world-class journalists</h2>
                <div id="latestFeature">
                    <Query query={LATEST_FEATURE_QUERY}>
                        {({data, loading, error}) => {
                             if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                             if (error) return <p>Error: {error.message}</p>;
                             return (
                                 <LatestFeature feature={data.latestFeature}/>
                             )
                        }}
                    </Query>
                </div>
                <h3>We cover all the usual topics - politics, investment, technology, culture...</h3>
                <p>What makes us <strong>different</strong> is that our understanding and interpretation of these things is filtered through the lens of the defining battle of the next generation - <em>the battle for the planet</em>. Our content spans the <strong>Four Forces</strong> shaping the future:</p>
                <div id="tabs">
                    <Link href={{pathname: '/category', query: { category: "innovation" }}}>
                        <a className="category">
                            <div>
                                <h4>Innovation</h4>
                                <img src="innovation.svg" alt="an illustration of a lightbulb"/>
                                <p>Scientists & entrepreneurs proactively engineering the climate.</p>
                            </div>
                        </a>                    
                    </Link>
                    <Link href={{pathname: '/category', query: { category: "conservation" }}}>
                        <a className="category">
                            <div>
                                <h4>Conservation</h4>
                                <img src="conservation.svg" alt="an illustration of a hand holding the earth"/>
                                <p>Protection of wild spaces from the anthropocene's reach.</p>
                            </div>
                        </a>
                    </Link>
                    <Link href={{pathname: '/category', query: { category: "power" }}}>
                        <a className="category">
                            <div>
                                <h4>Power</h4>
                                <img src="power.svg" alt="an illustration of a powerful man sat behind a big desk"/>
                                <p>Institutions shaping the future. Government, corporations, media.</p>
                            </div>
                        </a>   
                    </Link>
                    <Link href={{pathname: '/category', query: { category: "inspiration" }}}>
                        <a className="category">
                            <div>
                                <h4>Inspiration</h4>
                                <img src="inspiration.svg" alt="an illustration of two people talking on the radio"/>
                                <p>Efforts to educate, motivate & raise awareness.</p>
                            </div>
                        </a>   
                    </Link>
                </div>
                <div id="latestFeatures">
                    <h3 style={{textAlign: "center"}}>The latest features</h3>
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
                <div id="weLove">
                    <h3 style={{textAlign: "center"}}>Features we love</h3>
                    <Query query={BOOSTED_FEATURES_QUERY}>
                        {({data, loading, error}) => {
                            if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                            if (error) return <p>Error: {error.message}</p>;
                            return (
                                <div className="boostedFeatures">
                                    {data.boostedFeatures.map(feature => {
                                        return (
                                            <FeatureCard feature={feature}/>
                                        )
                                    })}
                                </div>
                            )
                        }}
                    </Query>
                </div>
                <h1>sign up for emails</h1>
                <h1>sign up</h1>
                <h1>support</h1>
                <h1>about</h1>
            </Container>
        );
    }
}

export default index;