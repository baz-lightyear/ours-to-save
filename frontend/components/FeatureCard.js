import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Moment from 'react-moment';
import { optimiseCloudinary } from '../lib/utils';


const Container = styled.div`
    width: 30%;
    @media (max-width: 1000px) {
        width: 40%;
    }
    @media (max-width: 700px) {
        width: 100%;
    }
    background-color: ${props => props.theme.yellow};
    background-image: url(littlePluses.png);
    margin: 1rem;
    border-radius: 2px;
    /* border: solid 1px ${props => props.theme.lightgreen}; */
    a {
        color: ${props => props.theme.black};
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        img {
            height: 300px;
            width: 100%;
            object-fit: cover;
        }
        .text {
            padding: 0.5rem;
            font-family: ${props => props.theme.serif};
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            h4 {
                margin: 0;
                margin-top: 0.5rem;
            }
            .category {
                margin-top: 0;
                margin-bottom: 1rem;
                font-family: ${props => props.theme.sansSerif};
                color: ${props => props.theme.green};
                text-transform: capitalize;
            }
            .subtitle {
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
    }

`;

class Feature extends Component {
    render() {
        return (
            <Container>
                <Link href={{pathname: '/feature', query: { id: this.props.feature.id }}}>
                    <a>
                        <img src={optimiseCloudinary(this.props.feature.featuredImage, 600)} alt={this.props.feature.title}/>
                        <div className="text">
                            <div className="info">
                                <h4>{this.props.feature.title}</h4>
                                <p className="category">{this.props.feature.category}</p>
                                <p className="subtitle">{this.props.feature.subtitle}</p>
                            </div>
                            <small><Moment date={this.props.feature.createdAt} format="Do MMM YYYY"/>﹒<span>{this.props.feature.author}</span></small>
                        </div>
                    </a>
                </Link>
            </Container>
        );
    }
}

export default Feature;