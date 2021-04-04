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

  const response = await postRequest("/spaces/new", space, token);

  // If there the Space was successfuly created dispatch a success message
  if (response.data) {
    const successAction = {
      type: "success/set",
      data: "New space created successfully!",
    };

    store.dispatch(successAction);

    return true;
  }

  // Else, dispatch an error
  const errorAction = {
    type: "error/set",
    data: "Something went wrong when creating the Space",
  };

  store.dispatch(errorAction);

  return false;
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

  const repsonse = await fetch(apiUrl + endpoint, options);

  return await repsonse.json();
}

// Fetch all user data and dispatch it to the store
export function fetchUserData() {
  const state = store.getState();
  const session = state.session;

  // If the user is not logged in, dispatch error
  if (!isLoggedIn(session)) {
    return false;
  }

  const userId = session.id;
  const token = session.token;

  // Make the get request and dispatch the data if successful
  const isSuccess = getRequest("/users/" + userId, token)
    .then((userData) => {
      const action = {
        type: "user/set",
        data: userData,
      };

      store.dispatch(action);

      return true;
    })
    .catch((err) => {
      console.log("err", err);
      return false;
    });

  return isSuccess;
}
