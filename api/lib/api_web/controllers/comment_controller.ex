defmodule ApiWeb.CommentController do
  use ApiWeb, :controller

  alias Api.Comments
  alias Api.Comments.Comment

  action_fallback ApiWeb.FallbackController

  plug ApiWeb.Plugs.RequireAuth, "en" when action in [:create, :update, :delete]

  def index(conn, _params) do
    comments = Comments.list_comments()
    render(conn, "index.json", comments: comments)
  end

  def create(conn, %{"comment" => comment_params}) do
    user = conn.assigns[:user]
    comment_params = Map.put(comment_params, "user_id", user.id)
    with {:ok, %Comment{} = comment} <- Comments.create_comment(comment_params) do
      comment = Api.Comments.get_comment(comment.id)
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.comment_path(conn, :show, comment))
      |> render("show.json", comment: comment)
    end
  end

  def show(conn, %{"id" => id}) do
    comment = Comments.get_comment!(id)
    render(conn, "show.json", comment: comment)
  end

  def update(conn, %{"id" => id, "comment" => comment_params}) do
    comment = Comments.get_comment!(id)

    with {:ok, %Comment{} = comment} <- Comments.update_comment(comment, comment_params) do
      render(conn, "show.json", comment: comment)
    end
  end

  def delete(conn, %{"id" => id}) do
    comment = Comments.get_comment!(id)

    with {:ok, %Comment{}} <- Comments.delete_comment(comment) do
      send_resp(conn, :no_content, "")
    end
  end
end
