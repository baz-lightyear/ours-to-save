import React, { Component } from 'react';
import { Query } from 'react-apollo'
import { CATEGORY_FEATURES_QUERY } from '../components/Apollo'
import FeatureCard from '../components/FeatureCard'
import LatestFeature from '../components/LatestFeature'
import CategoryTab from '../components/CategoryTab';
import {optimiseCloudinary} from '../lib/utils'
import styled from 'styled-components';
import Founders from '../components/Founders';


const Container = styled.div`
    margin: auto;
    width: 95%;
    max-width: 1000px;
    h1 {
        font-family: ${props => props.theme.serif};
        text-transform: capitalize;
        margin-bottom: 0;
    }
    .description {
        font-family: ${props => props.theme.serif};
        margin-bottom: 2rem;
    }
    #latestFeature {
        padding: 1rem;
    }
    #features {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
`

class category extends Component {
    static async getInitialProps(ctx) {
        const category = ctx.query.category;
        return { category };
    }
    describe = (category) => {
        switch (category) {
            case "innovation" :
                return "Scientists & entrepreneurs proactively engineering the climate. Technology, progress, change."
            case "conservation" :
                return "Protection of wild spaces from the anthropocene's reach. Rewilding, preservation efforts, ecosystems."
            case "power" : 
                return "Institutions shaping the future. Government, corporations, media, finance and law."
            case "inspiration" : 
                return "Efforts to educate, motivate & raise awareness. Culture, arts, voices."
            default : ""
        }
    }
    render() {
        return (
            <Query query={CATEGORY_FEATURES_QUERY} variables={{category: this.props.category}}>
                {({data, error, loading}) => {
                    if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                    if (error) return <p>Error: {error.message}</p>;
                    const features = data.categoryFeatures
                    return (
                        <Container>
                            <CategoryTab category={this.props.category}/>
                            <h1>{this.props.category}</h1>
                            <p className="description">{this.describe(this.props.category)}</p>
                            <div id="latestFeature">
                                <LatestFeature feature={features[0]}/>
                            </div>
                            <hr/>
                            <div id="features">
                                {features.slice(1, features.length).map(feature => {
                                    return (
                                        <FeatureCard feature={feature}/>
                                    )
                                })}
                            </div>
                            {/* <Founders/> */}
                        </Container>
                    )
                }}
            </Query>
        );
    }
}

export default category;