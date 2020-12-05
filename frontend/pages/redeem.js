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
    width: 95%;
    margin: auto;
    max-width: 1000px;
    font-family: ${props => props.theme.serif};
    .banner {
        display: flex;
        .benefits {
            width: 50%;
            display: flex;
            flex-wrap: wrap;
            color: ${props => props.theme.green};
            list-style-type: "✔";
            text-align: left;
            margin-right: 1rem;
            .inner {
                display: block;
                color: ${props => props.theme.black};
                padding-left: 1rem;
            }
        }
        .imgContainer {
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 80%;
            }
        }
        @media (max-width: 800px) {
            flex-direction: column-reverse;
            .imgContainer, .benefits {
                width: 100%;
                img {
                    margin: 2rem auto;
                }
            }
        }
    }
    .loadingButton {
        width: 220px;
        img {
            width: 20px;
        }
    }
    .loginWrapper {
        text-align: center;
    }
    button {
        margin-bottom: 1rem;
        font-family: ${props => props.theme.sansSerif};
        font-weight: bolder;
        padding: 0.5rem 2rem;
        background-color: ${props => props.theme.green};
        color: ${props => props.theme.offWhite};
        border: none;
        &:hover {
            border: none;
            background-color: ${props => props.theme.black};
            color: ${props => props.theme.offWhite};
        }
    }
    form {
        text-align: center;
        strong {
            margin-right: 1rem;
        }
        label {
            margin-bottom: 1rem;
        }
    }
    .final {
        text-align: center;
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
                <h1>Setting up your gift membership</h1>
                <h5>Become a member of <strong>Ours to Save</strong> for full access to dedicated climate news, analysis & opinion</h5>
                <hr/>
                <h2>Members enjoy full access to the following benefits:</h2>
                <div className="banner">
                    <ul className="benefits">
                        <li><span className="inner">Regular profiles of <strong>climate movers and shakers</strong>, and original op-eds on the stories that matter.</span></li>
                        <li><span className="inner">An <strong>ad-free experience</strong> and the quality you'd expect from an <strong>independent</strong> publisher.</span></li>
                        <li><span className="inner">A <strong>diverse</strong> collection of voices - this is a global crisis after all.</span></li>
                        <li><span className="inner">All the other stuff: our proprietary interactive, crowdsourced news <strong>map</strong>; an email <strong>newsletter</strong>; a monthly <strong>podcast</strong> (with special episodes just for members)</span></li>
                    </ul>
                    <div className="imgContainer">
                        <img src="threeDevices.png" alt="screenshots of Ours to Save website on different devices"/>
                    </div>
                </div>
                    <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}>
                        {({data, error, loading}) => {
                            if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                            if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                            const me = data.me === null ? null : data.me
                            if (me) {
                                return (
                                    <>
                                        <hr/>
                                        <h2>Hi {me.name.split(' ')[0]}</h2>
                                        {!this.state.showProduct && 
                                            <>
                                                <p>To active your gift membership, first we need to find the right gift subscription. Please enter the 7-digit code for your subscription - it will have been sent via email to the person who bought the gift subscription.</p>
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
                                                                        priceId: response.data.verifyGiftVoucher.stripeSubscriptionPriceId, 
                                                                        promoCode: response.data.verifyGiftVoucher.stripePromotionCode
                                                                    })
                                                                });
                                                            }}
                                                            >
                                                                <fieldset disabled={loading} aria-busy={loading}>
                                                                    <label htmlFor="voucherCode">
                                                                        <strong>Enter code:</strong>
                                                                        <input
                                                                            type="text"
                                                                            required
                                                                            name="voucherCode"
                                                                            value={this.state.voucherCode}
                                                                            onChange={(event) => this.setState({voucherCode: event.target.value})}
                                                                        />
                                                                    </label>
                                                                    <br/>
                                                                    <button type="submit" className="loadingButton">
                                                                        {!loading && "verify"}
                                                                        {loading && <img width="24px" src="greyLoading.gif" alt="loading gif"/>}
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
                                            <div className="final">
                                            {/* some copy to explain the differences between the two codes and their product */}
                                                <p>Nearly there. We've generated another, <strong>different</strong>  8-digit promotion code which you can enter on the checkout page - make a note of it now because we can't show it again - <strong>{this.state.promoCode}</strong></p>
                                                {/* explain their product */}
                                                <button onClick={ async (e) => {
                                                    const options = {
                                                        priceId: this.state.priceId,
                                                        mode: "subscription", 
                                                        stripeCustomerId: me.stripeCustomerId,
                                                        successRoute: '/account'
                                                    }
                                                    visitStripe(options)
                                                }}>
                                                    {!this.state.loading && "checkout"}
                                                    {this.state.loading && <img width="16px" src="loading.gif" alt="loading gif"/>}
                                                </button>
                                            </div>
                                        }
                                    </>
                                )
                            } else {
                                return (
                                    <>
                                        <p>To redeem your free gift membership, you'll need to log in or create an account if you don't already have one.</p>
                                        <div className="loginWrapper">
                                            <LoginModal specialMessage="Sign up or sign in to activate gift membership.">get started</LoginModal>
                                        </div>
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