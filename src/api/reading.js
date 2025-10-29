// src/api/reading.js
const BASE_URL = "http://127.0.0.1:8000/readings";

/**
 * Fetch all readings (for the list)
 */
export async function fetchReadings() {
  const res = await fetch(`${BASE_URL}/`);
  if (!res.ok) throw new Error("Failed to fetch readings");
  return res.json();
}

/**
 * Fetch a full reading by ID (for exercise page)
 * @param {number|string} id
 */
export async function fetchReadingById(id) {
  const res = await fetch(`${BASE_URL}/full-by-id/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch reading with id ${id}`);
  return res.json();
}
