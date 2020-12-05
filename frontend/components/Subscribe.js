import React, { Component } from 'react';
import Products from './Products.js';
import styled from 'styled-components';
import Link from 'next/link'
import {Query} from 'react-apollo'
import FeatureCard from './FeatureCard'
import { BOOSTED_FEATURES_QUERY } from './Apollo.js';

const Container = styled.div`
    text-align: left;
    .banner {
        display: flex;
        .benefits {
            width: 50%;
            display: flex;
            flex-wrap: wrap;
            color: ${props => props.theme.green};
            list-style-type: "✔";
            text-align: left;
            margin-right: 1rem;
            .inner {
                display: block;
                color: ${props => props.theme.black};
                padding-left: 1rem;
            }
        }
        .imgContainer {
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 80%;
            }
        }
        @media (max-width: 800px) {
            flex-direction: column-reverse;
            .imgContainer, .benefits {
                width: 100%;
                img {
                    margin: 2rem auto;
                }
            }
        }
    }
    .infoWrapper {
        text-align: center;
        .moreInfo {
            background-color: white;
            padding: 1rem;
            margin: 1rem auto;
            display: inline-flex;
            align-items: center;
            .icon {
                font-size: 2rem;
                margin-right: 1rem;
            }
        }
    }
    .sampleFeatures {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .testimonials {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .testimonial {
            text-align: center;
            padding: 1rem;
            width: 30%;
            @media (max-width: 1000px) {
                width: 40%;
            }
            @media (max-width: 700px) {
                width: 100%;
            }
            margin: 1rem;
        }
    }
`

class Subscribe extends Component {
    render() {
        return (
            <Container>
                <h1>Engage with the defining issue of our lifetime</h1>
                <h5>Become a member of <strong>Ours to Save</strong> for full access to dedicated climate news, analysis & opinion</h5>
                <hr/>
                <h2>Members enjoy full access to the following benefits:</h2>
                <div className="banner">
                    <ul className="benefits">
                        <li><span className="inner">Regular profiles of <strong>climate movers and shakers</strong>, and original op-eds on the stories that matter.</span></li>
                        <li><span className="inner">An <strong>ad-free experience</strong> and the quality you'd expect from an <strong>independent</strong> publisher.</span></li>
                        <li><span className="inner">A <strong>diverse</strong> collection of voices - this is a global crisis after all.</span></li>
                        <li><span className="inner">All the other stuff: our proprietary interactive, crowdsourced news <strong>map</strong>; an email <strong>newsletter</strong>; a monthly <strong>podcast</strong> (with special episodes just for members)</span></li>
                    </ul>
                    <div className="imgContainer">
                        <img src="threeDevices.png" alt="screenshots of Ours to Save website on different devices"/>
                    </div>
                </div>
                <hr/>
                {/* Screenshot in phone / computer */}
                <Products me={this.props.me} referred={this.props.referred} referrerId={this.props.referrerId}/>
                <div className="infoWrapper">
                    <div className="moreInfo"><span className="icon">ℹ</span><em>Cancel anytime. Promotion codes can be applied at checkout. We also offer <Link href="/gift">gift options</Link>.</em></div>
                </div>
                <hr/>
                <h2>Try some sample journalism for free</h2>
                <p>Browse our latest op-eds to get a feel for our representative, solutions-oriented climate journalism.</p>
                <Query query={BOOSTED_FEATURES_QUERY}>
                    {({data, loading, error}) => {
                        if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                        if (error) return <p>Error: {error.message}</p>;
                        return (
                            <div className="sampleFeatures">
                                {data.boostedFeatures.map(feature => {
                                    return (
                                        <FeatureCard feature={feature} key={feature.id} skipPaywall={true}/>
                                    )
                                })}
                            </div>
                        )
                    }}
                </Query>
                <hr/>
                {/* <h2>Testimonials</h2>
                <div className="testimonials">
                    <div className="testimonial">
                        <p><em>This is something I really love about climate journalism, yadda yadda yadda</em></p>
                        <p>By so and so of such-and-such</p>
                    </div>
                    <div className="testimonial">
                        <p><em>This is something I really love about climate journalism, yadda yadda yadda</em></p>
                        <p>By so and so of such-and-such</p>
                    </div>
                    <div className="testimonial">
                        <p><em>This is something I really love about climate journalism, yadda yadda yadda</em></p>
                        <p>By so and so of such-and-such</p>
                    </div>
                </div> */}
                <Products me={this.props.me} referred={this.props.referred} referrerId={this.props.referrerId}/>
            </Container>
        );
    }
}

export default Subscribe;
