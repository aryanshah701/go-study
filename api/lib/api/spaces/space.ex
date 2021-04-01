defmodule Api.Spaces.Space do
  use Ecto.Schema
  import Ecto.Changeset

  schema "spaces" do
    field :description, :string
    field :latitude, :string
    field :longitude, :string
    field :name, :string
    field :wifi, :boolean, default: false

    timestamps()
  end

  @doc false
  def changeset(space, attrs) do
    space
    |> cast(attrs, [:name, :description, :latitude, :longitude, :wifi])
    |> validate_required([:name, :description, :latitude, :longitude, :wifi])
  end
end
