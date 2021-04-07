import {Card, Row, Col} from 'react-bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import store from "../store";
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import { fetchSpacesData } from "../api";

  function Space({space}) {
      return (
          <Card style={{width: '50%'}}>
            <Card.Text>
                <NavLink to={"/spaces/:" + space.id}> {space.name} <br /> </NavLink>
                Wifi: {space.wifi} <br />
            </Card.Text>
          </Card>

      );
  }

  function Feed({spaces}) {

    const [position, setPosition] = useState({
      lat:42.3252,
      long:-71.0951,
      acc:0,
      timestamp:0
    });

    const [list, setList] = useState([]);
    const ClickableMarker = (props) => {
      const onMarkerClick = (evt) => {
        console.log(props.id);
      };

      return (
        <Marker
          onClick={onMarkerClick}
          {...props}
        />
      );
    };

    function pushPosition(obj) {
      let l = list;
      l.push(obj);
        setList(l);
    }

    const onMapClick = (evt) => {
      const latLng = evt.latLng;
      pushPosition({id: list.length,
              lat: latLng.lat(),
              long: latLng.lng(),
            });
    }

    let MyMapComponent = withScriptjs(withGoogleMap(props =>
      <GoogleMap
      onClick={onMapClick}
      defaultZoom={14}
      defaultCenter={{ lat:position.lat,lng:position.long}}
      >
      {list.map(place =>
      {return (<ClickableMarker
                id={place.id}
                position={{
                          lat:place.lat,
                          lng:place.long}}/>);
              })}
      </GoogleMap>));




      function getPosition() {
        //check to make sure geolocation is supported
        //by this browser
        fetchSpacesData();
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(updatePosition);
          navigator.geolocation.getCurrentPosition(appendPosition);
        }
      }

      function appendPosition(position) {
        console.log(position);
        let l = list;
        l.push({id: list.length,
                lat: position.coords.latitude,
                long: position.coords.longitude,
              });
          setList(l);
        }

        function updatePosition(position) {
          setPosition({
            lat: position.coords.latitude,
            long: position.coords.longitude,
            acc: position.coords.accuracy,
            timestamp: position.timestamp
          });
        }

        <Row className="my-5">
          <Col>
            <h1>Study Places Feed</h1>
          </Col>
        </Row>
        let body = null;


        let cards = null;
        if (spaces!=null) {
            cards = spaces.map((space) => <Space space={space} />);
        } else {
            cards = (<p>Loading Spaces...</p>);
        }

        body = (
          <Col>
              <Row className="my-5">
                <h1>Study Places Feed</h1>
              </Row>
                <div>
                      <button onClick={() => getPosition()}>Update Location</button>
                      <ul>
                        <li>Latitude: {position.lat}</li>
                        <li>Longitude: {position.long}</li>
                        <li>Timestamp: {position.timestamp}</li>
                      </ul>
                      <ul>
                        {list.map(place =>
                          {return (
                                    <li>
                                      id: {place.id}<br/>
                                      lat:{place.lat}<br/>
                                      lng:{place.long}
                                    </li>);
                                  })}
                      </ul>
                      <MyMapComponent
                      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAzOQ3G-TUqbBipUIUxpAGFRXL4HX-wrq8&v=3.exp&libraries=geometry,drawing,places"
                      loadingElement={<div style={{ height: '90%'}}/>}
                      containerElement={<div style={{height: '400px'}}/>}
                      mapElement={<div style={{height: '100%'}}/>}
                      />
              </div>

              <Row>
                { cards }
              </Row>
          </Col>
        );

          return body;
        }

        function stateToProps(state) {
            console.log(state);
          const { spaces } = state;
          console.log(spaces);
          return {
            spaces: spaces,
          };
        }

        export default connect(stateToProps)(Feed);
