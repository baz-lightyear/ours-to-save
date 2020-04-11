import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import Moment from 'react-moment';
import { SINGLE_FEATURE_QUERY } from './Apollo';
import OtherArticles from './OtherArticles';

const Container = styled.div`
    width: 95%;
    max-width: 700px;
    margin: auto;
    min-height: calc(100vh - 125px);
    font-family: ${props => props.theme.serif};
    padding: 1rem;
    .date {
        text-align: right;
        margin-bottom: 0;
    }
    .author {
        text-align: right;
        margin-bottom: 1rem;
    }
    .paragraph {
        text-align: justify;
        margin-bottom: 2rem;
    }
    .links {
        border-top: solid 1px ${props => props.theme.green};
        padding-top: 2rem;
        margin-top: 2rem;
        font-family: ${props => props.theme.sansSerif};
        font-weight: 700;
    }
    .link {
        text-decoration: none;
        color: ${props => props.theme.black};
        &:hover {
            color: ${props => props.theme.green};
        }
    }
    .bio {
        margin-top: 2rem;
        text-align: right;
    }
    #top-sharing {
        padding-bottom: 1rem;
        border-bottom: solid 1px ${props => props.theme.green};
    }
    #bottomSharing {
        padding-bottom: 1rem;
        margin-bottom: 2rem;
    }
    .sharing {
        display: flex;
        justify-content: flex-end;
        p {
            margin-bottom: 0;
            font-family: ${props => props.theme.sansSerif};
        }
        a {
            margin-left: 1rem;
            opacity: 0.9;
            &:hover {
                opacity: 1;
            }
            img {
                height: 1rem;
            }
        }
    }
    .image {
        display: block;
        margin: 2rem auto;
        width: 90%;
    }
    .otherArticles {
        margin-top: 2rem;
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
                    const feature = data.feature
                    return (
                        <Container>
                            <h1>{feature.title}</h1>
                            <h3 className="subtitle"><em>{feature.subtitle}</em></h3>
                            <p className="date"><Moment date={feature.createdAt} format="Do MMM YYYY"/></p>
                            <p className="author">{feature.author}</p>
                            <div className="sharing" id="top-sharing">
                                <p>Share this article: </p>
                                <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false"><img src="twitterBlue.png" alt="twitter logo"/></a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
                                <div class="fb-share-button" data-href={`https://ourstosave.com/feature?id=${feature.id}`} data-layout="button" data-size="small"><a target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fourstosave.com%feature%3Fid=${feature.id}&amp;src=sdkpreparse`} class="fb-xfbml-parse-ignore"><img src="facebookBlue.png" alt="facebook logo"/></a></div>
                            </div>
                            {feature.paragraphs.map(paragraph => {
                                return (
                                    <Fragment key={paragraph.id}>
                                        {paragraph.image && <img src={paragraph.image} alt="image" className="image"/>}
                                        <p className="paragraph" >{paragraph.text}</p>
                                    </Fragment>
                                )
                            })}
                            <p className="bio"><em>{feature.bio}</em></p>
                            <p className="links">Links:</p>
                            <ul>
                            {feature.featureLinks.map(link => {
                                return (
                                    <li key={link.id}><a href={link.ref} className="link">{link.title}</a></li>
                                )
                            })}
                            </ul>
                            <div className="sharing" id="bottomSharing">
                                <p>Share this article: </p>
                                <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false"><img src="twitterBlue.png" alt="twitter logo"/></a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
                                <div class="fb-share-button" data-href={`https://ourstosave.com/feature?id=${feature.id}`} data-layout="button" data-size="small"><a target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fourstosave.com%feature%3Fid=${feature.id}&amp;src=sdkpreparse`} class="fb-xfbml-parse-ignore"><img src="facebookBlue.png" alt="facebook logo"/></a></div>
                            </div>
                            <OtherArticles story="1"/>
                        </Container>
                    );
                }}
            </Query>
        );
    }
}

export default FeatureShow;