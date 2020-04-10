import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';
import React, { Component } from 'react';
import classNames from 'classnames'


const Container = styled.div`
  .filler {
    height: 80px;
    width: 100%;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${props => props.theme.green};
    height: 80px;
    width: 100%;
    position: fixed;
    z-index: 2;
  }
  .logo {
    margin-left: 2rem;
    font-size: 1.5rem;
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
    margin: 0 2rem;
    a {
      margin: 0 1rem;
      font-size: 1.5rem;
      color: ${props => props.theme.offWhite};
      &:hover {
        opacity: 0.7;
      }
    }
  }
  @media (min-width: 780px) {
    .flex {
      .mobileBurger {
        display: none;
      }
    }
  }
  @media (max-width: 779px) {
    .flex {
      .links {
        display: none;
      }
      .mobileBurger {
        display: block;
        .burgerDiv {
          background-color: ${props => props.theme.green};
          width: 140px;
          height: 80px;
          text-align: right;
          padding: 1rem;
          position: relative;
          z-index: 2;
          img {
            height: 40px;
            position: relative;
            z-index: 2;
            top: 3px;
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
          &.active {
            transform: translateY(0px);
            background-color: ${props => props.theme.yellow};
            transition-duration: 0.3s;
            position: absolute;
            z-index: 1;
            right: 0;
            text-align: right;
          }
          &.inactive {
            transform: translateY(-170px);
            background-color: transparent;
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
            <Link href="/map">
              <a>map</a>
            </Link>
            <Link href="/news">
              <a>news</a>
            </Link>
            <Link href="/about">
              <a>about</a>
            </Link>
            <Link href="/supportUs">
              <a>support us</a>
            </Link>
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
                  <a>news</a>
                </Link>
                <Link href="/about">
                  <a>about</a>
                </Link>
                <Link href="/supportUs">
                  <a>support us</a>
                </Link>
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
