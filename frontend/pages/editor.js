import React, { Component } from 'react';
import styled from 'styled-components';
import FeatureEditor from '../components/FeatureEditor';
import { Query } from 'react-apollo'
import {CURRENT_USER_QUERY} from '../components/Apollo'
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

class editor extends Component {
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
                                <h1>Add feature</h1>
                                <FeatureEditor content={JSON.stringify([{type: 'paragraph', children: [{ text: "" }]}])}/>
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

export default editor;