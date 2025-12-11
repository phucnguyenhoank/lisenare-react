import { useState } from "react";

/** OptionRadio riêng cho ReadingItem */
function OptionRadio({ qId, optIdx, label, text, selected, onSelect, disabled }) {
  return (
    <label
      className={`flex items-center space-x-2 cursor-pointer p-2 rounded ${
        disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"
      }`}
    >
      <input
        type="radio"
        name={`q-${qId}`}
        checked={selected === optIdx}
        onChange={() => !disabled && onSelect(qId, optIdx)}
        className="text-emerald-600 focus:ring-emerald-500"
      />
      <span className="font-medium text-gray-700">{label}.</span>
      <span className="text-gray-800">{text}</span>
    </label>
  );
}

/** QuestionBox cho ReadingItem */
function QuestionBox({ question, questionIndex, answers, onSelect, reveal }) {
  const options = Object.keys(question.options);
  const qId = question.id;
  const selected = answers[qId];

  // tìm index đúng
  const correctIndex = options.findIndex(
    (key) => question.options[key] === question.options[Object.keys(question.options)[question.correct]]
  );

  return (
    <div className="mb-6 p-4 border rounded-lg bg-white">
      <p className="font-semibold text-lg mb-3 text-gray-800">
        {questionIndex + 1}. {question.text}
      </p>

      <div className="space-y-2">
        {options.map((key, i) => {
          const isSelected = selected === i;
          const isCorrect = reveal && i === correctIndex;
          const isWrongSelected = reveal && isSelected && i !== correctIndex;
          const bgClass = isCorrect
            ? "bg-emerald-50 border-emerald-300"
            : isWrongSelected
            ? "bg-red-50 border-red-300"
            : "hover:bg-gray-50";

          return (
            <div key={i} className={`p-1 rounded border ${bgClass}`}>
              <OptionRadio
                qId={qId}
                optIdx={i}
                label={key}
                text={question.options[key]}
                selected={selected}
                onSelect={onSelect}
                disabled={reveal}
              />
            </div>
          );
        })}
      </div>

      {reveal && question.explanation && (
        <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded">
          <div className="font-medium mb-1">Explanation</div>
          <div>{question.explanation}</div>
        </div>
      )}
    </div>
  );
}

/** ReadingItem chính */
export default function ReadingItem({ reading }) {
  const [open, setOpen] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [isRevealed, setIsRevealed] = useState(false);

  function handleSelect(qId, optIdx) {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optIdx,
    }));
  }

  function resetAll() {
    setUserAnswers({});
    setIsRevealed(false);
  }

  function revealAll() {
    setIsRevealed(true);
  }

  return (
    <div className="border border-gray-300 p-5 rounded-lg mb-5">
      <h2
        className="cursor-pointer text-lg font-semibold mb-3"
        onClick={() => setOpen(!open)}
      >
        {reading.title}
      </h2>

      {open && (
        <>
          <p className="whitespace-pre-line mb-5">{reading.passage}</p>

          {/* Buttons */}
          <div className="mb-5 flex gap-2">
            <button
              onClick={resetAll}
              className="px-4 py-2 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={revealAll}
              className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-60"
            >
              Reveal
            </button>
          </div>

          {/* Danh sách câu hỏi */}
          <div className="space-y-6">
            {reading.list_question?.map((q, idx) => (
              <QuestionBox
                key={q.id}
                question={q}
                questionIndex={idx}
                answers={userAnswers}
                onSelect={handleSelect}
                reveal={isRevealed}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
