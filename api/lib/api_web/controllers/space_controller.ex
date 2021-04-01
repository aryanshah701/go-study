defmodule ApiWeb.SpaceController do
  use ApiWeb, :controller

  alias Api.Spaces
  alias Api.Spaces.Space

  action_fallback ApiWeb.FallbackController

  plug ApiWeb.Plugs.RequireAuth, "en" when action in [:create, :update, :delete]

  def index(conn, _params) do
    spaces = Spaces.list_spaces()
    render(conn, "index.json", spaces: spaces)
  end

  def create(conn, %{"space" => space_params}) do
    with {:ok, %Space{} = space} <- Spaces.create_space(space_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.space_path(conn, :show, space))
      |> render("show.json", space: space)
    end
  end

  def show(conn, %{"id" => id}) do
    space = Spaces.get_space!(id)
    render(conn, "show.json", space: space)
  end

  def update(conn, %{"id" => id, "space" => space_params}) do
    space = Spaces.get_space!(id)

    with {:ok, %Space{} = space} <- Spaces.update_space(space, space_params) do
      render(conn, "show.json", space: space)
    end
  end

  def delete(conn, %{"id" => id}) do
    space = Spaces.get_space!(id)

    with {:ok, %Space{}} <- Spaces.delete_space(space) do
      send_resp(conn, :no_content, "")
    end
  end
end
