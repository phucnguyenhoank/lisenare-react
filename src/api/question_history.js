// src/api/history.js
import { apiCall } from "./client";

export async function getHistoryQuestions(user_name) {
  return apiCall(`/history/questions/${user_name}`, "GET");
}
