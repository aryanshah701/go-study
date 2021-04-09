// File for all the AJAX fetch functions to the Events SPA API
import store from "./store";

const apiUrl =
  process.env.NODE_ENV === "production"
    ? "http://gostudy-api.aryanshah.tech/api/v1"
    : "http://localhost:4000/api/v1";

// ---------------------- HELPER FUNCTIONS -------------------------
// Checks if a user is logged in, if not dispatches an error
function isLoggedIn(session) {
  // If the user is not logged in, dispatch error
  if (!session) {
    const errorAction = {
      type: "error/set",
      data: "Sorry you need to be logged in for this.",
    };

    store.dispatch(errorAction);
    return false;
  }

  return true;
}

// ---------------------- POST REQUESTS ----------------------------
// Sends a post request
async function postRequest(endpoint, body, token = "") {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth": token,
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(apiUrl + endpoint, options);

  return await response.json();
}

// Authenticate the user and recieve the session token
export async function apiLogin(email, password) {
  // Make the POST request to create a session
  const response = await postRequest("/session", {
    email: email,
    password: password,
  });

  if (response.session) {
    // If the authentication is successful, dispatch the session
    const sessionAction = {
      data: response.session,
      type: "session/set",
    };

    const successAction = {
      data: "Login successful",
      type: "success/set",
    };

    store.dispatch(sessionAction);
    store.dispatch(successAction);

    return true;
  } else {
    // If the authentication is not successful, dispatch the an error
    const errorAction = {
      data: response.error,
      type: "error/set",
    };

    store.dispatch(errorAction);

    return false;
  }
}

// Registers a new user
export async function apiRegister(newUser) {
  try {
    const response = await postRequest("/users", { user: newUser });
    if (response.data) {
      // Registeration was successful
      return true;
    } else {
      // If the registeration is not successful, dispatch an error
      const err = getRegisterationError(response);

      if (err !== "") {
        const errorAction = {
          data: err,
          type: "error/set",
        };

        store.dispatch(errorAction);
      }

      return false;
    }
  } catch (err) {
    console.log("err", err);
    return false;
  }
}

// Generate an error string from the response object
function getRegisterationError(response) {
  if (response.errors) {
    const errors = response.errors;
    if (errors.email) {
      return "Email: " + errors.email[0];
    }

    if (errors.password) {
      return "Password: " + errors.password[0];
    }

    return "";
  }
}

// Creates a new Space
export async function apiCreateSpace(space) {
  const state = store.getState();
  const session = state.session;

  // If the user is not logged in, dispatch error
  if (!isLoggedIn(session)) {
    return false;
  }

  const token = session.token;

  const response = await postRequest("/spaces", { space: space }, token);

  // If there the Space was successfuly created dispatch a success message
  if (response.data) {
    const successAction = {
      type: "success/set",
      data: "New space created successfully!",
    };

    store.dispatch(successAction);

    return response.data;
  }

  // Else, dispatch an error
  const err = getCreateSpaceError(response.errors);

  const errorAction = {
    type: "error/set",
    data: err,
  };

  store.dispatch(errorAction);

  return null;
}

function getCreateSpaceError(errors) {
  if (errors.description) {
    return "Description: " + errors.description[0];
  } else if (
    errors.place_id &&
    errors.place_id[0] === "has already been taken"
  ) {
    return "Sorry this space has already been created";
  } else {
    return "Something went wrong when creating the Space";
  }
}

export async function apiPostReview(rating, spaceId) {
  // Ensure that the user is logged in
  const state = store.getState();
  const session = state.session;

  if (!isLoggedIn(session)) {
    return false;
  }

  console.log("Space id: ", spaceId);

  const review = {
    rating: rating,
    space_id: spaceId,
  };

  const token = session.token;

  const response = await postRequest("/reviews", { review: review }, token);

  // If successfully posted, then upadate the store with the newest version of the event
  if (response.data) {
    const newSpace = response.data.space.data;
    const action = {
      type: "showSpaces/update",
      data: newSpace,
    };

    store.dispatch(action);

    return true;
  }

  // Else dispatch an error
  const errAction = {
    type: "error/set",
    data: "Oops, something went wrong when posting your review",
  };

  console.log("review create err: ", response.errors);

  store.dispatch(errAction);

  return false;
}

export async function apiPostComment(commentBody, spaceId) {
  // Ensure that the user is logged in
  const state = store.getState();
  const session = state.session;

  if (!isLoggedIn(session)) {
    return false;
  }

  const comment = {
    body: commentBody,
    space_id: spaceId,
  };

  const token = session.token;

  const response = await postRequest("/comments", { comment: comment }, token);

  // If comment was created successfully, then dispatch the updated store
  if (response.data) {
    const newSpace = response.data.space.data;
    const action = {
      type: "showSpaces/update",
      data: newSpace,
    };

    store.dispatch(action);

    return true;
  }

  // Else, dispatch an error
  const errAction = {
    type: "error/set",
    data: "Oops, something went wrong with posting your comment",
  };

  store.dispatch(errAction);
  return false;
}

// --------------------- DELETE REQUESTS --------------------------
async function deleteRequest(endpoint, token = "") {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-auth": token,
    },
  };

  const response = await fetch(apiUrl + endpoint, options);
  return await response.json();
}

export async function apiDeleteComment(commentId, spaceId) {
  const state = store.getState();
  const session = state.session;

  // Ensure that the user is logged in
  if (!isLoggedIn(session)) {
    return null;
  }

  const token = session.token;

  try {
    await deleteRequest("/comments/" + commentId, token);
  } catch (err) {
    // Fetch the updated space
    const space = await fetchSpace(spaceId);
    return space.data;
  }
}

// --------------------- GET REQUESTS -------------------------------
// Fetches data from the API given the endpoint
async function getRequest(endpoint, token) {
  const options = {
    method: "GET",
    headers: {
      "x-auth": token,
    },
  };

  const response = await fetch(apiUrl + endpoint, options);

  return await response.json();
}

// Fetches the nearby recommended places for a user to add
export async function fetchRecommendation(position) {
  const state = store.getState();
  const session = state.session;

  // If the user is not logged in, dispatch error
  if (!isLoggedIn(session)) {
    return null;
  }

  const token = session.token;

  // Make the get request and dispatch the data if successful
  const uri =
    "/recommendations?" +
    new URLSearchParams({
      lat: position.lat,
      lng: position.lng,
    });

  const response = await getRequest(uri, token);

  // Return the recommendations if it was successful in fetching it
  if (response.recommendations) {
    const recommendations = response.recommendations;
    return recommendations;
  } else {
    return null;
  }
}

// Fetches the space with the given id and updates the store
export async function fetchSpace(id) {
  let space;
  try {
    space = await getRequest("/spaces/" + id);
  } catch (err) {
    const errAction = {
      type: "error/set",
      data: "Sorry this space doesn't exist",
    };

    store.dispatch(errAction);

    return null;
  }

  if (space.data) {
    // Store the space
    const action = {
      type: "showSpaces/update",
      data: space.data,
    };

    store.dispatch(action);

    return space.data;
  }

  return null;
}

export async function fetchSpacesData() {
  // Make the get request and dispatch the data if successful
  const response = await getRequest("/spaces/");

  if (response.data) {
    const action = {
      type: "spaces/set",
      data: response.data,
    };

    store.dispatch(action);
    return true;
  }

  const errAction = {
    type: "error/set",
    action: "Something went wrong with fetching all the Spaces",
  };

  store.dispatch(errAction);

  return false;
}

// Function to set the user's location as state
function setLocation(geoPosition) {
  const coords = geoPosition.coords;

  const position = {
    lat: coords.latitude,
    lng: coords.longitude,
  };

  // Dispatch the position
  const action = {
    type: "position/set",
    data: position,
  };

  store.dispatch(action);
}

// Function to handle the user denying location access
function handleError(err) {
  // Dispatch an error
  const errAction = {
    type: "err/set",
    data:
      "Seems like location is disabled. Try enabling it and revisiting the website.",
  };

  store.dispatch(errAction);
}

// Fetches the position of the user using the geoLocation API
export function fetchPosition() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setLocation, handleError, {
      timeout: 10000,
    });
  }
}

// Fetches the user's details
export async function fetchUserData() {
  const state = store.getState();
  const session = state.session;

  // If the user is not logged in, dispatch error
  if (!isLoggedIn(session)) {
    return null;
  }

  // Fetch the user's data
  const token = session.token;
  const endpoint = "/users/" + session.id;
  const response = await getRequest(endpoint, token);

  if (response.data) {
    // Dispatch the user information
    const action = {
      type: "user/set",
      data: response.data,
    };

    store.dispatch(action);
    return true;
  }

  // Dispatch an unautherised error
  const errAction = {
    type: "error/set",
    data: "Something went wrong",
  };

  return false;
}
