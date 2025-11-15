// src/api/interaction.js
import { apiCall } from './client';

export async function updateEvent(study_session_id, event_type) {
  return apiCall(
    `/study_sessions/${study_session_id}/event`,
    'PATCH',
    { event_type } // shorthand for { event_type: event_type }
  );
}

export async function submitAnswer(study_session_id, user_answer) {
  return apiCall(
    `/study_sessions/${study_session_id}/submit`,
    'PATCH',
    { user_answer }
  );
}

