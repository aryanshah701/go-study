defmodule ApiWeb.RecommendationController do
  use ApiWeb, :controller

  def index(conn, _params) do
    query_params = conn.query_params

    # Validate query params to have lat and lng
    if validate_recommendation_query(query_params) do
      # Get nearby cafes and libraries from google places
      lat = query_params["lat"]
      lng = query_params["lng"]
      key = "AIzaSyCGHtmjKxTs_xZbOpCSut7WnF4ge06p9OU"
      url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
            <> "location=#{lat},#{lng}&rankby=distance&"
            <> "types=cafe&key=#{key}"

      resp = HTTPoison.get!(url)
      data = Jason.decode!(resp.body)
      
      # Successful query to google places API
      if data["status"] == "OK" do
        max_recommendations = get_max_recommendations(data["results"])
        recommendations = Enum.take(data["results"], max_recommendations)
        conn 
          |> put_resp_header(
            "content-type",
            "application/json; charset=UTF-8")
          |> send_resp(
            :ok,
            Jason.encode!(%{recommendations: recommendations})
          )
      else
        conn 
          |> put_resp_header(
            "content-type",
            "application/json; charset=UTF-8")
          |> send_resp(
            :no_content,
            Jason.encode!(%{error: "Sorry, something went wrong with the Google Places API"})
          )
      end

    else
      conn 
        |> put_resp_header(
          "content-type",
          "application/json; charset=UTF-8")
        |> send_resp(
          :no_content,
          Jason.encode!(%{error: "Please provide the lat and lng search query strings in the request"})
        )
    end
  
  end

  def validate_recommendation_query(query_params) do
    Map.has_key?(query_params, "lat") && Map.has_key?(query_params, "lng")
  end

  def get_max_recommendations(results) do
    if Enum.count(results) < 4 do
      Enum.count(results)
    else
      4
    end
  end
end