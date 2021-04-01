defmodule Api.Repo.Migrations.CreateSpaces do
  use Ecto.Migration

  def change do
    create table(:spaces) do
      add :name, :string
      add :description, :string
      add :latitude, :string
      add :longitude, :string
      add :wifi, :boolean, default: false, null: false

      timestamps()
    end

  end
end
