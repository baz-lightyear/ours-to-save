import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Moment from 'react-moment';

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: ${props => props.theme.serif};
    /* border-bottom: solid 1px ${props => props.theme.lightgreen}; */
    border-top: solid 1px ${props => props.theme.lightgreen};
    .text {
        text-align: left;
        h4 {
            margin-bottom: 0;
        }
        small {
            font-family: ${props => props.theme.sansSerif};
            color: ${props => props.theme.green}
        }
        a {
            &:hover {
                color: ${props => props.theme.green};
                cursor: pointer;
            }
        }
        p {
            margin-bottom: 1rem;
        }
    }
    .image {
        width: 100px;
        margin: 0 0 0 1rem;
        text-align: center;
        img {
            height: 80px;
            max-width: 100px;
        }
    }
    @media (max-width: 650px) {
        flex-direction: column;
        margin-bottom: 1rem;
        .text {
            width: 100%;
        }
        .image {
            width: 100%;
        }
        img {
            margin-top: 1rem;
            height: 100px !important;
            max-width: 140px !important;
        }
        p {
            margin-bottom: 0 !important;
        }
    }
`;

class Story extends Component {
    render() {
        return (
            <Container>
                <div className="text">
                    <Link href={{pathname: '/story', query: { id: this.props.story.id }}}><h4><a>{this.props.story.title}</a></h4></Link>    
                    <small>Posted <Moment date={this.props.story.createdAt} format="Do MMM YYYY"/> by {this.props.story.author}</small> 
                    <p>{JSON.parse(this.props.story.content)[0].children[0].text.substring(0, 120)}{JSON.parse(this.props.story.content)[0].children[0].text.length > 120 ? "..." : ""}</p>
                </div>
                {this.props.story.image && <div className="image">
                    <Link href={{pathname: '/story', query: { id: this.props.story.id }}}><a>{this.props.story.image && <img src={this.props.story.image} alt={this.props.title}/>}</a></Link>    
                </div>}
            </Container>
        );
    }
}

export default Story;


