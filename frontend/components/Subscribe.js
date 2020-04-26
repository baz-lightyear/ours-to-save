import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import Swal from 'sweetalert2';
import { CREATE_USER_MUTATION } from './Apollo';

const Container = styled.div`
  a {
    margin: 0 1rem;
    font-size: 1.5rem;
    cursor: pointer;
    color: ${props => props.theme.offWhite};
  }
  @media (max-width: 950px) {
    a {
      font-size: 1rem;
      text-decoration: none;
      color: ${props => props.theme.black};
      line-height: 2;
      margin: 0;
    }
  }
`;

const Form = styled.form`
  text-align: center;  
  padding: 1rem;
  input {
    margin-bottom: 1rem;
    width: 100%;
    opacity: 0.5;
    border: none;
    border-bottom: 4px solid ${props => props.theme.green};
    background-color: #9fc8ca59;
    &:focus {
      outline: none;
      opacity: 1;
    }
  }
  button {
    background-color: transparent;
    border: none;
    font-family: ${props => props.theme.sansSerif};
    border: solid 2px ${props => props.theme.green};
    color: ${props => props.theme.green};
    font-weight: 700;
    &:hover {
        border-color: ${props => props.theme.black};
        color: ${props => props.theme.black};
    }
    &:focus {
        outline: none;
    }
  }
`;

function Subscribe() {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleChange = event => {
      setEmail(event.target.value)
    }

    return (
      <Container>
        <a onClick={handleShow}>
          subscribe
        </a>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Stay in touch</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <p>If you'd like to keep up to date with climate news and how our project is progressing, sign up for email updates so we can keep you in the loop. We'd love to stay in touch.</p>
              <Mutation mutation={CREATE_USER_MUTATION}>
                {(createUser, { loading, error }) => {
                  if (error) return <p>{error.message === "GraphQL error: A unique constraint would be violated on User. Details: Field name = email" && "It looks like we already have your details 🙌"}</p>
                  return (
                    <Form
                      data-test="form"
                      onSubmit={async e => {
                          e.preventDefault();
                          await createUser({variables: {email: email}});
                          Swal.fire({
                              title: 'Thanks for signing up for updates',
                              text: "We'll be in touch",
                              icon: 'success',
                              confirmButtonColor: '#329094'
                          })
                          setEmail({ email: ""})
                          handleClose()
                      }}
                    >
                      <input type="email" value={email} onChange={handleChange} placeholder="e.g. harry@ourstosave.com"/>
                      <button type="submit">submit</button>
                    </Form>
                  )
                }}
              </Mutation>
          </Modal.Body>
        </Modal>
      </Container>
    );
}

export default Subscribe