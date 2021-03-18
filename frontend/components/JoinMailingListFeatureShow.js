import React, { Component } from 'react';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { ADD_TO_MAILING_LIST} from '../lib/Apollo';
import Swal from 'sweetalert2';


const Container = styled.div`
    .filler {
        height: 80px;
        width: 100%;
    }
    #joinMailingDiv {
        font-family: ${props => props.theme.sansSerif};
        border-radius: 4px;
        padding: 1rem;
        display: flex;
        align-items: center;
        background-color: ${props => props.theme.yellow};
        width: 100%;
        position: relative;
        #mailingCopy {
            /* background-color: turquoise; */
            margin-right: 1rem;
            h4 {
                font-weight: bold;
                margin-bottom: 4px;
                margin-top: 4px;
            }
            span {
            }
        }
        form {
            margin-top: 1rem;
            height: 100%;
            /* background-color: pink; */
            display: flex;
            align-items: center;
            flex-grow: 1;
            fieldset {
                /* background-color: purple; */
                display: flex;
                align-items: flex-end;
                label {
                    margin: 0px;
                    margin-right: 0.5rem;
                    /* background-color: blue; */
                    display: flex;
                    flex-direction: column;
                    font-size: 0.8rem;
                    font-weight: bold;
                    input {
                        border-radius: 0;
                        outline: none;
                        border: solid 1px grey;
                        background-color: ${props => props.theme.offWhite};
                        font-size: 1rem;
                        font-weight: normal;
                    }
                }
                #joinMailingButton {
                    background-color: ${props => props.theme.green};
                    color: ${props => props.theme.offWhite};
                    height: 28px;
                    border: none;
                    padding: 0px 0.5rem;
                    font-weight: normal;
                    margin: 0;
                    &:hover {
                        background-color: ${props => props.theme.black};
                    }
                }
            }
        }
        #shutMailing {
            position: absolute;
            right: 0.5rem;
            top: 4px;
            border: none;
            padding: 0rem;
            margin: 0rem;
            min-width: min-content;
            opacity: 0.5;
            color: ${props => props.theme.black};
            img {
                height: 1rem;
            }
            &:hover {
                opacity: 1;
            }
        }
    }
    @media (max-width: 1000px) {
        .filler {
            height: 120px;
        }
        #joinMailingDiv {
            flex-direction: column;
            /* height: 120px; */
            align-items: flex-start;
            form {
                width: 100%;
                fieldset {
                    width: 100%;
                    label {
                        width: 100%;
                    }
                }
            }
        }
    }
    @media (max-width: 720px) {
        .filler {
            height: 200px;
        }
        #joinMailingDiv {
            /* height: 200px; */
            form {
                fieldset {
                    flex-direction: column;
                    align-items: flex-start;
                    label {
                        margin-bottom: 4px;
                    }
                }
            }
        }
    }
    @media (max-width: 600px) {
        .filler {
            height: 220px;
        }
        #joinMailingDiv {
            /* height: 220px; */
        }
    }
`

class JoinMailingListFeatureShow extends Component {
    state = {
        mailingListEmail: "",
        mailingListName: "",
        loading: false,
    }
    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }
    render() {
        return (
            <Container>
                <div id="joinMailingDiv">
                    <div id="mailingCopy">
                        <h4>Receive email updates</h4>
                        <span>No spam, just the latest climate movers and shakers in your inbox.</span>
                    </div>
                    <Mutation mutation={ADD_TO_MAILING_LIST} variables={{name: this.state.mailingListName, email: this.state.mailingListEmail}}>
                        {/* get email and full name and add to mailing list */}
                        {(addToMailingList, {error, loading}) => {
                            return (
                                <form
                                    method="post"
                                    onSubmit={async e => {
                                        e.preventDefault();
                                        await addToMailingList().then(response => {
                                            this.setState({ mailingListName: '', mailingListEmail: '' });
                                            Swal.fire({
                                                title: `You're all set`,
                                                text: `We've added you to our mailing list. Keep an eye on your junk folder in case we end up in the bin!`,
                                                icon: 'success',
                                                confirmButtonColor: '#4B4C53',
                                            })
                                        }, error => {
                                            Swal.fire({
                                                title: `Don't worry`,
                                                text: error.message.replace('GraphQL error: ', ''),
                                                icon: 'warning',
                                                confirmButtonColor: '#4B4C53',
                                            })
                                        });
                                    }}
                                >
                                    <fieldset disabled={loading} aria-busy={loading}>
                                        <label htmlFor="name">
                                            <span>Full name:</span>
                                            <input
                                                type="text"
                                                required
                                                name="mailingListName"
                                                value={this.state.mailingListName}
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <label htmlFor="email">
                                            <span>Email:</span>
                                            <input
                                                type="email"
                                                required
                                                name="mailingListEmail"
                                                value={this.state.mailingListEmail}
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <button id="joinMailingButton" type="submit"><strong>JOIN</strong></button>
                                    </fieldset>
                                </form>
                            )
                        }}
                    </Mutation>
                </div>
                <br/>
                {/* <div className="filler"></div> */}
            </Container>
        );
    }
}

export default JoinMailingListFeatureShow;