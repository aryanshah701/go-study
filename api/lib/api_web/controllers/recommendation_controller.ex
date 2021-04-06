defmodule ApiWeb.RecommendationController do
  use ApiWeb, :controller

  def index(conn, _params) do
    query_params = conn.query_params

    # Validate query params to have lat and lng
    if validate_recommendation_query(query_params) do
      # Get nearby cafes and libraries from google places
      lat = query_params["lat"]
      lng = query_params["lng"]
      key = ""
      url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
            <> "location=#{lat},#{lng}&rankby=distance&"
            <> "types=cafe&key=#{key}"

      resp = HTTPoison.get!(url)
      recommendations = Jason.decode!(resp.body)
      
      IO.inspect recommendations

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
          :bad_request,
          Jason.encode!(%{error: "Please provide the lat and lng fields in the search query"})
        )
    end
  
  end

  def validate_recommendation_query(query_params) do
    Map.has_key?(query_params, "lat") && Map.has_key?(query_params, "lng")
  end
end