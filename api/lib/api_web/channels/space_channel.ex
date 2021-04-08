defmodule ApiWeb.SpaceChannel do
  use ApiWeb, :channel

  alias Api.Spaces
  alias Api.Comments
  alias ApiWeb.CommentView

  @impl true
  def join("space:" <> space_id, %{"user_id" => user_id}, socket) do
    if authorized?(user_id) do
      # Send back the all the comments for the given space
      space = Spaces.get_space(space_id)
      comments_view = CommentView.render("index.json", comments: space.comments)
      
      # Save the space and user id onto the socket
      socket = assign(socket, :space_id, space_id)
      socket = assign(socket, :user_id, user_id)

      {:ok, comments_view, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("new_comment", %{"body" => body}, socket) do
    # Store the comment in the database
    user_id = socket.assigns[:user_id]
    space_id = socket.assigns[:space_id]

    comment_params = %{"body" => body, "space_id" => space_id, "user_id" => user_id}
    Comments.create_comment(comment_params)

    # Get the new list of comments
    space = Spaces.get_space(space_id);
    comments_view = CommentView.render("index.json", comments: space.comments)

    # Broacast the new list of comments
    broadcast(socket, "new_comment", comments_view)

    # Send back the new list of comments
    {:reply, {:ok, comments_view}, socket}
  end

  # Send the new and updated state when a comment is deleted
  @impl true
  def handle_in("delete_comment", _payload, socket) do
    # Get the new list of comments
    space_id = socket.assigns[:space_id]
    space = Spaces.get_space(space_id);
    comments_view = CommentView.render("index.json", comments: space.comments)

    # Broacast the new list of comments
    broadcast(socket, "delete_comment", comments_view)

    # Send back the new list of comments
    {:reply, {:ok, comments_view}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
