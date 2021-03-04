import React, { Component } from 'react';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { ADD_TO_MAILING_LIST} from '../lib/Apollo';
import Swal from 'sweetalert2';


const Container = styled.div`
    display: flex;
`

class JoinMailingList extends Component {
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
                                                title: `something nice`,
                                                text: `something nice`,
                                                icon: 'success',
                                                confirmButtonColor: '#4B4C53',
                                            })
                                        });
                                    }}
                                >
                                    <fieldset disabled={loading} aria-busy={loading}>
                                        {error && <p>{error.message}</p>}
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
                <button onClick={() => this.props.close()}>x</button>
            </Container>
        );
    }
}

export default JoinMailingList;