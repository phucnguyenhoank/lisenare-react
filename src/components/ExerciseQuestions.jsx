/**
 * Displays a group of options for a question. Each option can be selected.
 */
export function QuestionBox({ question, answers, onSelect }) {
  const options = ["A", "B", "C", "D"];
  return (
    <div className="mb-6 p-4 border rounded">
      <p className="font-medium mb-2">{question.question_text}</p>

      {options.map((opt, i) => (
        <OptionRadio
          key={i}
          qId={question.id}
          optIdx={i}
          label={opt}
          text={question[`option_${opt.toLowerCase()}`]}
          selected={answers[question.id]}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

/**
 * Display one option of a question, can be chosen or not.
 */
export function OptionRadio({ qId, optIdx, label, text, selected, onSelect }) {
  return (
    <label className="block mb-1">
      <input
        type="radio"
        name={`q-${qId}`}
        checked={selected === optIdx}
        onChange={() => onSelect(qId, optIdx)}
        className="mr-2"
      />
      {label}. {text}
    </label>
  );
}

/**
 * Display a list of questions and their options of a exercise.
 */
export default function ExerciseQuestions({ exercise, answers, onSelect }) {
  return (
    <>
      {exercise.questions.map((q) => (
        <QuestionBox
          key={q.id}
          question={q}
          answers={answers}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}
