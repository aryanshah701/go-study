defmodule ApiWeb.SpaceChannel do
  use ApiWeb, :channel

  alias ApiWeb.Spaces

  @impl true
  def join("space:" <> space_id, %{"user_id" => user_id}, socket) do
    if authorized?(payload) do
      # Send back the all the comments for the given space
      spaces = Spaces.get_space(space_id)
      comments = space.comments
      
      # Save the space and user id onto the socket
      socket = assign(socket, :space_id, space_id)
      socket = assign(socket, :user_id, user_id)

      {:ok, comments, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("comment", %{"body" => body}, socket) do
    # Store the comment in the database
    user_id = socket.assigns[:user_id]
    space_id = socket.assigns[:space_id]

    comment_params = %{"body" => body, "space_id" => space_id, "user_id" => socket.assigns[:user_id]}
    {:ok, %Comment{} = comment} = Comments.create_comment(comment_params)

    # Get the new list of comments
    comments = Spaces.get_space(space_id).comments

    # Broacast the new list of comments
    broadcast(socket, "update", comments)

    # Send back the new list of comments
    {:reply, {:ok, comments}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (space:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
