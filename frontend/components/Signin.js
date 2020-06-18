import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router'
import Error from './Error';
import { CURRENT_USER_QUERY, SIGNIN_MUTATION } from './Apollo';
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
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { error, loading }) => (
          <form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await signup();
              this.setState({ name: '', email: '', password: '' });   
              Router.push({
                pathname: '/news',
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
