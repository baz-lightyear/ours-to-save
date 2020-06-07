import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import Moment from 'react-moment';
import { optimiseCloudinary } from '../lib/utils'

const Container = styled.div`
    
`;

function StoryModal(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
      <Container>
          <span onClick={handleShow}>
            {props.children}
          </span>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{props.story.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <small>Posted <Moment date={props.story.createdAt} format="Do MMM YYYY"/> by {props.story.author}</small>
            <br/>
            {props.story.image && <img id="image" src={optimiseCloudinary(props.story.image, 500)} alt={props.story.title} />}
            {JSON.parse(props.story.content).map((element, index) => {
                return (
                    <p key={index}>
                        {element.children.map((leaf, index) => {
                            if (leaf.type === "link") {
                                return <a href={leaf.url} target="_blank" key={index}>{leaf.children[0].text}</a>
                            }
                            return (
                                <span key={index}>
                                    {leaf.text}
                                </span>
                            )
                        })}
                    </p>
                )
            })}
            {/* <div className="sharing">
                <p>Share: </p>
                <div className="icons">
                <EmailShareButton url={`https://www.ourstosave.com/story?id=${props.story.id}`}><EmailIcon round={true}></EmailIcon></EmailShareButton>
                <FacebookShareButton url={`https://www.ourstosave.com/story?id=${props.story.id}`}><FacebookIcon round={true}></FacebookIcon></FacebookShareButton>
                <TwitterShareButton url={`https://www.ourstosave.com/story?id=${props.story.id}`}><TwitterIcon round={true}></TwitterIcon></TwitterShareButton>
                </div>
            </div> */}
          </Modal.Body>
        </Modal>
      </Container>
    );
}

export default StoryModal
  
