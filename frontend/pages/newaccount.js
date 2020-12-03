import React, { Component } from 'react';
import { CURRENT_USER_QUERY, CREATE_STRIPE_BILLING_SESSION, CREATE_STRIPE_SUBSCRIPTION, BOOSTED_FEATURES_QUERY, GET_MAILING_LIST, ADD_TO_MAILING_LIST} from '../components/Apollo';
import styled from 'styled-components';
import { Query, Mutation } from 'react-apollo';
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js';
import Cookies from 'universal-cookie';
import { CSVLink, CSVDownload } from "react-csv";
import Error from '../components/Error'
import Swal from 'sweetalert2';
import Subscribe from '../components/Subscribe';

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
`;

class account extends Component {
    state = {
        consent: false,
        priceId: "",
        mailingListEmail: "",
        mailingListName: "",
        loading: false,
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
                    if (!me || !me.permissions.includes("PREMIUM")) {
                        return (
                            <Subscribe me={me}/>
                        )
                    }
                }}
            </Query>
        );
    }
}

export default account;