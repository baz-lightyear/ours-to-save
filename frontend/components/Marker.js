import React, { Component } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import MarkerModal from './MarkerModal';

const Container = styled.div`
    img {
        height: 4rem;
        position: relative;
        top: -2rem;
        left: -1rem;
        padding: 1rem;
    }
    .show {
        visibility: visible; 
        cursor: pointer;
    }
    .hide {
        visibility: hidden;
    }
    p {
        width: 200px;
        font-family: ${props => props.theme.serif};
        padding: 4px;
        font-size: 12px;
        position: relative;
        top: -40px;
        left: -90px;
        background-color: ${props => props.theme.offWhite};
        border: solid 1px ${props => props.theme.black};
        text-align: center;
        z-index: 2;
        small {
            opacity: 0.8;
            font-family: ${props => props.theme.sansSerif};
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
                    src={this.props.story.morality === "good" ? "goodMarker.png" : this.props.story.morality === "bad" ? "badMarker.png" : "inbetweenMarker.png"} 
                    alt="marker" 
                />
                <Link href={{pathname: '/story', query: { id: this.props.story.id }}}>
                        <div className={this.state.show}><p>{this.props.story.title}<br/><small>click to learn more</small></p></div>
                </Link>
            </Container>
        );
    }
}

export default Marker;
