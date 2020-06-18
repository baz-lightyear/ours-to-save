import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link'

const Container = styled.div`
    display: flex;
    /* justify-content: space-between; */
    border-bottom: solid 1px ${props => props.theme.lightgreen};
    a {
        color: ${props => props.theme.black};
        text-decoration: none;
        padding: 1rem 0;
        margin: 0 1rem 0 0;
        font-weight: bolder;
        opacity: 0.8;
        &:hover {
            opacity: 1;
        }
        &.active {
            color: ${props => props.theme.green};
            border-bottom: solid 4px ${props => props.theme.green};
        }
    }
    @media (max-width: 600px) {
        display: none;
    }
`;

class CategoryTab extends Component {
    render() {
        return (
            <Container>
                <Link href="/features">
                    <a className={this.props.category === undefined ? "active" : null}>latest</a>
                </Link>
                <Link href={{pathname: '/category', query: { category: "innovation" }}}>
                    <a className={this.props.category === "innovation" ? "active" : null}>innovation</a>
                </Link>
                <Link href={{pathname: '/category', query: { category: "power" }}}>
                    <a className={this.props.category === "power" ? "active" : null}>power</a>
                </Link>
                <Link href={{pathname: '/category', query: { category: "conservation" }}}>
                    <a className={this.props.category === "conservation" ? "active" : null}>conservation</a>
                </Link>
                <Link href={{pathname: '/category', query: { category: "inspiration" }}}>
                    <a className={this.props.category === "inspiration" ? "active" : null}>inspiration</a>
                </Link>
            </Container>
        );
    }
}

export default CategoryTab;