import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchReadingById } from "../api/reading";
import { submitStudySession } from "../api/studySession";

export default function ReadingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reading, setReading] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReadingById(id).then(setReading).catch(console.error);
  }, [id]);

  const handleSelect = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const data = await submitStudySession({
        readingId: reading.id,
        answers,
        timeSpent: 60, // example
      });
      navigate(`/study-result/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Submission failed!");
    } finally {
      setSubmitting(false);
    }
  };

  if (!reading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-3">{reading.title}</h1>
      <p className="mb-6">{reading.content_text}</p>

      {reading.questions.map((q) => (
        <div key={q.id} className="p-4 border rounded mb-4">
          <p className="font-medium mb-2">{q.question_text}</p>
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

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
