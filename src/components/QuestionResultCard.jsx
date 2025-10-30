export default function QuestionResultCard({ question, index }) {
  const { question_text, option_a, option_b, option_c, option_d, correct_option, user_selected, explanation } = question;

  const answerText = [option_a, option_b, option_c, option_d];

  return (
    <div className="p-4 border rounded">
      <div className="font-medium mb-2">{index + 1}. {question_text}</div>

      <div className="space-y-1">
        {answerText.map((opt, i) => {
          const isUser = user_selected === i;
          const isRight = correct_option === i;
          return (
            <div
              key={i}
              className={`p-2 rounded 
                ${isRight ? "bg-green-100" : isUser && !isRight ? "bg-red-100" : "bg-white"}`}
            >
              <span className="font-semibold mr-2">{["A","B","C","D"][i]}.</span>
              <span>{opt}</span>
              {isUser && <span className="ml-2 text-sm text-gray-600"> (your answer)</span>}
              {isRight && <span className="ml-2 text-sm text-green-700"> (correct)</span>}
            </div>
          );
        })}
      </div>

      {explanation && (
        <div className="mt-2 text-sm text-gray-700">
          <strong>Explanation:</strong> {explanation}
        </div>
      )}
    </div>
  );
}
