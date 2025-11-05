import { useState } from "react";
import ExerciseQuestions from "./ExerciseQuestions";
import ExerciseResult from "./ExerciseResult";
import ExerciseRating from "./ExerciseRating";
import ExerciseVisibilityTracker from "./ExerciseVisibilityTracker";
import useExerciseLogger from "./useExerciseLogger";
import { submitStudySession, setStudySessionRating } from "../api/studySession";

export default function ExerciseCard({ exercise }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(null);
  const [rerenderKey, setRerenderKey] = useState(0); // 👈 helps reset subcomponents

  const { sendLog } = useExerciseLogger(exercise.id);
  const { viewRef, dwellRef, reset: resetVisibility } = ExerciseVisibilityTracker({
    onView: () => sendLog("view"),
    onSkip: (dwell) => sendLog("skip", { dwell_ms: dwell }),
  });

  const handleSelect = (qId, optIdx) => {
    setAnswers((p) => ({ ...p, [qId]: optIdx }));
    setShowSubmit(true);
    sendLog("click", { question_id: qId, option_index: optIdx });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const data = await submitStudySession({
        readingId: exercise.id,
        answers,
        timeSpent: Math.round(dwellRef.current / 1000),
      });
      setResult(data);
      sendLog("submit", { answers });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRating = async (val) => {
    setRating(val);
    if (result?.id) await setStudySessionRating(result.id, val === "like" ? 1 : -1);
    sendLog(val);
  };

  const handleRetry = () => {
    // reset everything
    setAnswers({});
    setResult(null);
    setShowSubmit(false);
    setSubmitting(false);
    setRating(null);
    resetVisibility();
    setRerenderKey((k) => k + 1); // force re-render ExerciseQuestions
    sendLog("retry");
  };

  return (
    <div ref={viewRef} className="p-6 text-gray-800">
      <h3 className="text-2xl font-bold mb-3">{exercise.title}</h3>
      <p className="mb-4 whitespace-pre-line">{exercise.content_text}</p>

      <div className="flex flex-wrap gap-2 mb-6 text-sm">
        <span className="bg-blue-100 px-2 py-1 rounded-full">
          Difficulty: {exercise.difficulty}
        </span>
        <span className="bg-green-100 px-2 py-1 rounded-full">
          Time: {exercise.estimated_time} min
        </span>
        <span className="bg-yellow-100 px-2 py-1 rounded-full">
          Questions: {exercise.num_questions}
        </span>
      </div>

      {!result && (
        <>
          <ExerciseQuestions
            key={rerenderKey} // ensures clean re-render after retry
            exercise={exercise}
            answers={answers}
            onSelect={handleSelect}
          />
          {showSubmit && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-emerald-500 text-white px-5 py-2 rounded hover:bg-emerald-600"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          )}
        </>
      )}

      {result && (
        <>
          <ExerciseResult result={result} />
          <ExerciseRating rating={rating} onRate={handleRating} />

          {/* Retry button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleRetry}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Try again
            </button>
          </div>
        </>
      )}
    </div>
  );
}
