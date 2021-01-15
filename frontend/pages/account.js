import React, { Component } from 'react';
import { CURRENT_USER_QUERY, GET_MAILING_LIST, ADD_TO_MAILING_LIST} from '../lib/Apollo';
import styled from 'styled-components';
import { Query, Mutation } from 'react-apollo';
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js';
import Cookies from 'universal-cookie';
import { CSVLink } from "react-csv";
import Error from '../components/Error'
import Swal from 'sweetalert2';
import Subscribe from '../components/Subscribe';
import { endpoint, prodEndpoint } from '../config.js';

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
        display: inline-block;
        overflow-wrap: anywhere;
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
    .stripePortalButton {
        display: block;
        margin: 1rem auto;
        cursor: pointer;
        font-family: ${props => props.theme.sansSerif};
        background-color: ${props => props.theme.green};
        color: ${props => props.theme.offWhite};
        padding: 0.5rem 1rem;
        &:hover {
            box-shadow: 0px 0px 4px 0px ${props => props.theme.grey};
            background-color: ${props => props.theme.black};        
        }
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
                    return (
                        <Container>
                            {/* if you are on premium, you should be able to access the portal and refer to get credit */}
                            {me && me.permissions.includes("PREMIUM") &&
                                <>
                                    <h1 style={{textAlign: "center"}}>Hi, {me.name.split(" ")[0]}</h1>
                                    <h2>Earn credits</h2>
                                    <p>Currently you're billed for your Ours To Save premium membership, but you can add credit to your account which will be discounted from any future payments. You currently have £{(-1*(me.stripeCustomerBalance/100)) | 0} credit in your account.</p>
                                    <p>We want your help to spread the word about Ours To Save and make it the best it can be. For that reason we're running a referral scheme where <strong>you can earn £5 of credit</strong> for every new friend you sign up. Just send them the following unique link and once they set up a paid subscription, <strong>you'll both earn £5 of credit.</strong></p>
                                    <p className='code'><a href={`https://www.ourstosave.com/referred?userId=${me.id}`}><span>https://www.ourstosave.com/</span>referred?userId={me.id}</a></p>
                                    <h2>Manage subscription</h2>
                                    <p>To manage, cancel or view details about your subscription, please visit our payments partner, <em>Stripe</em>.</p>
                                    <button 
                                        className="stripePortalButton"
                                        onClick={async () => {
                                            this.setState({loading: true})
                                            const url = process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint
                                            const res = await fetch(`${url}/createStripeBillingSession`, {
                                                method: 'GET',
                                                headers: ({ 
                                                    'Content-Type': 'application/json', 
                                                    'event': 'createStripeBillingSession', 
                                                    'stripe_customer_id': me.stripeCustomerId
                                                }),
                                            })        
                                            window.location.replace(res.headers.get("billingSessionUrl"))
                                        }}
                                        >
                                        {!this.state.loading && 'manage subscription'}
                                        {this.state.loading && <img width="24px" src="greyLoading.gif" alt="loading gif"/>}
                                    </button>
                            
                                </>
                            }

                            {/* Editor's special permissions */}
                            {me && me.permissions.includes("EDITOR") && 
                                <div className="editorPermissions">
                                    <hr/>
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
                                </div>
                            }

                            {(!me || !me.permissions.includes("PREMIUM")) && 
                                <Subscribe me={me}/>
                            }
                        </Container>
                    )
                }}
            </Query>
        );
    }
}

export default account;