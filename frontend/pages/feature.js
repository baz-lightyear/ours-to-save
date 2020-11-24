import React, { Component } from 'react';
import Head from 'next/head'
import { endpoint, prodEndpoint } from '../config.js';
import FeatureShow from '../components/FeatureShow';
import { optimiseCloudinary } from '../lib/utils'
import Founders from '../components/Founders';


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
            body: JSON.stringify({ query: `{ feature(id: "${id}") { id title subtitle createdAt author bio content featuredImage latitude longitude category comments { id createdAt approved content author { name }}}}` }),
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
                    <title>{this.props.feature.title}</title>
                </Head>
                <FeatureShow feature={this.props.feature}/>
                {/* <Founders/> */}
            </>
        );
    }
}

export default feature;