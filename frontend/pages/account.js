import React, { Component } from 'react';
import { CURRENT_USER_QUERY, CREATE_STRIPE_BILLING_SESSION, CREATE_STRIPE_SUBSCRIPTION, BOOSTED_FEATURES_QUERY, GET_MAILING_LIST, ADD_TO_MAILING_LIST} from '../components/Apollo';
import LoginModal from '../components/LoginModal'
import Router from 'next/router'
import styled from 'styled-components';
import { Query, Mutation } from 'react-apollo';
import Link from 'next/link'
import FeatureCard from '../components/FeatureCard'
import { loadStripe } from '@stripe/stripe-js';
import Cookies from 'universal-cookie';
import { CSVLink, CSVDownload } from "react-csv";
import Error from '../components/Error'
import Swal from 'sweetalert2';
import LinkedInTag from 'react-linkedin-insight';

const stripePromise = loadStripe('pk_live_51HDyyHIcB8KtT8kgeO0eGq0SflBIGCgTzMSDWIlXyG4Am9Q01lpNjl7zS40e93dK5j94lOyGnaR2bBnf8K6bSpyv00bGnVCPMR')
const cookies = new Cookies()

const Container = styled.div`
    width: 95%;
    max-width: 1000px;
    margin: 1rem auto;
    font-family: ${props => props.theme.serif};
    text-align: center;
    .code {
        padding: 1rem;
        background-color: ${props => props.theme.yellow};
        border-radius: 4px;
        text-align: center;
    }
    #addToMailingDiv {
        padding: 1rem;
        form {
            fieldset {
                display: flex;
                flex-direction: column;
                text-align: center;
                label {
                    display: flex;
                    font-family: ${props => props.theme.sansSerif};
                    width: 100%;
                    max-width: 400px;
                    margin: 1rem auto;
                    input {
                        margin-left: 1rem;
                        flex-grow: 1;
                        background-color: ${props => props.theme.offWhite};
                    }
                }
                button {
                    margin: auto;
                }
            }
        }
    }
    #newSubscriptionDiv {
        label {
            justify-content: center;
            display: flex;
            align-items: baseline;
            input {
                margin-right: 1rem;
            }
            a {
                padding: 0 4px;
                font-weight: bolder;
            }
        }
        #pricePlans {
            display: flex;
            margin-bottom: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            .price {
                h1 {
                    margin: 0.5rem auto;
                }
                opacity: 0.5;
                background-color: ${props => props.theme.yellow};
                border: solid 4px ${props => props.theme.navy};
                width: 280px;
                /* height: 300px; */
                padding: 0rem 1rem;
                margin: 0.5rem;
                text-align: center;
                cursor: pointer;
                &:hover {
                    box-shadow: 0px 0px 8px 0px ${props => props.theme.grey};
                }
                .discount {
                    margin: 4px;
                    font-size: 2rem;
                    color: ${props => props.theme.green};
                    .strikeThrough {
                        color: ${props => props.theme.black};
                    }
                    .strikeThrough {
                        position: relative;
                    }
                    .strikeThrough:before {
                        position: absolute;
                        content: "";
                        left: 0;
                        top: 40%;
                        right: 0;
                        border-top: 4px solid;
                        border-color: black;

                        -webkit-transform:rotate(-40deg);
                        -moz-transform:rotate(-40deg);
                        -ms-transform:rotate(-40deg);
                        -o-transform:rotate(-40deg);
                        transform:rotate(-40deg);
                    }
                }
            }
            .selected {
                opacity: 1;
            }
            .bestOffer {
                font-weight: bolder;
                letter-spacing: 1px;
                display: inline-block;
                color: ${props => props.theme.yellow};
                background-color: ${props => props.theme.green};
                padding: 0.5rem;
                margin: 1rem auto;
                font-family: ${props => props.theme.sansSerif};
            }
        }
    }
    .offer {
        background-color: ${props => props.theme.yellow};
        padding: 1rem;
        border-radius: 4px;
        .code {
            background-color: ${props => props.theme.offWhite};
            padding: 4px;
            border-radius: 4px;
            text-align: center;
        }
    }
    .stripePortalButton {
        display: block;
        margin: 1rem auto;
        cursor: pointer;
        font-family: ${props => props.theme.sansSerif};
        border: solid 2px ${props => props.theme.green};
        background-color: ${props => props.theme.green};
        color: ${props => props.theme.offWhite};
        letter-spacing: 2px;
        padding: 0.5rem 1rem;
        &:hover {
            box-shadow: 0px 0px 4px 0px ${props => props.theme.grey};
        }
        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }
    #wakeUp {
        width: 50%;
        min-width: 19rem;
        height: 30rem;
        object-fit: cover;
        margin: auto;
        display: block;
    }
    .sampleFeatures {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }
`;

const PleaseLogin = styled.div`
    width: 95%;
    max-width: 1000px;
    font-family: ${props => props.theme.serif};
    margin: 1rem auto;
    text-align: center;
    button {
        font-family: ${props => props.theme.sansSerif};
    }
    #wakeUp {
        width: 50%;
        min-width: 19rem;
        height: 30rem;
        object-fit: cover;
        margin: auto;
        display: block;
    }
    .sampleFeatures {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }
`

class account extends Component {
    state = {
        consent: false,
        priceId: "",
        mailingListEmail: "",
        mailingListName: ""
    }
    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }
    render() {
        return (
            <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}>
                {({data, error, loading}) => {
                    if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                    if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                    const me = data.me === null ? null : data.me
                    if (me) {
                        return (
                            <Container>
                                <h1 style={{textAlign: "center"}}>Hi, {me.name.split(" ")[0]}</h1>

                                {me.permissions.includes("EDITOR") && 
                                    <div className="editorPermissions">
                                        <h4>Special features just for {me.name.split(" ")[0]} and other Editors!</h4>
                                        <Link href={"/editor"}><a style={{textAlign: "center", display: "block"}}><button>✏️ Write a new feature</button></a></Link>
                                        <Query query={GET_MAILING_LIST}>
                                            {({data, error, loading}) => {
                                                if (error) return <p>Error</p>
                                                if (loading) return <p>Loading...</p>
                                                if (data) {
                                                    const users = data.mailingList
                                                    const usersCSV = users.map(user => {
                                                        let referrer = ""
                                                        if (user.referredBy) {
                                                            referrer = user.referredBy.id
                                                        }
                                                        console.log(user)
                                                        return ([user.id, user.name.split(" ")[0], user.name, user.email, user.createdAt, user.stripeCustomerId, user.stripeCustomerBalance, user.permissions.includes("PREMIUM"), user.permissions.includes("UNSUBSCRIBED"), referrer ])
                                                    })
                                                    usersCSV.unshift(["Id", "First Name", "Name", "Email", "Created at", "Stripe Id", "Balance", "Premium?", "Unsubscribed?", "Referred by"])
                                                    return (
                                                        <CSVLink data={usersCSV}><button>🤓 USER DATA</button></CSVLink>
                                                    )
                                                }
                                            }} 
                                        </Query>
                                        <Mutation mutation={ADD_TO_MAILING_LIST} variables={{name: this.state.mailingListName, email: this.state.mailingListEmail}}>
                                            {/* get email and full name and add to mailing list */}
                                            {(addToMailingList, {error, loading}) => {
                                                return (
                                                    <div id="addToMailingDiv">
                                                        <hr/>
                                                        <h4>Add someone to the mailing list</h4>
                                                        <form
                                                            method="post"
                                                            onSubmit={async e => {
                                                                e.preventDefault();
                                                                await addToMailingList().then(response => {
                                                                    this.setState({ mailingListName: '', mailingListEmail: '' });
                                                                    Swal.fire({
                                                                        title: `Nice one`,
                                                                        text: `They're added to the database`,
                                                                        icon: 'success',
                                                                        confirmButtonColor: '#4B4C53',
                                                                    })
                                                                });
                                                            }}
                                                        >
                                                            <fieldset disabled={loading} aria-busy={loading}>
                                                                <Error error={error} />
                                                                <label htmlFor="name">
                                                                    <strong>Full name:</strong>
                                                                    <input
                                                                        type="text"
                                                                        required
                                                                        name="mailingListName"
                                                                        value={this.state.mailingListName}
                                                                        onChange={this.handleChange}
                                                                    />
                                                                </label>
                                                                <label htmlFor="email">
                                                                    <strong>Email:</strong>
                                                                    <input
                                                                        type="email"
                                                                        required
                                                                        name="mailingListEmail"
                                                                        value={this.state.mailingListEmail}
                                                                        onChange={this.handleChange}
                                                                    />
                                                                </label>
                                                                <button type="submit">Add to Mailing List</button>
                                                            </fieldset>
                                                        </form>
                                                    </div>
                                                )
                                            }}
                                        </Mutation>
                                        <hr/>
                                    </div>

                                }

                                {/* create a subcription */}
                                
                                {!me.permissions.includes("PREMIUM") &&
                                    <Mutation mutation={CREATE_STRIPE_SUBSCRIPTION} variables={{userId: me.id, priceId: this.state.priceId}}>
                                        {(createStripeSubscription, {error, loading}) => {
                                            return (
                                                <div id="newSubscriptionDiv">
                                                    <h2>Climate crisis journalism that should have existed years ago</h2>
                                                    <img id="wakeUp" src="wakeUp.png" alt="poster saying 'wake up' within a crowd of protestors"/>
                                                    <hr/>
                                                    <p>Are you a <strong>student?</strong> Are you actively involved in <strong>government</strong> and / or <strong>business?</strong> A <strong>human</strong> interested in the world around you? <strong>Yes?</strong> Then it's essential that you can understand and navigate the defining battle of the next generation - <strong>the battle for the planet</strong>.</p>
                                                    <p><strong>Ours to Save</strong> is a new publication borne out of the frustration that the urgent response to Covid-19 wasn't being applied to the climate crisis. Alongside our <Link href="/feed"><a>free interactive map</a></Link>, we publish <strong>full-length op-eds</strong>, covering the climate crisis with a fresh perspective. We expose the <strong>stories behind the headlines</strong>, directly from the <strong>frontline</strong>, with a <strong>solutions-oriented</strong> approach and always providing a platform for <strong>under-represented voices.</strong></p>
                                                    <h2 style={{textAlign: "center"}}>Pick a pricing plan</h2>
                                                    <small style={{textAlign: "center", display: "block", marginBottom: "1rem"}}>Click to select</small>
                                                    <div id="pricePlans">
                                                        <div className={`${this.state.priceId === "price_1Hdkm6IcB8KtT8kgUkoMXapO" ? "selected" : ""} price`} onClick={() => this.setState({priceId: "price_1Hdkm6IcB8KtT8kgUkoMXapO"})}>
                                                           <h1>Pay monthly</h1>
                                                            <div class="discount">
                                                                {/* <span class="strikeThrough">£5</span>  */}
                                                                {/* <span>£3</span> */}
                                                                <span>£5</span>
                                                            </div>
                                                            <p>
                                                                <strong>Special early members rate:</strong><br/>£5 / month once free trial ends. Cancel anytime.
                                                            </p>                                                        
                                                        </div>
                                                        <div className={`${this.state.priceId === "price_1HdklpIcB8KtT8kgJVP0lRJX" ? "selected" : ""} price`} onClick={() => this.setState({priceId: "price_1HdklpIcB8KtT8kgJVP0lRJX"})}>
                                                            <h1>Pay yearly</h1>
                                                            <div class="discount">
                                                                {/* <span class="strikeThrough">£50</span>  */}
                                                                {/* <span>£30</span> */}
                                                                <span>£50</span>
                                                            </div>
                                                            <p>
                                                                <strong>Special early members rate:</strong><br/>£50 / year once free trial ends. Cancel anytime.
                                                            </p>         
                                                            <p className="bestOffer">BETTER VALUE</p>
                                                        </div>
                                                    </div>
                                                    <label>
                                                        <input type="checkbox" checked={this.state.consent} onChange={e => this.setState({consent: e.target.checked})}/>
                                                        <p>I consent to the <a href="/terms" target="_blank">terms</a> (opens in new window).</p>
                                                    </label>
                                                    <p>If you have a discount code, you'll be able to apply it before you pay. On mobile, click 'view details' when you reach our payments partner, Stripe.</p>
                                                    <button className={`${this.state.consent && !(this.state.priceId === "") ? "enabled" : "disabled"} stripePortalButton newStripeSubscription`} disabled={!(this.state.consent && !(this.state.priceId === ""))} onClick={ async (e) => {
                                                        e.preventDefault()
                                                        // facebook ad tracking
                                                        import('react-facebook-pixel')
                                                        .then((x) => x.default)
                                                        .then((ReactPixel) => {
                                                            ReactPixel.init('687751288615310');
                                                            ReactPixel.track('InitiateCheckout', {name: me.name})
                                                        });
                                                        // LinkedIn tracking
                                                        LinkedInTag.init("2947289");
                                                        LinkedInTag.track("3621409");

                                                        await createStripeSubscription().then( async response => {
                                                            const stripe = await stripePromise;
                                                            const sessionId = response.data.createStripeSubscription.stripeCheckoutSessionId
                                                            await stripe.redirectToCheckout({
                                                                sessionId
                                                            });
                                                        })
                                                    }}>SUBSCRIBE</button>
                                                    <hr/>
                                                    <h2>More information</h2>
                                                    <p>As an Ours to Save member you'll have access to all our <strong>full-length features</strong> - whether we're picking apart the <strong>Green New Deal</strong>, exposing under-reported <strong>Polish wildfires</strong>, or evaluating the progress towards the <strong>Paris environmental goals</strong>. Have a read of some sample journalism and see what you think.</p>
                                                    <Query query={BOOSTED_FEATURES_QUERY}>
                                                        {({data, loading, error}) => {
                                                            if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                                                            if (error) return <p>Error: {error.message}</p>;
                                                            return (
                                                                <div className="sampleFeatures">
                                                                    {data.boostedFeatures.map(feature => {
                                                                        return (
                                                                            <FeatureCard feature={feature} key={feature.id} skipPaywall={true}/>
                                                                        )
                                                                    })}
                                                                </div>
                                                            )
                                                        }}
                                                    </Query>
                                                    <hr/>
                                                    <p>Prices start from <strong>58p each week</strong>, after a 3-day trial period. You can cancel at any time. Once you sign up (or log in), you can pick a plan that suits you.</p>
                                                    <p className="offer"><strong>Limited launch offer</strong> - share with a friend and you both get £3 of credit off your Ours to Save monthly membership - making the first month <strong>totally free</strong>.<br/><br/>Every time a new friend signs up through your invite, you'll both get (another) £3 of credit stored in your customer balance and discounted from your next Ours to Save subscription bill. Sign up now to generate a unique invite link.</p>
                                                    <h2>Interested?</h2>
                                                    <p>You'll be redirected to our billing partners, Stripe, to enter card information. After you sign up, your free 3-day trial will begin and we'll generate an invite link for you - so you (and a friend) can each get <strong>£3 of credit every time a friend signs up to Ours to Save.</strong></p>
                                                    <h2 style={{textAlign: "center"}}>Pick a pricing plan</h2>
                                                    <small style={{textAlign: "center", display: "block", marginBottom: "1rem"}}>Click to select</small>
                                                    <div id="pricePlans">
                                                        <div className={`${this.state.priceId === "price_1Hdkm6IcB8KtT8kgUkoMXapO" ? "selected" : ""} price`} onClick={() => this.setState({priceId: "price_1Hdkm6IcB8KtT8kgUkoMXapO"})}>
                                                            <h1>Pay monthly</h1>
                                                            <div class="discount">
                                                                {/* <span class="strikeThrough">£5</span>  */}
                                                                {/* <span>£3</span> */}
                                                                <span>£5</span>
                                                            </div>
                                                            <p>
                                                                <strong>Special early members rate:</strong><br/>£5 / month once free trial ends. Cancel anytime.
                                                            </p>                                                     
                                                        </div>
                                                        <div className={`${this.state.priceId === "price_1HdklpIcB8KtT8kgJVP0lRJX" ? "selected" : ""} price`} onClick={() => this.setState({priceId: "price_1HdklpIcB8KtT8kgJVP0lRJX"})}>
                                                            <h1>Pay yearly</h1>
                                                            <div class="discount">
                                                                {/* <span class="strikeThrough">£50</span>  */}
                                                                {/* <span>£30</span> */}
                                                                <span>£50</span>
                                                            </div>
                                                            <p>
                                                                <strong>Special early members rate:</strong><br/>£50 / year once free trial ends. Cancel anytime.
                                                            </p>         
                                                            <p className="bestOffer">BETTER VALUE</p>
                                                        </div>
                                                    </div>
                                                    <label>
                                                        <input type="checkbox" checked={this.state.consent} onChange={e => this.setState({consent: e.target.checked})}/>
                                                        <p>I consent to the <a href="/terms" target="_blank">terms</a> (opens in new window).</p>
                                                    </label>
                                                    <p>If you have a discount code, you'll be able to apply it before you pay. On mobile, click 'view details' when you reach our payments partner, Stripe.</p>
                                                    <button className={`${this.state.consent && !(this.state.priceId === "") ? "enabled" : "disabled"} stripePortalButton newStripeSubscription`} disabled={!(this.state.consent && !(this.state.priceId === ""))} onClick={ async (e) => {
                                                        e.preventDefault()
                                                        // facebook ad tracking
                                                        import('react-facebook-pixel')
                                                        .then((x) => x.default)
                                                        .then((ReactPixel) => {
                                                            ReactPixel.init('687751288615310');
                                                            ReactPixel.track('InitiateCheckout', {name: me.name})
                                                        });
                                                        // LinkedIn tracking
                                                        LinkedInTag.init("2947289");
                                                        LinkedInTag.track("3621409");
                                                        
                                                        await createStripeSubscription().then( async response => {
                                                            const stripe = await stripePromise;
                                                            const sessionId = response.data.createStripeSubscription.stripeCheckoutSessionId
                                                            await stripe.redirectToCheckout({
                                                                sessionId
                                                            });
                                                        })
                                                    }}>SUBSCRIBE</button>
                                                </div>
                                            )
                                        }}
                                    </Mutation>
                                }

                                {/* refer to get credit */}
                                {me.permissions.includes("PREMIUM") &&
                                    <>
                                        <h2>Earn credits</h2>
                                        <p>Currently you're billed for your Ours To Save premium membership, but you can add credit to your account which will be discounted from any future payments. You currently have £{(-1*(me.stripeCustomerBalance/100)) | 0} credit in your account.</p>
                                        <p>We want your help to spread the word about Ours To Save and make it the best it can be. For that reason we're running a time-limited scheme where <strong>you can earn £3 of credit</strong> for every new friend you sign up. Just send them the following unique link and once they set up a paid subscription, <strong>you'll both earn £3 of credit.</strong></p>
                                        <p className='code'><a href={`https://www.ourstosave.com/referred?userId=${me.id}`}>https://www.ourstosave.com/referred?userId={me.id}</a></p>
                                    </>
                                }

                                {/* access portal to manage subscription */}
                                {me.permissions.includes("PREMIUM") && 
                                    <Mutation mutation={CREATE_STRIPE_BILLING_SESSION} variables={{userId: me.id}}>
                                        {(createStripeBillingSession, {error, loading}) => {
                                            return (
                                                <>
                                                    <h2>Manage subscription</h2>
                                                    <p>To manage, cancel or view details about your subscription, please visit our payments partner, <em>Stripe</em>.</p>
                                                    <button 
                                                        className="stripePortalButton"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            createStripeBillingSession().then(response => {
                                                                window.location.replace(response.data.createStripeBillingSession.stripeBillingSessionUrl); 
                                                            })
                                                        }}
                                                    >
                                                        MANAGE SUBSCRIPTION
                                                    </button>
                                                </>
                                            )
                                        }}
                                    </Mutation>
                                }

                            </Container>
                        )
                    }
                    if (!me) {
                        return (
                            <PleaseLogin>
                                <h1>Climate crisis journalism that should have existed years ago</h1>
                                <img id="wakeUp" src="wakeUp.png" alt="poster saying 'wake up' within a crowd of protestors"/>
                                <hr/>
                                <p>Are you a <strong>student?</strong> Are you actively involved in <strong>government</strong> and / or <strong>business?</strong> A <strong>human</strong> interested in the world around you? <strong>Yes?</strong> Then it's essential that you can understand and navigate the defining battle of the next generation - <strong>the battle for the planet</strong>.</p>
                                <p><strong>Ours to Save</strong> is a new publication borne out of the frustration that the urgent response to Covid-19 wasn't being applied to the climate crisis. Alongside our <Link href="/feed"><a>free interactive map</a></Link>, we publish <strong>full-length op-eds</strong>, covering the climate crisis with a fresh perspective. We expose the <strong>stories behind the headlines</strong>, directly from the <strong>frontline</strong>, with a <strong>solutions-oriented</strong> approach and always providing a platform for <strong>under-represented voices.</strong></p>
                                <LoginModal>Sign in/up for free trial</LoginModal>
                                <hr/>
                                <p>As an Ours to Save member you'll have access to all our <strong>full-length features</strong> - whether we're picking apart the <strong>Green New Deal</strong>, exposing under-reported <strong>Polish wildfires</strong>, or evaluating the progress towards the <strong>Paris environmental goals</strong>. Have a read of some sample journalism and see what you think.</p>
                                <Query query={BOOSTED_FEATURES_QUERY}>
                                    {({data, loading, error}) => {
                                        if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                                        if (error) return <p>Error: {error.message}</p>;
                                        return (
                                            <div className="sampleFeatures">
                                                {data.boostedFeatures.map(feature => {
                                                    return (
                                                        <FeatureCard feature={feature} key={feature.id} skipPaywall={true}/>
                                                    )
                                                })}
                                            </div>
                                        )
                                    }}
                                </Query>
                                <hr/>
                                <p>Prices start from <strong>58p each week</strong>, after a 3-day trial period. You can cancel at any time. Once you sign up (or log in), you can pick a plan that suits you.</p>
                                <LoginModal>Sign in/up for free trial</LoginModal>
                            </PleaseLogin>
                        )
                    }
                }}
            </Query>
        );
    }
}

export default account;