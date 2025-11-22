// src/utils/jwt.js

// Decode JWT payload
export function parseJwt(token) {
  try {
    const payload = token.split('.')[1];        // get the middle part
    const decoded = atob(payload);             // decode base64
    return JSON.parse(decoded);                // parse JSON
  } catch (e) {
    console.error("Failed to parse JWT", e);
    return null;
  }
}

// Get username (sub) from JWT in localStorage
export function getLoggedInUsername() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  const payload = parseJwt(token);
  return payload?.sub || null;
}
