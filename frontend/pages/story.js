import React, { Component } from 'react';
import StoryShow from '../components/StoryShow';
import Head from 'next/head'
import { endpoint, prodEndpoint } from '../config.js';

class story extends Component {
    static async getInitialProps(ctx) {

        // get the feature id from the context

        const id = ctx.query.id;
        
        // find the right url to query the yoga server, in production and development

        const url = process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint

        // query it 

        const res = await fetch(`${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `{ story(id: "${id}") { id title content longitude latitude morality createdAt author image }}` }),
        })
        
        const payload = await res.json()
        const story = payload.data.story

        return { story };
    }
    render() {
        return (
            <>
                <Head>
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:site" content="@ourstosave" />
                    <meta property="og:url"                content={`https://www.ourstosave.com/story?id=${this.props.story.id}`} key='og:url'/>
                    <meta property="og:title"              content={this.props.story.title} key='og:title'/>
                    <meta property="og:description"        content={this.props.story.content} key='og:description'/>
                    <meta property="og:image"              content={this.props.story.image} key='og:image'/>
                    <meta property="og:type"               content="article" key='og:type'/>
                </Head>
                <StoryShow id={this.props.story.id} story={this.props.story}/>
            </>  
        );
    }
}

export default story;