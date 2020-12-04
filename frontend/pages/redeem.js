import React, { Component } from 'react';
import styled from 'styled-components';
import { Query, Mutation } from 'react-apollo';
import Cookies from 'universal-cookie';
import { CURRENT_USER_QUERY, VERIFY_GIFT_VOUCHER } from '../components/Apollo';
import LoginModal from '../components/LoginModal'
import Error from '../components/Error'
import { visitStripe } from '../lib/utils'

const cookies = new Cookies()

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
                                                                    console.log(response)
                                                                    this.setState({
                                                                        showProduct: true, 
                                                                        priceId: response.data.verifyGiftVoucher.stripeSubscriptionPriceId, 
                                                                        promoCode: response.data.verifyGiftVoucher.stripePromotionCode
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
                                                    const options = {
                                                        priceId: this.state.priceId,
                                                        mode: "subscription", 
                                                        stripeCustomerId: me.stripeCustomerId,
                                                        successRoute: '/news'
                                                    }
                                                    visitStripe(options)
                                                }}>
                                                    {!this.state.loading && "SUBSCRIBE"}
                                                    {this.state.loading && <img width="16px" src="loading.gif" alt="loading gif"/>}
                                                </button>
                                            </>
                                        }
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