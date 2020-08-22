import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Query } from 'react-apollo';
import { FEATURES_QUERY, BOOSTED_FEATURES_QUERY } from '../components/Apollo';
import LatestFeature from '../components/LatestFeature';
import FeatureCard from '../components/FeatureCard';
import CategoryTab from '../components/CategoryTab';
import Founders from '../components/Founders';


const Container = styled.div`
    width: 95%;
    max-width: 1000px;
    margin: auto;
    h1,h3 {
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
                <Query query={BOOSTED_FEATURES_QUERY}>
                    {({data, loading, error}) => {
                        if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                        if (error) return <p>Error: {error.message}</p>;
                        const boosted = data.boostedFeatures
                        const boostedIds = boosted.map(b => b.id)
                        return (
                            <Query query={FEATURES_QUERY}>
                                {({data, loading, error}) => {
                                    if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                                    if (error) return <p>Error: {error.message}</p>;
                                    const features = data.features.filter(f => {
                                        return !boostedIds.includes(f.id)
                                    })
                                    return (
                                        <>
                                            <div id="latest">
                                                <LatestFeature feature={features[0]}/>
                                            </div>
                                            <h3 style={{textAlign: "center"}}>Recently published</h3>
                                            <div className="features">
                                                {features.slice(1, 4).map(feature => {
                                                    return (
                                                        <FeatureCard feature={feature} key={feature.id}/>
                                                    )
                                                })}
                                            </div>
                                            <h3 style={{textAlign: "center"}}>Features we love</h3>
                                            <div id="weLove" className="features">
                                                {boosted.map(feature => {
                                                    return (
                                                        <FeatureCard key={feature.id} feature={feature}/>
                                                    )
                                                })}
                                                <h3>Extra reading</h3>
                                                <div className="features">
                                                    {features.slice(4, features.length).map(feature => {
                                                        return (
                                                            <FeatureCard feature={feature} key={feature.id}/>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )
                                }}
                            </Query>
                        )
                    }}
                </Query>
                {/* <Founders/> */}
            </Container>
        )
    }
}


export default features;