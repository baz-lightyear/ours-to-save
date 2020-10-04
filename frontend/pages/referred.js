import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY, UPDATE_REFERRER_MUTATION, CREATE_STRIPE_SUBSCRIPTION } from '../components/Apollo'
import LoginModal from '../components/LoginModal'
import { loadStripe } from '@stripe/stripe-js';
import Cookies from 'universal-cookie'
import styled from 'styled-components';
import Link from 'next/link'

const stripePromise = loadStripe('pk_live_51HDyyHIcB8KtT8kgeO0eGq0SflBIGCgTzMSDWIlXyG4Am9Q01lpNjl7zS40e93dK5j94lOyGnaR2bBnf8K6bSpyv00bGnVCPMR')
const cookies = new Cookies()

const PleaseLogin = styled.div`
    width: 95%;
    margin: auto;
    text-align: center;
    button {
    }
`;

const SelfReferral = styled.div`
    width: 95%;
    max-width: 800px;
    margin: auto;
    text-align: center; 
    .code {
        padding: 1rem;
        background-color: ${props => props.theme.yellow};
        border-radius: 4px;
        text-align: center;
    }
`;

const Premium = styled.div`
    width: 95%;
    max-width: 800px;
    margin: auto;
    text-align: center;  
`;

const Redeem = styled.div`
    width: 95%;
    max-width: 800px;
    margin: auto;
    text-align: center; 
    font-family: ${props => props.theme.serif}; 
    button {
        font-family: ${props => props.theme.sansSerif};
        text-transform: uppercase;
        display: block;
        margin: auto;
        cursor: pointer;
        /* border: solid 2px ${props => props.theme.navy}; */
        /* background-color: ${props => props.theme.yellow}; */
        letter-spacing: 2px;
        padding: 0.5rem 1rem;
        &:hover {
            box-shadow: 0px 0px 4px 0px ${props => props.theme.grey};
        }
    }
`;

const Container = styled.div`
    width: 95%;
    max-width: 800px;
    margin: 1rem auto;
    font-family: ${props => props.theme.serif};
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

class referred extends Component {
    static async getInitialProps(ctx) {
        const referrerId = ctx.query.userId;
        return { referrerId };
    }
    state = {
        redeemed: false,
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
                    // Get them logged in / signed up if they're not already
                    if (!me) {
                        return (
                            <PleaseLogin>
                                <h1>Redeem offer</h1>
                                <p>To redeem the offer and learn more about Ours to Save membership, you'll need to log in or sign up first.</p>
                                <LoginModal>log in / sign up</LoginModal>
                            </PleaseLogin>
                        )
                    } else {
                        // if they're the same user, tell them off
                        if (me.id === this.props.referrerId) {
                            return (
                                <SelfReferral>
                                    <h2>Hi, {me.name}</h2>
                                    <p>Are you trying to refer yourself?</p>
                                    <p>This url is only valid as a referral link for your friends. Copy the url and send it to your friends.</p>
                                    <p className='code'><a href={`https://www.ourstosave.com/referred?userId=${this.props.referrerId}`}>https://www.ourstosave.com/referred?userId={this.props.referrerId}</a></p>
                                </SelfReferral>
                            )
                        } else {
                            // if they've already got premium, tell them it's not available
                            if (me.permissions.includes("PREMIUM")) {
                                return (
                                    <Premium>
                                        <h2>Hi, {me.name}</h2>
                                        <p>Looks like you already have premium membership. You can't redeem this offer, but you can earn credits when you invite friends to Ours to Save. See more on your <Link href="/account"><a>account</a></Link> page.</p>
                                    </Premium>                                
                                )
                            } else {
                                if (!this.state.redeemed) {
                                    return (
                                        // if they haven't got premium, update them with a 'referred by' id and give them a link to stripe checkout
                                        <Redeem>
                                            <h1 style={{textAlign: "center"}}>Hi, {me.name}</h1>
                                            <h4 style={{textAlign: "center"}}>You've been referred! Join Ours to Save with your first month <em>for free</em> today.</h4>
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
                                                            }}>Redeem offer</button>
                                                        </>
                                                    )
                                                }}
                                            </Mutation>
                                        </Redeem>
                                    )
                                } else {
                                    return (
                                        <Mutation mutation={CREATE_STRIPE_SUBSCRIPTION} variables={{userId: me.id, priceId: this.state.priceId}}>
                                            {(createStripeSubscription, {error, loading}) => {
                                                return (
                                                    <Container>
                                                        <h1 style={{textAlign: "center"}}>Hi, {me.name}</h1>
                                                        <h4 style={{textAlign: "center"}}>You've been referred! Join Ours to Save with your first month<em>for free</em> today.</h4>
                                                        <p>Whether you're a <strong>student, working professional</strong> or actively involved in <strong>government</strong> and / or <strong>business</strong>, it's essential that you can understand and navigate the defining battle of the next generation - <strong>the battle for the planet</strong>.</p>
                                                        <p>As an Ours to Save member you'll have access to all our <strong>full-length op-eds</strong>, covering the climate crisis with a fresh perspective. We bring you the <strong>stories behind the headlines</strong>, directly from the <strong>frontline</strong>, with a <strong>solutions-oriented</strong> approach and always providing a platform for <strong>under-represented voices</strong>. For a taste, you can browse our members-only op-eds <Link href="/features"><a target="_blank">here</a></Link>.</p>
                                                        <h2>Interested?</h2>
                                                        <p>You'll be redirected to our billing partners, Stripe, to enter card information. Since you're being referred, you'll already have £3 off your Ours to Save membership. Once you are a member you can earn additional credit by inviting more friends.</p>
                                                        <h2 style={{textAlign: "center"}}>Pick a pricing plan</h2>
                                                        <small style={{textAlign: "center", display: "block", marginBottom: "1rem"}}>Click to select</small>
                                                        <div id="pricePlans">
                                                        <div className={`${this.state.priceId === "price_1HIuGwIcB8KtT8kg4C7rhysK" ? "unselected" : ""} price`} onClick={() => this.setState({priceId: "price_1HIuGjIcB8KtT8kgq6aU7OQ0"})}>
                                                                <h1>Pay monthly</h1>
                                                                <p>Pay £3 monthly after your 3-day free trial ends. Cancel anytime.</p>
                                                                <p><strong>Bill for first month:</strong><br/><br/>£3 - £3 referral credit = £0</p>
                                                                <p><strong>First month free</strong></p>
                                                            </div>
                                                            <div className={`${this.state.priceId === "price_1HIuGjIcB8KtT8kgq6aU7OQ0" ? "unselected" : ""} price`} onClick={() => this.setState({priceId: "price_1HIuGwIcB8KtT8kg4C7rhysK"})}>
                                                                <h1>Pay yearly</h1>
                                                                <p>Pay £30 yearly after your 3-day free trial ends. Cancel anytime.</p>
                                                                <p><strong>Bill for first year:</strong><br/><br/>£30 - £3 referral credit = £27 <br/><br/>Works out to 52p per week.</p>

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
                                                    </Container>
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