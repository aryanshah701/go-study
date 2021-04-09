import { Socket } from "phoenix";
import store from "./store";

const socketUrl =
  process.env.NODE_ENV === "production"
    ? "ws://gostudy-api.aryanshah.tech/socket/"
    : "ws://localhost:4000/socket/";

const state = store.getState();
const session = state.session;
let token = "";
let socket = null;
let channel = null;
let callback = null;

// Initialising state and set state callback
let liveState = {
  comments: [],
  err: "",
};

// If the user is logged in, provide live view
if (session && session.token) {
  token = session.token;
  socket = new Socket(socketUrl, { params: { token: token } });
  socket.connect();
}

// Update the comments by calling the callback function
function updateComments(updatedComments) {
  liveState = {
    ...liveState,
    comments: updatedComments.data,
  };

  callback(liveState);
}

// Handle errors from the server
function handleError(err) {
  console.log("Something went wrong with channel: ", err);

  if (err.reason) {
    liveState = {
      ...liveState,
      err: err.reason,
    };
  }
}

// Join the Space's channel to receive live updates
export function channelJoin(spaceId, userId, setLiveState) {
  if (!socket) {
    return;
  }

  callback = setLiveState;

  // Create and join the new channel
  channel = socket.channel("space:" + spaceId, { user_id: userId });
  channel
    .join()
    .receive("ok", (comments) => updateComments(comments))
    .receive("error", (err) => handleError(err));

  // Listen to broadcasts
  channel.on("new_comment", (comments) => {
    console.log("Broadcast: ", comments);
    updateComments(comments);
  });

  channel.on("delete_comment", (comments) => {
    updateComments(comments);
  });

  // Hooks for debugging
  channel.onError(() => console.log("there was an error!"));
  channel.onClose(() => console.log("the channel has gone away gracefully"));
}

// Pushed a new comment event
export function pushNewComment(commentBody) {
  if (!socket) {
    return;
  }

  channel
    .push("new_comment", { body: commentBody })
    .receive("ok", (comments) => updateComments(comments))
    .receive("error", (err) =>
      console.log("Something went wrong with creating your new comment: ", err)
    );
}

// Essentially just pushes to get the updated state
export function pushDeleteComment() {
  if (!socket) {
    return;
  }

  channel
    .push("delete_comment", {})
    .receive("ok", (comments) => updateComments(comments))
    .receive("error", (err) =>
      console.log("Something went wrong when deleting the comment: ", err)
    );
}

// Leaves the channel and unsubscribes from all the channel events
export function channelLeave() {
  if (!socket) {
    return;
  }

  channel.leave().receive("ok", () => console.log("you have left the channel"));
}
