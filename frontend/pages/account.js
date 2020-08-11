import React, { Component } from 'react';
import { CURRENT_USER_QUERY, CREATE_STRIPE_BILLING_SESSION, CREATE_STRIPE_SUBSCRIPTION} from '../components/Apollo';
import LoginModal from '../components/LoginModal'
import Cookies from 'universal-cookie';
import { Query, Mutation } from 'react-apollo';
import styled from 'styled-components';
import Router from 'next/router'
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link'

const stripePromise = loadStripe('pk_live_51HDyyHIcB8KtT8kgeO0eGq0SflBIGCgTzMSDWIlXyG4Am9Q01lpNjl7zS40e93dK5j94lOyGnaR2bBnf8K6bSpyv00bGnVCPMR')

const cookies = new Cookies()

const Container = styled.div`

`;

class account extends Component {
    state = {
        consent: false
    }
    render() {
        return (
            <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}>
                {({data, error, loading}) => {
                    if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                    if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                    const me = data.me === null ? null : data.me
                    if (me) {
                        return (
                            <Container>
                                <h1>Hi, {me.name}</h1>

                                {me.permissions.includes("EDITOR") && 
                                    <Link href={"/editor"}><a>Write a new feature</a></Link>
                                }

                                {/* create a subcription */}
                                {!me.permissions.includes("PREMIUM") &&
                                    <Mutation mutation={CREATE_STRIPE_SUBSCRIPTION} variables={{userId: me.id, priceId: "price_1HEK2oIcB8KtT8kgcw28vURb"}}>
                                        {(createStripeSubscription, {error, loading}) => {
                                            return (
                                                <div>
                                                    <label>
                                                        <input type="checkbox" onChange={e => this.setState({consent: e.target.checked})}/>
                                                        I consent to the <a href="/terms" target="_blank">terms</a> (opens in new window).
                                                    </label>
                                                    <button disabled={!this.state.consent} onClick={ async (e) => {
                                                        e.preventDefault()
                                                        await createStripeSubscription().then( async response => {
                                                            const stripe = await stripePromise;
                                                            const sessionId = response.data.createStripeSubscription.stripeCheckoutSessionId
                                                            await stripe.redirectToCheckout({
                                                                sessionId
                                                            });
                                                        })
                                                    }}>create stripe subscription</button>
                                                </div>
                                            )
                                        }}
                                    </Mutation>
                                }

                                {/* refer to get credit */}
                                {me.permissions.includes("PREMIUM") &&
                                    <>
                                    <p>You currently have £{(-1*(me.stripeCustomerBalance/100)) || 0} in your account. Share for an extra £3.</p>
                                    <p>Here is a nice referral code</p>
                                    <p className='code'><a href={`https://www.ourstosave.com/referred?userId=${me.id}`}>https://www.ourstosave.com/referred?userId={me.id}</a></p>
                                    </>
                                }

                                {/* access portal to manage subscription */}
                                {me.permissions.includes("PREMIUM") && 
                                    <Mutation mutation={CREATE_STRIPE_BILLING_SESSION} variables={{userId: me.id}}>
                                        {(createStripeBillingSession, {error, loading}) => {
                                            return (
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        createStripeBillingSession().then(response => {
                                                            window.location.replace(response.data.createStripeBillingSession.stripeBillingSessionUrl); 
                                                        })
                                                    }}
                                                >
                                                    click to go to stripe portal
                                                </button>
                                            )
                                        }}
                                    </Mutation>
                                }

                            </Container>
                        )
                    }
                    if (!me) {
                        return (
                            <LoginModal>log in / sign up</LoginModal>
                        )
                    }
                }}
            </Query>
        );
    }
}

export default account;