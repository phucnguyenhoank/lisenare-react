// src/components/useExerciseLogger.js
import { apiPost } from "../api/client";

export default function useExerciseLogger(recommendationStateId, exerciseId) {
  const sendLog = async (eventType = {}) => {
    const payload = [
      {
        event_type: eventType,
        event_time: new Date().toISOString(),
        recommendation_state_id: recommendationStateId,
        item_id: exerciseId,
      },
    ];
    try {
      await apiPost("/interactions", payload);
    } catch (err) {
      console.error("log send failed", err);
    }
  };

  return { sendLog };
}
