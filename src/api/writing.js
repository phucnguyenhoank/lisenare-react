// src/api/writing.js
import { apiCall } from "./client";

export async function checkWriting(instruction, text) {
  return apiCall(
    `/coedit/edit`,
    'POST',
    { instruction, text }
  );
}