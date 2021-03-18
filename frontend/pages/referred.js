import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from '../lib/Apollo'
import Subscribe from '../components/Subscribe'
import Cookies from 'universal-cookie'
import styled from 'styled-components';
import Link from 'next/link'

const cookies = new Cookies()

const SelfReferral = styled.div`
    width: 95%;
    max-width: 1000px;
    margin: auto;
    text-align: center; 
    .code {
        padding: 1rem;
        background-color: ${props => props.theme.offWhite};
        border-radius: 4px;
        text-align: center;
        font-family: ${props => props.theme.serif};
        overflow-wrap: anywhere;
    }
`;

const Premium = styled.div`
    width: 95%;
    max-width: 1000px;
    margin: auto;
    text-align: center;  
`;

const Container = styled.div`
    width: 95%;
    max-width: 1000px;
    margin: auto;
    font-family: ${props => props.theme.serif};
    .explanation {
        margin: 1rem;
        padding: 2rem;
        background-color: ${props => props.theme.offWhite};
        border-radius: 2rem;
        font-family: ${props => props.theme.sansSerif};
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
                                <p className='code'><a href={`https://www.ourstosave.com/referred?userId=${this.props.referrerId}`}><span>https://www.ourstosave.com/</span>referred?userId={this.props.referrerId}</a></p>
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
                                <div className="explanation">
                                    <p>You've been referred for a discounted Ours to Save membership, giving you £5 off your first subscription payment - effectively making your first month free.</p>
                                    <p style={{marginBottom: 0}}>Pick a monthly or annual subscription, sign up and generate a unique promotion code which you can then enter at checkout. Once you've finished, we'll add £5 of credit to the account of the nice person who referred you.</p>
                                </div>
                                <hr/>
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