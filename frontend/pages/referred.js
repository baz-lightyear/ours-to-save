import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY, UPDATE_REFERRER_MUTATION, CREATE_STRIPE_CUSTOMER } from '../components/Apollo'
import Subscribe from '../components/Subscribe'
import Error from '../components/Error'

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
        font-family: ${props => props.theme.serif};
    }
`;

const Premium = styled.div`
    width: 95%;
    max-width: 800px;
    margin: auto;
    text-align: center;  
`;

const Container = styled.div`
    width: 95%;
    max-width: 800px;
    margin: auto;
    .redeem {
        text-align: center; 
        font-family: ${props => props.theme.serif}; 
        button {
            font-family: ${props => props.theme.sansSerif};
            text-transform: uppercase;
            display: block;
            margin: auto;
            cursor: pointer;
            letter-spacing: 2px;
            padding: 0.5rem 1rem;
            &:hover {
                box-shadow: 0px 0px 4px 0px ${props => props.theme.grey};
            }
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
        priceId: "",
        loading: false
    }
    render() {
        return (
            <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}>
                {({data, error, loading}) => {
                    if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                    if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                    const me = data.me === null ? null : data.me
                    // if they're the same user, tell them off
                    if (me && (me.id === this.props.referrerId)) {
                        return (
                            <SelfReferral>
                                <h2>Hi, {me.name}</h2>
                                <p>Are you trying to refer yourself?</p>
                                <p>This url is only valid as a referral link for your friends. Copy the url and send it to your friends.</p>
                                <p className='code'><a href={`https://www.ourstosave.com/referred?userId=${this.props.referrerId}`}>https://www.ourstosave.com/referred?userId={this.props.referrerId}</a></p>
                            </SelfReferral>
                        )
                    }
                    // if they've already got premium, tell them it's not available
                    if (me && me.permissions.includes("PREMIUM")) {
                        return (
                            <Premium>
                                <h2>Hi, {me.name}</h2>
                                <p>Looks like you already have premium membership. You can't redeem this offer, but you can earn credits when you invite friends to Ours to Save. See more on your <Link href="/account"><a>account</a></Link> page.</p>
                            </Premium>                                
                        )
                    }
                    // if they haven't got premium, or are not logged in
                    if (!me || (me && !me.permissions.includes("PREMIUM"))) {
                        return (
                            <Container>
                                <p>Yeah so youve been referred well done. yadda yadda. this is what it means; this is what you get. </p>
                                <p>just pick ur product and we'll generate a unique code for you which you can then apply at checkout</p>
                                <Subscribe me={me} referred={true} referrerId={this.props.referrerId}/>
                            </Container>
                        )
                    }
                }}
            </Query>
        );
    }
}

export default referred;