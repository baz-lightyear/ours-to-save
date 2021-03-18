import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import Signup from './Signup';
import Signin from './Signin';
import RequestReset from './RequestReset';

const Container = styled.div`
`;
const Forms = styled.div`
  border-radius: 6px;
  margin: auto;
  background-color: white;
  font-family: ${props=>props.theme.sansSerif};
  #explanation {
    background-color: ${props=>props.theme.lightblue};
    color: ${props=>props.theme.black};
    border-radius: 4px;
    padding: 1rem;
    margin: 0;
  }
  .text {
    color: ${props=>props.theme.black};
    text-align: center;
    margin: 2rem 0rem;
    font-size: 0.9rem;
    span {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .tabs {
    display: flex;
    margin-bottom: 1rem;
    .tab {
      padding: 0.5rem;
      font-weight: bolder;
      text-align: center;
      width: 50%;
      &.active {
        border-radius: 8px 8px 0px 0px;
        border-left: solid 2px ${props => props.theme.lightblue};
        border-top: solid 2px ${props => props.theme.lightblue};
        border-right: solid 2px ${props => props.theme.lightblue};
      }
      &.inactive {
        color: #666666;
        border-left: solid 2px white;
        border-top: solid 2px white;
        border-right: solid 2px white;
        border-bottom: solid 2px ${props => props.theme.lightblue};
        cursor: pointer;
      }
    }
  }
  .signin {
    margin: 1rem auto;
    width: 80%;

    button {
      letter-spacing: 2px;
      margin-top: 1rem;
    }
  }
  .signup {
    margin: 1rem auto;
    width: 80%;
    button {
      margin-bottom: 1rem;
      letter-spacing: 2px;
      margin-top: 1rem;
    }
    .text {
      margin: 0;
      padding-bottom: 1rem;
    }
  }
  .reset {
    margin: 1rem auto;
    width: 80%;
    button {
      margin-bottom: 1rem;
      letter-spacing: 2px;
      margin-top: 1rem;
    }
    .text {
      margin: 0;
      padding: 1rem 0rem 2rem 0rem;
    }
  }
  
  .hide {
    display: none;
  }

  fieldset {
    border: none;
    display: flex;
    flex-direction: column;
    margin: 0rem;
    padding: 0px;

    input {
      padding: 4px 8px;
      width: 100%;
      height: 45px;
      border-radius: 4px;
      border: 1px solid ${props => props.theme.lightblue};
      font-family: ${props=>props.theme.sansSerif};
      font-size: 1rem;
      margin: 1rem 0rem;
      &:focus {
        outline: none;
      }
    }
    label {
      text-align: left;
      color: ${props=>props.theme.black};
    }
  }
  button {
    cursor: pointer;
    margin: auto;
    padding: 0.5rem 1rem;
    letter-spacing: 2px;
    font-family: ${props=>props.theme.sansSerif};
    font-size: 1rem;
    &:hover {
      box-shadow: 0px 0px 4px 0px rgba(100,100,100,0.3);
    }
  }
`;


const StyledModal = styled.div`
    padding: 0.5rem;
    border-radius: 4px;
    max-width: 100%;
    font-family: ${props => props.theme.sansSerif};
    .modal-body{
      
    }
    #modalTitle {
      letter-spacing: 4px;
      font-weight: bold;
      color: ${props => props.theme.lightblue};
    }
    #backButton {
        font-family: ${props => props.theme.sansSerif};
        background-color: transparent;
        border: none;
        cursor: pointer;
      }
    .close {
      &:hover {
        border: none;
      }
    }
`;

class LoginModal extends Component {
  state = {
    show: false,
    signin: false,
    signup: true,
    reset: false,
  }

  handleShow = () => {
    this.setState({show: true})
  }

  handleClose = () => {
    this.setState({
      show: false,
      signin: true,
      signup: false,
      reset: false,
    })
  }

  handlePass = () => {
    this.setState({
      signin: false,
      signup: false,
      reset: true,
    })
  }
  handleSignup = () => {
    this.setState({
      signin: false,
      signup: true,
      reset: false,
    })
  }
  handleSignin = () => {
    this.setState({
      signin: true,
      signup: false,
      reset: false,
    })
  }

  render() {
    return (
      <Container>
        <button onClick={this.handleShow}>{this.props.children}</button>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <StyledModal>
            <Modal.Header closeButton>
              <Modal.Title><span id="modalTitle">YOUR DETAILS</span></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Forms>
                {this.props.specialMessage && 
                  <p id="explanation">{this.props.specialMessage}</p>
                }
                {!this.props.specialMessage && 
                  <p id="explanation">To get the best out of Ours to Save, you'll need to log in or sign up.</p>
                }
                <div className={this.state.signin ? "signin" : "hide" }>
                  <div className="tabs">
                    <div className="inactive tab" onClick={this.handleSignup}>
                      SIGN UP
                    </div>
                    <div className="active tab">
                      LOG IN
                    </div>
                  </div>
                  <Signin/>
                  <div className="text">
                    <span onClick={this.handlePass}>Forgotten password?</span>
                  </div>
                </div>
                <div className={this.state.signup ? "signup" : "hide" }>
                  <div className="tabs">
                    <div className="active tab">
                      SIGN UP
                    </div>
                    <div className="inactive tab" onClick={this.handleSignin}>
                      LOG IN
                    </div>
                  </div>
                  <Signup/>
                  <div className="text">
                  </div>
                </div>
                <div className={this.state.reset ? "reset" : "hide" }>
                  <RequestReset/>
                  <div className="text">
                    <span onClick={this.handleSignin}>Remembered it</span>
                  </div>
                </div>
              </Forms>
            </Modal.Body>
          </StyledModal>
        </Modal>
      </Container>
    );
  }
}

export default LoginModal;