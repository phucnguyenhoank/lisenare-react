// src/api/recommendation.js
import { apiPost } from "./client";

export async function recommendNext(username) {
  return apiPost("/recommendation/recommend", {username});
}
