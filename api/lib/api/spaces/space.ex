defmodule Api.Spaces.Space do
  use Ecto.Schema
  import Ecto.Changeset

  schema "spaces" do
    # Actual fields
    field :description, :string
    field :latitude, :float
    field :longitude, :float
    field :name, :string
    field :wifi, :boolean, default: false
    field :address, :string
    field :google_rating, :float, default: 0.0
    field :opening_hours, {:array, :string}
    field :photo, :string, default: ""
    field :type, :string, default: ""
    field :website, :string, default: ""
    field :place_id, :string

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
    |> cast(attrs, [:name, :description, :latitude, :longitude, :wifi, 
      :user_id, :address, :google_rating, :opening_hours, :photo, :type, :website, :place_id])
    |> validate_required([:name, :description, :latitude, :longitude, :wifi, 
      :user_id, :address, :google_rating, :opening_hours, :type, :place_id])
    |> unique_constraint(:place_id)
  end
end
