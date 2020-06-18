import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Error from './Error';
import { SIGNUP_MUTATION, CURRENT_USER_QUERY } from './Apollo';
import Swal from 'sweetalert2';
import Router from 'next/router'

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
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { error, loading }) => (
          <form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await signup();
              this.setState({ name: '', email: '', password: '' });
              Swal.fire({
                title: `Welcome to Ours to Save`,
                text: `Thanks for signing up.`,
                icon: 'success',
                confirmButtonColor: '#4B4C53',
                onClose: () => {
                  Router.push('/').then(() =>{
                    Router.reload();
                  })
                }
              })
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
              <button type="submit">SIGNUP</button>
            </fieldset>
          </form>
        )}
      </Mutation>
    );
  }
}

export default Signup;