defmodule ApiWeb.ReviewView do
  use ApiWeb, :view
  alias ApiWeb.ReviewView

  def render("index.json", %{reviews: reviews}) do
    %{data: render_many(reviews, ReviewView, "review_without_assoc.json")}
  end

  def render("show.json", %{review: review}) do
    %{data: render_one(review, ReviewView, "review.json")}
  end

  def render("show_without_assoc.json", %{review: review}) do
    %{data: render_one(review, ReviewView, "review_without_assoc.json")}
  end

  def render("review.json", %{review: review}) do
  user_json = ApiWeb.UserView.render("show_without_assoc.json", user: review.user)
  space_json = ApiWeb.SpaceView.render("show_without_assoc.json", space: review.space)

    %{id: review.id,
      rating: review.rating,
      user: user_json,
      space: space_json}
  end

  def render("review_without_assoc.json", %{review: review}) do
    %{id: review.id,
      rating: review.rating}
  end
end
