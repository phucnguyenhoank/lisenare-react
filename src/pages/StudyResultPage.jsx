import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStudySession, setStudySessionRating } from "../api/studySession";
import QuestionResultCard from "../components/QuestionResultCard";
import RatingButtons from "../components/RatingButtons";

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
      setRating(newRating); // optimistic
      await setStudySessionRating(id, newRating);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-6">Loading result...</p>;
  if (!result) return <p className="p-6">No result found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{result.reading_title}</h1>
      <p className="text-gray-700 mb-4">{result.reading_content}</p>

      <div className="mb-4">
        <strong>Score:</strong> {(result.score * 100).toFixed(0)}%
      </div>

      <div className="space-y-4">
        {result.questions.map((q, idx) => (
          <QuestionResultCard key={q.id} question={q} index={idx} />
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-2">Rate this exercise:</div>
        <RatingButtons rating={rating} onChange={handleRatingChange} />
      </div>
    </div>
  );
}
