import React, { Component } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Link from 'next/link';
import Header from './Header';
import Meta from './Meta';


const theme = {
  yellow: '#FFF8D1',
  black: '#333333',
  grey: '#3A3A3A',
  blue: '#3347FF',
  lightgrey: '#E1E1E1',
  offWhite: '#FFFDF2',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
};

const StyledPage = styled.div`
  background: ${props => props.theme.offWhite};
  color: ${props => props.theme.black};
`;

const GlobalStyle = createGlobalStyle`
    html {
        box-sizing: border-box;
        font-size: 16px;
    }
    *, *:before, *:after {
        box-sizing: inherit;
    }
    body {
        padding: 0;
        margin: 0;
        font-size: 1.5rem;
        line-height: 2;
    }
    a {
        text-decoration: none;
        color: ${theme.black};
    }
    button {  
        &:hover {
            color: ${theme.blue}
        }
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
