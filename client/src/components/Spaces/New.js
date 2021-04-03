import { Row, Col, Form, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

function NewSpace() {
  const [position, setPosition] = useState({
    lat: 0,
    long: 0,
  });

  // Function to set the user's location as state
  function setLocation(position) {
    const coords = position.coords;
    setPosition({
      lat: coords.latitude,
      long: coords.longitude,
    });
  }

  // Function to handle the user denying location access
  function handleError(err) {
    // Set the Position to null to indicate an err
    setPosition(null);
    console.log("Error with geolocation: ", err);
  }

  // Get the user's geolocation on component load
  useEffect(() => {
    console.log("Using geolocation");
    if ("geolocation" in navigator) {
      console.log("Available");
    }

    navigator.geolocation.getCurrentPosition(setLocation, handleError, {
      timeout: 10000,
    });
  }, []);

  // Handle the case in which geolocation isn't enabled
  if (!position) {
    return (
      <Row>
        <Col>
          <Row>
            <Col>
              <h1>Create a New Space</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <Alert variant="info">
                Seems like you have geolocation disabled. Enable it and navigate
                back to this page to create a space!
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
            <h1>Create a New Space</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>
              Latitude: {position.lat}, Longitude: {position.long}
            </p>
          </Col>
        </Row>
        <Row>
          <Col></Col>
        </Row>
      </Col>
    </Row>
  );
}

export default NewSpace;
