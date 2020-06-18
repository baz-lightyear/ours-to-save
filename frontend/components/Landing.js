import React, { Component } from 'react';
import styled from 'styled-components';
import LoginModal from '../components/LoginModal.js'

const Container = styled.div`
    h3 {
        margin-top: 2rem;
        font-family: ${props => props.theme.serif};

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
                width: 20rem;
                margin: 2rem auto;
                height: 4rem;
                object-fit: contain;
            }
        }
    }
    #CTAs {
        text-align: center;
        margin: 1rem;
    }
`

class Landing extends Component {
    render() {
        return (
            <Container>
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
                        <img src="TimeOut.svg" alt="black logo of Time Out"/>
                    </div>
                    <div className="proof">
                        <img src="EuronewsLogo.svg" alt="black logo of EuroNews"/>
                    </div>
                </div>
                <div id="CTAs">
                    <LoginModal>get started</LoginModal>
                </div>
                <hr/>
            </Container>
        );
    }
}

export default Landing;