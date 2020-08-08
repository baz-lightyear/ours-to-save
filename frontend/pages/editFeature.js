import React, { Component } from 'react';
import FeatureEditor from '../components/FeatureEditor'
import { endpoint, prodEndpoint } from '../config.js';
import styled from 'styled-components'
import { CURRENT_USER_QUERY } from '../components/Apollo';
import { Query } from 'react-apollo'
import Link from 'next/link'
import Cookies from 'universal-cookie';

const cookies = new Cookies()

const Container = styled.div`
    margin: auto;
    width: 95%;
    max-width: 1000px;
    .hide {
        display: none;
    }
    .show {
        display: block;
    }
`;

class editFeature extends Component {
    static async getInitialProps(ctx) {
        // get the feature id from the context
        const id = ctx.query.id;
        // find the right url to query the yoga server, in production and development
        const url = process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint
        // query it 
        const res = await fetch(`${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `{ feature(id: "${id}") { id title subtitle createdAt author bio content featuredImage latitude longitude address category comments { id createdAt approved content author { name }}}}` }),
        })
        
        const payload = await res.json()
        const feature = payload.data.feature
        return { feature };
    }

    render() {
        return (
            <Query query={CURRENT_USER_QUERY} variables={{token: cookies.get('token')}}>
                 {({data, loading, error}) => {
                    if (loading) return <p style={{margin: "1rem", textAlign: "center"}}>Loading...</p>;
                    if (error) return <p style={{margin: "1rem auto"}}>Error: {error.message}</p>;
                    const me = data.me === null ? null : data.me
                    return (
                        <Container>
                            {me && me.permissions.includes("EDITOR") &&
                                <>
                                    <h1>Edit feature</h1>
                                    <FeatureEditor 
                                        title={this.props.feature.title}
                                        content={this.props.feature.content}
                                        // address={this.props.feature.address}
                                        subtitle={this.props.feature.subtitle}
                                        bio={this.props.feature.bio}
                                        authorName={this.props.feature.author}
                                        category={this.props.feature.category}
                                        updating={true}
                                        featureId={this.props.feature.id}
                                        featuredImage={this.props.feature.featuredImage}
                                    />
                                </>
                            }
                            {me && !me.permissions.includes("EDITOR") && 
                                <p>Are you in the right place? Back to <Link href="/"><a>home</a></Link></p>
                            }
                            {!me && 
                                <p>Log in to access this page</p>
                            }
                        </Container>
                    )
                 }}
            </Query>
        );
    }
}

export default editFeature;