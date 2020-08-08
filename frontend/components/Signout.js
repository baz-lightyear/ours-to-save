import React, { Component } from 'react';
import Router from 'next/router'
import Cookies from 'universal-cookie';

const cookies = new Cookies()

const Signout = props => (
  <form
    method="post"
    onSubmit={async e => {
      e.preventDefault();
      cookies.remove('token')
      Router.push({
        pathname: '/',
      }).then(() => {
        Router.reload()
      })
    }}
  >
    <button type="submit">log out</button>
  </form>
);
export default Signout;
