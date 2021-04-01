defmodule Api.Comments.Comment do
  use Ecto.Schema
  import Ecto.Changeset

  schema "comments" do
    field :body, :string

    # Associations
    belongs_to :user, Api.Users.User
    belongs_to :space, Api.Spaces.Space

    timestamps()
  end

  @doc false
  def changeset(comment, attrs) do
    comment
    |> cast(attrs, [:body, :user_id, :space_id])
    |> validate_required([:body, :user_id, :space_id])
  end
end
