import React, { Component } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import LoginModal from '../components/LoginModal'
import { CURRENT_USER_QUERY } from '../lib/Apollo';
import Fade from 'react-reveal'
import { Query } from 'react-apollo'
import Cookies from 'universal-cookie';

const cookies = new Cookies()

const Container = styled.div`
    font-family: ${props => props.theme.serif};
    button {
        width: 240px;
    }
    #hero {
        display: flex;
        .text {
            .textWrapper {
                width: 90%;
                margin: auto;        
                .CTAs {
                    justify-content: center;
                    margin: 4rem auto;
                    display: flex;
                    flex-wrap: wrap;
                    button {
                        padding: 0.5rem 2rem;
                        font-family: ${props => props.theme.sansSerif};
                        font-weight: 700;
                        margin: 1rem;
                        border: solid 2px ${props => props.theme.green};
                        background-color: ${props => props.theme.green};
                        color: ${props => props.theme.offWhite};
                        &:hover {
                            color: ${props => props.theme.offWhite};
                            border: solid 2px ${props => props.theme.black};
                            background-color: ${props => props.theme.black};
                        }
                    }
                    #browse {
                        border: solid 2px ${props => props.theme.green};
                        background-color: transparent;
                        color: ${props => props.theme.green};
                        &:hover {
                            color: ${props => props.theme.black};
                            border: solid 2px ${props => props.theme.black};
                        }
                    }
                }
            }
        }
        @media (min-width: 851px) {
            min-height: calc(100vh - 125px);
            .text {
                width: 67%;
                .textWrapper {
                    h1 {
                        margin-top: 10rem;
                        font-size: 4.5rem;
                        line-height: 1;
                        margin-bottom: 0px;
                    }
                    p {
                        font-size: 1.5rem;
                    }
                    .link {
                        margin-top: 6rem;
                        margin-bottom: 2rem;
                    }
                }
            }
        }
        .imgDiv {
            width: 33%;
            background-image: url("wakeUp.png");
            background-size: cover;
        }
        @media (max-width: 850px) {
            flex-direction: column-reverse;
            .textWrapper {
                width: 100%;
                h1 {
                    margin: 0;
                    margin-top: 1rem;
                    font-size: 3rem;
                    text-align: center;
                    line-height: 1.5;
                }
                p {
                    margin-top: 0rem;
                    text-align: center;
                }
                .link {
                    margin: 3rem 0;
                }
            }
            .imgDiv {
                width: 100%;
                height: 480px;
                background-position-y: 50%;
            }
        }
    }
    #features {
        h3 {
            margin-top: 2rem;
            font-family: ${props => props.theme.serif};
        }
        #contentModes {
            display: flex;
            /* justify-content: space-around; */
            justify-content: center;
            flex-wrap: wrap;
            .mode {
                width: 18rem;
                text-align: center;
                margin: 1rem;
                padding: 1rem;
                height: 20rem;
                color: ${props => props.theme.black};
                background-color: ${props => props.theme.yellow};
                background-image: url(littlePluses.png);                
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                .illustration {
                    height: 50%;
                    max-width: 95%;
                    margin-bottom: 2rem;
                    &#airpods {
                        padding: 1rem;
                    }
                }
                p {
                    margin: 0;
                    font-family: ${props => props.theme.sansSerif};
                }
                &:hover {
                    box-shadow: 0px 0px 4px rgba(50,50,50,0.3);
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
        .CTAs {
            text-align: center;
            margin-top: 2rem;
            button {
                padding: 0.5rem 2rem;
                font-family: ${props => props.theme.sansSerif};
                font-weight: 700;
                margin: 1rem;
                border: solid 2px ${props => props.theme.green};
                background-color: ${props => props.theme.green};
                color: ${props => props.theme.offWhite};
                &:hover {
                    color: ${props => props.theme.offWhite};
                    border: solid 2px ${props => props.theme.black};
                    background-color: ${props => props.theme.black};
                }
            }
            #browse {
                border: solid 2px ${props => props.theme.green};
                background-color: transparent;
                color: ${props => props.theme.green};
                &:hover {
                    color: ${props => props.theme.black};
                    border: solid 2px ${props => props.theme.black};
                }
            }
        }
    }
    #socialProof {
        color: ${props => props.theme.offWhite};
        background-color: ${props => props.theme.black};
        padding: 1rem 0;
        #socialProofs {
            max-width: 90%;
            margin: auto;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            align-items: center;
            .proof {
                img {
                    width: 18rem;
                    margin: 2rem auto;
                    height: 4rem;
                    object-fit: contain;
                    &#TimeOut {
                        height: 6rem;
                    }
                }
            }
        }
    }
    #categories {
        width: 95%;
        margin: auto;
        text-align: center;
        h3 {
            margin-top: 3rem;
        }
        p {
            margin-bottom: 3rem;
            max-width: 1000px
            margin: auto;
        }
        #tabs {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            .category {
                margin: 1rem 0.5rem;
                width: 240px;
                @media (max-width: 480px) {
                    width: 90%;
                }
                text-align: center;
                color: ${props => props.theme.black};
                border-radius: 2px;
                font-family: ${props => props.theme.serif};
                p {
                    margin: 2rem 8px 1rem 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 3rem;
                }
                img {
                    width: 100%;
                    transition-duration: 0.5s;
                    object-fit: contain;
                }
                &:hover {
                    img {
                        transform: scale(1.05);
                        transition-duration: 0.5s;
                        object-fit: contain;
                    }
                }
            }
        }
        .CTAs {
            justify-content: center;
            margin: 1rem auto;
            display: flex;
            flex-wrap: wrap;
            button {
                padding: 0.5rem 2rem;
                font-family: ${props => props.theme.sansSerif};
                font-weight: 700;
                margin: 1rem;
                border: solid 2px ${props => props.theme.green};
                background-color: ${props => props.theme.green};
                color: ${props => props.theme.offWhite};
                &:hover {
                    color: ${props => props.theme.offWhite};
                    border: solid 2px ${props => props.theme.black};
                    background-color: ${props => props.theme.black};
                }
            }
            #browse {
                border: solid 2px ${props => props.theme.green};
                background-color: transparent;
                color: ${props => props.theme.green};
                &:hover {
                    color: ${props => props.theme.black};
                    border: solid 2px ${props => props.theme.black};
                }
            }
        }
    }
`;

class index extends Component {    
    render() {
        return (
            <Container>
                 <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}>
                    {({data, error, loading}) => {
                        if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                        if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                        const me = data.me === null ? null : data.me
                        return (
                            <>
                            <div id="hero">
                                <div className="text">
                                    <div className="textWrapper">
                                        <h1>It's ours to save.</h1>
                                        <p><em>Ours to Save</em> is a new kind of publication that makes it easier to engage with the climate crisis, by harnessing the power of <strong>technology</strong> and <strong>community</strong>.</p>
                                        <div className="CTAs">
                                            {/* <Link href="/feed"><a><button id="browse">explore free map</button></a></Link> */}
                                            <Link href="/features"><a><button id="browse">explore stories</button></a></Link>
                                            {(!me || !(me.permissions.includes("PREMIUM"))) && <Link href="/account"><a><button>become a member</button></a></Link>}
                                            {me && me.permissions.includes("PREMIUM") && <Link href="/features"><a><button>browse features</button></a></Link>}
                                        </div> 
                                    </div>
                                </div>
                                <div className="imgDiv">
                                </div>
                            </div>
                            <div id="socialProof">
                                <h3 style={{textAlign: "center"}}>As featured in</h3>
                                <div id="socialProofs">
                                    <Fade bottom>
                                        <div className="proof">
                                            <img src="TelegraphLogo.svg" alt="black logo of The Telegraph"/>
                                        </div>
                                    </Fade>
                                    <Fade bottom>
                                        <div className="proof">
                                            <img src="TimeOut.svg" id="TimeOut" alt="black logo of Time Out"/>
                                        </div>
                                    </Fade>
                                    <Fade bottom>
                                        <div className="proof">
                                            <img src="EuronewsLogo.svg" alt="black logo of EuroNews"/>
                                        </div>
                                    </Fade>
                                </div>
                            </div>
                            <div id="features">
                                <h3 style={{textAlign: "center"}}>We're a new kind of publication</h3>
                                <div id="contentModes">
                                    {/* <Fade bottom>
                                        <Link href="/feed">
                                            <a>
                                                <div id="feed" className="mode">
                                                    <img className="illustration" src="globe.svg" alt="black illustration of a globe"/>
                                                    <p>Our <strong>crowdsourced interactive map</strong> is a constantly-updated news feed that exposes stories from all around the world. It's totally free and anyone can contribute.</p>
                                                </div>
                                            </a>
                                        </Link>
                                    </Fade> */}
                                    <Fade bottom>

                                        <Link href="/features">
                                            <a>
                                                <div id="features" className="mode">
                                                    <img className="illustration" id="lightbulb" src="lightbulb.svg" alt="black illustration of a lightbulb"/>
                                                    <p>Members have access to a curated selection of <strong>full-length features</strong> from world-class journalists, to examine the facts beneath the headlines.</p>
                                                </div>
                                            </a>
                                        </Link>
                                    </Fade>
                                    <Fade bottom>

                                        <Link href="/podcast">
                                            <a>
                                                <div id="podcast" className="mode">
                                                    <img className="illustration" id="airpods" src="airpods.svg" alt="black illustration of airpods"/>
                                                    <p>Make sense of the weekly stories and hear directly from climate movers-and-shakers with our <strong>podcast</strong>.</p>
                                                </div>
                                            </a>
                                        </Link>
                                    </Fade>
                                </div>
                                <div className="CTAs">
                                    <Link href="/features"><a><button id="browse">explore stories</button></a></Link>
                                    {(!me || !(me.permissions.includes("PREMIUM"))) && <Link href="/account"><a><button>become a member</button></a></Link>}
                                    {me && me.permissions.includes("PREMIUM") && <Link href="/features"><a><button>browse features</button></a></Link>}
                                </div> 
                            </div>
                            <div id="categories">
                                <h3>We cover all the usual topics - politics, investment, technology, culture...</h3>
                                <p>What makes us <strong>different</strong> is that our understanding and interpretation of these things is filtered through the lens of the defining battle of the next generation - <em>the battle for the planet</em>. Our content spans the <strong>Four Pressures</strong> that we believe will shape the future:</p>
                                <div id="tabs">
                                    <Link href={{pathname: '/category', query: { category: "innovation" }}}>
                                        <a className="category">
                                            <div>
                                                <img src="innovationCard.png" alt=""/>
                                                <p>Scientists & entrepreneurs proactively engineering the climate.</p>
                                            </div>
                                        </a>                    
                                    </Link>
                                    <Link href={{pathname: '/category', query: { category: "conservation" }}}>
                                        <a className="category">
                                            <div>
                                                <img src="conservationCard.png" alt=""/>
                                                <p>Protection of wild spaces from the anthropocene's reach.</p>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href={{pathname: '/category', query: { category: "power" }}}>
                                        <a className="category">
                                            <div>
                                                <img src="powerCard.png" alt=""/>
                                                <p>Institutions shaping the future. Government, corporations, media.</p>
                                            </div>
                                        </a>   
                                    </Link>
                                    <Link href={{pathname: '/category', query: { category: "inspiration" }}}>
                                        <a className="category">
                                            <div>
                                                <img src="inspirationCard.png" alt=""/>
                                                <p>Efforts to educate, motivate & raise awareness.</p>
                                            </div>
                                        </a>   
                                    </Link>
                                </div>
                                <div className="CTAs">
                                    <Link href="/features"><a><button id="browse">explore stories</button></a></Link>
                                    {(!me || !(me.permissions.includes("PREMIUM"))) && <Link href="/account"><a><button>become a member</button></a></Link>}
                                    {me && me.permissions.includes("PREMIUM") && <Link href="/features"><a><button>browse features</button></a></Link>}
                                </div>                       
                                </div>
                            </>
                        )
                    }}
                </Query>
                {/* <Founders/> */}
            </Container>
        );
    }
}

export default index;