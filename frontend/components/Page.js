import React, { Component } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Link from 'next/link';
import Head from 'next/head';
import PrivacyTerms from './PrivacyTerms'
import Header from './Header';
import Founders from './Founders';
import Cookies from 'universal-cookie';
import { Query } from 'react-apollo'
import { CURRENT_USER_QUERY } from '../lib/Apollo'
import * as gtag from '../lib/gtag'


const cookies = new Cookies()

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
    p {
      a {
          text-decoration: none;
          color: ${props => props.theme.green};
          font-weight: bolder;
          &:hover {
            opacity: 0.8;
          }
      }
    }
    a {
      text-decoration: none;
    }
    button {
      padding: 0.5rem 2rem;
      font-family: ${props => props.theme.sansSerif};
      font-weight: 700;
      margin: 1rem;
      border: solid 2px ${props => props.theme.green};
      background-color: transparent;
      color: ${props => props.theme.green};
      &:hover {
          color: ${props => props.theme.black};
          border: solid 2px ${props => props.theme.black};
      }
    }
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: ${theme.green};
  margin: 0;
  .socialLinks {
    margin: 0 1rem;
    a {
      margin: 0 0.5rem;
      img {
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
  .contact {
    padding: 0.5rem 0;
    margin-right: 1rem;
    display: flex;
    @media (max-width: 650px) {
      flex-direction: column;
      align-items: flex-end;
      .breaker {
        display: none;
      }
    }
    color: ${props => props.theme.offWhite};
    a {
      color: ${props => props.theme.offWhite};
      margin: 0rem 0.5rem;
      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

const GDPR = styled.div`
  position: fixed;
  z-index: 10;
  height: 100vh;
  width: 100vw;
  background-color: rgba(100,100,100,0.5);
  display: flex;
  align-items: center;
  .popup {
    text-align: center;
    border-radius: 4px;
    width: 90%;
    max-width: 800px;
    margin: auto;
    padding: 1rem;
    background: ${props => props.theme.offWhite};
    #title {
      margin-top: 0;
    }
    button {
      color: ${props => props.theme.offWhite};
      background: ${props => props.theme.green};
      border: none;
      &:hover {
        opacity: 0.8;
      }
      margin-top: 0;
    }
    summary:focus {
      outline: none;
    }
    .termsDiv {
      margin-top: 1rem;
      font-size: 12px;
      text-align: left;
      max-height: 200px;
      overflow: scroll;
      padding: 0rem 0.5rem;
      background-color: ${props => props.theme.yellow};
    }
  }
`

class Page extends Component {
  state = {
    cookieConsent: true,
  }
  componentDidMount() {
    this.setState({cookieConsent: !!cookies.get("GDPR")})
  }
  render() {
    return (
        <ThemeProvider theme={theme}>
            <StyledPage>
                <Head>
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                  <meta charSet="utf-8" />
                  <meta name="application-name" content="Ours to save"/>
                  <meta name="author" content="Flossie Wildblood and Harry Kingdon" />
                  <meta name="description" content="Crowdsourced, breaking news on the climate - use our interactive map"/>

                  <link href="https://fonts.googleapis.com/css?family=Poppins:300,700&display=swap" rel="stylesheet" />
                  <link href="https://fonts.googleapis.com/css?family=Martel:300,700&display=swap" rel="stylesheet"/>
                  <title>Ours to Save</title>

                  {/* Facebook/WhatsApp/Instagram metatags */}

                  <meta property="og:url"                content="https://ourstosave.com" key="og:url"/>
                  <meta property="og:title"              content="Ours to Save" key="og:title"/>
                  <meta property="og:description"        content="Crowdsourced, breaking news on the climate - use our interactive map" key="og:description"/>
                  <meta property="og:image"              content="https://images.unsplash.com/photo-1559294824-627e9738df81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80" key="og:image"/>
                  <meta property="og:type"               content="website" key="og:type"/>
                  <meta property="og:locale" content="en_GB" />

                  {/* Favicons courtesy of faviconit */}

                  <link rel="shortcut icon" href="favicons/favicon.ico" />
                  <link rel="icon" sizes="16x16 32x32 64x64" href="favicons/favicon.ico" />
                  <link rel="icon" type="image/png" sizes="196x196" href="favicons/favicon-192.png" />
                  <link rel="icon" type="image/png" sizes="160x160" href="favicons/favicon-160.png" />
                  <link rel="icon" type="image/png" sizes="96x96" href="favicons/favicon-96.png" />
                  <link rel="icon" type="image/png" sizes="64x64" href="favicons/favicon-64.png" />
                  <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32.png" />
                  <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16.png" />
                  <link rel="apple-touch-icon" href="favicons/favicon-57.png" />
                  <link rel="apple-touch-icon" sizes="114x114" href="favicons/favicon-114.png" />
                  <link rel="apple-touch-icon" sizes="72x72" href="favicons/favicon-72.png" />
                  <link rel="apple-touch-icon" sizes="144x144" href="favicons/favicon-144.png" />
                  <link rel="apple-touch-icon" sizes="60x60" href="favicons/favicon-60.png" />
                  <link rel="apple-touch-icon" sizes="120x120" href="favicons/favicon-120.png" />
                  <link rel="apple-touch-icon" sizes="76x76" href="favicons/favicon-76.png" />
                  <link rel="apple-touch-icon" sizes="152x152" href="favicons/favicon-152.png" />
                  <link rel="apple-touch-icon" sizes="180x180" href="favicons/favicon-180.png" />
                  <meta name="msapplication-TileColor" content="#FFFFFF"/>
                  <meta name="msapplication-TileImage" content="favicons/favicon-144.png"/>
                  <meta name="msapplication-config" content="favicons/browserconfig.xml"/>
                </Head>
                
                {/* This is for sharing on facebook */}
                <div id="fb-root"></div>
                <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v6.0"></script>                
                {(this.state.cookieConsent) ||
                  <GDPR>
                    <div className="popup">
                      <h2 id="title">Before we begin...</h2>
                      <p>In order to make <em>Ours to Save</em> as useful as possible, and like most online news websites, we collect limited information on our members and visitors. By proceeding, you agree to the terms of our privacy policy.</p>
                      <button onClick={() => {
                        cookies.set("GDPR", "Consented", {
                          maxAge: 1000 * 60 * 60 * 24 * 365,
                        })
                        this.setState({cookieConsent: true})
                      }}>ok</button>
                      <details>
                        <summary>See full privacy policy</summary>
                        <div className="termsDiv">
                          <PrivacyTerms/>
                        </div>
                      </details>
                    </div>
                  </GDPR>
                }
                <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}>
                  {({data, error, loading}) => {
                      if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                      if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                      const me = data.me === null ? null : data.me
                      if (me) {
                        // send user-specific info to GA
                        gtag.setUserId(me.id)
                      }
                      return (
                        <>
                          <Header />
                          <span className="flexGrow">{this.props.children}</span>          
                          <Founders/>
                          <Footer>
                            <span className="socialLinks">
                              <a href="https://twitter.com/ourstosave" target="_blank">
                                <img className="twitter" src="twitter.png" alt="twitter logo"/>
                              </a>
                              {/* <a href="https://www.facebook.com/ourstosave" target="_blank">
                                <img src="facebook.png" alt="facebook logo"/>
                              </a> */}
                              <a href="https://www.linkedin.com/company/ours-to-save/" target="_blank">
                                <img src="linkedin.svg" alt="linkedin logo"/>
                              </a>
                              <a href="https://www.instagram.com/ours.tosave/?utm_source=ig_embed&utm_campaign=loading" target="_blank">
                                <img src="instagram.svg" alt="instagram logo"/>
                              </a>
                            </span>
                            <span className="contact">
                              <Link href="suggestContent"><a>suggest content</a></Link>
                              <span className="breaker">·</span>
                              <Link href="contact"><a>contact</a></Link>
                              <span className="breaker">·</span>
                              <Link href="/about">
                                <a>about</a>
                              </Link>
                              <span className="breaker">·</span>
                              <Link href="/supportUs">
                                <a>support us</a>
                              </Link>
                              <span className="breaker">·</span>
                              <Link href="/terms">
                                <a>terms</a>
                              </Link>
                            </span>
                          </Footer>
                        </>
                      )
                  }}
                </Query>
            </StyledPage>
            <GlobalStyle/>
        </ThemeProvider>
    );
  }
}

export default Page;
