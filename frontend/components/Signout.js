import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { SIGN_OUT_MUTATION, CURRENT_USER_QUERY } from './Apollo';
import Router from 'next/router'

const Signout = props => (
  <Mutation mutation={SIGN_OUT_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
    {signout => (
      <form
        method="post"
        onSubmit={async e => {
          e.preventDefault();
          await signout();
          Router.push({
            pathname: '/',
          }).then(() => {
            Router.reload()
          })
        }}
      >
        <button type="submit">log out</button>
      </form>
    )}
  </Mutation>
);
export default Signout;
