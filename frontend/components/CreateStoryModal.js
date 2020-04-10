import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import CreateStory from './CreateStory';

const Container = styled.div`
    text-align: center;
    #openModalButton {
        background-color: transparent;
        border: none;
        font-family: ${props => props.theme.sansSerif};
        border: solid 2px ${props => props.theme.green};
        color: ${props => props.theme.green};
        font-weight: 700;
        padding: 0.5rem 1rem;
        &:hover {
            border-color: ${props => props.theme.black};
            color: ${props => props.theme.black};
        }
        &:focus {
            outline: none;
        }
    }
`;

function CreateStoryModal() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
      <Container>
        <button id="openModalButton" onClick={handleShow}>
          + Submit a post
        </button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a post to our map</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <CreateStory closeModal={handleClose}/>
          </Modal.Body>
        </Modal>
      </Container>
    );
}

export default CreateStoryModal
  
