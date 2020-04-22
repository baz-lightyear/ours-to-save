import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';

const Container = styled.div`
    p {
        margin: 0;
        line-height: 2rem;
    }
`;

function Subscribe() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
      <Container>
        <p onClick={handleShow}>
          subscribe
        </p>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>So we can stay in touch 💚</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <form action="">
                  <input type="text" placeholder="harry@ourstosave.com"/>
                  <button>submit</button>
              </form>
          </Modal.Body>
        </Modal>
      </Container>
    );
}

export default Subscribe