import React, { Component } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {timeFromNow} from '../lib/utils';
import StoryModal from './StoryModal'

const Container = styled.div`
    .marker {
        height: 20px;
        /* padding: 0 1rem 1rem 1rem; */
        padding-bottom: 0.5rem;
        position: relative;
        right: 4px;
        &.show {
            opacity: 0.8;
        }
    }
    .show {
        visibility: visible; 
    }
    div {
        &.hide {
            visibility: hidden;
        }
    }
    .popup {
        position: relative;
        top: 8px;
        right: 7px;
        cursor: pointer;
        img {
            position: absolute;
            z-index: 3;
            top: -24px;
            height: 2rem;
            width: 2rem;
            right: -25px;
        }
        p {
            width: 160px;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 12px;
            position: relative;
            right: 70px;
            background-color: white;
            text-align: center;
            z-index: 2;
            box-shadow: 0px 0px 10px rgba(100,100,100,0.3);
            small {
                opacity: 0.8;
                margin-top: 1rem;
                display: inline-block;
                font-family: ${props => props.theme.sansSerif};
            }
        }
    }
`;

class Marker extends Component {
    state = {
        show: 'hide'
    }
    show = () => {
        this.setState({show: 'show'})
    }
    hide = () => {
        this.setState({show: 'hide'})
    }
    render() {
        return (
            <Container onMouseOver={this.show} onMouseLeave={this.hide}>
                <img 
                    // src={this.props.story.morality === "good" ? "goodMarker.png" : this.props.story.morality === "bad" ? "badMarker.png" : "inbetweenMarker.png"} 
                    src="marker.png"
                    alt="marker" 
                    className={`${this.state.show} marker`}
                />
                <StoryModal story={this.props.story} hide={this.hide}>
                    <div className={`${this.state.show} popup`}>
                        <img src="triangle.svg" alt=""/>
                        <p>
                            {this.props.story.title}<br/>
                            <small>click to expand</small><br/>
                            <small style={{textAlign: "right"}}><strong>{timeFromNow(this.props.story.createdAt)}</strong></small>
                        </p>
                    </div>
                </StoryModal>
            </Container>
        );
    }
}

export default Marker;
