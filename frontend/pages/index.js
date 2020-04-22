import React, { Component } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';
import Subscribe from '../components/Subscribe';


const Container = styled.div`
    display: flex;
    .text {
        .textWrapper {
            width: 90%;
            margin: auto;        
            font-family: ${props => props.theme.serif};
           .link {
               text-align: center;
                a {
                    border: solid 2px ${props => props.theme.green};
                    padding: 0.5rem 2rem;
                    font-family: ${props => props.theme.sansSerif};
                    font-weight: 700;
                    color: ${props => props.theme.green};
                    &:hover {
                        color: ${props => props.theme.black};
                        border: solid 2px ${props => props.theme.black};
                    }
                }
            }
        }
    }
    @media (min-width: 851px) {
        min-height: calc(100vh - 125px);
        .text {
            width: 67%;
            .textWrapper {
                h1 {
                    margin-top: 10rem;
                    font-size: 4.5rem;
                    line-height: 1;
                    margin-bottom: 0px;
                }
                p {
                    font-size: 1.5rem;
                }
                .link {
                    margin-top: 6rem;
                    margin-bottom: 2rem;
                }
            }
        }
    }
    .imgDiv {
        width: 33%;
        background-image: url("wakeUp.png");
        background-size: cover;
    }
    @media (max-width: 850px) {
        flex-direction: column-reverse;
        .textWrapper {
            width: 100%;
            h1 {
                margin: 0;
                margin-top: 1rem;
                font-size: 3rem;
                text-align: center;
                line-height: 1.5;
            }
            p {
                margin-top: 0rem;
                text-align: center;
            }
            .link {
                margin: 3rem 0;
            }
        }
        .imgDiv {
            width: 100%;
            height: 480px;
            background-position-y: 50%;
        }
    }
`;

class index extends Component {    
    render() {
        return (
            <Container>
                <div className="text">
                    <div className="textWrapper">
                        <h1>It's ours to save.</h1>
                        <p><em>Ours to Save</em> is a new journalism initiative focused exclusively on the climate crisis. Our interactive map displays crowdsourced, breaking climate news from all over the world. </p>
                        <div className="link"><Link href="/map"><a>see it in action</a></Link></div> 
                        <Subscribe/>
                    </div>
                </div>
                <div className="imgDiv">
                </div>
            </Container>
        );
    }
}

export default index;