import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link'

const Container = styled.div`
    width: 90%;
    max-width: 800px;
    margin: 1rem auto;
    font-family: ${props => props.theme.serif};
    h1 {
        text-align: center;
        /* color: ${props => props.theme.green}; */
        margin-bottom: 0px;
    }
    .text {
        width: 50%;
    }
    .green {
        color: ${props => props.theme.green}
    }
    a {
        color: ${props => props.theme.green}
    }
    .section1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .imgDiv {
            background-image: url("covidMap.png");
            height: 400px;
            width: 300px;
            margin: 3rem 0rem 3rem 3rem;
            background-size: cover;
        }
        @media (max-width: 780px) {
            flex-direction: column;
            .text {
                width: 100%;
            }
            .imgDiv {
                margin: 3rem;
            }
        }
    }
    .section2 {
        display: flex;
        text-align: right;
        align-items: center;
        justify-content: space-between;
        .imgDiv {
            background-image: url("speaker.png");
            height: 400px;
            width: 300px;
            margin: 3rem 3rem 3rem 0rem;
            background-size: cover;
        }
        @media (max-width: 780px) {
            flex-direction: column-reverse;
            text-align: left;
            .text {
                width: 100%;
            }
            .imgDiv {
                margin: 3rem;
            }
        }
    }
    .section3 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .imgDiv {
            background-image: url("scientist.png");
            height: 400px;
            width: 300px;
            margin: 3rem 0rem 3rem 3rem;
            background-size: cover;
        }
        @media (max-width: 780px) {
            flex-direction: column;
            .text {
                width: 100%;
            }
            .imgDiv {
                margin: 3rem;
            }
        }
    }
    .section4 {
        display: flex;
        align-items: center;
        text-align: right;
        justify-content: space-between;
        .imgDiv {
            background-image: url("strike.png");
            height: 400px;
            width: 300px;
            margin: 3rem 3rem 3rem 0rem;
            background-size: cover;
        }
        @media (max-width: 780px) {
            flex-direction: column-reverse;
            text-align: left;
            .text {
                width: 100%;
            }
            .imgDiv {
                margin: 3rem;
            }
        }
    }
`;

class about extends Component {
    render() {
        return (
            <>
            <Container>
                <h1>About us</h1>
                <div className="section1">
                    <div className="text">
                        <h3>Who are we?</h3>
                        <p>Climate change is already happening. But there are a lot of people already on the case. <br/><br/>
                        Inspired by the impact of rolling news coverage during the covid-19 pandemic, we want to replicate this level of urgency for another crisis – one that’s just around the corner, but that we still largely have the power to prevent. <br/><br/>
                        We want to make it easier to visualise where we’re making progress and where we’re failing, and therefore possible to hold the powerful to account and lift up those fighting back from the grassroots. <br/><br/>
                        So, we’ve made an interactive platform for crowdsourced, global climate news - which is constantly updated by our brilliant team of volunteers, and open to contributions from anyone else who has something to say.</p>

                    </div>
                    <div className="imgDiv"></div>
                </div>
                <div className="section2">
                    <div className="imgDiv"></div>
                    <div className="text">
                        <h3>How does it work?</h3>
                        <p>Our climate map is free for all to access. You can scroll over the pins or down the feed, checking out stories from your neighbourhood and much further afield. <br/><br/>

                        On our news page you’ll find in-depth investigations of the issues raised on the map, features and op-eds by prominent and emerging journalists. As of September 2020, we will introduce a small monthly fee (provisionally £3) for our Founding Members to access these in-depth investigations. </p>
                    </div>
                </div>
                <div className="section3">
                    <div className="text">
                        <h3>Get in touch</h3>
                        <p>If you’d like to submit a snippet of breaking news, you can do so <Link href="addStory"><a><strong>here</strong></a></Link>.<br/><br/>

                        We accept pitches - for short profiles and longer in-depth features - at the end of every month for the month ahead. Please email <span className="green"><strong><a href="mailto:hello@ourstosave.com">hello@ourstosave.com</a></strong></span> with a bit about yourself and your idea.</p>
                    </div>
                    <div className="imgDiv"></div>
                </div>
                <div className="section4">
                    <div className="imgDiv"></div>
                    <div className="text">
                        <h3>Just so you know –</h3>
                        <p>The news on our map is primarily crowdsourced. If you spot any errors please let us know. Fake news isn't going to help us beat climate change.<br/><br/>

                        All of our features are edited before publication.</p>
                    </div>
                </div>
            </Container>
            </>
        );
    }
}

export default about;