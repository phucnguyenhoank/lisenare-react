import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiCall } from "../api/client";

export default function SessionDetailPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [reading, setReading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        // Find session data
        const sessionData = await apiCall(`/study_sessions/by-id/${sessionId}`);
        setSession(sessionData);

        // Load reading
        const readingData = await apiCall(`/readings/full-by-id/${sessionData.reading_id}`);
        setReading(readingData);

      } catch (err) {
        setError(err.message);
      }
    }

    load();
  }, [sessionId]);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!session || !reading) return <div className="p-4">Loading...</div>;

  // Parse user answers
  const userAnswers = session.user_answers.split(",").map(x => parseInt(x));

  // Calculate score
  let correctCount = 0;
  reading.questions.forEach((q, i) => {
    if (userAnswers[i] === q.correct_option) correctCount++;
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{reading.title}</h1>

      <p className="text-gray-700 whitespace-pre-line mb-6">
        {reading.content_text}
      </p>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
        <p className="text-lg font-semibold">
          Result: {correctCount} / {reading.questions.length} correct
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-3">Your Answers</h2>

      <div className="space-y-4">
        {reading.questions.map((q, idx) => {
          const userAnswer = userAnswers[idx];
          const isCorrect = userAnswer === q.correct_option;

          const options = [q.option_a, q.option_b, q.option_c, q.option_d];

          return (
            <div
              key={q.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <p className="font-semibold mb-2">
                {idx + 1}. {q.question_text}
              </p>

              <div className="ml-4 space-y-1">
                {options.map((opt, i) => {
                  const optionIndex = i; // 0, 1, 2, 3

                  const isUser = userAnswer === optionIndex;
                  const isCorrectOption = q.correct_option === optionIndex;

                  return (
                    <p
                      key={i}
                      className={`
                        p-2 rounded 
                        ${isUser ? "border border-gray-400" : ""}
                        ${isCorrectOption ? "bg-green-100" : ""}
                        ${isUser && !isCorrect ? "bg-red-100" : ""}
                      `}
                    >
                      {String.fromCharCode(65 + i)}. {opt}
                    </p>
                  );
                })}
              </div>

              <p className="mt-3 text-sm text-gray-600">
                <strong>Explanation:</strong> {q.explanation}
              </p>

              <p className="mt-1 text-sm">
                <strong>Your answer:</strong>{" "}
                <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                  {String.fromCharCode(65 + userAnswer)}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
