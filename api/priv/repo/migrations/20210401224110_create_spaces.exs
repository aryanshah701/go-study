defmodule Api.Repo.Migrations.CreateSpaces do
  use Ecto.Migration

  def change do
    create table(:spaces) do
      add :name, :string, null: false
      add :description, :string, null: false
      add :latitude, :string, null: false
      add :longitude, :string, null: false
      add :wifi, :boolean, default: false, null: false

      timestamps()
    end

  end
end
