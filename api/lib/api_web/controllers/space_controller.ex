defmodule ApiWeb.SpaceController do
  use ApiWeb, :controller

  alias Api.Spaces
  alias Api.Spaces.Space

  action_fallback ApiWeb.FallbackController

  plug ApiWeb.Plugs.RequireAuth, "en" when action in [:create, :update, :delete]

  def space_owner?(conn, space) do
    curr_user_id = conn.assigns[:user].id
    owner_user_id = space.user_id
    curr_user_id == owner_user_id
  end

  def index(conn, _params) do
    spaces = Spaces.list_spaces()
    render(conn, "index.json", spaces: spaces)
  end

  def create(conn, %{"space" => space_params}) do
    # Add user id
    user_id = conn.assigns[:user].id
    space_params = Map.put(space_params, "user_id", user_id)
    with {:ok, %Space{} = space} <- Spaces.create_space(space_params) do
      space = Spaces.get_space(space.id)
      IO.inspect space
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

    if space_owner?(conn, space) do
      with {:ok, %Space{} = space} <- Spaces.update_space(space, space_params) do
        render(conn, "show.json", space: space)
      end
    else
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "You must be the owner of this space."})
      )
    end
  end

  def delete(conn, %{"id" => id}) do
    space = Spaces.get_space!(id)

    if space_owner?(conn, space) do
      with {:ok, %Space{}} <- Spaces.delete_space(space) do
        send_resp(conn, :no_content, "")
      end
    else
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "You must be the owner of this space."})
      )
    end
  end
  
end
