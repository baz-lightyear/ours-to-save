import React, { Component } from 'react';
import { Query } from 'react-apollo'
import { CATEGORY_FEATURES_QUERY } from './Apollo'
import FeatureCard from './FeatureCard';
import styled from 'styled-components'

const Container = styled.div`
    padding: 0 1rem;
    h2 {
        text-align: center;
        margin-top: 2rem;
        span {
            color: ${props => props.theme.green};
        }
    }
    .suggestions {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
`
const Filler = styled.div`
    height: ;
`;

class CategorySuggestions extends Component {
    render() {
        return (
            <Query query={CATEGORY_FEATURES_QUERY} variables={{category: this.props.category}}>
                {({data, error, loading}) => {
                    if (loading) return <><p style={{textAlign: "center", margin: "1rem"}}>Loading...</p><img src="loading.gif" alt="loading" height="50"  style={{display: "block", margin: "auto"}}/></>;
                    if (error) return <p>Error: {error.message}</p>;
                    const features = data.categoryFeatures.filter(feature => feature !== this.props.feature).slice(0, 3)
                    return (
                        <>
                        <Container>
                            <h2>More in <span>{this.props.category}</span></h2>
                            <div className="suggestions">
                                {features.map(feature => {
                                    return  <FeatureCard key={feature.id} feature={feature}/>
                                })}
                            </div>
                        </Container>
                        <Filler/>
                        </>
                    )
                }}
            </Query>
        );
    }
}

export default CategorySuggestions;