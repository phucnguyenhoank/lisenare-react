// src/api/client.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function handleResponse(res) {
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

export async function apiCall(endpoint, method = 'GET', data = null, headers = {}) {
  // Default to JSON, overiden by any custom headers
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const options = {
    method,
    headers: { ...defaultHeaders, ...headers },
  };

  // Allow sending JSON, form-encoded, or raw bodies
  if (data) options.body = data instanceof URLSearchParams ? data : JSON.stringify(data);
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  return handleResponse(res);
}
