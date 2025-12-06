// src/api/studySessions.js
import { apiCall } from "./client";

export function getSubmittedSessions(userId) {
  return apiCall(`/study_sessions/users/${userId}/submitted`);
}
