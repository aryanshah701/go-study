defmodule Api.SpacesTest do
  use Api.DataCase

  alias Api.Spaces

  describe "spaces" do
    alias Api.Spaces.Space

    @valid_attrs %{description: "some description", latitude: "some latitude", longitude: "some longitude", name: "some name", wifi: true}
    @update_attrs %{description: "some updated description", latitude: "some updated latitude", longitude: "some updated longitude", name: "some updated name", wifi: false}
    @invalid_attrs %{description: nil, latitude: nil, longitude: nil, name: nil, wifi: nil}

    def space_fixture(attrs \\ %{}) do
      {:ok, space} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Spaces.create_space()

      space
    end

    test "list_spaces/0 returns all spaces" do
      space = space_fixture()
      assert Spaces.list_spaces() == [space]
    end

    test "get_space!/1 returns the space with given id" do
      space = space_fixture()
      assert Spaces.get_space!(space.id) == space
    end

    test "create_space/1 with valid data creates a space" do
      assert {:ok, %Space{} = space} = Spaces.create_space(@valid_attrs)
      assert space.description == "some description"
      assert space.latitude == "some latitude"
      assert space.longitude == "some longitude"
      assert space.name == "some name"
      assert space.wifi == true
    end

    test "create_space/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Spaces.create_space(@invalid_attrs)
    end

    test "update_space/2 with valid data updates the space" do
      space = space_fixture()
      assert {:ok, %Space{} = space} = Spaces.update_space(space, @update_attrs)
      assert space.description == "some updated description"
      assert space.latitude == "some updated latitude"
      assert space.longitude == "some updated longitude"
      assert space.name == "some updated name"
      assert space.wifi == false
    end

    test "update_space/2 with invalid data returns error changeset" do
      space = space_fixture()
      assert {:error, %Ecto.Changeset{}} = Spaces.update_space(space, @invalid_attrs)
      assert space == Spaces.get_space!(space.id)
    end

    test "delete_space/1 deletes the space" do
      space = space_fixture()
      assert {:ok, %Space{}} = Spaces.delete_space(space)
      assert_raise Ecto.NoResultsError, fn -> Spaces.get_space!(space.id) end
    end

    test "change_space/1 returns a space changeset" do
      space = space_fixture()
      assert %Ecto.Changeset{} = Spaces.change_space(space)
    end
  end
end
