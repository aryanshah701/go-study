import { Socket } from "phoenix";

const socketUrl =
  process.env.NODE_ENV === "production"
    ? "ws://gostudy-api.aryanshah.tech/socket/"
    : "ws://localhost:4000/socket/";

let socket = new Socket(socketUrl, { params: { token: "" } });

socket.connect();

// Creating channel with name of the game
let channel = null;

// Initialising state and set state callback
let liveState = {
  comments: [],
};

let callback = null;

// Update the comments by calling the callback function
function updateComments(updatedComments) {
  liveState = {
    comments: updatedComments.data,
  };

  callback(liveState);
}

// Join the Space's channel to receive live updates
export function channelJoin(spaceId, userId, setLiveState) {
  callback = setLiveState;

  // Create and join the new channel
  channel = socket.channel("space:" + spaceId, { user_id: userId });
  channel
    .join()
    .receive("ok", (comments) => updateComments(comments))
    .receive("error", (err) =>
      console.log("Unable to join the channel: ", err)
    );

  // Listen to broadcasts
  channel.on("new_comment", (comments) => {
    updateComments(comments);
  });

  // Hooks for debugging
  channel.onError(() => console.log("there was an error!"));
  channel.onClose(() => console.log("the channel has gone away gracefully"));
}

// Pushed a new comment event
export function pushNewComment(commentBody) {
  channel
    .push("new_comment", { body: commentBody })
    .receive("ok", (comments) => updateComments(comments))
    .receive("error", (err) =>
      console.log("Something went wrong with creating your new comment: ", err)
    );
}

// Leaves the channel and unsubscribes from all the channel events
export function channelLeave() {
  channel.leave().receive("ok", () => console.log("you have left the channel"));
}
