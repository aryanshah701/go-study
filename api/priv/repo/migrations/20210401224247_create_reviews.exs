defmodule Api.Repo.Migrations.CreateReviews do
  use Ecto.Migration

  def change do
    create table(:reviews) do
      add :rating, :float, null: false

      timestamps()
    end

  end
end
