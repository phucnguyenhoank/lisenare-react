// src/api/users.js
import { apiCall } from "./client";
import { loginUser } from "./auth";

export async function registerOrLogin(payload) {
  console.log("PAYLOAD" + payload);

  let justRegistered = false;
  let tokenRes;

  try {
    // Try to register
    const res = await apiCall("/users/", "POST", payload);
    tokenRes = res["token"];
    justRegistered = true;
    console.log("✅ Registered successfully!");
  } catch (err) {
    if (err.message.includes("already") || err.message.includes("409")) {
      console.log("User already exists, logging in...");
      const { username, password } = payload;
      tokenRes = await loginUser({ username, password });
    } else {
      throw err;
    }
  }

  if (tokenRes?.access_token) {
    localStorage.setItem("access_token", tokenRes.access_token);
    window.location.href = "/";
  }

  return { token: tokenRes, justRegistered };
}

export async function registerUserAPI(userData) {
  return apiCall("/users/", "POST", userData, {
    accept: "application/json",
  });
}

export async function getUser(params) {
  
}
