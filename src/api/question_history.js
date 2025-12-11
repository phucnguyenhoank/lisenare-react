// src/api/history.js
import { apiCall } from "./client";

export async function getHistoryQuestions(user_name) {
  
  const response = await apiCall(`/history/questions/${user_name}`, "GET");
  return { data: response };
}
