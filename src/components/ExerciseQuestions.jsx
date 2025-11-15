// src/components/ExerciseQuestions.jsx

/**
 * Displays a group of options for a question. Each option can be selected.
 */
export function QuestionBox({ question, answers, onSelect, questionIndex }) {
  const options = ["A", "B", "C", "D"];

  return (
    <div className="mb-6 p-4 border rounded-lg bg-white">
      {/* Question Number + Text */}
      <p className="font-semibold text-lg mb-3 text-gray-800">
        {questionIndex + 1}. {question.question_text}
      </p>

      {/* Options */}
      <div className="space-y-2">
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
    </div>
  );
}

/**
 * Display one option of a question, can be chosen or not.
 */
export function OptionRadio({ qId, optIdx, label, text, selected, onSelect }) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
      <input
        type="radio"
        name={`q-${qId}`}
        checked={selected === optIdx}
        onChange={() => onSelect(qId, optIdx)}
        className="text-emerald-600 focus:ring-emerald-500"
      />
      <span className="font-medium text-gray-700">{label}.</span>
      <span className="text-gray-800">{text}</span>
    </label>
  );
}

/**
 * Display a list of questions and their options for an exercise.
 */
export default function ExerciseQuestions({ exercise, answers, onSelect }) {
  return (
    <div className="space-y-6">
      {exercise.questions.map((q, index) => (
        <QuestionBox
          key={q.id}
          question={q}
          answers={answers}
          onSelect={onSelect}
          questionIndex={index} // pass the index for numbering
        />
      ))}
    </div>
  );
}