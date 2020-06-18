import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Query } from 'react-apollo';
import { FEATURES_QUERY } from '../components/Apollo';
import LatestFeature from '../components/LatestFeature';
import FeatureCard from '../components/FeatureCard';
import CategoryTab from '../components/CategoryTab';

const Container = styled.div`
    width: 95%;
    max-width: 1000px;
    margin: auto;
    h1 {
        font-family: ${props => props.theme.serif};
    }
    #latest {
        padding: 1rem;
    }
    .features {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
`;

class features extends Component {
    render() {
        return (
            <Container>
                <CategoryTab/>
                <h1>Analysis & opinion from world-class journalists</h1>
                <Query query={FEATURES_QUERY}>
                    {({data, loading, error}) => {
                        if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                        if (error) return <p>Error: {error.message}</p>;
                        const features = data.features
                        return (
                            <>
                                <div id="latest">
                                    <LatestFeature feature={features[0]}/>
                                </div>
                                <div className="features">
                                    {features.slice(1, features.length).map(feature => {
                                        return (
                                            <FeatureCard feature={feature}/>
                                        )
                                    })}
                                </div>
                            </>
                        )
                    }}

                </Query>
            </Container>
        )
    }
}


export default features;