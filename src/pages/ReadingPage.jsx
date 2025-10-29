import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchReadingById } from "../api/reading";

export default function ReadingPage() {
  const { id } = useParams();
  const [reading, setReading] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetchReadingById(id)
      .then((data) => setReading(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    console.log("User answers:", answers);
    alert("Submitted!");
  };

  if (!reading) return <p className="p-6">Loading reading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-3">{reading.title}</h1>
      <p className="text-gray-700 mb-6">{reading.content_text}</p>

      <div className="space-y-6">
        {reading.questions.map((q, idx) => (
          <div key={q.id} className="p-4 border rounded-lg">
            <p className="font-medium mb-2">
              {idx + 1}. {q.question_text}
            </p>
            {["A", "B", "C", "D"].map((opt, i) => (
              <label key={i} className="block">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={i}
                  checked={answers[q.id] === i}
                  onChange={() => handleSelect(q.id, i)}
                  className="mr-2"
                />
                {q[`option_${opt.toLowerCase()}`]}
              </label>
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
}
