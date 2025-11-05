// src/api/recommendation.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function recommendNext(username) {

  const res = await fetch(`${BASE_URL}/recommendation/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.item; // return the single recommended item
}
