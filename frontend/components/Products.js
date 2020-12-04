import React, { Component } from 'react';
import styled from 'styled-components';
import { visitStripe } from '../lib/utils';
import StripeChecks from './StripeChecks'


const Container = styled.div`
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
`

class Products extends Component {
    state = {
        showReferralDialogue: this.props.referred
    }
    render() {
        return (
            <Container>
                <div className="products">
                    <div className="product">
                        <div className="top">
                            <h3>Monthly membership</h3>
                            <ul>
                                <li><span className='inner'>6 months' full access to original journalism covering the biggest issue of our times</span></li>
                                <li><span className='inner'>Support independent journalism</span></li>
                                <li><span className='inner'>Diverse ideas and representative writing panel</span></li>
                            </ul>
                        </div>
                        <div className="bottom">
                            <h5>£30</h5>

                            {/* There are a series of checks we need to take the user through before we take them to the stripe checkout page */}
                            <StripeChecks me={this.props.me} referred={this.props.referred} referrerId={this.props.referrerId} showReferralDialogue={this.state.showReferralDialogue} closeReferralDialogue={() => {this.setState({showReferralDialogue: false})}}/>
                            {/* once passed both tests */}
                            {this.props.me && !this.state.showReferralDialogue &&
                                <button 
                                    // here we create a stripe customer in case none exists, and refetch the current user query (OR change the code 6 lines down)
                                    onClick={() => {
                                        const options = {
                                            priceId: "price_1Hdkm6IcB8KtT8kgUkoMXapO",
                                            mode: "subscription", 
                                            successRoute: "/news",
                                            stripeCustomerId: this.props.me.stripeCustomerId,
                                        }
                                        visitStripe(options)
                                    }}
                                >
                                    checkout
                                </button>
                            }
                        </div>
                    </div>
                    <div className="products">
                        <div className="product">
                            <div className="top">
                                <h3>Yearly membership</h3>
                                <ul>
                                    <li><span className='inner'>6 months' full access to original journalism covering the biggest issue of our times</span></li>
                                    <li><span className='inner'>Support independent journalism</span></li>
                                    <li><span className='inner'>Diverse ideas and representative writing panel</span></li>
                                </ul>
                            </div>
                            <div className="bottom">
                                <h5>£50</h5>
                                <StripeChecks me={this.props.me} referred={this.props.referred} referrerId={this.props.referrerId} showReferralDialogue={this.state.showReferralDialogue} closeReferralDialogue={() => {this.setState({showReferralDialogue: false})}}/>
                                {this.props.me && !this.state.showReferralDialogue &&
                                    <button 
                                        onClick={() => {
                                            const options = {
                                                priceId: "price_1HdklpIcB8KtT8kgJVP0lRJX",
                                                mode: "subscription", 
                                                successRoute: "/news", 
                                                stripeCustomerId: this.props.me.stripeCustomerId,
                                                
                                            }
                                            visitStripe(options)
                                        }}
                                    >
                                        checkout
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
}

export default Products;