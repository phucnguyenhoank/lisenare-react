// src/api/users.js
import { apiPost } from "./client";
import { loginUser } from "./auth";

export async function registerOrLogin(username) {
  const payload = {
    username,
    email: null,
    password: "1234",
    user_level: 0,
    goal_type: 0,
    age_group: 0,
  };

  let justRegistered = false;

  try {
    await apiPost("/users/", payload);
    justRegistered = true;
    console.log("✅ Registered successfully, now logging in...");
  } catch (err) {
    // only ignore "already exists" errors
    if (err.message.includes("already") || err.message.includes("409")) {
      console.log("ℹ️ User already exists, logging in...");
    } else {
      throw err; // rethrow other real errors
    }
  }

  // In both cases, login
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
