defmodule ApiWeb.SpaceView do
  use ApiWeb, :view
  alias ApiWeb.SpaceView

  def render("index.json", %{spaces: spaces}) do
    %{data: render_many(spaces, SpaceView, "show_without_assoc.json")}
  end

  def render("show.json", %{space: space}) do
    %{data: render_one(space, SpaceView, "space.json")}
  end

  def render("show_without_assoc.json", %{space: space}) do
    %{data: render_one(space, SpaceView, "space_without_assoc.json")}
  end

  def render("space.json", %{space: space}) do
    comments_json = ApiWeb.CommentView.render("index.json", comments: space.comments)

    %{id: space.id,
      name: space.name,
      description: space.description,
      latitude: space.latitude,
      longitude: space.longitude,
      wifi: space.wifi,
      comments: comments_json,
      avg_rating: space.avg_rating,
      address: space.address,
      opening_hours: space.opening_hours,
      website: space.website,
      photo: space.photo,
      type: space.type,
      google_rating: space.google_rating}
  end

  def render("space_without_assoc.json", %{space: space}) do
    %{id: space.id,
      name: space.name,
      description: space.description,
      latitude: space.latitude,
      longitude: space.longitude,
      wifi: space.wifi}
  end
end
