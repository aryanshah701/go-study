defmodule ApiWeb.UserView do
  use ApiWeb, :view
  alias ApiWeb.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user_without_assoc.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("show_without_assoc.json", %{user: user}) do
    %{data: render_one(user, UserView, "user_without_assoc.json")}
  end

  def render("user.json", %{user: user}) do
    spaces_json = ApiWeb.SpaceView.render("index.json", spaces: user.spaces)
    comments_json = ApiWeb.CommentView.render("index.json", comments: user.comments)
    reviews_json = ApiWeb.ReviewView.render("index.json", reviews: user.reviews)

    %{id: user.id,
      name: user.name,
      email: user.email,
      spaces: spaces_json,
      comments: comments_json,
      reviews: reviews_json}
  end

  def render("user_without_assoc.json", %{user: user}) do
    %{id: user.id,
      name: user.name,
      email: user.email}
  end
end
