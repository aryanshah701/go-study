// File for redux reducer functions
import { createStore, combineReducers } from "redux";

// User reducer(authenticated user data)
function user(state = null, action) {
  switch (action.type) {
    case "user/set":
      return action.data;
    case "session/logout":
      console.log("Clearing cached user data");
      return null;
    default:
      return state;
  }
}

// Loads session from local storage if it exists
function loadSession() {
  let session = localStorage.getItem("session");

  // If session doesn't exist, return null
  if (!session) {
    return null;
  }

  session = JSON.parse(session);

  // Check if the session has expired
  const maxTime = 24 * 60 * 60 * 1000;
  const timeElapsed = Date.now() - session.timestamp;
  if (timeElapsed > maxTime) {
    return null;
  }

  // Return the session if it exists and hasn't expired
  return session;
}

// Saves the given session to local storage with the timestamp of the save
function saveSessionToLocalStorage(session) {
  const sessionWithTime = {
    ...session,
    timestamp: Date.now(),
  };
  localStorage.setItem("session", JSON.stringify(sessionWithTime));
}

// Session reducer
function session(state = loadSession(), action) {
  switch (action.type) {
    case "session/set":
      saveSessionToLocalStorage(action.data);
      return action.data;
    case "session/logout":
      localStorage.removeItem("session");
      return null;
    default:
      return state;
  }
}

// Spaces reducer
function showSpaces(state = [], action) {
  switch (action.type) {
    case "showSpaces/set":
      return action.data;
    case "showSpaces/add":
      const newStateAdd = state.concat([action.data]);
      return newStateAdd;
    case "showSpaces/update":
      console.log("Updating store: ", state);
      // Check if the space exists
      let newStateUpdate;
      if (state.some((space) => space.id === action.id)) {
        console.log("Ther is dup");
        // Replace it
        newStateUpdate = replaceEvent(state, action.data);
      } else {
        // Add it
        newStateUpdate = state.concat([action.data]);
      }
      return newStateUpdate;
    case "session/logout":
      return [];
    default:
      return state;
  }
}

// Replace a space within the given state with the new space
function replaceEvent(state, newSpace) {
  // Clone the state to prevent mutating
  const clonedState = state.slice();

  // Find the index of the space that needs to be replaced
  const index = clonedState.findIndex((space) => space.id === newSpace.id);

  // Replace the space
  clonedState.splice(index, 1, newSpace);

  return clonedState;
}

// Error flash reducer
function error(state = "", action) {
  switch (action.type) {
    case "error/set":
      return action.data;
    default:
      return null;
  }
}

// Info flash reducer
function info(stat = "", action) {
  switch (action.type) {
    case "error/set":
      return action.data;
    default:
      return null;
  }
}

// Success flash reducer
function success(state = "", action) {
  switch (action.type) {
    case "success/set":
      return action.data;
    default:
      return null;
  }
}

// Root reducer
function rootReducer(state, action) {
  const reducers = combineReducers({
    session,
    user,
    showSpaces,
    error,
    success,
    info,
  });

  const updatedState = reducers(state, action);
  return updatedState;
}

const store = createStore(rootReducer);
export default store;
