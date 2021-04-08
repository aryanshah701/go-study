defmodule Api.Repo.Migrations.CreateSpaces do
  use Ecto.Migration

  def change do
    create table(:spaces) do
      add :name, :string, null: false
      add :description, :text, null: false
      add :latitude, :float, null: false
      add :longitude, :float, null: false
      add :wifi, :boolean, default: false, null: false
      add :user_id, references(:users, on_delete: :nothing), null: false
      add :website, :string, default: "", null: false
      add :address, :string, null: false
      add :google_rating, :float, null: false
      add :opening_hours, {:array, :string}, null: false
      add :photo, :text, default: "", null: false
      add :type, :string, null: false

      timestamps()
    end

    create index(:spaces, [:user_id])
  end
  
end
