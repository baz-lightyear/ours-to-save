import React, { Component } from 'react';
import styled from 'styled-components';
import { visitStripe } from '../lib/utils'

const Container = styled.div`
    font-family: ${props => props.theme.serif};
    width: 95%;
    max-width: 1000px;
    margin: 1rem auto;
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
            flex-direction: column;
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
        font-family: ${props => props.theme.sansSerif};
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
    .posterInfo {
        display: flex;
        .info {
            width: 70%;
        }
        .posterWrapper {
            padding: 0rem 1rem;
            width: 30%;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                height: 260px;
                box-shadow: 0px 0px 10px lightgray;
            }
        }
        @media (max-width: 800px) {
            flex-direction: column;
            align-items: center;
            .imgContainer, .info {
                width: 100%;
                img {
                    margin: 2rem auto;
                }
            }
        }
    }
    .products {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .product {
            font-family: ${props => props.theme.serif};
            background-color: ${props => props.theme.yellow};
            box-shadow: 0px 0px 12px lightgrey;
            padding: 0.5rem;
            margin: 1rem;
            text-align: center;
            width: 13rem;
            height: 22rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .top {
                height: 1rem;
                margin-bottom: 4rem;
            }
            .middle {
                img {
                    width: 95%;
                    margin: 1rem 0;
                }
            }
            button {
                margin: 1rem 0 6px 0;
                font-family: ${props => props.theme.sansSerif};
                font-weight: bolder;
                padding: 0.5rem;
                width: 95%;
                background-color: ${props => props.theme.green};
                color: ${props => props.theme.offWhite};
                border: none;
                &:hover {
                    border: none;
                    background-color: ${props => props.theme.black};
                }
            }
        }
    }
`;

class gift extends Component {
    render() {
        return (
            <Container>
                <h1>A gift fit for the 21st Century</h1>
                <h5>Give those you love a membership to <strong>Ours to Save</strong> for full access to dedicated climate news.</h5>
                <hr/>
                <h2>They'll enjoy full access to the following benefits:</h2>
                <div className="banner">
                    <ul className="benefits">
                        <li><span className="inner">Regular profiles of <strong>climate movers and shakers</strong>, and original op-eds on the stories that matter.</span></li>
                        <li><span className="inner">An <strong>ad-free experience</strong> and the quality you'd expect from an <strong>independent</strong> publisher.</span></li>
                        <li><span className="inner">A <strong>diverse</strong> collection of voices - this is a global crisis after all.</span></li>
                        <li><span className="inner">All the other stuff: our proprietary interactive, crowdsourced news <strong>map</strong>; an email <strong>newsletter</strong>; a monthly <strong>podcast</strong> (with special episodes just for members)</span></li>
                    </ul>
                    <div className="imgContainer">
                        <img src="threeDevicesAndPoster.png" alt="screenshots of Ours to Save website on different devices"/>
                    </div>
                </div>
                <div className="infoWrapper">
                    <div className="moreInfo"><span className="icon">ℹ</span><em>Once purchased we'll email you with special instructions on setting up their gift membership.</em></div>
                </div>
                <h2>Christmas 2020 Limited Edition Prints</h2>
                <div className="posterInfo">
                    <div className="posterWrapper">
                        <img src="Poster.png" alt="ours to save on a poster" className="poster"/>
                    </div>
                    <div className="info">
                        <p>Upgrade your present to be extra special with a limited edition <strong>Ours to Save print</strong>, designed by <a href="https://abigailannaswan.myportfolio.com/" target="_blank">Abigail Anna Swan</a>. The seafoam & orange inks are printed on  A4 recycled riso paper in London by <a href="https://www.duplikat.co.uk/" target="_blank">Duplikat Press</a> - leaders in the exceptionally eco-friendly risograph printing method.</p>
                        <p>They're available to ship anywhere within the United Kingdom but if you really want one sent elsewhere, please get in touch. For delivery by Christmas we recommend you order by <strong>20th December</strong> in order to ensure they arrive on time.</p>
                    </div>
                </div>
                <hr/>
                <div className="products">
                    <div className="product">
                        <div className="top">
                            <h3>6 month subscription</h3>
                        </div>
                        <div className="middle">
                            <img src="threeDevices.png" alt=""/>
                            <h5>£30</h5>
                        </div>
                        <div className="bottom">
                            <button 
                                onClick={() => {
                                    const options = {
                                        priceId: "price_1HtxGoIcB8KtT8kgkCuCjQ9g",
                                        mode: "payment", 
                                        successRoute: "/giftSuccess", 
                                    }
                                    visitStripe(options)
                                }}
                            >
                                checkout
                            </button>
                        </div>
                    </div>
                    <div className="product">
                        <div className="top">
                            <h3>6 month + print</h3>
                        </div>
                        <div className="middle">
                            <img src="threeDevicesAndPoster.png" alt=""/>
                            <h5>£35</h5>
                        </div>
                        <div className="bottom">
                            <button 
                                onClick={() => {
                                    const options = {
                                        priceId: "price_1HuOTUIcB8KtT8kg0WAes53y",
                                        mode: "payment", 
                                        successRoute: "/giftSuccess", 
                                        addressInstruction: "includeShippingAddress"
                                    }
                                    visitStripe(options)
                                }}
                            >
                                checkout
                            </button>
                        </div>
                    </div>
                    <div className="product">
                        <div className="top">
                            <h3>12 month subscription</h3>
                        </div>
                        <div className="middle">
                            <img src="threeDevices.png" alt=""/>
                            <h5>£50</h5>
                        </div>
                        <div className="bottom">
                            <button 
                                onClick={() => {
                                    const options = {
                                        priceId: "price_1HuOQtIcB8KtT8kgpPvYZFca",
                                        mode: "payment", 
                                        successRoute: "/giftSuccess", 
                                    }
                                    visitStripe(options)
                                }}
                            >
                                checkout
                            </button>
                        </div>
                    </div>
                    <div className="product">
                        <div className="top">
                            <h3>12 month + print</h3>
                        </div>
                        <div className="middle">
                            <img src="threeDevicesAndPoster.png" alt=""/>
                            <h5>£55</h5>
                        </div>
                        <div className="bottom">
                            <button 
                                onClick={() => {
                                    const options = {
                                        priceId: "price_1HuOTDIcB8KtT8kgLPqC3Vie",
                                        mode: "payment", 
                                        successRoute: "/giftSuccess", 
                                        addressInstruction: "includeShippingAddress"
                                    }
                                    visitStripe(options)
                                }}
                            >
                                checkout
                            </button>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
}

export default gift;