import React, { Component } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import MarkerModal from './MarkerModal';

const Container = styled.div`
    img {
        height: 3rem;
        position: relative;
        top: -3rem;
        left: -1.5rem;
    }
    .show {
        visibility: visible; 
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
        top: -64px;
        left: -108px;
        background-color: ${props => props.theme.offWhite};
        border: solid 2px ${props => props.theme.darkgreen};
        text-align: center;
        z-index: 2;
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
            <Container>
                <Link href={{pathname: '/story', query: { id: this.props.story.id }}}>
                    <img 
                        src={this.props.story.good === "good" ? "goodMarker.png" : "badMarker.png"} 
                        alt="marker" 
                        onMouseEnter={this.show} 
                        onMouseLeave={this.hide}
                    />
                </Link>
                <div className={this.state.show}><p>{this.props.story.title}</p></div>
            </Container>
        );
    }
}

export default Marker;