import React, { Component } from 'react';
import styled from 'styled-components';
import { visitStripe } from '../lib/utils';
import { CREATE_STRIPE_CUSTOMER } from './Apollo';
import StripeChecks from './StripeChecks'
import { Mutation } from 'react-apollo'


const Container = styled.div`
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
            width: 15rem;
            height: 25rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
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
                            <h2>Pay monthly</h2>
                        </div>
                        <div className="middle">
                            <img src="threeDevices.png" alt=""/>
                            <h5>£5 / month</h5>
                            <small><strong>£1.15</strong> / week after your 3-day free trial ends</small>
                        </div>
                        <div className="bottom">
                            {/* There are a series of checks we need to take the user through before we take them to the stripe checkout page */}
                            <StripeChecks me={this.props.me} referred={this.props.referred} referrerId={this.props.referrerId} showReferralDialogue={this.state.showReferralDialogue} closeReferralDialogue={() => {this.setState({showReferralDialogue: false})}}/>
                            {/* once passed both tests */}
                            {this.props.me && !this.state.showReferralDialogue &&
                                <Mutation mutation={CREATE_STRIPE_CUSTOMER} variables={{userId: this.props.me.id}}>
                                    {(createStripeCustomer, {error, loading}) => {
                                        return (
                                            <button 
                                                onClick={async () => {
                                                    const updatedUser = await createStripeCustomer()
                                                    const options = {
                                                        priceId: "price_1Hdkm6IcB8KtT8kgUkoMXapO",
                                                        mode: "subscription", 
                                                        successRoute: "/account", 
                                                        stripeCustomerId: updatedUser.data.createStripeCustomer.stripeCustomerId
                                                    }
                                                    visitStripe(options)
                                                }}
                                            >
                                                {!loading && "checkout"}
                                                {loading && <img width="24px" src="greyLoading.gif" alt="loading gif"/>}
                                            </button>
                                        )
                                    }}
                                </Mutation>
                            }
                        </div>
                    </div>
                    <div className="products">
                        <div className="product">
                            <div className="top">
                                <h2>Pay annually</h2>
                            </div>
                            <div className="middle">
                                <img src="threeDevices.png" alt=""/>
                                <h5>£50 / year</h5>
                                <small><strong>£0.95</strong> / week after your 3-day free trial ends</small>
                            </div>
                            <div className="bottom">
                                <StripeChecks me={this.props.me} referred={this.props.referred} referrerId={this.props.referrerId} showReferralDialogue={this.state.showReferralDialogue} closeReferralDialogue={() => {this.setState({showReferralDialogue: false})}}/>
                                {this.props.me && !this.state.showReferralDialogue &&
                                    <Mutation mutation={CREATE_STRIPE_CUSTOMER} variables={{userId: this.props.me.id}}>
                                        {(createStripeCustomer, {error, loading}) => {
                                            return (
                                                <button 
                                                    onClick={async () => {
                                                        const updatedUser = await createStripeCustomer()
                                                        const options = {
                                                            priceId: "price_1HdklpIcB8KtT8kgJVP0lRJX",
                                                            mode: "subscription", 
                                                            successRoute: "/account", 
                                                            stripeCustomerId: updatedUser.data.createStripeCustomer.stripeCustomerId
                                                        }
                                                        visitStripe(options)
                                                    }}
                                                >
                                                    {!loading && "checkout"}
                                                    {loading && <img width="24px" src="greyLoading.gif" alt="loading gif"/>}
                                                </button>
                                            )
                                        }}
                                    </Mutation>
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