// src/api/recommendation.js
import { apiCall } from "./client";

export async function getRecommendedItems(username, batch_size) {
  const params = new URLSearchParams({ username });
  if (batch_size) params.append("batch_size", batch_size);

  return apiCall(`/recommendation/recommend?${params.toString()}`, "POST");
}
