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
                <p>By signing up for an account you give permission for Ours to Save to send you informational emails from time to time. To unsubscribe from such emails, you can simply message harry@ourstosave.com.</p>
                <h2>Privacy policy</h2>
                <p>At Ours to Save we use modern digital technology in order to deliver the best experience for people who visit the site. This includes collecting particular data on users. For sake of transparency and in order to comply with the GDPR regulations, we've written these terms as a guide to the information we collect, how we get it, what we do with it, how we store it, and why.</p>
                <h4>Your data rights</h4>
                <p>It's also important to be aware of the data regulations that protect you, under law. These include:</p>
                <ul>
                    <li><strong>Your right of access</strong>. You have the right to ask for copies of your personal information.</li>
                    <li><strong>Your right to rectification</strong>. You have the right to ask to rectify information you think is inaccurate. You also have the right to ask to complete information you think is incomplete.</li>
                    <li><strong>Your right to erasure</strong>. You have the right to ask to erase your personal information in certain circumstances.</li>
                    <li><strong>Your right to restriction of processing</strong>. You have the right to ask to restrict the processing of your information in certain circumstances.</li>
                    <li><strong>Your right to object to processing</strong>. You have the right to object to the processing of your personal data in certain circumstances.</li>
                    <li><strong>Your right to data portability</strong>. You have the right to ask that we transfer the information you gave us to another organisation, or to you, in certain circumstances.</li>
                </ul>
                <p>You are not required to pay any charge for exercising your rights. If you make a request, we have the right to respond in up to one month. Please contact harry@ourstosave.com if you wish to make a request.</p>
                <h4>The information we collect</h4>
                <ul>
                    <li>Personal information (such as your name).</li>
                    <li>Contact information (such as email and physical addresses).</li>
                    <li>Account information (such as account settings and passwords. We encrypt all passwords so that nobody - including us - may access it).</li>
                    <li>Billing information (such as credit and debit card information, though complete billing information is hidden from us to safeguard against fraud).</li>
                    <li>Your preferences (such as responses to surveys).</li>
                    <li>Communications (such as customer support emails and comments / articles you post on the site).</li>
                    <li>Other information (such as other information you provide about yourself or others through our services or to which you provide us with access via third-parties).</li>
                </ul>
                <h4>How we collect it and why</h4>
                <p>Information is either supplied directly by you in order to gain access to some feature, or collected implicitly from you (such as the fact that you visited a particular webpage).</p>
                <p>We have several legal grounds for collecting such information. First, by using the site and as clearly indicated on entry to the site, you consent to these terms. You are able to revoke that consent at any time by contacting us. We are also contractually obliged to collect information in the event that you pay us in exchange for services, such as ongoing access to premium features, on the site. We also have a legal obligation to keep information relevant for tax purposes.</p>
                <h4>What we do with it</h4>
                <ul><li><strong>Provide the service</strong>, including using analytics to better understand how you use our service for purposes of product, website, application and service development and to enhance the user experience.</li><li><strong>Authenticate your account credentials and identify you</strong>, as necessary to log you in and ensure the security of your account.</li><li><strong>Communicate with you</strong> about your account or respond to your comments and questions and otherwise provide customer service.</li><li><strong>Send you marketing communications</strong> including communicating with you about services or products offered by Ours to Save, our business partners and other marketing communications that we believe you would be interested in.</li><li><strong>Operate and improve our service and develop new products and services,</strong> including using analytics to better understand how you use our services for purposes of product, website, application and service development and to enhance the user experience. </li><li><strong>Authenticate your credit or debit card account information.</strong></li><li><strong>Protect against, investigate, and deter fraudulent, unauthorized, or illegal activity</strong></li><li><strong>Comply with our policies, procedures and legal obligations,</strong> including complying with law enforcement or government authority requests, addressing litigation-related issues, and exercising rights or obligations conferred by law.</li><li><strong>As otherwise consented to by you and as required or permitted by applicable law.</strong> If you give your consent to any further use of personal information, you can withdraw that consent at any time by contacting us.</li></ul>
                <h4>How we store it</h4>
                <p>Ours to Save maintains commercially-reasonable technical, administrative, and physical security measures designed to protect your information from loss, misuse, unauthorized access, disclosure, alteration, and destruction. When your credit or debit card account information is being transmitted to or through our services, it will be protected by cryptographic protocols. To be clear, Ours to Save does not itself store your credit or debit card account information, and we do not have direct control over or responsibility for your credit or debit card account information. We use third party payment processors that are the controllers of your credit card information. Our contracts with third parties that receive your credit or debit card account information require them to keep it secure and confidential.</p>
                <p>You play an important role in keeping your information secure. You should not share your user name, password, or other security information for your Ours to Save account with anyone. If we receive instructions using your user name and password, we will assume you have authorized the instructions. If you have reason to believe that your interaction with us is no longer secure (for example, if you feel that the security of any account you might have with us has been compromised), please contact us immediately.</p>
                <p>We may retain your personal information for as long as your account is active and for a period of time afterwards to allow you to re-activate your account without loss of information. We may also retain your personal information as necessary to:</p>
                <ul>
                    <li>Maintain logs and business records for analysis, security, and/or audit purposes.</li>
                    <li>Comply with record retention requirements under the law.</li>
                    <li>Deal with any complaints regarding the services.</li>
                    <li>Comply with our legal obligations, protect or defend our rights, resolve disputes and enforce our contracts.</li>
                </ul>
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
                    From time to time, Ours to Save encourages our members to help out with our marketing efforts in return for benefits, such as reduced Ours to Save membership prices.
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
                <h4>Shipping</h4>
                <p>From time to time, Ours to Save sells physical products such as prints, artworks and other merchandise. In such cases, we are only able to ship to the United Kingdom. Unless ordered through special arrangement (please contact us directly), we are not able to fulfil orders with shipping addresses elsewhere.</p>
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