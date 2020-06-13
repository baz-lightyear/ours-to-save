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
    color: ${props=>props.theme.navy};
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
  .signin {
    margin: 1rem auto;
    width: 80%;
    p {
      margin-top: 0.2rem;
    }

    button {
    letter-spacing: 2px;
    margin-top: 1rem;
    }
  }
  .google {
    button {
      cursor: pointer;
      background-color: white;
      border: none;
      color: ${props => props.theme.black};
      border-top: 1px solid ${props => props.theme.lightblue};
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
      height: 5.5rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        opacity: 0.8;
        box-shadow: none;
      }
      &:focus {
        /* outline: none; */
      }
      img {
        padding: 0rem 0.5rem 0rem 0rem;
      }
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
      padding: 4px;
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
    max-height: 100vh;
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
`;

class LoginModal extends Component {
  state = {
    show: false,
    google: true,
    signin: true,
    signup: false,
    reset: false,
  }

  handleShow = () => {
    this.setState({show: true})
  }

  handleClose = () => {
    this.setState({
      show: false,
      google: true,
      signin: true,
      signup: false,
      reset: false,
    })
  }

  handlePass = () => {
    this.setState({
      google: false,
      signin: false,
      signup: false,
      reset: true,
    })
  }
  handleSignup = () => {
    this.setState({
      google: false,
      signin: false,
      signup: true,
      reset: false,
    })
  }
  handleSignin = () => {
    this.setState({
      google: true,
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
            <Modal.Header>
              <Modal.Title><span id="modalTitle">LOGIN TO SAYPLANTS</span></Modal.Title>
              <button onClick={this.handleClose} id="backButton"><img src="x.svg" alt="grey cross"/></button>
            </Modal.Header>
            <Modal.Body>
              <Forms>
                <p id="explanation">To get the best out of Ours to Save, you'll need to sign in or create an account.</p>
                <div className={this.state.signin ? "signin" : "hide" }>
                  <Signin/>
                  <div className="text">
                    <span onClick={this.handlePass}>Forgotten password?</span>
                    <p>Don't have an account? <span onClick={this.handleSignup}>Sign up</span></p>
                  </div>
                </div>
                <div className={this.state.signup ? "signup" : "hide" }>
                  <Signup/>
                  <div className="text">
                    <p>Already have an account? <span onClick={this.handleSignin}>Login</span></p>
                  </div>
                </div>
                {/* <div className={this.state.google ? "google" : "hide" }> */}
                  {/* <GoogleSigninUp/> */}
                {/* </div> */}
                <div className={this.state.reset ? "reset" : "hide" }>
                  <RequestReset/>
                  <div className="text">
                    <span onClick={this.handleSignin}>Remembered it!</span>
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