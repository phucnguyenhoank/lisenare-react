// src/api/feedback.js
import { apiCall } from "./client";

export async function sendEvent(username, event_type, reading_text, question_text, metadata = {}) {
  return apiCall(
    "/feedback/event",
    "POST",
    {
      username,
      event_type,
      reading_text,
      question_text,
      metadata: {
        ...metadata,
        timestamp: Date.now(),
      }
    }
  );
}
