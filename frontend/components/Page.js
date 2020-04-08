import React, { Component } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Link from 'next/link';
import Header from './Header';
import Meta from './Meta';


const theme = {
  yellow: '#FFEFCA',
  orange: '#FABD7C',
  lightgreen: '#c7d5cf',
  lightblue: '#C1DBE3',
  green: '#329094',
  offWhite: '#FEF8EA',
  black: "#333333",
  serif: 'Martel',
  sansSerif: 'Poppins',
};

const StyledPage = styled.div`
  background: ${props => props.theme.offWhite};
  color: ${props => props.theme.black};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
  .flexGrow {
    flex-grow: 1;
  }
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

const Footer = styled.div`
  width: 100%;
  text-align: right;
  background-color: ${theme.green};
  margin: 0;
  a {
    color: ${theme.offWhite};
  }
  span {
    padding-right: 2rem;
    color: ${theme.offWhite};
  }
`;

class Page extends Component {
  render() {
    return (
        <ThemeProvider theme={theme}>
            <StyledPage>
                <Meta />
                <Header />
                <span className="flexGrow">{this.props.children}</span>
                <Footer>
                  <span><a href="https://harrykingdon.com" target="_blank">- Baz</a> & <a href="https://twitter.com/flossiewild">Floss</a></span>
                </Footer>
            </StyledPage>
            <GlobalStyle/>
        </ThemeProvider>
    );
  }
}

export default Page;
