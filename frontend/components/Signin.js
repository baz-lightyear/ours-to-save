import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router'
import Error from './Error';
import { CURRENT_USER_QUERY, SIGNIN_MUTATION } from '../lib/Apollo';
import Cookies from 'universal-cookie';

const cookies = new Cookies()

class Signin extends Component {
  state = {
    name: '',
    password: '',
    email: '',
  };
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  
  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY, variables: {token: cookies.get('token')} }]}
      >
        {(signin, { error, loading }) => (
          <form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await signin().then(response => {
                cookies.set('token', response.data.signin.cookieToken, {
                  maxAge: 1000 * 60 * 60 * 24 * 365,
                })
                this.setState({ name: '', email: '', password: '' });   
                Router.reload()
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              {/* <h2>Sign into your account</h2> */}
              <Error error={error} />
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  required
                  // placeholder="email"
                  value={this.state.email}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  required
                  // placeholder="password"
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>

              <button type="submit">LOGIN</button>
            </fieldset>
          </form>
        )}
      </Mutation>
    );
  }
}

export default Signin;
