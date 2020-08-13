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
    width: 95%;
    max-width: 800px;
    margin: 1rem auto;
    .code {
        padding: 1rem;
        background-color: ${props => props.theme.yellow};
        border-radius: 4px;
        text-align: center;
    }
    button {
        display: block;
        margin: auto;
    }
`;

const PleaseLogin = styled.div`
    width: 95%;
    margin: 1rem auto;
    text-align: center;
`

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
                                    <Link href={"/editor"}><a>✏️ Write a new feature</a></Link>
                                }

                                {/* create a subcription */}
                                {!me.permissions.includes("PREMIUM") &&
                                    <Mutation mutation={CREATE_STRIPE_SUBSCRIPTION} variables={{userId: me.id, priceId: "price_1HEK2oIcB8KtT8kgcw28vURb"}}>
                                        {(createStripeSubscription, {error, loading}) => {
                                            return (
                                                <div id="newSubscriptionDiv">
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
                                        <h2>Earn credits</h2>
                                        <p>Currently you're billed for your Ours To Save premium membership, but you can add credit to your account which will be discounted from any future payments.</p>
                                        <p>You currently have £{(-1*(me.stripeCustomerBalance/100)) | 0} credit in your account.</p>
                                        <p>We want your help to spread the word about Ours To Save and make it the best it can be. For that reason we're running a time-limited scheme where <strong>you can earn £3 of credit</strong> for every new friend you sign up. Just send them the following unique link and once they set up a paid subscription, <strong>you'll both earn £3 of credit.</strong></p>
                                        <p className='code'><a href={`https://www.ourstosave.com/referred?userId=${me.id}`}>https://www.ourstosave.com/referred?userId={me.id}</a></p>
                                    </>
                                }

                                {/* access portal to manage subscription */}
                                {me.permissions.includes("PREMIUM") && 
                                    <Mutation mutation={CREATE_STRIPE_BILLING_SESSION} variables={{userId: me.id}}>
                                        {(createStripeBillingSession, {error, loading}) => {
                                            return (
                                                <>
                                                    <h2>Manage subscription</h2>
                                                    <p>To manage, cancel or view details about your subscription, please visit our payments partner, <em>Stripe</em>.</p>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            createStripeBillingSession().then(response => {
                                                                window.location.replace(response.data.createStripeBillingSession.stripeBillingSessionUrl); 
                                                            })
                                                        }}
                                                    >
                                                        manage subscription
                                                    </button>
                                                </>
                                            )
                                        }}
                                    </Mutation>
                                }

                            </Container>
                        )
                    }
                    if (!me) {
                        return (
                            <PleaseLogin>
                                <h1>Are you in the right place?</h1>
                                <p>You need to log in or sign up to access this page.</p>
                                <LoginModal>log in / sign up</LoginModal>
                            </PleaseLogin>
                        )
                    }
                }}
            </Query>
        );
    }
}

export default account;