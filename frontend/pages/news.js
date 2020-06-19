import React, { Component } from 'react';
import styled from 'styled-components';
import Map from '../components/Map'
import FeedPreview from '../components/FeedPreview.js'
import LatestFeature from '../components/LatestFeature.js'
import FeatureCard from '../components/FeatureCard.js'

import Link from 'next/link';

import { Query } from 'react-apollo'
import { LATEST_FEATURE_QUERY, RECENT_FEATURES_QUERY, BOOSTED_FEATURES_QUERY, CURRENT_USER_QUERY } from '../components/Apollo'
import LoginModal from '../components/LoginModal';

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
    }
    #feedPreview {
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
    #aAndO {
        margin: 3rem auto;
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
    .login {
        margin: 2rem auto;
        text-align: center;
    }
`;

class news extends Component {
    render() {
        return (
            <Container>
                <Query query={CURRENT_USER_QUERY}>
                    {({data, error, loading}) => {
                        if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                        if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                        const me = data.me === null ? null : data.me
                        return (
                            <>
                            <div id="newsHeader">
                                <h1>The climate crisis is underway.</h1>
                                {/* <p>Join us on our journey to better understand and respond to the defining challenge of the century.</p> */}
                                <hr/>
                            </div>
                            <h2>Crowdsourced map</h2>
                            <div id="feedPreview">
                                <Map/>
                                <div id="previewWrapper">
                                    <FeedPreview/>
                                </div>
                            </div>
                            <h2 id="aAndO">Analysis & opinion from world-class journalists</h2>
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
                                                        <FeatureCard feature={feature} key={feature.id}/>
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
                                                        <FeatureCard feature={feature} key={feature.id}/>
                                                    )
                                                })}
                                            </div>
                                        )
                                    }}
                                </Query>
                            </div>
                            <div className="login">
                                {!me && <LoginModal>log in / sign up</LoginModal>}
                            </div>
                            </>
                        )
                    }}
                </Query>
            </Container>
        );
    }
}

export default news;