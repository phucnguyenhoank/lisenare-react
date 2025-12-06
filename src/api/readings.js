// src/api/readings.js
import { apiCall } from "./client";

export function getFullReadingById(readingId) {
  return apiCall(`/readings/full-by-id/${readingId}`);
}
