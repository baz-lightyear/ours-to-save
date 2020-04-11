import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Moment from 'react-moment';


const Container = styled.div`

`;

class Feature extends Component {
    render() {
        return (
            <Container>
                <div className="text">
                    <Link href={{pathname: '/feature', query: { id: this.props.feature.id }}}><h4><a>{this.props.feature.title}</a></h4></Link>    
                    <small>Posted <Moment date={this.props.feature.createdAt} format="Do MMM YYYY"/> by {this.props.feature.author}</small> 
                    <p>{this.props.feature.content.substring(0, 120)}{this.props.feature.content.length > 120 ? "..." : ""}</p>
                </div>
            </Container>
        );
    }
}

export default Feature;