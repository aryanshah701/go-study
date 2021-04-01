defmodule Api.Repo.Migrations.CreateComments do
  use Ecto.Migration

  def change do
    create table(:comments) do
      add :body, :string, null: false
      add :user_id, references(:users, on_delete: :nothing), null: false
      add :space_id, references(:spaces, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:comments, [:user_id])
    create index(:comments, [:space_id])
  end
end
