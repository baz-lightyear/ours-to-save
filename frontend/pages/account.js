import React, { Component } from 'react';
import { CURRENT_USER_QUERY, CREATE_STRIPE_BILLING_SESSION, CREATE_STRIPE_SUBSCRIPTION} from '../components/Apollo';
import LoginModal from '../components/LoginModal'
import Router from 'next/router'
import styled from 'styled-components';
import { Query, Mutation } from 'react-apollo';
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js';
import Cookies from 'universal-cookie';

const stripePromise = loadStripe('pk_live_51HDyyHIcB8KtT8kgeO0eGq0SflBIGCgTzMSDWIlXyG4Am9Q01lpNjl7zS40e93dK5j94lOyGnaR2bBnf8K6bSpyv00bGnVCPMR')
const cookies = new Cookies()

const Container = styled.div`
    width: 95%;
    max-width: 800px;
    margin: 1rem auto;
    font-family: ${props => props.theme.serif};
    .code {
        padding: 1rem;
        background-color: ${props => props.theme.yellow};
        border-radius: 4px;
        text-align: center;
    }
    #newSubscriptionDiv {
        label {
            justify-content: center;
            display: flex;
            align-items: baseline;
            input {
                margin-right: 1rem;
            }
            a {
                padding: 0 4px;
                font-weight: bolder;
            }
        }
        #pricePlans {
            display: flex;
            margin-bottom: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            .price {
                background-color: ${props => props.theme.yellow};
                border: solid 4px ${props => props.theme.navy};
                width: 280px;
                /* height: 300px; */
                padding: 0rem 1rem;
                margin: 0.5rem;
                text-align: center;
                cursor: pointer;
                &:hover {
                    box-shadow: 0px 0px 8px 0px ${props => props.theme.grey};
                }
            }
            .unselected {
                opacity: 0.5;
            }
            .bestOffer {
                font-size: 2rem;
                display: inline-block;
                background: linear-gradient(to right,#f1ca0d,#FCF6BA,#f1ca0d);
                padding: 0.5rem;
                border: solid;
                margin: 1rem auto;
                border-color: #f1ca0d;
                font-family: ${props => props.theme.sansSerif};
            }
        }
    }
    .offer {
        background-color: ${props => props.theme.yellow};
        padding: 1rem;
        border-radius: 4px;
        .code {
            background-color: ${props => props.theme.offWhite};
            padding: 4px;
            border-radius: 4px;
            text-align: center;
        }
    }
    .stripePortalButton {
        display: block;
        margin: 1rem auto;
        cursor: pointer;
        font-family: ${props => props.theme.sansSerif};
        border: solid 2px ${props => props.theme.green};
        background-color: ${props => props.theme.green};
        color: ${props => props.theme.offWhite};
        letter-spacing: 2px;
        padding: 0.5rem 1rem;
        &:hover {
            box-shadow: 0px 0px 4px 0px ${props => props.theme.grey};
        }
        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }
`;

const PleaseLogin = styled.div`
    width: 95%;
    margin: 1rem auto;
    text-align: center;
`

class account extends Component {
    state = {
        consent: false,
        priceId: ""
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
                                    <Mutation mutation={CREATE_STRIPE_SUBSCRIPTION} variables={{userId: me.id, priceId: this.state.priceId}}>
                                        {(createStripeSubscription, {error, loading}) => {
                                            return (
                                                <div id="newSubscriptionDiv">
                                                    <h2>Join Ours to Save today</h2>
                                                    <p>Whether you're a <strong>student, working professional</strong> or actively involved in <strong>government</strong> and / or <strong>business</strong>, it's essential that you can understand and navigate the defining battle of the next generation - <strong>the battle for the planet</strong>.</p>
                                                    <p>As an Ours to Save member you'll have access to all our <strong>full-length op-eds</strong>, covering the climate crisis with a fresh perspective. We bring you the <strong>stories behind the headlines</strong>, directly from the <strong>frontline</strong>, with a <strong>solutions-oriented</strong> approach and always providing a platform for <strong>under-represented voices</strong>. For a taste, you can browse our members-only op-eds <Link href="/features"><a target="_blank">here</a></Link>.</p>
                                                    <p>Support an ethically conscious model for new media today. After your 3-day trial period, subscription prices start from as low as <strong>58p per week</strong>.</p>
                                                    <p className="offer"><strong>Limited launch offer</strong> - share with a friend and you both get £3 of credit off your Ours to Save monthly membership - making the first month <strong>totally free</strong>.<br/><br/>Every time a new friend signs up through your invite, you'll both get (another) £3 of credit stored in your customer balance and discounted from your next Ours to Save subscription bill. Sign up now to generate a unique invite link.</p>
                                                    <h2>Interested?</h2>
                                                    <p>You'll be redirected to our billing partners, Stripe, to enter card information. After you sign up, your free 3-day trial will begin and we'll generate an invite link for you - so you (and a friend) can each get <strong>£3 of credit every time a friend signs up to Ours to Save.</strong></p>
                                                    <h2 style={{textAlign: "center"}}>Pick a pricing plan</h2>
                                                    <small style={{textAlign: "center", display: "block", marginBottom: "1rem"}}>Click to select</small>
                                                    <div id="pricePlans">
                                                        <div className={`${this.state.priceId === "price_1HIuGwIcB8KtT8kg4C7rhysK" ? "unselected" : ""} price`} onClick={() => this.setState({priceId: "price_1HIuGjIcB8KtT8kgq6aU7OQ0"})}>
                                                            <h1>Pay monthly</h1>
                                                            <p>Pay £3 monthly after your 3-day free trial ends. Cancel anytime.</p>
                                                        </div>
                                                        <div className={`${this.state.priceId === "price_1HIuGjIcB8KtT8kgq6aU7OQ0" ? "unselected" : ""} price`} onClick={() => this.setState({priceId: "price_1HIuGwIcB8KtT8kg4C7rhysK"})}>
                                                            <h1>Pay yearly</h1>
                                                            <p>Pay £30 yearly after your 3-day free trial ends - works out to <strong>58p per week</strong>. Cancel anytime.</p>
                                                            <p className="bestOffer"><em>Better value!</em></p>
                                                        </div>
                                                    </div>
                                                    <label>
                                                        <input type="checkbox" onChange={e => this.setState({consent: e.target.checked})}/>
                                                        <p>I consent to the <a href="/terms" target="_blank">terms</a> (opens in new window).</p>
                                                    </label>
                                                    <button className={`${this.state.consent && !(this.state.priceId === "") ? "enabled" : "disabled"} stripePortalButton`} disabled={!(this.state.consent && !(this.state.priceId === ""))} onClick={ async (e) => {
                                                        e.preventDefault()
                                                        await createStripeSubscription().then( async response => {
                                                            const stripe = await stripePromise;
                                                            const sessionId = response.data.createStripeSubscription.stripeCheckoutSessionId
                                                            await stripe.redirectToCheckout({
                                                                sessionId
                                                            });
                                                        })
                                                    }}>SUBSCRIBE</button>
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
                                                        className="stripePortalButton"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            createStripeBillingSession().then(response => {
                                                                window.location.replace(response.data.createStripeBillingSession.stripeBillingSessionUrl); 
                                                            })
                                                        }}
                                                    >
                                                        MANAGE SUBSCRIPTION
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