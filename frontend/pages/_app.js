import App, {Container} from 'next/app';
import Router from 'next/router'
import { ApolloProvider } from 'react-apollo';
import React from 'react';
import window from 'global' 
import TagManager from 'react-gtm-module'
import Page from '../components/Page';
import withData from '../lib/withData';
import * as gtag from '../lib/gtag'
import { endpoint, prodEndpoint } from '../config.js';
import '../lib/bootstrap.min.css';


const tagManagerArgs = {
    gtmId: 'GTM-NCSSVXP'
}

Router.events.on('routeChangeComplete', url => gtag.pageview(url))

if (process.env.NODE_ENV !== 'development') {
    if (window.document) { 
        const httpTokens = /^http:\/\/(.*)$/.exec(window.location.href)
        if(httpTokens) { 
            window.location.replace('https://' + httpTokens[1]); 
        } 
    }
}

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};
        if(Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        pageProps.query = ctx.query;
        return { pageProps };
    }
    componentDidMount () {
        // Google Analytics
        TagManager.initialize(tagManagerArgs)
        // Facebook Ad tracking
        import('react-facebook-pixel')
        .then((x) => x.default)
        .then((ReactPixel) => {
            ReactPixel.init('687751288615310');
            ReactPixel.pageView();
            Router.events.on('routeChangeComplete', () => {
                ReactPixel.pageView();
            });
        });
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