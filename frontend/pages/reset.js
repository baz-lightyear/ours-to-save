import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { RESET_MUTATION, CURRENT_USER_QUERY } from '../components/Apollo'
import Cookies from 'universal-cookie';
import Error from '../components/Error'
import Router from 'next/router'
import styled from 'styled-components'

const Container = styled.div`
    width: 95%;
    max-width: 400px;
    margin: auto;
    fieldset {
        display: flex;
        flex-direction: column;
        input {
            display: block;
            width: 100%;
        }
    }
    button {
        margin: 2rem auto;
    }
`;

const cookies = new Cookies()

class reset extends Component {
    state = {
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        return (
            <Mutation
                mutation={RESET_MUTATION}
                variables={{
                    resetToken: this.props.query.resetToken,
                    password: this.state.password,
                    confirmPassword: this.state.confirmPassword,
                }}
                refetchQueries={[{ query: CURRENT_USER_QUERY, variables: {token: cookies.get('token')} }]}
            >
                {(resetPassword, { error, loading }) => (
                    <Container>
                        <h1>Update password</h1>
                        <form
                            method="post"
                            onSubmit={async e => {
                                e.preventDefault();
                                const user = await resetPassword()
                                if (user) {
                                    cookies.set('token', user.data.resetPassword.cookieToken, {
                                        maxAge: 1000 * 60 * 60 * 24 * 365,
                                    })
                                    Router.push({pathname: '/'});
                                }
                            }}
                        >
                            <fieldset disabled={loading} aria-busy={loading}>
                                <Error error={error} />
                                <label htmlFor="password">
                                    <h4>New password</h4>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                    />
                                </label>

                                <label htmlFor="confirmPassword">
                                    <h4>Confirm password</h4>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        // placeholder="confirmPassword"
                                        value={this.state.confirmPassword}
                                        onChange={this.handleChange}
                                    />
                                </label>

                                <button type="submit">Reset password</button>
                            </fieldset>
                        </form>
                    </Container>
                )}
            </Mutation>
        );
    }
}

export default reset;