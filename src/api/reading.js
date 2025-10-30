import { apiGet } from "./client";

export function fetchReadings() {
  return apiGet("/readings/");
}

export function fetchReadingById(id) {
  return apiGet(`/readings/full-by-id/${id}`);
}
