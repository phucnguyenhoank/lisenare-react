export default function ExerciseRating({ rating, onRate }) {
  if (rating) {
    // user already rated -> hide buttons
    return <p className="text-gray-600 italic">Thanks for your feedback!</p>;
  }

  return (
    <div className="mt-6">
      <p className="mb-2">Rate this exercise:</p>
      <div className="flex gap-4">
        <button
          onClick={() => onRate("like")}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-green-100"
        >
          👍 Like
        </button>
        <button
          onClick={() => onRate("dislike")}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-red-100"
        >
          👎 Dislike
        </button>
      </div>
    </div>
  );
}
