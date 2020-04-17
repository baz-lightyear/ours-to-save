import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { SINGLE_FEATURE_QUERY } from '../components/Apollo';
import FeatureShow from '../components/FeatureShow';

class feature extends Component {
    render() {
        return (
            <Query
                query={SINGLE_FEATURE_QUERY}
                variables={{
                    id: this.props.query.id,
                }}
            >
                {({ error, loading, data }) => {
                    if (error) return <p>error</p>;
                    if (loading) return <p>Loading...</p>;
                    return ( 
                        <FeatureShow id={this.props.query.id} feature={data.feature}/>
                    )
                }}
            </Query>
        );
    }
}

export default feature;