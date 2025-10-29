import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchReadingById } from "../api/reading";

export default function ReadingPage() {
  const { id } = useParams();
  const [reading, setReading] = useState(null);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchReadingById(id)
      .then((data) => setReading(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    // reading.questions exists and has order (order_index or id)
    const answersArray = reading.questions.map(q => {
        // answers state is keyed by question id (answers[q.id] === selectedOption)
        // if unanswered, we put empty string so CSV keeps positions consistent
        const val = answers[q.id];
        return typeof val === "number" ? String(val) : "";
    });

    const payload = {
        user_id: 1, // replace with actual logged-in user id
        reading_id: reading.id,
        score: 0, // server will compute real score
        rating: 3, // default rating; you may let user rate on result page later
        time_spent: 0, // optionally track with a timer
        give_up: false,
        user_answers: answersArray.join(",") // "0,1, ,2"
    };

    try {
        const res = await fetch("http://127.0.0.1:8000/study_sessions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        });

        if (!res.ok) {
        const txt = await res.text();
        console.error("Submit failed:", txt);
        alert("Failed to submit");
        return;
        }

        const data = await res.json();
        // data will contain created session id (data.id)
        // navigate to result page
        navigate(`/study-result/${data.id}`);
    } catch (err) {
        console.error(err);
        alert("Network error");
    }
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
