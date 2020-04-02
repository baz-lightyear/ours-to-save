import React, { Component } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Link from 'next/link';
import Header from './Header';
import Meta from './Meta';


const theme = {
  yellow: '#f6feaa',
  orange: '#fce694',
  lightgreen: '#c7d5cf',
  lightblue: '#C1DBE3',
  darkgreen: '#395756',
  offWhite: '#f9f9f9',
  black: "#333333",
  serif: 'Martel',
  sansSerif: 'Poppins',
};

const StyledPage = styled.div`
  background: ${props => props.theme.offWhite};
  color: ${props => props.theme.black};
`;

const GlobalStyle = createGlobalStyle`
    html {
        box-sizing: border-box;
        font-size: 16px;
        font-family: ${theme.sansSerif}
    }
    *, *:before, *:after {
        box-sizing: inherit;
    }
    body {
        padding: 0;
        margin: 0;
        font-size: 1rem;
    }
    a {
        text-decoration: none;
    }
`

class Page extends Component {
  render() {
    return (
        <ThemeProvider theme={theme}>
            <StyledPage>
                <Meta />
                <Header />
                {this.props.children}
            </StyledPage>
            <GlobalStyle/>
        </ThemeProvider>
    );
  }
}

export default Page;
