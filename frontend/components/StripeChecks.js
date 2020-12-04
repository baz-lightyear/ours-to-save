import React, { Component } from 'react';
import { UPDATE_REFERRER_MUTATION } from './Apollo';
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
                    <LoginModal specialMessage="pleas login dicked">checkout</LoginModal>
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
                                            title: 'here is your code',
                                            html: `its really important pls make a note of it, we wont show it again ${promoCode}`,
                                            icon: 'success',
                                            confirmButtonText: `Noted`,
                                            confirmButtonColor: '#329094',
                                        }).then(() => {
                                            this.props.closeReferralDialogue()
                                        })
                                    }}
                                >
                                    {loading && <img src="loading.gif" alt=""/>}
                                    {!loading && "Generate discount code"}
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