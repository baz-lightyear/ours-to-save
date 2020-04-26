import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Moment from 'react-moment';


const Container = styled.div`
    padding-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: ${props => props.theme.serif};
    border-top: solid 1px ${props => props.theme.lightgreen};
    .text {
        text-align: left;
        width: 100%;
        h2 {
            margin: 0;
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
        .author {
            text-align: right;
            margin-bottom: 0;
            margin-top: 1rem;
            font-size: 12px;
        }
        img {
            width: 100%;
            margin: 1rem 0;
            cursor: pointer;
        }
    }
`;

class Feature extends Component {
    render() {
        return (
            <Container>
                <div className="text">
                    <p className="author"><em>{this.props.feature.author}</em></p> 
                    <Link href={{pathname: '/feature', query: { id: this.props.feature.id }}}><h2><a>{this.props.feature.title}</a></h2></Link>    
                    <p>{this.props.feature.subtitle}</p>
                    <small><Moment date={this.props.feature.createdAt} format="Do MMM YYYY"/></small>
                    <Link href={{pathname: '/feature', query: { id: this.props.feature.id }}}>
                        <img src={this.props.feature.featuredImage} alt={this.props.feature.title}/>
                    </Link>
                </div>
            </Container>
        );
    }
}

export default Feature;