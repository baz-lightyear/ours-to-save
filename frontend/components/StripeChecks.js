import React, { Component } from 'react';
import { UPDATE_REFERRER_MUTATION } from '../lib/Apollo';
import LoginModal from './LoginModal'
import { Mutation } from 'react-apollo'
import Swal from 'sweetalert2';
import { endpoint, prodEndpoint } from '../config.js';

class StripeChecks extends Component {
    render() {
        return (
            <>
                {/* First we need to log them in if they are not already logged in */}
                {!this.props.me && 
                    <LoginModal specialMessage="To checkout, first you'll need to sign up with your email address and set up a password.">checkout</LoginModal>
                }
                
                {/* Then, if there's a referrer, we need to update the referrer in order to catch it in the webhook. We also need to genreate a user-facing promotion code to be applied at checkout */}
                {this.props.me && this.props.referred && this.props.showReferralDialogue &&
                    <Mutation mutation={UPDATE_REFERRER_MUTATION} variables={{referrerId: this.props.referrerId, referredId: this.props.me.id}}>
                        {(updateReferrer, {error, loading}) => {
                            return (
                                <button
                                    onClick={async () => {
                                        // update the referrer and create a stripe customer if there is none
                                        const payload = await updateReferrer()
                                        const referred = payload.data.updateReferrer
                                        // fetch a promotion code
                                        const url = process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint
                                        const res = await fetch(`${url}/getReferralPromotionCode`, {
                                            method: 'GET', 
                                            headers: ({
                                                'Content-Type': 'application/json', 
                                                'stripe_customer_id': referred.stripeCustomerId,
                                                'event': 'getReferralPromotionCode'
                                            })
                                        })
                                        const promoCode = res.headers.get('referral_promotion_code')
                                        Swal.fire({
                                            title: 'Copy and paste!',
                                            html: `Here's your discount code - <strong>${promoCode}</strong>. You'll be able to enter it when you check out, before you pay. Make a note of it before you shut this popup - we can't show it to you again.`,
                                            icon: 'success',
                                            confirmButtonText: `Ok`,
                                            confirmButtonColor: '#329094',
                                        }).then(() => {
                                            this.props.closeReferralDialogue()
                                        })
                                    }}
                                >
                                    {loading && <img width="24px" src="greyLoading.gif" alt="loading gif"/>}
                                    {!loading && "get discount code"}
                                </button>
                            )
                        }}
                    </Mutation>
                }
            </>
        );
    }
}

export default StripeChecks;