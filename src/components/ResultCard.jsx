export default function ResultCard({ exercise, answers, result, onRetry }) {
  window.scrollTo({ top: 0, behavior: "smooth" });

  const total = exercise.questions.length;

  const correctCount = exercise.questions.reduce((acc, q) => {
    const userIdx = answers[q.id];
    return acc + (userIdx === q.correct_option ? 1 : 0);
  }, 0);


  return (
    <div className="p-6 text-gray-800 space-y-6">
      {/* Score */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Result</h3>
        <p className="text-lg">
          You answered <strong>{correctCount}</strong> out of{" "}
          <strong>{total}</strong> correctly.
        </p>
      </div>

      {/* Per-question feedback */}
      <div className="space-y-4">
        {exercise.questions.map((q, i) => {
          const userIdx = answers[q.id];
          const correctIdx = q.correct_option;

          const optionLabels = ["A", "B", "C", "D"];
          const optionKeys = ["option_a", "option_b", "option_c", "option_d"];

          const userAnswerLabel =
            userIdx != null ? optionLabels[userIdx] : "-";
          const userAnswerText =
            userIdx != null ? q[optionKeys[userIdx]] : "(No answer)";

          const correctAnswerLabel = optionLabels[correctIdx];
          const correctAnswerText = q[optionKeys[correctIdx]];

          const isCorrect = userIdx === correctIdx;

          return (
            <div
              key={q.id}
              className={`p-4 rounded-lg border ${
                isCorrect
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              {/* Question */}
              <p className="font-semibold text-gray-900 mb-1">
                Question {i + 1}: {q.question_text}
              </p>

              {/* User answer */}
              <p
                className={`${
                  isCorrect ? "text-green-700" : "text-red-700"
                } mt-1`}
              >
                <strong>Your answer:</strong>{" "}
                {userAnswerLabel}. {userAnswerText}
              </p>

              {/* Correct answer (only show if wrong) */}
              {!isCorrect && (
                <>
                  <p className="text-gray-800 mt-1">
                    <strong>Correct answer:</strong>{" "}
                    {correctAnswerLabel}. {correctAnswerText}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {q.explanation}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Retry */}
      <button
        onClick={onRetry}
        className="w-full bg-emerald-500 text-white px-5 py-2 rounded hover:bg-emerald-600 font-medium"
      >
        Try Again
      </button>
    </div>
  );
}
