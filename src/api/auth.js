// src/api/auth.js
import { apiCall } from './client';

export async function loginUser(username, password = "1234") {
  const formBody = new URLSearchParams({
    grant_type: "password",
    username,
    password,
    
    scope: "",
    client_id: "string",
    client_secret: "********",
  });

  const data = await apiCall(
    '/auth/login',
    'POST',
    formBody,
    { 'Content-Type': 'application/x-www-form-urlencoded' } // override default JSON header
  );

  return data;
}
