defmodule Api.Spaces do
  @moduledoc """
  The Spaces context.
  """

  import Ecto.Query, warn: false
  alias Api.Repo

  alias Api.Spaces.Space

  @doc """
  Returns the list of spaces.

  ## Examples

      iex> list_spaces()
      [%Space{}, ...]

  """
  def list_spaces do
    Repo.all(Space)
  end

  @doc """
  Gets a single space.

  Raises `Ecto.NoResultsError` if the Space does not exist.

  ## Examples

      iex> get_space!(123)
      %Space{}

      iex> get_space!(456)
      ** (Ecto.NoResultsError)

  """
  def get_space!(id) do
    IO.inspect id
    space = Repo.get!(Space, id)
    if space do
      # Preload spaces
      space = space 
      |> Repo.preload(:comments)
      |> Repo.preload(:reviews)
      |> Repo.preload(:user)
      |> load_stats()

      space  
    end
  end

  def get_space(id) do
    space = Repo.get(Space, id)
    if space do
      # Preload spaces
      space = space 
      |> Repo.preload(:comments)
      |> Repo.preload(:reviews)
      |> Repo.preload(:user)
      |> load_stats()

      space  
    end
  end

  # Load the event's stats(virtual fields)
  def load_stats(space) do
    # Compute the average rating of the event
    reviews = space.reviews
    num_reviews = Enum.count(reviews)
    total_rating = Enum.reduce(reviews, 0.0, fn review, acc -> review.rating + acc end)
    IO.inspect num_reviews
    IO.inspect total_rating

    if num_reviews == 0 do
      space = Map.replace(space, :avg_rating, 0)
      space 
    else
      avg_rating = total_rating/num_reviews
      space = Map.replace(space, :avg_rating, avg_rating)
      space
    end
  end

  @doc """
  Creates a space.

  ## Examples

      iex> create_space(%{field: value})
      {:ok, %Space{}}

      iex> create_space(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_space(attrs \\ %{}) do
    %Space{}
    |> Space.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a space.

  ## Examples

      iex> update_space(space, %{field: new_value})
      {:ok, %Space{}}

      iex> update_space(space, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_space(%Space{} = space, attrs) do
    space
    |> Space.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a space.

  ## Examples

      iex> delete_space(space)
      {:ok, %Space{}}

      iex> delete_space(space)
      {:error, %Ecto.Changeset{}}

  """
  def delete_space(%Space{} = space) do
    Repo.delete(space)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking space changes.

  ## Examples

      iex> change_space(space)
      %Ecto.Changeset{data: %Space{}}

  """
  def change_space(%Space{} = space, attrs \\ %{}) do
    Space.changeset(space, attrs)
  end
end
