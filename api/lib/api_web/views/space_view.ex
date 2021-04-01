defmodule ApiWeb.SpaceView do
  use ApiWeb, :view
  alias ApiWeb.SpaceView

  def render("index.json", %{spaces: spaces}) do
    %{data: render_many(spaces, SpaceView, "space.json")}
  end

  def render("show.json", %{space: space}) do
    %{data: render_one(space, SpaceView, "space.json")}
  end

  def render("space.json", %{space: space}) do
    %{id: space.id,
      name: space.name,
      description: space.description,
      latitude: space.latitude,
      longitude: space.longitude,
      wifi: space.wifi}
  end
end
