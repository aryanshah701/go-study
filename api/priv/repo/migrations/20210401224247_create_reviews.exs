defmodule Api.Repo.Migrations.CreateReviews do
  use Ecto.Migration

  def change do
    create table(:reviews) do
      add :rating, :float, null: false

      add :space_id, references(:spaces, on_delete: :nothing), null: false
      add :user_id, references(:users, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:reviews, [:user_id])
    create index(:reviews, [:space_id])

    # A user can only leave one review per space
    create unique_index(:reviews, [:user_id, :space_id], name: :unique_idx)
  end
end
