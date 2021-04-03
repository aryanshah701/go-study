import { Row, Col, Form, Alert, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

// Search radius in miles
const RADIUS = 10;

// Google library
const google = window.google;

function NewSpace() {
  // State for the position
  const [position, setPosition] = useState(null);

  // State for the autocomplete value(space searched)
  const [searchedSpace, setSearchedSpace] = useState(null);

  // State for the space to create
  const [space, setSpace] = useState(null);

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

    // Cleanup
    return () => {
      setPosition(null);
    };
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
                Locating Spaces nearby you. If you have location disabled,
                enable it and come back to this page.
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
        <SearchForm
          position={position}
          searchedSpace={searchedSpace}
          setSearchedSpace={setSearchedSpace}
          space={space}
          setSpace={setSpace}
        />
      </Col>
    </Row>
  );
}

// Form for the google places autocomplete search
function SearchForm(props) {
  const { position, searchedSpace, setSearchedSpace, space, setSpace } = props;
  const [userInput, setUserInput] = useState({
    description: "",
    hasWifi: false,
  });

  // Create the new Space when the space object has been set
  useEffect(() => {
    console.log("Space object: ", space);

    // Ensure that the spaces object is valid
    if (spaceObjectHasRequiredFields(space)) {
      // Check user inputed fields
      // Add user inputed fields to object
      // Make the POST request to create the space
    }
  }, [space]);

  // Ensures that the space object has all required fields after a getDetails call
  function spaceObjectHasRequiredFields(space) {
    return space && space.name;
  }

  // Gets details from the Places API and updates the state
  function getDetailsFromPlacesAPI() {
    // If the searchedSpace isn't set yet
    if (!searchedSpace || searchedSpace === "") {
      console.log("Display error: ", searchedSpace);
    }

    // Get place details from google places
    const request = {
      placeId: searchedSpace.value.place_id,
      fields: [
        "name",
        "formatted_address",
        "photo",
        "type",
        "website",
        "opening_hours",
        "rating",
      ],
    };

    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails(request, savePlacesResult);
  }

  // Saves the places API response to getDetails to state
  function savePlacesResult(place, status) {
    if (status !== "OK" || !place) {
      console.log("Handle error from places");
      return;
    }

    setSpace({
      name: place.name,
      address: place.formatted_address,
      google_rating: place.rating,
      photo: place.photos[0].getUrl(),
      opening_hours: place.opening_hours.weekday_text,
      type: place.type,
      website: place.website,
    });

    return place;
  }

  // Handle any error from the google autocomplete component
  function handleAutocompleteError(err) {}

  // Google Places autocomplete and controlled form
  return (
    <Row>
      <Col>
        <Form>
          <Form.Group>
            <Form.Label>Search for the space you wish to add</Form.Label>
            <Row>
              <Col>
                <GooglePlacesAutocomplete
                  onLoadFailed={handleAutocompleteError}
                  selectProps={{
                    searchedSpace,
                    onChange: setSearchedSpace,
                  }}
                  autocompletionRequest={{
                    location: {
                      lat: position.lat,
                      lng: position.long,
                    },
                    radius: RADIUS,
                    componentRestrictions: {
                      country: ["us"],
                    },
                  }}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="testArea">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={userInput.description}
              onChange={(ev) => {
                setUserInput({ ...userInput, description: ev.target.value });
              }}
            />
          </Form.Group>

          <Form.Group controlId="wifi">
            <Form.Check
              type="checkbox"
              label="Free Public Wifi?"
              checked={userInput.hasWifi}
              onChange={(ev) => {
                console.log(ev.target.value);
                setUserInput({
                  ...userInput,
                  hasWifi: ev.target.checked,
                });
              }}
            />
          </Form.Group>

          <Button onClick={getDetailsFromPlacesAPI}>Create Space!</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default NewSpace;