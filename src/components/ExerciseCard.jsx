// src/components/ExerciseCard.jsx
import { useState } from "react";
import ExerciseQuestions from "./ExerciseQuestions";
import ResultCard from "./ResultCard";
import { submitAnswer } from "../api/interaction";

export default function ExerciseCard({ studySessionId, exercise }) {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const levelLabels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  const handleSelect = (qId, optIdx) => {
    setAnswers((p) => ({ ...p, [qId]: optIdx }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const ordered = exercise.questions.map((q) => answers[q.id] ?? -1);
      const user_answer = ordered.join(",");
      const updated_study_session = await submitAnswer(studySessionId, user_answer);
      setResult(updated_study_session);
    } catch (err) {
      alert(`Submit failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const allAnswered = exercise.questions.every((q) => answers[q.id] != null);

  const handleRetry = () => {
    setResult(null);
    setAnswers({});
  };

  if (result) {
    return (
      <ResultCard
        exercise={exercise}
        answers={answers}
        studySessionId={studySessionId}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="p-6 text-gray-800">
      <h3 className="text-2xl font-bold mb-3">{exercise.title}</h3>

      <div className="flex flex-wrap gap-2 mb-6 text-sm">
        <span className="bg-blue-100 px-2 py-1 rounded-full">
          Difficulty: {levelLabels[exercise.difficulty] || "Unknown"}
        </span>
        <span className="bg-green-100 px-2 py-1 rounded-full">
          Words: {exercise.num_words}
        </span>
        <span className="bg-yellow-100 px-2 py-1 rounded-full">
          Questions: {exercise.num_questions}
        </span>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <p className="whitespace-pre-line leading-relaxed">{exercise.content_text}</p>
      </div>

      <ExerciseQuestions
        exercise={exercise}
        answers={answers}
        onSelect={handleSelect}
      />

      <button
        onClick={handleSubmit}
        disabled={submitting || !allAnswered}
        className={`
          w-full mt-6 px-5 py-2 rounded font-medium text-white transition
          ${submitting || !allAnswered
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-emerald-500 hover:bg-emerald-600"}
        `}
      >
        {submitting ? "Submitting..." : "Submit Answers"}
      </button>
    </div>
  );
}