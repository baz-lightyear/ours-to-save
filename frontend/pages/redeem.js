import React, { Component } from 'react';
import styled from 'styled-components';
import { Query, Mutation } from 'react-apollo';
import Cookies from 'universal-cookie';
import { loadStripe } from '@stripe/stripe-js';
import { CURRENT_USER_QUERY, VERIFY_GIFT_VOUCHER, CREATE_STRIPE_BILLING_SESSION, CREATE_STRIPE_SUBSCRIPTION} from '../components/Apollo';
import LoginModal from '../components/LoginModal'
import Error from '../components/Error'

const cookies = new Cookies()
const stripePromise = loadStripe('pk_live_51HDyyHIcB8KtT8kgeO0eGq0SflBIGCgTzMSDWIlXyG4Am9Q01lpNjl7zS40e93dK5j94lOyGnaR2bBnf8K6bSpyv00bGnVCPMR')

const Container = styled.div`

`

class redeem extends Component {
    state = {
        voucherCode: ""
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
                                        <p>Pls enter your voucher:</p>
                                        <Mutation mutation={VERIFY_GIFT_VOUCHER} variables={{userId: me.id, voucherCode: this.state.voucherCode}}>
                                            {(verifyGiftVoucher, {error, loading}) => {
                                                return (
                                                    <form
                                                        method="post"
                                                        onSubmit={async e => {
                                                            e.preventDefault();
                                                            await verifyGiftVoucher().then(response => {
                                                            });
                                                        }}
                                                    >
                                                        <fieldset disabled={loading} aria-busy={loading}>
                                                            <Error error={error} />
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
                                                            <button type="submit">Verify voucher code</button>
                                                        </fieldset>
                                                    </form>
                                                )
                                            }}
                                        </Mutation>
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