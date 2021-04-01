// File for all the AJAX fetch functions to the Events SPA API
import store from "./store";

const apiUrl =
  process.env.NODE_ENV === "production"
    ? "http://gostudy-api.aryanshah.tech/api/v1"
    : "http://localhost:4000/api/v1";

// ---------------------- POST REQUESTS ----------------------------
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

// --------------------- GET REQUESTS -------------------------------
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