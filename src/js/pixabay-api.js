import axios from "axios";
const API_KEY = "52255195-3e160ad4bb4ef956860251d45";
const BASE_URL = "https://pixabay.com/api/";
const PER_PAGE = 15;

export async function getImagesByQuery(query, page = 1) {
  if (typeof query !== "string") {
    throw new Error("Query must be a string");
  }
  if (typeof page !== "number") {
    throw new Error("Page must be a number");
  }
  const params = {
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    page,
    per_page: PER_PAGE,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}
