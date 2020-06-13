import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link'

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    border-bottom: solid 1px ${props => props.theme.lightgreen};
    a {
        color: ${props => props.theme.black};
        text-decoration: none;
        margin: 1rem;
        font-weight: bolder;
        opacity: 0.8;
        &:hover {
            opacity: 1;
        }
    }
`;

class CategoryTab extends Component {
    render() {
        return (
            <Container>
                <Link href="/news">
                    <a>all</a>
                </Link>
                <Link href={{pathname: '/category', query: { category: "innovation" }}}>
                    <a>innovation</a>
                </Link>
                <Link href={{pathname: '/category', query: { category: "power" }}}>
                    <a>power</a>
                </Link>
                <Link href={{pathname: '/category', query: { category: "conservation" }}}>
                    <a>conservation</a>
                </Link>
                <Link href={{pathname: '/category', query: { category: "inspiration" }}}>
                    <a>inspiration</a>
                </Link>
            </Container>
        );
    }
}

export default CategoryTab;