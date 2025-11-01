import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { submitStudySession, setStudySessionRating } from "../api/studySession";

export default function ExerciseCard({ exercise }) {
  // ---------- Visibility & dwell time ----------
  const { ref: viewRef, inView } = useInView({ threshold: 0.85 });
  const dwellRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (inView) {
      const start = Date.now();
      timerRef.current = setInterval(() => {
        dwellRef.current = Date.now() - start;
        if (dwellRef.current >= 3000) log("view");
      }, 100);
    } else {
      if (dwellRef.current < 3000 && dwellRef.current > 0) log("skip");
      dwellRef.current = 0;
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [inView]);

  // ---------- Interaction ----------
  const [answers, setAnswers] = useState({});
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [rating, setRating] = useState(null);

  const handleSelect = (qId, optIdx) => {
    setAnswers((p) => ({ ...p, [qId]: optIdx }));
    if (!showSubmit) setShowSubmit(true);
    log("click");
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
      log("submit");
    } catch {
      alert("Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRating = async (val) => {
    setRating(val);
    await setStudySessionRating(result.id, val);
    log(val);
  };

  const log = (type) => console.log(`[METRIC] ${type} - exercise ${exercise.id}`);

  return (
    <div ref={viewRef} className="p-6 text-gray-800">
      {/* Title + text */}
      <h3 className="text-2xl font-bold mb-3">{exercise.title}</h3>
      <p className="mb-4 whitespace-pre-line">{exercise.content_text}</p>

      {/* Tags */}
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

      {/* Questions */}
      {!result &&
        exercise.questions.map((q) => (
          <div key={q.id} className="mb-6 p-4 border rounded">
            <p className="font-medium mb-2">{q.question_text}</p>
            {["A", "B", "C", "D"].map((opt, i) => (
              <label key={i} className="block mb-1">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={answers[q.id] === i}
                  onChange={() => handleSelect(q.id, i)}
                  className="mr-2"
                />
                {q[`option_${opt.toLowerCase()}`]}
              </label>
            ))}
          </div>
        ))}

      {/* Submit */}
      {showSubmit && !result && (
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-emerald-500 text-white px-5 py-2 rounded hover:bg-emerald-600"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      )}

      {/* Result */}
      {result && (
        <div className="mt-6 space-y-4">
          <p className="text-lg font-medium">
            Score: {(result.score * 100).toFixed(0)}%
          </p>
          {result.questions.map((q, idx) => (
            <div key={q.id} className="p-4 border rounded bg-gray-50">
              <p className="font-medium">
                Q{idx + 1}: {q.question_text}
              </p>
              <p>
                Your answer:{" "}
                <strong>{q.user_answer}user_answer</strong>{" "}
                {q.is_correct ? "(Correct)" : "(Incorrect)"}
              </p>
            </div>
          ))}

          {/* Rating */}
          <div className="mt-6">
            <p className="mb-2">Rate this exercise:</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleRating("like")}
                className={`px-4 py-2 rounded ${
                  rating === "like"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-green-100"
                }`}
              >
                👍 Like
              </button>
              <button
                onClick={() => handleRating("dislike")}
                className={`px-4 py-2 rounded ${
                  rating === "dislike"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 hover:bg-red-100"
                }`}
              >
                👎 Dislike
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
