import React, { Component } from 'react';
import { CURRENT_USER_QUERY, CREATE_STRIPE_CUSTOMER_ID, CREATE_STRIPE_BILLING_SESSION, CREATE_STRIPE_SUBSCRIPTION} from '../components/Apollo';
import Cookies from 'universal-cookie';
import { Query, Mutation } from 'react-apollo';
import styled from 'styled-components';
import Router from 'next/router'
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_51HDyyHIcB8KtT8kgeO0eGq0SflBIGCgTzMSDWIlXyG4Am9Q01lpNjl7zS40e93dK5j94lOyGnaR2bBnf8K6bSpyv00bGnVCPMR')

const cookies = new Cookies()

const Container = styled.div`

`;

class account extends Component {
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

                                {/* make stripe customer id if they haven't got one */}
                                {!me.stripeCustomerId &&
                                    <Mutation mutation={CREATE_STRIPE_CUSTOMER_ID} variables={{userId: me.id}}>
                                        {(createStripeCustomerId, {error, loading}) => {
                                            return (
                                                <button onClick={(e) => {
                                                    e.preventDefault()
                                                    createStripeCustomerId().then(response => {
                                                        Router.reload()
                                                    })
                                                }}>create stripe customer id</button>
                                            )
                                        }}
                                    </Mutation>
                                }

                                {/* create a subcription */}
                                {me.stripeCustomerId &&
                                    <Mutation mutation={CREATE_STRIPE_SUBSCRIPTION} variables={{userId: me.id}}>
                                    {(createStripeSubscription, {error, loading}) => {
                                        return (
                                            <button onClick={ async (e) => {
                                                e.preventDefault()
                                                await createStripeSubscription().then( async response => {
                                                    const stripe = await stripePromise;
                                                    const sessionId = response.data.createStripeSubscription.stripeCheckoutSessionId
                                                    await stripe.redirectToCheckout({
                                                        sessionId
                                                    });
                                                })
                                            }}>create stripe subscription</button>
                                        )
                                    }}
                                </Mutation>
                                }

                                {/* access portal to manage subscription */}
                                {me.stripeCustomerId && 
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
                            <p>you should sign up or log in mate</p>
                        )
                    }
                }}
            </Query>
        );
    }
}

export default account;