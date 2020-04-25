import App, {Container} from 'next/app';
import Router from 'next/router'
import { ApolloProvider } from 'react-apollo';
import React from 'react';
import 'draft-js/dist/Draft.css'
import Page from '../components/Page';
import withData from '../lib/withData';
import * as gtag from '../lib/gtag'

import '../lib/bootstrap.min.css';

Router.events.on('routeChangeComplete', url => gtag.pageview(url))


class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};
        if(Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        pageProps.query = ctx.query;
        return { pageProps };
    }
    
    render() {
        const { Component, apollo, pageProps } = this.props;

        return (
            <ApolloProvider client={this.props.apollo}>
                <Page>
                    <Component {...pageProps} />
                </Page>
            </ApolloProvider>
        )
    }
}

export default withData(MyApp);