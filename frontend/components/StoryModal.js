import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import StoryModalContent from './StoryModalContent'
import Moment from 'react-moment';

const StyledHeader = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    .dates {
      time {
        margin-left: 0.5rem;
      }
    }
    opacity: 0.5;
`;

function StoryModal(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => {
      props.hide()
      setShow(false);
    }
    const handleShow = () => setShow(true);
    return (
        <>
          <span onClick={handleShow}>
            {props.children}
          </span>
    
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <StyledHeader>
                <span>{props.story.country}</span>
                <span>﹒</span>
                <span className="dates">
                  <Moment date={props.story.createdAt} format="HH:mm"/>
                  <Moment date={props.story.createdAt} format="DD-MM-YYYY"/>
                </span>  
              </StyledHeader>
            </Modal.Header>
            <Modal.Body>
              <StoryModalContent id={props.story.id}/>
            </Modal.Body>
          </Modal>
        </>
    );
}

export default StoryModal
  
