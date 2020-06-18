import React, { Component } from 'react';
import Head from 'next/head'
import { endpoint, prodEndpoint } from '../config.js';
import FeatureShow from '../components/FeatureShow';
import Kickstarter from '../components/Kickstarter';
import { optimiseCloudinary } from '../lib/utils'

class feature extends Component {
    static async getInitialProps(ctx) {
        // get the feature id from the context
        const id = ctx.query.id;
        // find the right url to query the yoga server, in production and development
        const url = process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint
        // query it 
        const res = await fetch(`${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `{ feature(id: "${id}") { id title subtitle createdAt author bio content featuredImage latitude longitude category}}` }),
        })
        
        const payload = await res.json()
        const feature = payload.data.feature
        return { feature };
    }
    render() {
        return (
            <>
                <Head>
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:site" content="@ourstosave" />
                    <meta property="og:url"                content={`https://www.ourstosave.com/feature?id=${this.props.feature.id}`} key='og:url'/>
                    <meta property="og:title"              content={this.props.feature.title} key='og:title'/>
                    <meta property="og:description"        content={this.props.feature.subtitle} key='og:description'/>
                    <meta property="og:image"              content={optimiseCloudinary(this.props.feature.featuredImage, 400)} key='og:image'/>
                    <meta property="og:type"               content="article" key='og:type'/>
                </Head>
                <FeatureShow feature={this.props.feature}/>
            </>
        );
    }
}

export default feature;