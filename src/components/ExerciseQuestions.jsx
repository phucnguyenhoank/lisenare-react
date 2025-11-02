export default function ExerciseQuestions({ exercise, answers, onSelect }) {
  return (
    <>
      {exercise.questions.map((q) => (
        <div key={q.id} className="mb-6 p-4 border rounded">
          <p className="font-medium mb-2">{q.question_text}</p>
          {["A", "B", "C", "D"].map((opt, i) => (
            <label key={i} className="block mb-1">
              <input
                type="radio"
                name={`q-${q.id}`}
                checked={answers[q.id] === i}
                onChange={() => onSelect(q.id, i)}
                className="mr-2"
              />
              {q[`option_${opt.toLowerCase()}`]}
            </label>
          ))}
        </div>
      ))}
    </>
  );
}
