import { Row, Col, Card, Alert, Button } from "react-bootstrap";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { FiWifiOff } from "react-icons/fi";
import { FiWifi } from "react-icons/fi";

import { useState, useEffect, useCallback, memo } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { connect } from "react-redux";

function Feed({ spaces }) {
  const [position, setPosition] = useState(null);

  // Function to set the user's location as state
  function setLocation(position) {
    const coords = position.coords;
    setPosition({
      lat: coords.latitude,
      lng: coords.longitude,
    });
  }

  // Function to handle the user denying location access
  function handleError(err) {
    // Set the Position to null to indicate an err
    setPosition(null);
  }

  // Get the user's geolocation on component load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(setLocation, handleError, {
        timeout: 10000,
      });
    }
  }, []);

  if (!position) {
    return (
      <Row className="my-5">
        <Col>
          <Row>
            <Col>
              <h1>Spaces Near You</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <Alert variant="info">
                Locating Spaces nearby you. If you have location disabled, try
                enabling it and come back to this page.
              </Alert>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="my-5">
      <Col>
        <Row>
          <Col>
            <h1>Spaces Near You</h1>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <Map position={position} spaces={spaces} />
          </Col>
        </Row>
        <SpaceCards spaces={spaces} />
      </Col>
    </Row>
  );
}

// The MAP
const containerStyle = {
  height: "50vh",
  width: "100%",
};

function Map({ position, spaces }) {
  const center = {
    lat: position.lat,
    lng: position.lng,
  };

  const [map, setMap] = useState(null);
  const history = useHistory();

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const currentLocationMarker = <Marker position={position} />;
  let spaceMarkers = null;
  let spaceInfoWindows = null;

  if (spaces) {
    spaceMarkers = spaces.map((space, idx) => {
      const position = {
        lat: space.data.latitude,
        lng: space.data.longitude,
      };
      const label = idx + 1 + "";
      return (
        <Marker
          key={idx}
          position={position}
          label={label}
          onClick={() => history.push("/spaces/" + space.data.id)}
        />
      );
    });

    spaceInfoWindows = spaces.map((space, idx) => {
      const position = {
        lat: space.data.latitude,
        lng: space.data.longitude,
      };

      return (
        <InfoWindow key={idx} position={position}>
          <p>{space.data.name}</p>
        </InfoWindow>
      );
    });
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onUnmount={onUnmount}
    >
      {currentLocationMarker}
      {spaceMarkers}
    </GoogleMap>
  );
}

function SpaceCards({ spaces }) {
  let spaceCards = null;

  if (spaces) {
    spaceCards = spaces.map((space, idx) => {
      return <SpaceCard key={idx} space={space.data} idx={idx + 1} />;
    });
  }

  return <Row className="d-flex align-items-stretch my-3">{spaceCards}</Row>;
}

function SpaceCard({ space, idx }) {
  let websiteLink = null;
  if (space.website !== "") {
    websiteLink = (
      <Button
        className="mr-2"
        variant="primary"
        target="_blank"
        href={space.website}
      >
        Website
      </Button>
    );
  }

  let wifiIcon;
  if (space.wifi) {
    wifiIcon = <FiWifi />;
  } else {
    wifiIcon = <FiWifiOff />;
  }

  return (
    <Col className="col-md-6 col-lg-3 my-2">
      <Card className="h-100 light">
        <Card.Header as="h5">
          <NavLink to={"/spaces/" + space.id}>
            {idx}. {space.name}
          </NavLink>
        </Card.Header>
        <Card.Body>
          <Card.Text>Location: {space.address}</Card.Text>
        </Card.Body>
        <Card.Footer className="text-muted">
          <Button className="mr-2">{wifiIcon}</Button>
          {websiteLink}
        </Card.Footer>
      </Card>
    </Col>
  );
}

function stateToProps(state) {
  const { spaces } = state;

  return {
    spaces: spaces,
  };
}

export default connect(stateToProps)(memo(Feed));
