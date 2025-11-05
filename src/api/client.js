// src\api\client.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function handleResponse(res) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }

  // if response is 204 No Content → just return null
  if (res.status === 204) return null;

  // sometimes servers send empty 200 OK with no body too
  const text = await res.text();
  if (!text) return null;

  return JSON.parse(text);
}


export async function apiGet(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  return handleResponse(res);
}

export async function apiPost(endpoint, data) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiPut(endpoint, data) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiDelete(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, { method: "DELETE" });
  return handleResponse(res);
}

export async function apiPatch(endpoint, data) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
