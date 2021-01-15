import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import StoryModalContent from './StoryModalContent'
import Moment from 'react-moment';
import {timeFromNow} from '../lib/utils';

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

const MoreStyle = styled.div`
  button:hover {
    border: none;
  }
`

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
            <MoreStyle>
              <Modal.Header closeButton>
                <StyledHeader>
                  <span>{props.story.country}</span>
                  <span>﹒</span>
                  <span className="dates">
                    {timeFromNow(props.story.createdAt)}
                  </span>  
                </StyledHeader>
              </Modal.Header>
            </MoreStyle>
            <Modal.Body>
              <StoryModalContent id={props.story.id}/>
            </Modal.Body>
          </Modal>
        </>
    );
}

export default StoryModal
  
