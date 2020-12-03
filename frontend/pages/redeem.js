import React, { Component } from 'react';
import styled from 'styled-components';
import { Query, Mutation } from 'react-apollo';
import Cookies from 'universal-cookie';
import { loadStripe } from '@stripe/stripe-js';
import { CURRENT_USER_QUERY, VERIFY_GIFT_VOUCHER, CREATE_STRIPE_BILLING_SESSION, CREATE_STRIPE_SUBSCRIPTION} from '../components/Apollo';
import LoginModal from '../components/LoginModal'
import Error from '../components/Error'
import { endpoint, prodEndpoint } from '../config.js';

const cookies = new Cookies()
const stripePromise = loadStripe('pk_live_51HDyyHIcB8KtT8kgeO0eGq0SflBIGCgTzMSDWIlXyG4Am9Q01lpNjl7zS40e93dK5j94lOyGnaR2bBnf8K6bSpyv00bGnVCPMR')

const Container = styled.div`
    .loadingButton {
        width: 220px;
        img {
            width: 20px;
        }
    }
`

class redeem extends Component {
    state = {
        voucherCode: "",
        showProduct: false,
        promoCode: ""
    }
    visitStripe = async (priceId) => {
        const url = process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint
        const res = await fetch(`${url}/createStripeCheckoutSession`, {
            method: 'GET',
            headers: ({ 'Content-Type': 'application/json', 'event': 'createStripeCheckoutSession', 'price_id': priceId}),
        })        
        const sessionId = res.headers.get('sessionId')
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({sessionId})
    }
    render() {
        return (
            <Container>
                <h1>This is wher eyou can redeem your gift voucher</h1>
                    <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}>
                        {({data, error, loading}) => {
                            if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                            if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                            const me = data.me === null ? null : data.me
                            if (me) {
                                return (
                                    <>
                                        {/* if logged in */}
                                        <p>Hi FIRST NAME</p>
                                        {!this.state.showProduct && 
                                            <>
                                                <p>Pls enter your voucher:</p>
                                                <Mutation mutation={VERIFY_GIFT_VOUCHER} variables={{userId: me.id, voucherCode: this.state.voucherCode}}>
                                                    {(verifyGiftVoucher, {error, loading}) => {
                                                        return (
                                                            <form
                                                            method="post"
                                                            onSubmit={async e => {
                                                                e.preventDefault();
                                                                await verifyGiftVoucher().then(response => {
                                                                    this.setState({
                                                                        showProduct: true, 
                                                                        priceId: response.data.stripePriceId, 
                                                                        promoCode: stripePromotionCode
                                                                    })
                                                                });
                                                            }}
                                                            >
                                                                <fieldset disabled={loading} aria-busy={loading}>
                                                                    <label htmlFor="voucherCode">
                                                                        <strong>Enter your voucher code:</strong>
                                                                        <input
                                                                            type="text"
                                                                            required
                                                                            name="voucherCode"
                                                                            value={this.state.voucherCode}
                                                                            onChange={(event) => this.setState({voucherCode: event.target.value})}
                                                                            />
                                                                    </label>
                                                                    <button type="submit" className="loadingButton">
                                                                        {loading && <img src="loading.gif" alt=""/>}
                                                                        {!loading && "Verify gift voucher"}
                                                                    </button>
                                                                    <Error error={error} />
                                                                </fieldset>
                                                            </form>
                                                        )
                                                    }}
                                                </Mutation>
                                            </>
                                        }
                                        {/* If verified: */}
                                        {this.state.showProduct &&
                                            <>
                                                <p>great! just enter the code "{this.state.promoCode}" when you hit the stripe portal and your gift voucher will apply</p>

                                                <button onClick={ async (e) => {
                                                    this.setState({loading: true})
                                                    e.preventDefault()
                                                    this.visitStripe(this.state.priceId)
                                                }}>
                                                        {!this.state.loading && "SUBSCRIBE"}
                                                        {this.state.loading && <img width="16px" src="loading.gif" alt="loading gif"/>}
                                                    </button>
                                            </>
                                        }
                                        {/* then give them 6 months product (create it) button or yearly (if 12 months) button  - you can tell from the price id*/}
                                    </>
                                )
                            } else {
                                return (
                                    <>
                                        <p>In order to continue, you'll need to create an account, or if you already have one, log in</p>
                                        <LoginModal>Sign in/up</LoginModal>
                                    </>
                                )
                            }
                        }}
                    </Query>
                </Container>

                            
        );
    }
}

export default redeem;