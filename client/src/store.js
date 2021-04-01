// File for redux reducer functions
import { createStore, combineReducers } from "redux";

// Session reducer
function session(state={}, action) {
  switch (action.type) {
    case "login":
    case "logout":
    default:
      return null;
  }
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
    error,
    success,
  });

  const updatedState = reducers(state, action);
  return updatedState;
}

const store = createStore(rootReducer);
export default store;