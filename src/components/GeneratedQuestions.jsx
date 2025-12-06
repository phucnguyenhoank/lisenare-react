// src/components/ExerciseQuestions.jsx
import React from "react";
import { sendEvent } from "../api/feedbackuser";

/**
 * OptionRadio: one radio option
 */
export function OptionRadio({ qId, optIdx, label, text, selected, onSelect, disabled, passage, question_text, username}) {
   return (
    <label
      className={`flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
      onMouseEnter={() =>
        sendEvent(username, "option_hover", passage, question_text, { option: label })
      }
    >
      <input
        type="radio"
        name={`q-${qId}`}
        checked={selected === optIdx}
        onChange={() => {
          sendEvent(username, "option_selected", passage,question_text, { option: label });
          !disabled && onSelect(qId, optIdx);
        }}
        className="text-emerald-600 focus:ring-emerald-500"
      />
      <span className="font-medium text-gray-700">{label}.</span>
      <span className="text-gray-800">{text}</span>
    </label>
  );
}

/**
 * QuestionBox: display single question with its options
 * props.question must contain fields:
 *  - id
 *  - question_text
 *  - option_a ... option_d
 *  - answer (full text of correct answer) [optional]
 *  - explanation [optional]
 */
export function QuestionBox({ question, answers, onSelect, questionIndex, reveal, feedback, onFeedback, passage, username}) {
  const options = ["A", "B", "C", "D"];
  const qId = question.id;
  // --- EVENT 2: tính thời gian user xem câu hỏi ---
  const viewStartRef = React.useRef(Date.now());

  // track "question_view" khi câu hỏi mount
  React.useEffect(() => {
    sendEvent(username, "question_view", passage, question.question_text, {});
    viewStartRef.current = Date.now();
  }, [qId]);

  // khi unmount -> gửi time_spent_on_question
  React.useEffect(() => {
    return () => {
      const duration = Date.now() - viewStartRef.current;
      sendEvent(username, "time_spent_on_question", passage,question.question_text, { duration_ms: duration });
    };
  }, []);

  // map option index -> text
  const optionText = (i) => question[`option_${options[i].toLowerCase()}`] || "";

  // find correct index if answer is provided as full text
  const correctIndex = (() => {
    if (!question.answer) return null;
    const ansText = question.answer?.trim();
    for (let i = 0; i < options.length; i++) {
      if (optionText(i).trim() === ansText) return i;
    }
    return null;
  })();

  return (
    <div className="mb-6 p-4 border rounded-lg bg-white">
      <p className="font-semibold text-lg mb-3 text-gray-800">
        {questionIndex + 1}. {question.question_text}
      </p>

      <div className="space-y-2">
        {options.map((opt, i) => {
          const selected = answers[qId];
          const isSelected = selected === i;
          const isCorrect = reveal && correctIndex === i;
          const isWrongSelected = reveal && isSelected && correctIndex !== i;

          const bgClass = isCorrect ? "bg-emerald-50 border-emerald-300" : isWrongSelected ? "bg-red-50 border-red-300" : "hover:bg-gray-50";

          return (
            <div key={i} className={`p-1 rounded border ${bgClass}`}>
              <OptionRadio
                qId={qId}
                optIdx={i}
                label={opt}
                text={optionText(i)}
                selected={selected}
                onSelect={onSelect}
                disabled={reveal} // after reveal don't allow changes
                passage={passage}
                question_text={question.question_text}
                username={username}
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

      {/*like / dislike */}
      <div className="mt-4 flex space-x-3">
        <button
          onClick={() => {
            sendEvent(username, "like", passage, question.question_text, {});
            onFeedback(qId, "like");
          }}
          className={`px-3 py-1 rounded border ${
            feedback[qId] === "like"
              ? "bg-emerald-100 border-emerald-500"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          👍 Like
        </button>

        <button
          onClick={() => {
            sendEvent(username, "dislike", passage, question.question_text, {});
            onFeedback(qId, "dislike");
          }}
          className={`px-3 py-1 rounded border ${
            feedback[qId] === "dislike"
              ? "bg-red-100 border-red-500"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          👎 Dislike
        </button>
      </div>
    </div>
  );
}

/**
 * ExerciseQuestions: list of questions
 * props.exercise = { questions: [...] } but we accept an array as well
 */
export default function ExerciseQuestions({ questions, answers, onSelect, reveal = false, feedback, onFeedback, passage, username}) {
  return (
    <div className="space-y-6">
      {questions.map((q, index) => (
        <QuestionBox
          key={q.id}
          question={q}
          answers={answers}
          onSelect={onSelect}
          questionIndex={index}
          reveal={reveal}
          feedback={feedback}
          onFeedback={onFeedback}
          passage={passage}
          username={username}
        />
      ))}
    </div>
  );
}
