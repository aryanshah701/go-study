defmodule ApiWeb.CommentView do
  use ApiWeb, :view
  alias ApiWeb.CommentView

  def render("index.json", %{comments: comments}) do
    %{data: render_many(comments, CommentView, "comment_without_assoc.json")}
  end

  def render("show.json", %{comment: comment}) do
    %{data: render_one(comment, CommentView, "comment.json")}
  end

  def render("show_without_assoc.json", %{comment: comment}) do
    %{data: render_one(comment, CommentView, "comment_without_assoc.json")}
  end

  def render("comment.json", %{comment: comment}) do
    space_json = ApiWeb.SpaceView.render("show.json", space: comment.space)
    user_json = ApiWeb.UserView.render("show_without_assoc.json", user: comment.user)
    
    %{id: comment.id,
      body: comment.body,
      space: space_json,
      user: user_json}
  end

  def render("comment_without_assoc.json", %{comment: comment}) do
    # Preload nested data
    comment = Api.Comments.get_comment(comment.id)

    %{id: comment.id,
      body: comment.body,
      user_id: comment.user_id,
      user: comment.user.name,
      space_id: comment.space_id}
  end
end
