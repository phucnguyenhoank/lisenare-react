// src/components/useExerciseLogger.js
import { apiPost } from "../api/client";

export default function useExerciseLogger(exerciseId) {
  const sendLog = async (eventType, extra = {}) => {
    const userId = (window.currentUser && window.currentUser.id) ?? null;
    const payload = [
      {
        user_id: userId,
        item_id: exerciseId,
        event_type: eventType,
        event_time: new Date().toISOString(),
        ...extra,
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
