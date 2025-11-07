// src/components/useExerciseLogger.js
import { apiPost } from "../api/client";

export default function useExerciseLogger(userStateId, exerciseId) {
  const sendLog = async (eventType = {}) => {
    const payload = [
      {
        event_type: eventType,
        event_time: new Date().toISOString(),
        user_state_id: userStateId,
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
