import React, { Component } from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import Moment from 'react-moment';
import { SINGLE_STORY_QUERY } from './Apollo';
import MapStoryShow from './MapStoryShow';
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

class StoryShow extends Component {
    render() {
        return (
            <Query
                query={SINGLE_STORY_QUERY}
                variables={{
                id: this.props.id,
                }}
            >
                {({ error, loading, data }) => {
                    if (error) return <p>error</p>;
                    if (loading) return <p>Loading...</p>;
                    const story = data.story;
                    return (
                        <Container>
                            <h1>{story.title}</h1>
                            <small>Posted <Moment date={story.createdAt} format="Do MMM YYYY"/> by {story.author}</small>
                            <br/>
                            {story.image && <img id="image" src={story.image} alt={story.title} />}
                            <p>{story.content}</p>
                            <div className="sharing">
                                <p>Share: </p>
                                <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false"><img src="twitterBlue.png" alt="twitter logo"/></a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
                                <div class="fb-share-button" data-href={`https://ourstosave.com/story?id=${story.id}`} data-layout="button" data-size="small"><a target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fourstosave.com%2Fstory%3Fid=${story.id}&amp;src=sdkpreparse`} class="fb-xfbml-parse-ignore"><img src="facebookBlue.png" alt="facebook logo"/></a></div>
                            </div>
                            <div className="mapContainer">
                                <MapStoryShow story={story}/>
                            </div>
                            <OtherArticles story={story}/>
                        </Container>
                    );
                }}
            </Query>
        );
    }
}

export default StoryShow;