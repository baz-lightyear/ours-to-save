import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';
import React, { Component } from 'react';
import Subscribe from './Subscribe';

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
    a {
      margin: 0;
      margin-left: 2rem;
      font-size: 1.2rem;
      color: ${props => props.theme.offWhite};
      &:hover {
        opacity: 0.7;
      }
    }
  }
  @media (min-width: 951px) {
    .flex {
      .mobileBurger {
        display: none;
      }
    }
  }
  @media (max-width: 950px) {
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
            padding: 1rem 1rem 1rem 2rem;
            display: flex;
            flex-direction: column;
            border-bottom: solid 6px ${props => props.theme.green};
            a {
              text-decoration: none;
              color: ${props => props.theme.black};
              line-height: 2;
            }
          }
          &.inactive {
            transform: translateY(-200px);
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
            <Link href="/feed">
              <a>live feed</a>
            </Link>
            <Link href="/news">
              <a>features</a>
            </Link>
            <Link href="/about">
              <a>about</a>
            </Link>
            <Link href="/supportUs">
              <a>support us</a>
            </Link>
            <Subscribe/>
          </div>
          <div className='mobileBurger' onClick={this.toggle}>
            <div className="burgerDiv">
              <img src="burger.png" alt="burgerMenuIcon" className={this.state.toggle}/>
            </div>
            <div className={this.state.toggle}>
              <div className="dropdown">
                <Link href="/map">
                  <a>map</a>
                </Link>
                <Link href="/news">
                  <a>features</a>
                </Link>
                <Link href="/about">
                  <a>about</a>
                </Link>
                <Link href="/supportUs">
                  <a>support us</a>
                </Link>
                <Subscribe/>
              </div>
            </div>
          </div>
        </div>
        <div className="filler"></div>
      </Container>
    )
  }
}

export default Header;
