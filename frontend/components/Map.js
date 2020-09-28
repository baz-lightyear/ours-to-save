import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {Query} from 'react-apollo';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';
import {MAP_STORIES_QUERY} from './Apollo';
import Marker from './Marker';


const Form = styled.form`
height: 0px;
position: relative;
top: 1rem;
text-align: center;
z-index: 1;
margin: auto;
width: fit-content;
@media (max-width: 600px) {
    text-align: left;
    margin-left: 1rem;
}
    input {
        background-color: white;
        color: grey;
        padding-left: 8px;
        border: solid 2px ${props => props.theme.green};
        border-radius: 0 16px 16px 0;
        font-family: ${props => props.theme.serif};
        position: relative;
        top: -1px;
        &:focus {
            outline: none;
        }
    }
    button {
        background-color: ${props => props.theme.green};
        padding-left: 8px;
        height: 33px;
        border: none;
        border-radius: 16px 0 0 16px;
        &:focus {
            outline: none;
        }
        img {
            height: 16px;
            position: relative;
            top: -1px;
        }
    }
`;

class Map extends Component {
    state = {
        address: "",
        center: {lat: 51, lng: 0},
        zoom: 3
    }
    mapOptions = { styles: [
      {
          "featureType": "administrative",
          "elementType": "labels.text.fill",
          "stylers": [
              {
                  "color": "#71737c",
              }
          ]
      },
    //   {
    //       "featureType": "landscape",
    //       "elementType": "all",
    //       "stylers": [
    //           {
    //               "color": "#f2f2f2"
    //           }
    //       ]
    //   },
    //   {
    //       "featureType": "poi",
    //       "elementType": "all",
    //       "stylers": [
    //           {
    //               "visibility": "off"
    //           }
    //       ]
    //   },
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
                  "color": "#C1DBE3"
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
        "featureType": "administrative.land_parcel",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.neighborhood",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
    ]}
    handleChange = e => {
        this.setState({address: e.target.value})
    }
    render() {
        return (
            <Query query={MAP_STORIES_QUERY} variables={{first: 50}}>
                {({ data, error, loading }) => {
                    if (loading) return <img src="loading.gif" alt="loading" height="50"  style={{margin: "auto", display: "block"}}/>;
                    if (error) return null;
                    if (data) return (
                        <div style={{ height: '60vh', width: '100%'}}>
                            {/* <Form onSubmit={async e => {
                                e.preventDefault();
                                const geocodingApiKey = 'AIzaSyCHnPOc-JR_LcJqiu40yHIW-PlaGMtf0hw'
                                const location = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.address}&key=${geocodingApiKey}`)
                                .then(response => response.json())
                                .then(data => {
                                    this.setState({zoom: 10, center: { lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng}})
                                }).catch((error) => {
                                    console.error('Error:', error);
                                });
                            }}>
                                <button type="submit"><img src="search.png" alt="search icon, (Search by Kyle Dodson from the Noun Project)"/></button>
                                <input type="text" placeholder="search" onChange={this.handleChange}/>
                            </Form> */}

                            <GoogleMapReact
                                bootstrapURLKeys={{ key: 'AIzaSyCHnPOc-JR_LcJqiu40yHIW-PlaGMtf0hw' }}
                                defaultZoom={this.state.zoom}
                                zoom={this.state.zoom}
                                options={this.mapOptions}
                                center={this.state.center}
                                id="map"
                            >
                                {data.mapStories.map(story => <Marker lng={story.longitude} lat={story.latitude} key={story.id} story={story}/>)}                               
                            </GoogleMapReact>
                        </div>
                    )
                }}
            </Query>
        );
    }
}

export default Map;