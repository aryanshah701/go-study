defmodule Api.Repo.Migrations.CreateSpaces do
  use Ecto.Migration

  def change do
    create table(:spaces) do
      add :name, :string, null: false
      add :description, :string, null: false
      add :latitude, :string, null: false
      add :longitude, :string, null: false
      add :wifi, :boolean, default: false, null: false
      add :user_id, references(:users, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:spaces, [:user_id])
  end
  
end
