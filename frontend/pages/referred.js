import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY, UPDATE_REFERRER_MUTATION, CREATE_STRIPE_SUBSCRIPTION } from '../components/Apollo'
import LoginModal from '../components/LoginModal'
import { loadStripe } from '@stripe/stripe-js';
import Cookies from 'universal-cookie'

const stripePromise = loadStripe('pk_live_51HDyyHIcB8KtT8kgeO0eGq0SflBIGCgTzMSDWIlXyG4Am9Q01lpNjl7zS40e93dK5j94lOyGnaR2bBnf8K6bSpyv00bGnVCPMR')

const cookies = new Cookies()

class referred extends Component {
    static async getInitialProps(ctx) {
        const referrerId = ctx.query.userId;
        return { referrerId };
    }
    state = {
        redeemed: false,
        consent: false
    }
    render() {
        return (
            <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}>
                {({data, error, loading}) => {
                    if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                    if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                    const me = data.me === null ? null : data.me
                    // Get them logged in / signed up if they're not already
                    if (!me) {
                        return (
                            <LoginModal>log in / sign up</LoginModal>
                        )
                    } else {
                        // if they're the same user, tell them off
                        if (me.id === this.props.referrerId) {
                            return (
                                <p>Are you trying to refer yourself...?</p>
                            )
                        } else {
                            // if they've already got premium, tell them it's not available
                            if (me.permissions.includes("PREMIUM")) {
                                return (
                                    <p>you already premium but you should share with someone else for creditz</p>
                                )
                            } else {
                                if (!this.state.redeemed) {
                                    return (
                                        // if they haven't got premium, update them with a 'referred by' id and give them a link to stripe checkout
                                        <>
                                            <p>cool so you're legit. here is a button to redeem code</p>
                                            <Mutation mutation={UPDATE_REFERRER_MUTATION} variables={{referrerId: this.props.referrerId, referredId: me.id}}>
                                                {(updateReferrer, {error, loading}) => {
                                                    return (
                                                        <>
                                                            <p>{this.state.error}</p>
                                                            <button onClick={async e => {
                                                                e.preventDefault()
                                                                this.setState({error: ""})
                                                                await updateReferrer().catch(err => this.setState({error: err.message})).then(res => {
                                                                    this.setState({redeemed: true})
                                                                })
                                                            }}>redeem code</button>
                                                        </>
                                                    )
                                                }}
                                            </Mutation>
                                        </>
                                    )
                                } else {
                                    return (
                                        <Mutation mutation={CREATE_STRIPE_SUBSCRIPTION} variables={{userId: me.id, priceId: "price_1HEK2oIcB8KtT8kgcw28vURb"}}>
                                            {(createStripeSubscription, {error, loading}) => {
                                                return (
                                                    <div>
                                                        <label>
                                                            <input type="checkbox" onChange={e => this.setState({consent: e.target.checked})}/>
                                                            I consent to the <a href="/terms" target="_blank">terms</a> (opens in new window).
                                                        </label>
                                                        <p>on the next page you will be told that you'll be billed but we'll add credit to your account immediately after</p>
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
                                    )
                                }
                            }
                            

                        }                        
                    }
                }}
            </Query>
        );
    }
}

export default referred;