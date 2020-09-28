import React, { Component } from 'react';
import Link from 'next/link'
import styled from 'styled-components';

const Container = styled.div`
    width: 90%;
    max-width: 1000px;
    margin: auto;
    font-family: ${props => props.theme.serif};
    h1 {
        text-align: center;
    }
`

class terms extends Component {
    render() {
        return (
            <Container>
                <h1>Terms</h1>
                <h2>Who we are</h2>
                <p><strong>Ours to Save</strong> is a business partnership founded in 2020. If you'd like to get in touch you can find us on <a target="_blank" href="https://www.instagram.com/ours.tosave/">Instagram</a> or email us at <a href="mailto: hello@ourstosave.com">hello@ourstosave.com</a>.</p>
                <p>By signing up for an account you give permission for Ours to Save to send you informational emails from time to time. To unsubscribe from such emails, you can simply message hello@ourstosave.com.</p>
                <h2>Terms of sale for premium subscribers</h2>
                <h4>Free trial</h4>
                <p>
                    As per the 2020 Visa trial subscription requirements, we are obligated to inform our customers of the following. 
                    Your subscription includes access to exclusive features and op-eds, outlined on our <Link href="/features"><a>features</a></Link> page.
                </p>
                <p>
                    Information on start and end date of your subscription, the length and price of the free trial, and the cost of the subscription after the free trial is readily available on the Stripe Customer Portal, easily accessible from your <Link href="/account"><a>account</a></Link> page.
                    We will send you a reminder 7 days before each billing date, to the email address registered with your account.
                </p>
                <p>
                    You will be billed immediately after your free trial ends, a date indicated on the Stripe Customer Portal, which is easily accessible from your <Link href="/account"><a>account</a></Link> page.
                    Unless you cancel your subscription, you will be billed for renewal one month or one year after that date (depending on the type of membership you signed up for).
                </p>
                <h4>Promotions</h4>
                <p>
                    From time to time, Ours to Save encourages our members to help our with our marketing efforts in return for benefits, such as reduced Ours to Save membership prices.
                    We want to make Ours to Save the best it can be and so it's our pleasure to work with our members to grow it and support our mission - to make it easier to engage with the climate crisis.    
                </p>
                <p>
                    Details of promotions are outlined wherever they are available. Typically we will offer 'credit' in return for some activity (such as inviting a friend to use Ours to Save).
                    In such cases, our members (and their friends) are able to earn 'credit' when their friends sign up for paid Ours to Save memberships. 
                </p>
                <p>
                    'Credit' is equivalent to money stored in your Stripe Customer Balance. When you are billed monthly or yearly (depending on the type of membership you signed up for), your billing amount will be calcualted by subtracting the amount of credit you have in your account from the billing amount.
                    Your credit will reduce by however much was subtracted from your last bill and the remainder will stay in your Customer Balance to be used at the next billing date.
                </p>
                <p>You can easily see how much credit you have (as a premium member) by visiting your <Link href="/account"><a>account</a></Link> page.</p>
                <h4>Cancellation</h4>
                <p>
                    We're sad to see you go! You can easily cancel your subscription at any time on the Stripe Customer Portal, easily accessible from your <Link href="/account"><a>account</a></Link> page. 
                    If you have a moment we'd love to know why our service wasn't right for you - just email <a href="mailto: hello@ourstosave.com" target="_blank">hello@ourstosave.com</a>.
                </p>
                {/* GDPR and privacy */}
            </Container>
        );
    }
}

export default terms;