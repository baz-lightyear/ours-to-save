import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';
import React, { Component } from 'react';
import Signout from './Signout';
import LoginModal from './LoginModal';
import { CURRENT_USER_QUERY } from '../lib/Apollo';
import { Query } from 'react-apollo'
import Cookies from 'universal-cookie';

const cookies = new Cookies()


const Container = styled.div`
  .filler {
    height: 40px;
    width: 100%;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${props => props.theme.green};
    height: 40px;
    width: 100%;
    position: fixed;
    z-index: 2;
  }
  .logo {
    margin-left: 1rem;
    font-size: 1.3rem;
    a {
      color: ${props => props.theme.offWhite};
      &:hover {
        opacity: 0.7;
      }
    }
    img {
      height: 1.5rem;
      padding-right: 1rem;
      position: relative;
      top: -1px;
    }
  }
  .links {
    display: flex;
    margin-right: 1rem;
    color: ${props => props.theme.offWhite};
    .breaker {
      margin: 0rem 0.5rem;
    }
    a {
      color: ${props => props.theme.offWhite};
      margin: 0;
      &:hover {
        opacity: 0.7;
      }
    }
    #account {
      button {
        margin: 0;
        font-weight: normal;
        color: ${props => props.theme.offWhite};
        &:hover {
          opacity: 0.7;
        }
        &:active {
          outline: none;
        }
        padding: 0;
        border: none;
      }
    }
  }
  @media (min-width: 701px) {
    .flex {
      .mobileBurger {
        display: none;
      }
    }
  }
  @media (max-width: 700px) {
    .flex {
      .logo {
        margin-left: 0.5rem !important;
        img {
          padding-right: 0.5rem !important;
        }
      }
      .links {
        display: none;
      }
      .mobileBurger {
        display: block;
        .burgerDiv {
          background-color: ${props => props.theme.green};
          width: 140px;
          height: 40px;
          text-align: right;
          position: relative;
          z-index: 2;
          img {
            height: 28px;
            position: relative;
            z-index: 2;
            top: 6px;
            right: 6px;
            &.active {
              transform: rotate(-90deg);
              transition-duration: 0.3s
            }
            &.inactive {
              transform: rotate(0deg);
              transition-duration: 0.3s
            }
          }
        }
        div {
          .dropdown {
            display: flex;
            flex-direction: column;
            border-bottom: solid 6px ${props => props.theme.green};
            a {
              padding: 0 0.5rem 0 1rem;
              /* border-bottom: solid 1px ${props => props.theme.lightgreen};; */
              text-decoration: none;
              color: ${props => props.theme.black};
              line-height: 2;
            }
            .category {
              background-color: white;
            }
            .featuresButton {
              border-bottom: solid 1px ${props => props.theme.lightgreen};
            }
            #account {
              button {
                margin: 0;
                padding: 0;
                padding-right: 0.5rem;
                padding-left: 14px;
                font-weight: normal;
                color: ${props => props.theme.black};
                line-height: 2;
                &:active {
                  outline: none;
                }
                border: none;
              }
            }
          }
          &.inactive {
            transform: translateY(-360px);
            background-color: ${props => props.theme.offWhite};
            transition-duration: 0.3s;
            position: absolute;
            z-index: 1;
            right: 0;
            text-align: right;
          }
          &.active {
            transform: translateY(0px);
            background-color: ${props => props.theme.offWhite};
            box-shadow: 0px 0px 10px grey;
            transition-duration: 0.3s;
            position: absolute;
            z-index: 1;
            right: 0;
            text-align: right;
          }
        }
      }
    }
  }
`;

class Header extends Component {
  state = {
    toggle: "inactive"
  }
  toggle = () => {
    this.state.toggle === "active" ? this.setState({toggle: "inactive"}) : this.setState({toggle: "active"})
  }
  render () {
    return (
      <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}>
          {({data, error, loading}) => {
            if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
            if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
            const me = data.me === null ? null : data.me
            return (
              <Container>
                <div className="flex">
                  <div className="logo">
                    <Link href="/">
                      <a>
                        <img src="/flossfist.png" alt="logo"/>
                        ours to save
                      </a>
                    </Link>
                  </div>
                  <div className="links">
                    <Link href="/features">
                      <a>news</a>
                    </Link>
                    <span className="breaker">·</span>
                    {/* <Link href="/feed">
                      <a>map</a>
                    </Link>
                    <span className="breaker">·</span> */}

                    <Link href="/gift">
                      <a>gift</a>
                    </Link>
                    <span className="breaker">·</span>
                    {/* <Link href="/features">
                      <a>features</a>
                    </Link>
                    <span className="breaker">·</span> */}
                    { me && me.permissions.includes("PREMIUM") && <Link href="/account"><a>account</a></Link>}
                    { (!me || !(me.permissions.includes("PREMIUM"))) && <Link href="/account"><a>subscribe</a></Link>}
                    <span className="breaker">·</span>
                    <div id="account">
                      { me && <Signout/>}
                      { !me && <LoginModal>account</LoginModal>}
                    </div>
                  </div>
                  <div className='mobileBurger' onClick={this.toggle}>
                    <div className="burgerDiv">
                      <img src="burger.png" alt="burgerMenuIcon" className={this.state.toggle}/>
                    </div>
                    <div className={this.state.toggle}>
                      <div className="dropdown">
                        { me && me.permissions.includes("PREMIUM") && <Link href="/account"><a>account</a></Link>}
                        { (!me || !(me.permissions.includes("PREMIUM"))) && <Link href="/account"><a>subscribe</a></Link>}
                        <Link href="/features">
                          <a>news</a>
                        </Link>
                        {/* <Link href="/feed">
                          <a>map</a>
                        </Link> */}
                        <Link href="/gift">
                          <a>gift</a>
                        </Link>
                        <div id="account">
                          { me && <Signout/>}
                          { !me && <LoginModal>account</LoginModal>}
                        </div>
                        {/* <Link href="/features">
                          <a className="featuresButton">features</a>
                        </Link> */}
                        {/* <Link href={{pathname: '/category', query: { category: "innovation" }}}>
                          <a className="category">innovation ·</a>
                        </Link>
                        <Link href={{pathname: '/category', query: { category: "conservation" }}}>
                          <a className="category">conservation ·</a>
                        </Link>
                        <Link href={{pathname: '/category', query: { category: "inspiration" }}}>
                          <a className="category">inspiration ·</a>
                        </Link>
                        <Link href={{pathname: '/category', query: { category: "power" }}}>
                          <a className="category featuresButton">power ·</a>
                        </Link> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="filler"></div>
              </Container>
             )
          }}
        </Query>
    )
  }
}

export default Header;
