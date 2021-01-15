import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Error from './Error';
import Swal from 'sweetalert2';
import { REQUEST_RESET_MUTATION } from "../lib/Apollo";


class RequestReset extends Component {
  state = {
    email: '',
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleAlert() {
    Swal.mixin({
      customClass: {
        confirmButton: 'sweetAlertConfirmation',
      }
    }).fire({
      icon: 'success',
      title: 'Password reset link sent',
      text: 'Check your emails. You should receive a link to reset your password',
      confirmButtonColor: '#213852',
      confirmButtonText: 'Return to homepage'
    }).then(() => {
          window.location.reload();
        }
    )
      };

  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(reset, { error, loading, called }) => (
          <form
            method="post"
            data-test="form"
            onSubmit={async e => {
              e.preventDefault();
              await reset().then(response => {
                this.setState({ email: '' });
                this.handleAlert();
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <Error error={error} />
              {/* {!error && !loading && called && this.handleAlert} */}
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
              <button type="submit">SEND RESET EMAIL</button>
            </fieldset>
          </form>
        )}
      </Mutation>
    );
  }
}

export default RequestReset;
