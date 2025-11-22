// src/api/users.js
import { apiCall } from "./client";
import { loginUser } from "./auth";

export async function registerOrLogin(payload) {
  let justRegistered = false;

  try {
    const res = await apiCall("/users/", "POST", payload);
    justRegistered = true;
    console.log("✅ Registered successfully, now logging in...");
  } catch (err) {
    // only ignore "already exists" errors
    if (err.message.includes("already") || err.message.includes("409")) {
      console.log("User already exists, logging in...");
    } else {
      throw err; // rethrow other real errors
    }
  }

  // In both cases, login
  const username = payload.username;
  const tokenRes = await loginUser(username);

  // Save token and username
  if (tokenRes?.access_token) {
    localStorage.setItem("access_token", tokenRes.access_token);
    localStorage.setItem("username", username);

    // Redirect to home
    window.location.href = "/";
  }

  return { user: { username }, token: tokenRes, justRegistered };
}

export async function registerUserAPI(userData) {
  return apiCall("/users/", "POST", userData, {
    accept: "application/json",
  });
}
