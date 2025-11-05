export default function ExerciseResult({ result }) {
  return (
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
            Your answer: <strong>{q.user_answer}</strong>{" "}
            {q.is_correct ? "(Correct)" : "(Incorrect)"}
          </p>
        </div>
      ))}
    </div>
  );
}
