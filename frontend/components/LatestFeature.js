import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { optimiseCloudinary } from '../lib/utils'
import { Query } from 'react-apollo'
import { CURRENT_USER_QUERY } from '../lib/Apollo'
import Cookies from 'universal-cookie';

const cookies = new Cookies()

const Container = styled.div`
    display: flex;
    background-color: ${props => props.theme.yellow};
    background-image: url(littlePluses.png);                
    .content {
        padding: 1rem;
        font-family: ${props => props.theme.serif};
        color: ${props => props.theme.black};
        h2 {
            /* margin-top: 0; */
            margin-bottom: 0;
        }
        .breaking {
            padding: 4px 0.5rem;
            font-family: ${props => props.theme.sansSerif};
            background-color: ${props => props.theme.green};
            display: inline-block;
            font-weight: bolder;
            color: white;
            letter-spacing: 1px;
        }
        .category {
            text-transform: capitalize;
            font-family: ${props => props.theme.sansSerif};
            margin-top: 0;
            color: ${props => props.theme.green};
        }
        .author {
            opacity: 0.5;
        }
    }
    img {
        height: 400px;
        width: 66%;
        object-fit: cover;
    }
    &:hover {
        box-shadow: 0px 0px 4px rgba(50,50,50,0.3);
    }
    @media (max-width: 700px) {
        flex-direction: column-reverse;
        img {
            width: 100%;
        }
    }
`;

class LatestFeature extends Component {
    render() {
        return (
            <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}>
                {({data, error, loading}) => {
                    if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                    if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                    const me = data.me === null ? null : data.me
                    // if (me && me.permissions.includes("PREMIUM")) {
                        return (
                            <Link href={{pathname: '/feature', query: { id: this.props.feature.id, title: this.props.feature.title }}}>
                                <a>
                                    <Container>
                                        <div className="content">
                                            <span className="breaking">LATEST FEATURE</span>
                                            <h2>{this.props.feature.title}</h2>
                                            <p className="category">{this.props.feature.category}</p>
                                            <p className="author">{this.props.feature.author}</p>
                                            <p>{this.props.feature.subtitle}</p>
                                        </div>
                                        <img src={optimiseCloudinary(this.props.feature.featuredImage, 600)} alt=""/>
                                    </Container>
                                </a>
                            </Link>
                        )
                    // } else {
                    //     return (
                    //         <Link href="/account">
                    //             <a>
                    //                 <Container>
                    //                     <div className="content">
                    //                         <span className="breaking">LATEST FEATURE</span>
                    //                         <h2>{this.props.feature.title}</h2>
                    //                         <p className="category">{this.props.feature.category}</p>
                    //                         <p className="author">{this.props.feature.author}</p>
                    //                         <p>{this.props.feature.subtitle}</p>
                    //                     </div>
                    //                     <img src={optimiseCloudinary(this.props.feature.featuredImage, 600)} alt=""/>
                    //                 </Container>
                    //             </a>
                    //         </Link>
                    //     )
                    // }
                }}
            </Query>
        );
    }
}

export default LatestFeature;