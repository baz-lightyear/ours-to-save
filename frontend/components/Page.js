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
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  width: 100%;
  background-color: ${theme.green};
  margin: 0;
  .socialLinks {
    margin: 0 1rem;
    a {
      margin: 0 0.5rem;
      img {
        /* display: inline-block; */
        height: 1rem;
        vertical-align: middle;
        position: relative;
        top: -1px;
        &:hover {
          opacity: 0.5;
        }
      }
      .facebook {
        height: 18px;
      }
    }
  }
  .authors {
    margin: 0 2rem;
    color: ${theme.offWhite};
    a {
      color: ${theme.offWhite};
      &:hover {
        opacity: 0.5;
      }
    }
  }
`;

class Page extends Component {
  render() {
    return (
        <ThemeProvider theme={theme}>
            <StyledPage>
                <Meta />
                
                {/* This is for sharing on facebook */}
                <div id="fb-root"></div>
                <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v6.0"></script>
                
                <Header />
                <span className="flexGrow">{this.props.children}</span>
                <Footer>
                  <span className="socialLinks"><a href="https://twitter.com/ourstosave" target="_blank"><img className="twitter" src="twitter.png" alt="twitter logo"/></a><a href="" target="_blank"><img src="facebook.png" alt="facebook logo"/></a></span>
                  <span className="authors"><a href="https://harrykingdon.com" target="_blank">- Baz</a> & <a href="https://twitter.com/flossiewild" >Floss</a></span>
                </Footer>
            </StyledPage>
            <GlobalStyle/>
        </ThemeProvider>
    );
  }
}

export default Page;
