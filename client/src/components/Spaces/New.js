import { Row, Col, Form, Alert, Button, Card, Badge } from "react-bootstrap";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

import { useState, useEffect } from "react";
import { apiCreateSpace, fetchRecommendation } from "../../api";
import store from "../../store";
import { useHistory } from "react-router-dom";

// Search radius in miles
const RADIUS = 10;

// Google library
const google = window.google;

// Create a new space page
function NewSpace() {
  // State for the position
  const [position, setPosition] = useState(null);

  // State for the recommended spaces
  const [recommendations, setRecommendations] = useState(null);

  // State for the autocomplete value(space searched)
  const [searchedSpace, setSearchedSpace] = useState(null);

  // State for the space to create
  const [space, setSpace] = useState(null);

  // State for controlled user input form
  const [userInput, setUserInput] = useState({
    description: "",
    hasWifi: false,
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
  }

  // Get the user's geolocation on component load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(setLocation, handleError, {
        timeout: 10000,
      });
    }

    // Cleanup
    return () => {
      setPosition(null);
    };
  }, []);

  // Get the recommended places once the geolocation is obtained
  useEffect(() => {
    if (position) {
      fetchRecommendation(position).then((recommendations) => {
        // If a response was returned successfully
        if (recommendations) {
          setRecommendations(recommendations);
        }
      });
    }
  }, [position]);

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
        <Recommendations
          recommendations={recommendations}
          setSearchedSpace={setSearchedSpace}
        />
        <SearchForm
          position={position}
          searchedSpace={searchedSpace}
          setSearchedSpace={setSearchedSpace}
          space={space}
          setSpace={setSpace}
          userInput={userInput}
          setUserInput={setUserInput}
        />
      </Col>
    </Row>
  );
}

function priceToDollar(price_level) {
  switch (price_level) {
    case 1:
      return "$";
    case 2:
      return "$$";
    case 3:
      return "$$$";
    case 4:
      return "$$$$";
    default:
      return null;
  }
}

function Recommendations({ recommendations, setSearchedSpace }) {
  if (!recommendations) {
    return (
      <Row>
        <Col>
          <p>Looking for potential study spots nearby</p>
        </Col>
      </Row>
    );
  }

  // Handle select recommendation event
  function selectRecommendation(recommendation) {
    console.log(recommendation.place_id);
    set;
  }

  const cards = recommendations.map((recommendation, idx) => {
    return (
      <Col key={idx} className="col-md-6 col-lg-3 my-2">
        <Card className="h-100">
          <Card.Header as="h5">{recommendation.name}</Card.Header>
          <Card.Body>
            <Card.Text>Location: {recommendation.vicinity}</Card.Text>
          </Card.Body>
          <Row className="my-3 mx-2">
            <Col className="col-2">
              <Badge variant="dark">{recommendation.rating}</Badge>
            </Col>
            <Col className="col-2">
              <Badge variant="dark">
                {priceToDollar(recommendation.price_level)}
              </Badge>
            </Col>
          </Row>

          <Card.Footer className="text-muted">
            <Card.Link
              variant="primary"
              onClick={(ev) => selectRecommendation(recommendation)}
            >
              Select
            </Card.Link>
          </Card.Footer>
        </Card>
      </Col>
    );
  });

  return (
    <Row className="mt-5">
      <Col>
        <Row>
          <Col>
            <h4>Recommended Spaces Near You</h4>
          </Col>
        </Row>
        <Row className="d-flex align-items-stretch">{cards}</Row>
      </Col>
    </Row>
  );
}

// Form for the google places autocomplete search
function SearchForm(props) {
  const {
    position,
    searchedSpace,
    setSearchedSpace,
    space,
    setSpace,
    userInput,
    setUserInput,
  } = props;

  // For redirection purposes
  const history = useHistory();

  console.log("Searched place: " + JSON.stringify(searchedSpace));

  // Create the new Space when the space object has been set
  useEffect(() => {
    // Ensure that the spaces object is valid
    if (spaceObjectHasRequiredFields(space)) {
      // Check user inputed fields
      if (!isUserInputValid(userInput)) {
        // Dispatch input error message
        const errorAction = {
          type: "error/set",
          data: "Please enter a description",
        };

        store.dispatch(errorAction);

        return;
      }

      // Add user inputed fields to object
      const completeSpace = {
        ...space,
        wifi: userInput.hasWifi,
        description: userInput.description,
      };

      // Make the POST request to create the space
      apiCreateSpace(completeSpace).then((response) => {
        // If successful creation, naviagte to the event's page
        if (response) {
          history.push("/spaces/" + response.id);
        }
      });
    }
  }, [space, userInput, history]);

  // Gets details from the Places API and updates the state
  function getDetailsFromPlacesAPI() {
    // If the searchedSpace isn't set yet
    if (!searchedSpace || searchedSpace === "") {
      // Dispatch error
      const errorAction = {
        type: "error/set",
        data: "Please select a valid place to save",
      };

      store.dispatch(errorAction);

      return;
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
        "geometry",
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
      // Dispatch an error
      const errorAction = {
        type: "error/set",
        action: "Something went wrong. Message from Google Places: " + status,
      };

      store.dispatch(errorAction);

      return;
    }

    setSpace({
      name: place.name,
      address: place.formatted_address,
      google_rating: place.rating,
      photo: place.photos[0].getUrl(),
      opening_hours: place.opening_hours.weekday_text,
      type: place.types[0],
      website: place.website,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    });

    return place;
  }

  // Handle any error from the google autocomplete component
  function handleAutocompleteError(err) {
    // Dispatch an error
    const errorAction = {
      type: "error/set",
      action:
        "Something went wrong with Google Places. Try reloading or revisiting.",
    };

    store.dispatch(errorAction);

    console.error("Error with autocomplete: " + err);
    return;
  }

  // Google Places autocomplete and controlled form
  return (
    <Row className="mt-5">
      <Col>
        <Row>
          <Col>
            <h4>Manually Search for a Space</h4>
          </Col>
        </Row>
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

// Ensures that the userinput is valid
function isUserInputValid(userInput) {
  return userInput && userInput.description !== "";
}

// Ensures that the space object has all required fields after a getDetails call
function spaceObjectHasRequiredFields(space) {
  return space && space.name;
}

export default NewSpace;
