import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStudySession, setStudySessionRating } from "../api/studySession"

export default function StudyResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getStudySession(id);
        setResult(data);
        setRating(data.rating);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);


  const handleRatingChange = async (newRating) => {
    try {
      // optimistic UI
      setRating(newRating);
      setStudySessionRating(id, newRating);
    } catch (err) {
      console.error(err);
      // revert if you want
    }
  };

  if (loading) return <p className="p-6">Loading result...</p>;
  if (!result) return <p className="p-6">No result found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{result.reading_title}</h1>
      <p className="text-gray-700 mb-4">{result.reading_content}</p>

      <div className="mb-4">
        <strong>Score:</strong> {(result.score * 100).toFixed(0)}%
      </div>

      <div className="space-y-4">
        {result.questions.map((q, idx) => {
          const user = q.user_selected;
          const correct = q.correct_option;
          const isCorrect = q.is_correct;

          const answerText = (i) =>
            i === 0 ? q.option_a : i === 1 ? q.option_b : i === 2 ? q.option_c : q.option_d;

          return (
            <div key={q.id} className="p-4 border rounded">
              <div className="font-medium mb-2">{idx + 1}. {q.question_text}</div>

              <div className="space-y-1">
                {[0,1,2,3].map((i) => {
                  const isUser = user === i;
                  const isRight = correct === i;
                  return (
                    <div
                      key={i}
                      className={`p-2 rounded 
                        ${isRight ? "bg-green-100" : isUser && !isRight ? "bg-red-100" : "bg-white"}`}
                    >
                      <span className="font-semibold mr-2">{["A","B","C","D"][i]}.</span>
                      <span>{answerText(i)}</span>
                      {isUser && <span className="ml-2 text-sm text-gray-600"> (your answer)</span>}
                      {isRight && <span className="ml-2 text-sm text-green-700"> (correct)</span>}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="mt-2 text-sm text-gray-700">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <div className="mb-2">Rate this exercise:</div>
        <div className="flex gap-2">
          {[1,2,3,4,5].map((r) => (
            <button
              key={r}
              onClick={() => handleRatingChange(r)}
              className={`px-3 py-1 rounded ${rating === r ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
