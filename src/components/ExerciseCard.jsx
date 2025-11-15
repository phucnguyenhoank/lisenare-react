import { useState } from "react";
import ExerciseQuestions from "./ExerciseQuestions";

/**
 * Display an exercise and its questions.
 */
export default function ExerciseCard({ studySessionId, exercise }) {
  const [answers, setAnswers] = useState({});

  const handleSelect = (qId, optIdx) => {
    setAnswers((p) => ({ ...p, [qId]: optIdx }));
  };

  const levelLabels = ["A1", "A2", "B1", "B2", "C1", "C2"];

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

      <p className="mb-4 whitespace-pre-line">{exercise.content_text}</p>

      <ExerciseQuestions
        exercise={exercise}
        answers={answers}
        onSelect={handleSelect}
      />

      <button className="w-full bg-emerald-500 text-white px-5 py-2 rounded hover:bg-emerald-600">
        {"Submit"}
      </button>
    </div>
  );
}