import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Moment from 'react-moment';
import { optimiseCloudinary } from '../lib/utils';


const Container = styled.div`
    a {
        color: ${props => props.theme.black};
    }
    display: flex;
    flex-direction: column;
    width: 300px;
    background-color: ${props => props.theme.yellow};
    background-image: url(littlePluses.png);
    margin: 1rem;
    border-radius: 2px;
    img {
        height: 150px;
        width: 100%;
        object-fit: cover;
    }
    .text {
        padding: 0.5rem;
        font-family: ${props => props.theme.serif};
        
        h4 {
            margin: 0;
            margin-bottom: 1rem;
        }
        p {
            margin-bottom: 1rem;
        }
        small {
            display: flex;
            justify-content: space-between;
            opacity: 0.5;
        }
    }
    &:hover {
        box-shadow: 0px 0px 4px rgba(50,50,50,0.3);
    }

`;

class Feature extends Component {
    render() {
        return (
            <Container>
                <Link href={{pathname: '/feature', query: { id: this.props.feature.id }}}>
                    <a>
                        <img src={optimiseCloudinary(this.props.feature.featuredImage, 300)} alt={this.props.feature.title}/>
                        <div className="text">
                            <h4>{this.props.feature.title}</h4>
                            <p>{this.props.feature.subtitle}</p>
                            <small><Moment date={this.props.feature.createdAt} format="Do MMM YYYY"/>﹒<span>{this.props.feature.author}</span></small>
                        </div>
                    </a>
                </Link>
            </Container>
        );
    }
}

export default Feature;