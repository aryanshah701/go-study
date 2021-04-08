defmodule Api.Reviews.Review do
  use Ecto.Schema
  import Ecto.Changeset

  schema "reviews" do
    field :rating, :float

    # Associations
    belongs_to :user, Api.Users.User
    belongs_to :space, Api.Spaces.Space

    timestamps()
  end

  @doc false
  def changeset(review, attrs) do
    review
    |> cast(attrs, [:rating, :user_id, :space_id])
    |> validate_required([:rating, :user_id, :space_id])
    |> foreign_key_constraint(:space_id)
    |> foreign_key_constraint(:user_id)
  end
end
