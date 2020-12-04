import React, { Component } from 'react';
import styled from 'styled-components';
import { visitStripe } from '../lib/utils'

const Container = styled.div`
    width: 95%;
    max-width: 1000px;
    margin: 1rem auto;
    .products {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        .product {
            font-family: ${props => props.theme.serif};
            background-color: ${props => props.theme.yellow};
            box-shadow: 0px 0px 12px lightgrey;
            padding: 0.5rem;
            margin: 0.5rem;
            text-align: center;
            width: 18rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            ul {
                color: ${props => props.theme.green};
                list-style-type: "✔";
                text-align: left;
                padding-left: 0px;
                margin-left: 1rem;
                .inner {
                    color: ${props => props.theme.black};
                    position: relative;
                    left: 8px;
                    padding-right: 1rem;
                }
            }
            button {
                margin-bottom: 6px;
                font-family: ${props => props.theme.sansSerif};
                padding: 0.5rem;
                width: 95%;
                font-weight: normal;
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
                <h1>Buy a gift card</h1>
                <p>Some marketing spiel</p>
                <div className="products">
                    <div className="product">
                        <div className="top">
                            <h3>Gift 6 months</h3>
                            <ul>
                                <li><span className='inner'>6 months' full access to original journalism covering the biggest issue of our times</span></li>
                                <li><span className='inner'>Support independent journalism</span></li>
                                <li><span className='inner'>Diverse ideas and representative writing panel</span></li>
                            </ul>
                        </div>
                        <div className="bottom">
                            <h5>£30</h5>
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
                            <h3>12 months</h3>
                            <ul>
                                <li><span className='inner'>12 months' full access to original journalism covering the biggest issue of our times</span></li>
                                <li><span className='inner'>Support independent journalism</span></li>
                                <li><span className='inner'>Diverse ideas and representative writing panel</span></li>
                            </ul>
                        </div>
                        <div className="bottom">
                            <h5>£50</h5>
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
                            <h3>6 months POSTER</h3>
                            <ul>
                                <li><span className='inner'>6 months' full access to original journalism covering the biggest issue of our times</span></li>
                                <li><span className='inner'>Support independent journalism</span></li>
                                <li><span className='inner'>Diverse ideas and representative writing panel</span></li>
                                <li><span className='inner'>Beautifully designed poster yadda yadda yadda by yadda yadda yadda</span></li>
                            </ul>
                        </div>
                        <div className="bottom">
                            <h5>£35</h5>
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
                            <h3>12 months POSTER</h3>
                            <ul>
                                <li><span className='inner'>12 months' full access to original journalism covering the biggest issue of our times</span></li>
                                <li><span className='inner'>Support independent journalism</span></li>
                                <li><span className='inner'>Diverse ideas and representative writing panel</span></li>
                                <li><span className='inner'>Beautifully designed poster yadda yadda yadda by yadda yadda yadda</span></li>
                            </ul>
                        </div>
                        <div className="bottom">
                            <h5>£55</h5>
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
                this is where you can buy a gift card
            </Container>
        );
    }
}

export default gift;