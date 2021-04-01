defmodule ApiWeb.SpaceControllerTest do
  use ApiWeb.ConnCase

  alias Api.Spaces
  alias Api.Spaces.Space

  @create_attrs %{
    description: "some description",
    latitude: "some latitude",
    longitude: "some longitude",
    name: "some name",
    wifi: true
  }
  @update_attrs %{
    description: "some updated description",
    latitude: "some updated latitude",
    longitude: "some updated longitude",
    name: "some updated name",
    wifi: false
  }
  @invalid_attrs %{description: nil, latitude: nil, longitude: nil, name: nil, wifi: nil}

  def fixture(:space) do
    {:ok, space} = Spaces.create_space(@create_attrs)
    space
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all spaces", %{conn: conn} do
      conn = get(conn, Routes.space_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create space" do
    test "renders space when data is valid", %{conn: conn} do
      conn = post(conn, Routes.space_path(conn, :create), space: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.space_path(conn, :show, id))

      assert %{
               "id" => id,
               "description" => "some description",
               "latitude" => "some latitude",
               "longitude" => "some longitude",
               "name" => "some name",
               "wifi" => true
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.space_path(conn, :create), space: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update space" do
    setup [:create_space]

    test "renders space when data is valid", %{conn: conn, space: %Space{id: id} = space} do
      conn = put(conn, Routes.space_path(conn, :update, space), space: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.space_path(conn, :show, id))

      assert %{
               "id" => id,
               "description" => "some updated description",
               "latitude" => "some updated latitude",
               "longitude" => "some updated longitude",
               "name" => "some updated name",
               "wifi" => false
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, space: space} do
      conn = put(conn, Routes.space_path(conn, :update, space), space: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete space" do
    setup [:create_space]

    test "deletes chosen space", %{conn: conn, space: space} do
      conn = delete(conn, Routes.space_path(conn, :delete, space))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.space_path(conn, :show, space))
      end
    end
  end

  defp create_space(_) do
    space = fixture(:space)
    %{space: space}
  end
end
