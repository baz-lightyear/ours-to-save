import React, { Component } from 'react';
import {Query} from 'react-apollo';
import {FEATURES_QUERY} from './Apollo';
import Feature from './Feature';

class Features extends Component {
    render() {
        return (
            <Query query={FEATURES_QUERY}>
            {({ data, error, loading }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error: {error.message}</p>;
                return (
                    <div>
                        {data.features.map(feature => <Feature feature={feature} key={feature.id}/>)}
                    </div>
                );
            }}
            </Query>
        );
    }
}

export default Features;