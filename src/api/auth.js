// src/api/auth.js
import { apiPost } from "./client";

export async function loginUser(username, password = "1234") {
  const formBody = new URLSearchParams({
    grant_type: "password",
    username,
    password,
    scope: "",
    client_id: "string",
    client_secret: "********", // or remove if not required
  });

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login failed: ${text}`);
  }

  const data = await res.json();

  // Save token + username
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("username", username);

  return data;
}
