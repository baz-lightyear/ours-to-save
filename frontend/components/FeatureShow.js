import React, { Component } from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import Moment from 'react-moment';
import { SINGLE_FEATURE_QUERY } from './Apollo';
import OtherArticles from './OtherArticles';

const Container = styled.div`
    width: 90%;
    max-width: 700px;
    margin: auto;
    min-height: calc(100vh - 125px);
    font-family: ${props => props.theme.serif};
    small {
        font-family: ${props => props.theme.sansSerif};
    }
    .sharing {
        display: flex;
        justify-content: center;
        p {
            margin: none;
            margin-right: 1rem;
            font-family: ${props => props.theme.sansSerif};
        }
        a {
            margin-right: 1rem;
            opacity: 0.9;
            &:hover {
                opacity: 1;
            }
            img {
                height: 1rem;
            }
        }
    }
    padding: 1rem;
    #image {
        display: block;
        margin: 2rem auto;
        height: 200px;
    }
`;

class FeatureShow extends Component {
    render() {
        return (
            <Query
                query={SINGLE_FEATURE_QUERY}
                variables={{
                id: this.props.id,
                }}
            >
                {({ error, loading, data }) => {
                    if (error) return <p>error</p>;
                    if (loading) return <p>Loading...</p>;
                    const feature = data.feature;
                    return (
                        <Container>
                            <h1>{feature.title}</h1>
                            <small>Posted <Moment date={feature.createdAt} format="Do MMM"/> by {feature.author}</small>
                            <br/>
                            <p>{feature.content}</p>
                            <div className="sharing">
                                <p>Share: </p>
                                <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false"><img src="twitterBlue.png" alt="twitter logo"/></a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
                                <div class="fb-share-button" data-href={`https://ourstosave.com/feature?id=${feature.id}`} data-layout="button" data-size="small"><a target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fourstosave.com%2Ffeature%3Fid%${feature.id}&amp;src=sdkpreparse`} class="fb-xfbml-parse-ignore"><img src="facebookBlue.png" alt="facebook logo"/></a></div>
                            </div>
                            <OtherArticles feature={feature}/>
                        </Container>
                    );
                }}
            </Query>
        );
    }
}

export default FeatureShow;