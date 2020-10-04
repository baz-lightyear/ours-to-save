import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Error from './Error';
import { SIGNUP_MUTATION, CURRENT_USER_QUERY } from './Apollo';
import Swal from 'sweetalert2';
import Router from 'next/router'
import Cookies from 'universal-cookie';
import Link from 'next/link'

const cookies = new Cookies()

class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: '',
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY, variables: {token: cookies.get('token')}}]}
      >
        {(signup, { error, loading }) => (
          <form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await signup().then(response => {
                cookies.set('token', response.data.signup.cookieToken, {
                  maxAge: 1000 * 60 * 60 * 24 * 365,
                })
                this.setState({ name: '', email: '', password: '' });
                Swal.fire({
                  title: `Welcome to Ours to Save`,
                  text: `Thanks for signing up. We've sent you an email to confirm - please check your junk folder as it contains important information about your Ours to Save account!`,
                  icon: 'success',
                  confirmButtonColor: '#4B4C53',
                  onClose: () => {
                    Router.reload();
                  }
                })
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <Error error={error} />
              <label htmlFor="name">
                Full name
                <input
                  type="text"
                  required
                  name="name"
                  // placeholder="full name e.g. 'Jake Krais'"
                  value={this.state.name}
                  onChange={this.saveToState}
                />
              <label htmlFor="email">
                Email
              </label>
              <input
                type="email"
                required
                name="email"
                // placeholder="email"
                value={this.state.email}
                onChange={this.saveToState}
              />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  required
                  name="password"
                  // placeholder="password"
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>
              <p style={{textAlign: "center"}}><small>I consent to the <Link href="/terms"><a target="_blank">terms</a></Link> (opens in new window).</small></p>
              <button type="submit">SIGNUP</button>
            </fieldset>
          </form>
        )}
      </Mutation>
    );
  }
}

export default Signup;