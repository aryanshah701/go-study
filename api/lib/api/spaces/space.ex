defmodule Api.Spaces.Space do
  use Ecto.Schema
  import Ecto.Changeset

  schema "spaces" do
    # Actual fields
    field :description, :string
    field :latitude, :string
    field :longitude, :string
    field :name, :string
    field :wifi, :boolean, default: false

    # Virtual fields
    field :avg_rating, :float, virtual: true

    # Associations
    belongs_to :user, Api.Users.User
    has_many :comments, Api.Comments.Comment
    has_many :reviews, Api.Reviews.Review

    timestamps()
  end

  @doc false
  def changeset(space, attrs) do
    space
    |> cast(attrs, [:name, :description, :latitude, :longitude, :wifi, :user_id])
    |> validate_required([:name, :description, :latitude, :longitude, :wifi, :user_id])
  end
end
