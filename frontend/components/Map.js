import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {Query} from 'react-apollo';
import {STORIES_QUERY} from './Apollo';
import Marker from './Marker';



class Map extends Component {
    mapOptions = { styles: [
      {
          "featureType": "administrative",
          "elementType": "labels.text.fill",
          "stylers": [
              {
                  "color": "#71737c"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#f2f2f2"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": -100
              },
              {
                  "lightness": 45
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#ffffff"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "labels.icon",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#dde6e8"
              },
              {
                  "visibility": "on"
              }
          ]
      }
    ]}
    render() {
        return (
            <Query query={STORIES_QUERY}>
                {({ data, error, loading }) => {
                    if (loading) return <img src="loading.gif" alt="loading" height="50"/>;
                    if (error) return null;
                    if (data) return (
                        <div style={{ height: '70vh', width: '100%' }}>
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: 'AIzaSyCHnPOc-JR_LcJqiu40yHIW-PlaGMtf0hw' }}
                                defaultCenter={{lat: data.stories[0].latitude, lng: data.stories[0].longitude }}
                                defaultZoom={7}
                                options={this.mapOptions}
                            >
                                {data.stories.map(story => <Marker lng={story.longitude} lat={story.latitude} key={story.id} story={story}/>)}                               
                            </GoogleMapReact>
                        </div>
                    )
                }}
            </Query>
        );
    }
}

export default Map;