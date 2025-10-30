import { apiGet, apiPatch, apiPost } from "./client";

// Centralized function to submit a study session
export async function submitStudySession({ userId = 1, readingId, answers, rating = 3, timeSpent = 0 }) {
  // Convert answers (object like {1:0,2:1,3:2}) → "0,1,2"
  const userAnswers = Object.values(answers).join(",");

  const payload = {
    user_id: userId,
    reading_id: readingId,
    score: 0,          // backend computes real score
    rating,
    time_spent: timeSpent,
    give_up: false,
    user_answers: userAnswers,
  };

  return apiPost("/study_sessions/", payload);
}

export async function setStudySessionRating(id, newRating) {
  return apiPatch(`/study_sessions/${id}/rating`, { rating: newRating });
}

export async function getStudySession(id) {
  return apiGet(`/study_sessions/${id}`);
}
